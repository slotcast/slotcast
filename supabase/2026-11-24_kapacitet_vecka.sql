-- Fabrikens ungefärliga kapacitet i m² per vecka (normal produktion, inte ledig kapacitet). Kopieras till svaret som ISO.
alter table public.organizations add column if not exists capacity_week integer check (capacity_week is null or capacity_week > 0);
alter table public.answers add column if not exists capacity_week integer check (capacity_week is null or capacity_week > 0);
