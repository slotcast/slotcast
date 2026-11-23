-- Slutet på radien: rader som nått sista steget, väntat 2 dygn och fortfarande har färre än 3 kravuppfyllande svar.
-- Admin ser alla (ruta i Översikt); köparen ser bara sina egna rader och får beskedet att vi hör av oss personligen.
create or replace function public.stalled_lines()
returns table(line_id uuid, request_id uuid, answers integer)
language sql stable security definer set search_path = '' as $$
  select rl.id, rq.id,
    (select count(*)::int from public.answers a where a.line_id = rl.id and a.status in ('helt','delvis')
       and (rq.min_climate_level is null or coalesce(a.climate_level, 0) >= rq.min_climate_level)
       and (not coalesce(rq.epd_required, false) or coalesce(a.has_epd, false)))
  from public.request_lines rl join public.requests rq on rq.id = rl.request_id
  where not rl.removed and rl.chosen_org_id is null and rq.deleted_at is null and rq.review in ('ok','godkand')
    and rl.radius_km >= 750
    and (coalesce(app.line_m2(rl.unit, rl.qty, rl.height_mm), 0) < 4000 or rl.include_pl)
    and now() - greatest(rl.radius_set_at, coalesce(rq.reviewed_at, rq.created_at)) >= interval '2 days'
    and (app.is_admin() or rq.buyer_org_id = app.my_org())
    and (select count(*) from public.answers a where a.line_id = rl.id and a.status in ('helt','delvis')
       and (rq.min_climate_level is null or coalesce(a.climate_level, 0) >= rq.min_climate_level)
       and (not coalesce(rq.epd_required, false) or coalesce(a.has_epd, false))) < 3
$$;
revoke all on function public.stalled_lines() from public, anon;
grant execute on function public.stalled_lines() to authenticated;
