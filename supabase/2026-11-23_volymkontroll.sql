-- Volymkontroll: en förfrågan där någon produktrad har under 100 m² eller över 4 000 m²
-- publiceras inte direkt. Den får granskning = 'granskas', admin får ett mejl (funktionen "granskning")
-- och godkänner, avböjer, kontaktar köparen eller rättar förfrågan. Köparen ser inget om granskningen.
-- Rader i lm räknas om till m² med elementhöjden. Trappor (st) räknas inte.

alter table public.requests add column if not exists review text not null default 'ok';
alter table public.requests drop constraint if exists requests_review_check;
alter table public.requests add constraint requests_review_check check (review in ('ok','granskas','godkand','avbojd'));
alter table public.requests add column if not exists review_reason text;
alter table public.requests add column if not exists reviewed_at timestamptz;
alter table public.requests add column if not exists review_notified_at timestamptz;

insert into public.app_settings(key, value) values
  ('review_email', 'filip.bjornstjerna@icloud.com'),
  ('review_min_m2', '100'),
  ('review_max_m2', '4000')
on conflict (key) do nothing;

-- Radens yta i m² (null för trappor och rader utan höjd i lm)
create or replace function app.line_m2(u public.qty_unit, q numeric, h integer)
returns numeric language sql immutable set search_path to '' as $$
  select case when u::text = 'm2' then q when u::text = 'lm' and h > 0 then q * h / 1000.0 else null end
$$;

create or replace function app.volume_outside(u public.qty_unit, q numeric, h integer)
returns boolean language sql stable security definer set search_path to '' as $$
  select coalesce(app.line_m2(u, q, h) < (select value::numeric from public.app_settings where key = 'review_min_m2')
               or app.line_m2(u, q, h) > (select value::numeric from public.app_settings where key = 'review_max_m2'), false)
$$;

-- Köparen ny rad eller ändrad mängd utanför gränserna: förfrågan går till granskning igen.
-- Admin som rättar en rad flaggar inte.
create or replace function public.flag_review()
returns trigger language plpgsql security definer set search_path to '' as $$
begin
  if app.is_admin() or coalesce(auth.role(),'') = 'service_role' then return null; end if;
  if new.removed then return null; end if;
  if tg_op = 'UPDATE' and (new.unit, new.qty, new.height_mm, new.removed) is not distinct from (old.unit, old.qty, old.height_mm, old.removed) then return null; end if;
  if app.volume_outside(new.unit, new.qty, new.height_mm) then
    perform set_config('app.review_sys', '1', true);
    update public.requests set review = 'granskas', reviewed_at = null, review_notified_at = null
      where id = new.request_id and review <> 'avbojd';
    perform set_config('app.review_sys', '', true);
  end if;
  return null;
end $$;

drop trigger if exists flag_review on public.request_lines;
create trigger flag_review after insert or update on public.request_lines
  for each row execute function public.flag_review();

-- Bara admin (eller systemet) ändrar granskningen
create or replace function public.touch_request()
returns trigger language plpgsql set search_path to '' as $$
begin
  if (new.city, new.first_week, new.last_week, new.all_from_one, new.drawings, new.addr, new.min_climate_level, new.epd_required, new.kind)
     is distinct from (old.city, old.first_week, old.last_week, old.all_from_one, old.drawings, old.addr, old.min_climate_level, old.epd_required, old.kind)
  then new.edited_at := now(); end if;
  if new.buyer_org_id is distinct from old.buyer_org_id and not app.is_admin() then raise exception 'Fältet kan inte ändras'; end if;
  if (new.review, new.review_reason, new.reviewed_at, new.review_notified_at) is distinct from (old.review, old.review_reason, old.reviewed_at, old.review_notified_at)
     and not app.is_admin() and coalesce(auth.role(),'') <> 'service_role' and coalesce(current_setting('app.review_sys', true), '') <> '1'
  then raise exception 'Fältet kan inte ändras'; end if;
  if new.review is distinct from old.review and new.review in ('godkand','avbojd') then new.reviewed_at := now(); end if;
  return new;
