-- Ett normalt offertflöde (beslut 9, 10, 28, 29).
-- 1) Ingen snabb leverans och ingen ledig kapacitet. 2) Förfrågan går till fabriker inom 250 km;
-- radien utökas till 500 och 750 km om färre än 3 svar som uppfyller kraven kommit efter 2 dagar per steg.
-- Stora volymer (minst 4 000 m² på någon rad) startar på 500 km och går efter 2 dagar utan tillräckligt med svar
-- även till fabriker i Polen. Avstånd: fågelväg × 1,3 som närmevärde för vägavstånd.

-- ---------- Ta bort snabb leverans och kapacitet ----------
update public.requests set kind = 'offert' where kind <> 'offert';
drop function if exists public.capacity_summary(text, integer, integer);
drop function if exists public.open_capacity(integer);
drop table if exists public.slots cascade;

-- ---------- Radie per förfrågningsrad ----------
alter table public.request_lines add column if not exists radius_km smallint not null default 250 check (radius_km in (250, 500, 750));
alter table public.request_lines add column if not exists radius_set_at timestamptz not null default now();
alter table public.request_lines add column if not exists include_pl boolean not null default false;

-- Köparen får inte själv ändra radien: nya rader startar alltid på 250 km, ändringar görs bara av jobbet (och admin).
create or replace function public.guard_line_radius_ins()
returns trigger language plpgsql set search_path = '' as $$
begin
  if session_user not in ('postgres', 'supabase_admin') and not app.is_admin() and coalesce(auth.role(), '') <> 'service_role' then
    new.radius_km := 250; new.include_pl := false; new.radius_set_at := now();
  end if;
  return new;
end $$;
drop trigger if exists guard_line_radius_ins on public.request_lines;
create trigger guard_line_radius_ins before insert on public.request_lines for each row execute function public.guard_line_radius_ins();

create or replace function public.guard_line()
 returns trigger language plpgsql security definer set search_path to ''
as $function$
begin
  if app.is_admin() or coalesce(auth.role(),'') = 'service_role' then return new; end if;
  if (new.radius_km, new.radius_set_at, new.include_pl) is distinct from (old.radius_km, old.radius_set_at, old.include_pl)
     and session_user not in ('postgres', 'supabase_admin') then raise exception 'Fältet kan inte ändras'; end if;
  if new.request_id is distinct from old.request_id then raise exception 'Fältet kan inte ändras'; end if;
  if old.chosen_org_id is not null then
    if new.chosen_org_id is distinct from old.chosen_org_id then raise exception 'Valet av fabrik kan inte ändras'; end if;
    if (new.product, new.spec, new.unit, new.qty, new.height_mm, new.elements, new.concrete_mm, new.t1, new.t2, new.t3, new.arm, new.removed)
       is distinct from (old.product, old.spec, old.unit, old.qty, old.height_mm, old.elements, old.concrete_mm, old.t1, old.t2, old.t3, old.arm, old.removed)
    then raise exception 'Raden är låst eftersom fabrik är vald'; end if;
  elsif new.chosen_org_id is not null then
    if not exists(select 1 from public.answers where line_id = new.id and factory_org_id = new.chosen_org_id and status <> 'nej') then
      raise exception 'Fabriken har inte lämnat något svar med pris';
    end if;
    new.chosen_at := now();
  end if;
  if new.outcome is distinct from old.outcome and new.chosen_org_id is null then
    raise exception 'Utfall kan bara anges efter att fabrik valts';
  end if;
  if old.chosen_org_id is null and (new.product, new.spec, new.unit, new.qty, new.height_mm, new.elements, new.concrete_mm, new.t1, new.t2, new.t3, new.arm, new.removed)
       is distinct from (old.product, old.spec, old.unit, old.qty, old.height_mm, old.elements, old.concrete_mm, old.t1, old.t2, old.t3, old.arm, old.removed)
  then new.edited_at := now(); end if;
  return new;
end $function$;

-- Avstånd (fågelväg × 1,3) och Polen (rutan över Polen; fabriker finns bara i Sverige, Danmark och Polen).
create or replace function app.in_range(flat double precision, flng double precision, rlat double precision, rlng double precision, rad integer, pl boolean)
returns boolean language sql immutable set search_path = '' as $$
  select flat is null or rlat is null
    or (pl and flat between 49 and 54.9 and flng between 14.1 and 24.2)
    or 1.3 * 12742 * asin(least(1, sqrt(power(sin(radians(rlat - flat) / 2), 2)
         + cos(radians(flat)) * cos(radians(rlat)) * power(sin(radians(rlng - flng) / 2), 2)))) <= rad
$$;

