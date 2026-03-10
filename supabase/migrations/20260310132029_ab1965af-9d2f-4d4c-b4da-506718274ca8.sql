
-- =============================================
-- 1. FIX VENTURES OWNERSHIP HIJACK
-- =============================================
-- Drop the ALL policy and create granular ones
DROP POLICY IF EXISTS "Owners and accepted members can manage ventures" ON public.ventures;
DROP POLICY IF EXISTS "venture_select" ON public.ventures;
DROP POLICY IF EXISTS "venture_insert" ON public.ventures;
DROP POLICY IF EXISTS "venture_update" ON public.ventures;
DROP POLICY IF EXISTS "venture_delete" ON public.ventures;

-- SELECT: owner + accepted members
CREATE POLICY "venture_select" ON public.ventures FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR
  id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted')
);

-- INSERT: only owner
CREATE POLICY "venture_insert" ON public.ventures FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- UPDATE: owner can update anything; accepted members can update but NOT change user_id
CREATE POLICY "venture_update" ON public.ventures FOR UPDATE TO authenticated
USING (
  user_id = auth.uid() OR
  id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted')
)
WITH CHECK (
  user_id = auth.uid() OR
  (
    id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted')
    AND user_id = (SELECT v.user_id FROM ventures v WHERE v.id = ventures.id)
  )
);

-- DELETE: only owner
CREATE POLICY "venture_delete" ON public.ventures FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- =============================================
-- 2. FIX VENTURE_MEMBERS SELF-RESTORE
-- =============================================
DROP POLICY IF EXISTS "Invited users can update own membership" ON public.venture_members;
DROP POLICY IF EXISTS "venture_members_self_update" ON public.venture_members;

-- Members can only update their own row, and only from pending → accepted/rejected
CREATE POLICY "venture_members_self_update" ON public.venture_members FOR UPDATE TO authenticated
USING (
  user_id = auth.uid()
  AND status = 'pending'
)
WITH CHECK (
  user_id = auth.uid()
  AND status IN ('accepted', 'rejected')
);

-- =============================================
-- 3. CREATE FOUNDER_LOCATIONS TABLE (GPS privacy)
-- =============================================
CREATE TABLE IF NOT EXISTS public.founder_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  latitude double precision,
  longitude double precision,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.founder_locations ENABLE ROW LEVEL SECURITY;

-- Only owner can see/manage their precise location
CREATE POLICY "owner_select" ON public.founder_locations FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "owner_insert" ON public.founder_locations FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "owner_update" ON public.founder_locations FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "owner_delete" ON public.founder_locations FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Migrate existing data
INSERT INTO public.founder_locations (user_id, latitude, longitude)
SELECT user_id, latitude, longitude FROM public.founder_profiles
WHERE latitude IS NOT NULL AND longitude IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Update get_rounded_coordinates to read from founder_locations
CREATE OR REPLACE FUNCTION public.get_rounded_coordinates(p_user_id uuid)
RETURNS TABLE(latitude double precision, longitude double precision)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ROUND(fl.latitude::numeric, 2)::double precision,
    ROUND(fl.longitude::numeric, 2)::double precision
  FROM founder_locations fl
  WHERE fl.user_id = p_user_id;
$$;
