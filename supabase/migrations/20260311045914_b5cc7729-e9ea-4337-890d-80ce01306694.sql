
-- Affiliate requests (application form)
CREATE TABLE public.affiliate_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  instagram text,
  tiktok text,
  youtube text,
  twitter text,
  audience text,
  strategy text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.affiliate_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own affiliate requests" ON public.affiliate_requests FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Affiliate profiles (approved affiliates)
CREATE TABLE public.affiliate_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  affiliate_id text NOT NULL UNIQUE,
  commission_rate numeric DEFAULT 0.25,
  level text DEFAULT 'starter',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.affiliate_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own affiliate profile" ON public.affiliate_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Affiliate leads
CREATE TABLE public.affiliate_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id text NOT NULL,
  user_id uuid NOT NULL,
  user_name text,
  user_plan text DEFAULT 'free',
  signed_up_at timestamptz DEFAULT now(),
  purchased_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.affiliate_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates view own leads" ON public.affiliate_leads FOR SELECT TO authenticated
  USING (referrer_id IN (SELECT affiliate_id FROM affiliate_profiles WHERE user_id = auth.uid()));
CREATE POLICY "System inserts affiliate leads" ON public.affiliate_leads FOR INSERT TO authenticated WITH CHECK (true);

-- Affiliate commissions
CREATE TABLE public.affiliate_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id text NOT NULL,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  paid_at timestamptz
);
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates view own commissions" ON public.affiliate_commissions FOR SELECT TO authenticated
  USING (affiliate_id IN (SELECT affiliate_id FROM affiliate_profiles WHERE user_id = auth.uid()));

-- Affiliate wallet
CREATE TABLE public.affiliate_wallet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  balance_pending numeric DEFAULT 0,
  balance_available numeric DEFAULT 0,
  total_paid numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.affiliate_wallet ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own wallet" ON public.affiliate_wallet FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Affiliate withdrawals
CREATE TABLE public.affiliate_withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.affiliate_withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own withdrawals" ON public.affiliate_withdrawals FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Affiliate payout info
CREATE TABLE public.affiliate_payout_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text,
  cpf text,
  pix_key text,
  paypal_email text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.affiliate_payout_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own payout info" ON public.affiliate_payout_info FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
