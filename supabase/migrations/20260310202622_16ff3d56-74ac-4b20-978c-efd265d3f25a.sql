
-- Partner profiles
CREATE TABLE public.partner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  partner_id text NOT NULL UNIQUE,
  pix_key text,
  paypal_email text,
  full_name text,
  cpf text,
  commission_rate numeric DEFAULT 0.25,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.partner_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own partner profile" ON public.partner_profiles FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Referrals
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id text NOT NULL,
  user_id uuid NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners view own referrals" ON public.referrals FOR SELECT TO authenticated
  USING (referrer_id IN (SELECT partner_id FROM public.partner_profiles WHERE user_id = auth.uid()));
CREATE POLICY "System inserts referrals" ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (true);

-- Commissions
CREATE TABLE public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id text NOT NULL,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  paid_at timestamptz
);
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners view own commissions" ON public.commissions FOR SELECT TO authenticated
  USING (affiliate_id IN (SELECT partner_id FROM public.partner_profiles WHERE user_id = auth.uid()));

-- Payouts
CREATE TABLE public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners view own payouts" ON public.payouts FOR SELECT TO authenticated
  USING (affiliate_id IN (SELECT partner_id FROM public.partner_profiles WHERE user_id = auth.uid()));
