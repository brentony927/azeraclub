
-- 1. Fix get_rounded_coordinates: only return coords for published profiles
CREATE OR REPLACE FUNCTION public.get_rounded_coordinates(p_user_id uuid)
 RETURNS TABLE(latitude double precision, longitude double precision)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT
    ROUND(fl.latitude::numeric, 2)::double precision,
    ROUND(fl.longitude::numeric, 2)::double precision
  FROM founder_locations fl
  JOIN founder_profiles fp ON fp.user_id = fl.user_id
  WHERE fl.user_id = p_user_id
    AND fp.is_published = true;
$function$;

-- 2. Fix founder_connections UPDATE policy: only recipient can update
DROP POLICY IF EXISTS "Participants can update connections" ON public.founder_connections;
CREATE POLICY "Recipients can update connections"
  ON public.founder_connections
  FOR UPDATE
  TO authenticated
  USING (to_user_id = auth.uid())
  WITH CHECK (to_user_id = auth.uid());

-- 3. Fix is_venture_member: require accepted status
CREATE OR REPLACE FUNCTION public.is_venture_member(p_user_id uuid, p_venture_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.venture_members
    WHERE user_id = p_user_id AND venture_id = p_venture_id AND status = 'accepted'
  );
$function$;
