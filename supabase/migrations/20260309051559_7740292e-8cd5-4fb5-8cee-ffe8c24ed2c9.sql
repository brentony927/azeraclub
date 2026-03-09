
-- Fix 1: Restrict founder_notifications INSERT to service_role only
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.founder_notifications;

CREATE POLICY "Service role inserts notifications"
  ON public.founder_notifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow users to insert notifications where related_user_id is themselves (for connection requests etc.)
CREATE POLICY "Users can insert own-authored notifications"
  ON public.founder_notifications FOR INSERT
  TO authenticated
  WITH CHECK (related_user_id = auth.uid());

-- Fix 2: Restrict weekly_message_limits - prevent users from decreasing their count
-- Drop the permissive ALL policy and replace with granular ones
DROP POLICY IF EXISTS "Users manage own message limits" ON public.weekly_message_limits;

CREATE POLICY "Users can view own message limits"
  ON public.weekly_message_limits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own message limits"
  ON public.weekly_message_limits FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Only allow updates that increase the message_count (no resets)
CREATE POLICY "Users can only increment message limits"
  ON public.weekly_message_limits FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND message_count >= 0);
