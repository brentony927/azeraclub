
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_key TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_key)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view badges (for displaying on other profiles)
CREATE POLICY "Anyone authenticated can view badges"
  ON public.user_badges FOR SELECT
  TO authenticated
  USING (true);

-- Only service_role can insert/update/delete (system grants badges)
CREATE POLICY "Service role manages badges"
  ON public.user_badges FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
