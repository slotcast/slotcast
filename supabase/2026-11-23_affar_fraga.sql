-- "Blev det affär?": ett mejl till köparen några veckor efter att köparen valt fabrik, med två knappar (Ja / Nej).
-- Inga belopp. Svaret sparas i request_lines.outcome (finns redan: 'affar' / 'ingen') och outcome_at.
-- Funktionen "affar" skickar mejlen (anropas dagligen av pg_cron) och tar emot svaren från mejlets länkar.

alter table public.request_lines add column if not exists outcome_at timestamptz;
alter table public.request_lines add column if not exists outcome_asked_at timestamptz;
alter table public.request_lines add column if not exists outcome_token uuid not null default gen_random_uuid();
create unique index if not exists request_lines_outcome_token on public.request_lines(outcome_token);
update public.request_lines set outcome_at = coalesce(chosen_at, created_at) where outcome is not null and outcome_at is null;

insert into public.app_settings(key, value) values ('outcome_days', '21') on conflict (key) do nothing;

-- Köparen kan inte ändra token eller när frågan skickades; outcome_at sätts när utfallet ändras
create or replace function public.guard_outcome()
returns trigger language plpgsql security definer set search_path to '' as $$
begin
  if not app.is_admin() and coalesce(auth.role(),'') <> 'service_role'
     and (new.outcome_token, new.outcome_asked_at) is distinct from (old.outcome_token, old.outcome_asked_at)
  then raise exception 'Fältet kan inte ändras'; end if;
  if new.outcome is distinct from old.outcome then new.outcome_at := case when new.outcome is null then null else now() end; end if;
  return new;
end $$;
drop trigger if exists guard_outcome on public.request_lines;
create trigger guard_outcome before update on public.request_lines for each row execute function public.guard_outcome();

-- Hemlighet för det dagliga anropet, i Vault. Funktionen kontrollerar den via affar_cron_ok (bara service_role).
do $$ begin
  if not exists (select 1 from vault.secrets where name = 'affar_cron') then
    perform vault.create_secret(encode(extensions.gen_random_bytes(24), 'hex'), 'affar_cron', 'Daglig utskick av Blev det affär?');
  end if;
end $$;

create or replace function public.affar_cron_ok(s text)
returns boolean language sql stable security definer set search_path to '' as $$
  select exists(select 1 from vault.decrypted_secrets where name = 'affar_cron' and decrypted_secret = s)
$$;
revoke all on function public.affar_cron_ok(text) from public, anon, authenticated;
grant execute on function public.affar_cron_ok(text) to service_role;

-- Dagligt anrop kl. 07 UTC (08 svensk vintertid)
create extension if not exists pg_cron;
create extension if not exists pg_net;
select cron.unschedule('affar-fraga') where exists (select 1 from cron.job where jobname = 'affar-fraga');
select cron.schedule('affar-fraga', '0 7 * * *', $c$
  select net.http_post(
    url := 'https://rottbopdolyiparxkadd.supabase.co/functions/v1/affar',
    headers := jsonb_build_object('Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'affar_cron')),
    body := '{"action":"send"}'::jsonb)
$c$);