end $$;

-- Köparen kan inte sätta granskning själv vid skapandet
create or replace function public.guard_new_request()
returns trigger language plpgsql set search_path to '' as $$
begin
  if not app.is_admin() and coalesce(auth.role(),'') <> 'service_role' then
    new.review := 'ok'; new.review_reason := null; new.reviewed_at := null; new.review_notified_at := null;
  end if;
  return new;
end $$;
drop trigger if exists guard_new_request on public.requests;
create trigger guard_new_request before insert on public.requests for each row execute function public.guard_new_request();

-- Fabriker ser och svarar bara på förfrågningar som inte väntar på granskning eller är avböjda
create or replace function app.can_answer(l uuid)
returns boolean language sql stable security definer set search_path to '' as $$
  select exists(
    select 1 from public.request_lines rl
    join public.requests r on r.id = rl.request_id
    join public.organizations f on f.id = app.my_org()
    where rl.id = l and not rl.removed and rl.chosen_org_id is null and r.deleted_at is null
      and r.review in ('ok','godkand')
      and f.role in ('fabrik','bada') and f.status <> 'avstangd'
      and rl.product = any(f.products) and r.buyer_org_id <> f.id
      and app.org_active(r.buyer_org_id))
$$;

create or replace function public.factory_inbox()
 returns table(line_id uuid, request_id uuid, product text, spec text, unit public.qty_unit, qty numeric, height_mm integer, elements integer, concrete_mm integer, t1 integer, t2 integer, t3 integer, arm numeric, line_edited_at timestamp with time zone, city text, first_week integer, last_week integer, all_from_one boolean, drawings text, request_created_at timestamp with time zone, request_edited_at timestamp with time zone, chosen_me boolean, chosen_other boolean, outcome public.deal_outcome, buyer_name text, buyer_contact text, buyer_phone text, buyer_email text, addr text, min_climate_level smallint, epd_required boolean, kind text, lat double precision, lng double precision)
 language sql stable security definer set search_path to ''
as $$
  select rl.id, r.id, rl.product, rl.spec, rl.unit, rl.qty, rl.height_mm, rl.elements, rl.concrete_mm,
         rl.t1, rl.t2, rl.t3, rl.arm, rl.edited_at, r.city, r.first_week, r.last_week, r.all_from_one,
         r.drawings, r.created_at, r.edited_at,
         rl.chosen_org_id = f.id, rl.chosen_org_id is not null and rl.chosen_org_id <> f.id,
         case when rl.chosen_org_id = f.id then rl.outcome end,
         case when rl.chosen_org_id = f.id then b.name end,
         case when rl.chosen_org_id = f.id then b.contact_name end,
         case when rl.chosen_org_id = f.id then b.phone end,
         case when rl.chosen_org_id = f.id then b.email end,
         case when rl.chosen_org_id = f.id then r.addr end,
         r.min_climate_level, r.epd_required, r.kind,
         round(r.lat::numeric, 2)::double precision, round(r.lng::numeric, 2)::double precision
  from public.organizations f
  join public.request_lines rl on rl.product = any(f.products) and not rl.removed
  join public.requests r on r.id = rl.request_id and r.deleted_at is null and r.buyer_org_id <> f.id
  join public.organizations b on b.id = r.buyer_org_id and b.status <> 'avstangd'
  where f.id = app.my_org() and f.role in ('fabrik','bada') and f.status <> 'avstangd'
    and (rl.chosen_org_id is null or rl.chosen_org_id = f.id
         or exists(select 1 from public.answers a where a.line_id = rl.id and a.factory_org_id = f.id))
    and r.review in ('ok','godkand')
  order by r.created_at desc
$$;

grant execute on function app.line_m2(public.qty_unit, numeric, integer) to authenticated;
grant execute on function app.volume_outside(public.qty_unit, numeric, integer) to authenticated;
