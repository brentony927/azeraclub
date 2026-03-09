
-- Remove the authenticated INSERT policy that allows notification injection
DROP POLICY IF EXISTS "Users can insert own-authored notifications" ON public.founder_notifications;

-- Tighten ventures SELECT: only owners and members can see venture details
DROP POLICY IF EXISTS "Anyone authenticated can view active ventures" ON public.ventures;

CREATE POLICY "Owners and members can view ventures"
  ON public.ventures FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR id IN (SELECT venture_id FROM public.venture_members WHERE user_id = auth.uid())
  );
