
-- 1. Logs de atividade administrativa
CREATE TABLE public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner can manage logs" ON admin_logs
  FOR ALL TO authenticated USING (is_site_owner(auth.uid()));

-- 2. Pedidos de saque de afiliados
CREATE TABLE public.affiliate_withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  requested_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  notes text
);
ALTER TABLE public.affiliate_withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages withdrawals" ON affiliate_withdrawals
  FOR ALL TO authenticated USING (is_site_owner(auth.uid()));
CREATE POLICY "Users view own withdrawals" ON affiliate_withdrawals
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users request own withdrawals" ON affiliate_withdrawals
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
