ALTER TABLE public.affiliate_profiles ADD COLUMN IF NOT EXISTS stripe_account_id text;
ALTER TABLE public.affiliate_profiles ADD COLUMN IF NOT EXISTS stripe_onboarding_complete boolean DEFAULT false;