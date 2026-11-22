-- Klimatnivå 1–6 (nivå 6 = 60 % under typvärdet) och ISO-certifiering i fabrikens profil och svar.
alter table public.requests drop constraint if exists requests_min_climate_level_check;
alter table public.requests add constraint requests_min_climate_level_check check (min_climate_level between 0 and 6);
alter table public.answers drop constraint if exists answers_climate_level_check;
alter table public.answers add constraint answers_climate_level_check check (climate_level between 0 and 6);

alter table public.organizations add column if not exists iso text[] not null default '{}';
alter table public.organizations drop constraint if exists organizations_iso_check;
alter table public.organizations add constraint organizations_iso_check check (iso <@ array['9001','14001','45001']::text[]);

-- Svaret sparar fabrikens ISO, så att köparen ser det utan att se vilken fabrik det är.
alter table public.answers add column if not exists iso text[] not null default '{}';

grant select, insert, update (iso) on public.organizations to authenticated;
grant select, insert, update (iso) on public.answers to authenticated;
