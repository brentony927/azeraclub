ALTER TABLE public.founder_profiles
  ADD COLUMN latitude double precision DEFAULT NULL,
  ADD COLUMN longitude double precision DEFAULT NULL;