create or replace function app.can_answer(l uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(
    select 1 from public.request_lines rl
    join public.requests r on r.id = rl.request_id
    join public.organizations f on f.id = app.my_org()
    where rl.id = l and not rl.removed and rl.chosen_org_id is null and r.deleted_at is null
      and r.review in ('ok','godkand')
      and f.role in ('fabrik','bada') and f.status <> 'avstangd'
      and rl.product = any(f.products) and r.buyer_org_id <> f.id
      and app.org_active(r.buyer_org_id)
      and (app.in_range(f.lat, f.lng, r.lat, r.lng, rl.radius_km, rl.include_pl)
           or exists(select 1 from public.answers a where a.line_id = rl.id and a.factory_org_id = f.id)))
$$;

-- ---------- Fabrikens inkorg: bara förfrågningar inom radien, och sista svarsdag ----------
drop function if exists public.factory_inbox();
create function public.factory_inbox()
 returns table(line_id uuid, request_id uuid, product text, spec text, unit public.qty_unit, qty numeric, height_mm integer, elements integer, concrete_mm integer, t1 integer, t2 integer, t3 integer, arm numeric, line_edited_at timestamp with time zone, city text, first_week integer, last_week integer, all_from_one boolean, drawings text, request_created_at timestamp with time zone, request_edited_at timestamp with time zone, chosen_me boolean, chosen_other boolean, outcome public.deal_outcome, buyer_name text, buyer_contact text, buyer_phone text, buyer_email text, addr text, min_climate_level smallint, epd_required boolean, kind text, lat double precision, lng double precision, answer_by timestamp with time zone)
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
         round(r.lat::numeric, 2)::double precision, round(r.lng::numeric, 2)::double precision,
         coalesce(r.reviewed_at, r.created_at) + interval '7 days'
  from public.organizations f
  join public.request_lines rl on rl.product = any(f.products) and not rl.removed
  join public.requests r on r.id = rl.request_id and r.deleted_at is null and r.buyer_org_id <> f.id
  join public.organizations b on b.id = r.buyer_org_id and b.status <> 'avstangd'
  where f.id = app.my_org() and f.role in ('fabrik','bada') and f.status <> 'avstangd'
    and (rl.chosen_org_id is null or rl.chosen_org_id = f.id
         or exists(select 1 from public.answers a where a.line_id = rl.id and a.factory_org_id = f.id))
    and (rl.chosen_org_id = f.id
         or exists(select 1 from public.answers a where a.line_id = rl.id and a.factory_org_id = f.id)
         or app.in_range(f.lat, f.lng, r.lat, r.lng, rl.radius_km, rl.include_pl))
    and r.review in ('ok','godkand')
  order by r.created_at desc
$$;
grant execute on function public.factory_inbox() to authenticated;
grant execute on function app.in_range(double precision, double precision, double precision, double precision, integer, boolean) to authenticated;

-- ---------- Jobbet som utökar radien (varje timme) ----------
create or replace function app.advance_radius()
returns integer language plpgsql security definer set search_path = '' as $$
declare r record; q integer; n integer := 0; start_at timestamptz; set_at timestamptz;
begin
  for r in
    select rl.id, rl.radius_km, rl.radius_set_at, rl.include_pl, rq.created_at, rq.reviewed_at,
           rq.min_climate_level, rq.epd_required,
           coalesce(app.line_m2(rl.unit, rl.qty, rl.height_mm), 0) >= 4000 as big
    from public.request_lines rl join public.requests rq on rq.id = rl.request_id
    where not rl.removed and rl.chosen_org_id is null and rq.deleted_at is null and rq.review in ('ok','godkand')
  loop
    start_at := coalesce(r.reviewed_at, r.created_at);
    set_at := greatest(r.radius_set_at, start_at);
    -- stora volymer startar på 500 km
    if r.big and r.radius_km = 250 then
      update public.request_lines set radius_km = 500, radius_set_at = start_at where id = r.id;
      n := n + 1; continue;
    end if;
    if now() - set_at < interval '2 days' then continue; end if;
    select count(*) into q from public.answers a
      where a.line_id = r.id and a.status in ('helt','delvis')
        and (r.min_climate_level is null or coalesce(a.climate_level, 0) >= r.min_climate_level)
        and (not coalesce(r.epd_required, false) or coalesce(a.has_epd, false));
    if q >= 3 then continue; end if;
    if r.radius_km = 250 then
      update public.request_lines set radius_km = 500, radius_set_at = now() where id = r.id;
    elsif r.radius_km = 500 then
      update public.request_lines set radius_km = 750, radius_set_at = now(), include_pl = r.big where id = r.id;
    elsif r.big and not r.include_pl then
      update public.request_lines set include_pl = true, radius_set_at = now() where id = r.id;
    else continue;
    end if;
    n := n + 1;
  end loop;
  return n;
end $$;
revoke all on function app.advance_radius() from public, anon, authenticated;

select cron.schedule('radie-steg', '7 * * * *', 'select app.advance_radius()');
select app.advance_radius();
