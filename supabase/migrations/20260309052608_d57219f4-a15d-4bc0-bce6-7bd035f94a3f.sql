
-- Fix 1: Remove client UPDATE permission on weekly_message_limits - service_role only
DROP POLICY IF EXISTS "Users can only increment message limits" ON public.weekly_message_limits;

CREATE POLICY "Service role updates message limits"
  ON public.weekly_message_limits FOR UPDATE
  TO service_role
  WITH CHECK (true);

-- Fix 2: Split founder_messages UPDATE policy - recipients can only update read field
DROP POLICY IF EXISTS "Users can update own messages" ON public.founder_messages;

-- Senders can update their own messages (all columns)
CREATE POLICY "Senders can update own messages"
  ON public.founder_messages FOR UPDATE
  TO authenticated
  USING (from_user_id = auth.uid())
  WITH CHECK (from_user_id = auth.uid());

-- Recipients can mark messages as read only (no content changes)
-- We use a function to restrict updateable columns
CREATE OR REPLACE FUNCTION public.check_read_only_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If the updater is the recipient, only allow read field changes
  IF OLD.to_user_id = auth.uid() AND OLD.from_user_id != auth.uid() THEN
    IF NEW.content != OLD.content OR NEW.from_user_id != OLD.from_user_id OR NEW.to_user_id != OLD.to_user_id THEN
      RAISE EXCEPTION 'Recipients can only update the read status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS enforce_read_only_update ON public.founder_messages;
CREATE TRIGGER enforce_read_only_update
  BEFORE UPDATE ON public.founder_messages
  FOR EACH ROW EXECUTE FUNCTION public.check_read_only_update();

-- Allow recipients to update (the trigger enforces read-only restriction)
CREATE POLICY "Recipients can mark messages read"
  ON public.founder_messages FOR UPDATE
  TO authenticated
  USING (to_user_id = auth.uid())
  WITH CHECK (to_user_id = auth.uid());
