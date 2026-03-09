-- Fix weekly_message_limits: restrict writes to service_role only
DROP POLICY IF EXISTS "Users can insert own message limits" ON public.weekly_message_limits;
DROP POLICY IF EXISTS "Users can update own message limits" ON public.weekly_message_limits;
DROP POLICY IF EXISTS "Service role manages message limits" ON public.weekly_message_limits;

CREATE POLICY "Service role manages message limits"
  ON public.weekly_message_limits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Keep SELECT for users to see their own count
DROP POLICY IF EXISTS "Users can view own message limits" ON public.weekly_message_limits;
CREATE POLICY "Users can view own message limits"
  ON public.weekly_message_limits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());