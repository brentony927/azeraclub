-- 1. Create SECURITY DEFINER helper functions to break recursion

CREATE OR REPLACE FUNCTION public.is_group_member(p_user_id uuid, p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.message_group_members
    WHERE user_id = p_user_id AND group_id = p_group_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_group_admin(p_user_id uuid, p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.message_group_members
    WHERE user_id = p_user_id AND group_id = p_group_id AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_group_creator(p_user_id uuid, p_group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.message_groups
    WHERE id = p_group_id AND created_by = p_user_id
  );
$$;

-- 2. Drop and recreate message_group_members policies (self-referential)

DROP POLICY IF EXISTS "Members can view members" ON public.message_group_members;
CREATE POLICY "Members can view members"
  ON public.message_group_members FOR SELECT TO authenticated
  USING (public.is_group_member(auth.uid(), group_id));

DROP POLICY IF EXISTS "Admins can insert members" ON public.message_group_members;
CREATE POLICY "Admins can insert members"
  ON public.message_group_members FOR INSERT TO authenticated
  WITH CHECK (
    public.is_group_admin(auth.uid(), group_id)
    OR public.is_group_creator(auth.uid(), group_id)
  );

DROP POLICY IF EXISTS "Admins can update members" ON public.message_group_members;
CREATE POLICY "Admins can update members"
  ON public.message_group_members FOR UPDATE TO authenticated
  USING (
    public.is_group_admin(auth.uid(), group_id)
    OR public.is_group_creator(auth.uid(), group_id)
  );

DROP POLICY IF EXISTS "Admins can delete members" ON public.message_group_members;
CREATE POLICY "Admins can delete members"
  ON public.message_group_members FOR DELETE TO authenticated
  USING (
    public.is_group_admin(auth.uid(), group_id)
    OR public.is_group_creator(auth.uid(), group_id)
    OR user_id = auth.uid()
  );

-- 3. Drop and recreate message_groups policies (cross-referential)

DROP POLICY IF EXISTS "Members can view groups" ON public.message_groups;
CREATE POLICY "Members can view groups"
  ON public.message_groups FOR SELECT TO authenticated
  USING (
    public.is_group_member(auth.uid(), id)
    OR created_by = auth.uid()
  );

DROP POLICY IF EXISTS "Admins can update groups" ON public.message_groups;
CREATE POLICY "Admins can update groups"
  ON public.message_groups FOR UPDATE TO authenticated
  USING (
    public.is_group_admin(auth.uid(), id)
    OR created_by = auth.uid()
  );

-- 4. Drop and recreate group_messages policies (cross-referential)

DROP POLICY IF EXISTS "Members can view group messages" ON public.group_messages;
CREATE POLICY "Members can view group messages"
  ON public.group_messages FOR SELECT TO authenticated
  USING (public.is_group_member(auth.uid(), group_id));

DROP POLICY IF EXISTS "Members can insert group messages" ON public.group_messages;
CREATE POLICY "Members can insert group messages"
  ON public.group_messages FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND public.is_group_member(auth.uid(), group_id)
  );