-- Ledig kapacitet anges utan produkt (m² och veckor). Köparens förfrågan avgör produkten.
alter table public.slots alter column product drop not null;

create or replace function public.capacity_summary(p text, w1 integer, w2 integer)
 returns table(factories integer, with_capacity integer)
 language sql stable security definer set search_path to ''
as $function$
  select count(distinct o.id)::int,
         count(distinct o.id) filter (where exists(
           select 1 from public.slots s where s.org_id = o.id and s.to_week >= w1 and s.from_week <= w2))::int
  from public.organizations o
  where p = any(o.products) and o.role in ('fabrik','bada') and o.status <> 'avstangd'
    and o.id <> coalesce(app.my_org(), '00000000-0000-0000-0000-000000000000'::uuid)
$function$;

-- Trappor räknas i styck.
alter type public.qty_unit add value if not exists 'st';
