ALTER TABLE public.founder_profiles ADD COLUMN IF NOT EXISTS is_site_owner boolean NOT NULL DEFAULT false;

UPDATE public.founder_profiles
SET is_site_owner = true
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'brentonybss2025@gmail.com' LIMIT 1);