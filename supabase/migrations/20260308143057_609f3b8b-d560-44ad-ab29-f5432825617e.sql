ALTER TABLE public.founder_profiles ADD COLUMN username text UNIQUE;
CREATE INDEX idx_founder_profiles_username ON public.founder_profiles(username);