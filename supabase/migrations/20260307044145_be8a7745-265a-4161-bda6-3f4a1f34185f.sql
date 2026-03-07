
CREATE TABLE public.user_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own plan
CREATE POLICY "Users can view own plan"
  ON public.user_plans
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Service role can manage all (for admin operations via backend)
CREATE POLICY "Service role manages all plans"
  ON public.user_plans
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
