-- Klimat: nivå och EPD-värde per produkt hos fabriken, klimatkrav i förfrågan och klimatuppgifter i svaret.
alter table public.organizations add column if not exists climate jsonb not null default '{}'::jsonb;

alter table public.requests add column if not exists min_climate_level smallint not null default 0 check (min_climate_level between 0 and 5);
alter table public.requests add column if not exists epd_required boolean not null default false;

-- Svaret sparar fabrikens klimatuppgifter, så att köparen kan jämföra utan att se vilken fabrik det är.
alter table public.answers add column if not exists climate_level smallint check (climate_level between 0 and 5);
alter table public.answers add column if not exists has_epd boolean not null default false;
alter table public.answers add column if not exists gwp_value numeric check (gwp_value is null or gwp_value > 0);
alter table public.answers add column if not exists gwp_unit text check (gwp_unit is null or gwp_unit in ('ton','m3','m2'));

-- Transporten får lämnas tom; då visas priset exklusive transport.
alter table public.answers drop constraint if exists answers_check;
alter table public.answers add constraint answers_check check (
  status = 'nej'::public.answer_status
  or (price > 0 and (transport is null or transport >= 0) and week_from is not null and week_to >= week_from));

-- Fabrikens inkorg visar köparens klimatkrav.
drop function if exists public.factory_inbox();
create function public.factory_inbox()
 returns table(line_id uuid, request_id uuid, product text, spec text, unit public.qty_unit, qty numeric, height_mm integer, elements integer, concrete_mm integer, t1 integer, t2 integer, t3 integer, arm numeric, line_edited_at timestamp with time zone, city text, first_week integer, last_week integer, all_from_one boolean, drawings text, request_created_at timestamp with time zone, request_edited_at timestamp with time zone, chosen_me boolean, chosen_other boolean, outcome public.deal_outcome, buyer_name text, buyer_contact text, buyer_phone text, buyer_email text, addr text, min_climate_level smallint, epd_required boolean)
 language sql stable security definer set search_path to ''
as $function$
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
         r.min_climate_level, r.epd_required
  from public.organizations f
  join public.request_lines rl on rl.product = any(f.products) and not rl.removed
  join public.requests r on r.id = rl.request_id and r.deleted_at is null and r.buyer_org_id <> f.id
  join public.organizations b on b.id = r.buyer_org_id and b.status <> 'avstangd'
  where f.id = app.my_org() and f.role in ('fabrik','bada') and f.status <> 'avstangd'
    and (rl.chosen_org_id is null or rl.chosen_org_id = f.id
         or exists(select 1 from public.answers a where a.line_id = rl.id and a.factory_org_id = f.id))
  order by r.created_at desc
$function$;
revoke all on function public.factory_inbox() from public;
grant execute on function public.factory_inbox() to authenticated;

-- Ändrat klimatkrav markerar förfrågan som uppdaterad, så att fabrikerna kontrollerar sina svar.
create or replace function public.touch_request() returns trigger language plpgsql set search_path to '' as $$
begin
  if (new.city, new.first_week, new.last_week, new.all_from_one, new.drawings, new.addr, new.min_climate_level, new.epd_required)
     is distinct from (old.city, old.first_week, old.last_week, old.all_from_one, old.drawings, old.addr, old.min_climate_level, old.epd_required)
  then new.edited_at := now(); end if;
  if new.buyer_org_id is distinct from old.buyer_org_id and not app.is_admin() then raise exception 'Fältet kan inte ändras'; end if;
  return new;
end $$;
