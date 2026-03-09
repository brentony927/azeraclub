
-- CRITICAL 1: Remove ALL policy on founder_scores (prevents score manipulation)
DROP POLICY IF EXISTS "Users manage own score" ON public.founder_scores;

-- Create SELECT-only policy for own scores (the existing "Anyone can view scores" already covers public read)
CREATE POLICY "Users can view own score"
ON public.founder_scores
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- CRITICAL 2: Fix venture_notes - add membership check for INSERT
DROP POLICY IF EXISTS "Venture participants can manage notes" ON public.venture_notes;

CREATE POLICY "Venture participants can view notes"
ON public.venture_notes
FOR SELECT
TO authenticated
USING (
  (venture_id IN (SELECT id FROM ventures WHERE user_id = auth.uid()))
  OR (venture_id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted'))
);

CREATE POLICY "Venture participants can insert notes"
ON public.venture_notes
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND (
    (venture_id IN (SELECT id FROM ventures WHERE user_id = auth.uid()))
    OR (venture_id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted'))
  )
);

CREATE POLICY "Venture participants can update own notes"
ON public.venture_notes
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Venture participants can delete own notes"
ON public.venture_notes
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- WARNING 1: Harden venture_tasks policies to require accepted membership
DROP POLICY IF EXISTS "Venture owner or member can select tasks" ON public.venture_tasks;
DROP POLICY IF EXISTS "Venture owner or member can insert tasks" ON public.venture_tasks;
DROP POLICY IF EXISTS "Venture owner or member can update tasks" ON public.venture_tasks;
DROP POLICY IF EXISTS "Venture owner or member can delete tasks" ON public.venture_tasks;

CREATE POLICY "Venture owner or accepted member can select tasks"
ON public.venture_tasks FOR SELECT TO public
USING (
  (venture_id IN (SELECT id FROM ventures WHERE user_id = auth.uid()))
  OR (venture_id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted'))
);

CREATE POLICY "Venture owner or accepted member can insert tasks"
ON public.venture_tasks FOR INSERT TO public
WITH CHECK (
  (venture_id IN (SELECT id FROM ventures WHERE user_id = auth.uid()))
  OR (venture_id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted'))
);

CREATE POLICY "Venture owner or accepted member can update tasks"
ON public.venture_tasks FOR UPDATE TO public
USING (
  (venture_id IN (SELECT id FROM ventures WHERE user_id = auth.uid()))
  OR (venture_id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted'))
);

CREATE POLICY "Venture owner or accepted member can delete tasks"
ON public.venture_tasks FOR DELETE TO public
USING (
  (venture_id IN (SELECT id FROM ventures WHERE user_id = auth.uid()))
  OR (venture_id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted'))
);

-- Harden venture_chat policies
DROP POLICY IF EXISTS "Venture owner or member can select chat" ON public.venture_chat;
DROP POLICY IF EXISTS "Venture owner or member can insert chat" ON public.venture_chat;

CREATE POLICY "Venture owner or accepted member can select chat"
ON public.venture_chat FOR SELECT TO public
USING (
  (venture_id IN (SELECT id FROM ventures WHERE user_id = auth.uid()))
  OR (venture_id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted'))
);

CREATE POLICY "Venture owner or accepted member can insert chat"
ON public.venture_chat FOR INSERT TO public
WITH CHECK (
  (venture_id IN (SELECT id FROM ventures WHERE user_id = auth.uid()))
  OR (venture_id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted'))
);

-- WARNING 2: Create function to round GPS coordinates (~1km precision)
CREATE OR REPLACE FUNCTION public.get_rounded_coordinates(p_user_id uuid)
RETURNS TABLE(latitude double precision, longitude double precision)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ROUND(fp.latitude::numeric, 2)::double precision,
    ROUND(fp.longitude::numeric, 2)::double precision
  FROM founder_profiles fp
  WHERE fp.user_id = p_user_id;
$$;
