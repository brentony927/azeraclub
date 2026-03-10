
-- 1. Create SECURITY DEFINER functions to break the cycle

CREATE OR REPLACE FUNCTION public.is_venture_member(p_user_id UUID, p_venture_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.venture_members
    WHERE user_id = p_user_id AND venture_id = p_venture_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_venture_owner(p_user_id UUID, p_venture_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.ventures
    WHERE id = p_venture_id AND user_id = p_user_id
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_venture_member FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_venture_member TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_venture_owner FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_venture_owner TO authenticated;

-- 2. Drop ALL existing policies on ventures
DROP POLICY IF EXISTS "Users manage own ventures" ON public.ventures;
DROP POLICY IF EXISTS "Owners and members can view ventures" ON public.ventures;
DROP POLICY IF EXISTS "venture_select" ON public.ventures;
DROP POLICY IF EXISTS "venture_insert" ON public.ventures;
DROP POLICY IF EXISTS "venture_update" ON public.ventures;
DROP POLICY IF EXISTS "venture_delete" ON public.ventures;

-- 3. Drop problematic policies on venture_members
DROP POLICY IF EXISTS "Members can view their venture memberships" ON public.venture_members;
DROP POLICY IF EXISTS "venture_members_select" ON public.venture_members;
DROP POLICY IF EXISTS "venture_members_insert" ON public.venture_members;
DROP POLICY IF EXISTS "venture_members_update" ON public.venture_members;
DROP POLICY IF EXISTS "venture_members_delete" ON public.venture_members;
DROP POLICY IF EXISTS "Users manage own venture members" ON public.venture_members;
DROP POLICY IF EXISTS "Venture owners manage members" ON public.venture_members;
DROP POLICY IF EXISTS "Members can view venture members" ON public.venture_members;
DROP POLICY IF EXISTS "Owner manages venture members" ON public.venture_members;
DROP POLICY IF EXISTS "Members view own membership" ON public.venture_members;

-- 4. Recreate ventures policies using SECURITY DEFINER functions
CREATE POLICY "venture_select_v2"
ON public.ventures FOR SELECT TO authenticated
USING (
  public.is_venture_owner(auth.uid(), id) OR public.is_venture_member(auth.uid(), id)
);

CREATE POLICY "venture_insert_v2"
ON public.ventures FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "venture_update_v2"
ON public.ventures FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "venture_delete_v2"
ON public.ventures FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- 5. Recreate venture_members policies (no cross-table references)
CREATE POLICY "vm_select_v2"
ON public.venture_members FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR public.is_venture_owner(auth.uid(), venture_id)
);

CREATE POLICY "vm_insert_v2"
ON public.venture_members FOR INSERT TO authenticated
WITH CHECK (
  public.is_venture_owner(auth.uid(), venture_id)
);

CREATE POLICY "vm_update_v2"
ON public.venture_members FOR UPDATE TO authenticated
USING (
  user_id = auth.uid() OR public.is_venture_owner(auth.uid(), venture_id)
);

CREATE POLICY "vm_delete_v2"
ON public.venture_members FOR DELETE TO authenticated
USING (
  user_id = auth.uid() OR public.is_venture_owner(auth.uid(), venture_id)
);

-- 6. Fix venture_tasks, venture_notes, venture_chat that may also reference ventures
DROP POLICY IF EXISTS "venture_tasks_select" ON public.venture_tasks;
DROP POLICY IF EXISTS "venture_tasks_insert" ON public.venture_tasks;
DROP POLICY IF EXISTS "venture_tasks_update" ON public.venture_tasks;
DROP POLICY IF EXISTS "venture_tasks_delete" ON public.venture_tasks;
DROP POLICY IF EXISTS "Users manage own venture tasks" ON public.venture_tasks;
DROP POLICY IF EXISTS "Members manage venture tasks" ON public.venture_tasks;

CREATE POLICY "vt_select_v2"
ON public.venture_tasks FOR SELECT TO authenticated
USING (
  public.is_venture_owner(auth.uid(), venture_id) OR public.is_venture_member(auth.uid(), venture_id)
);

CREATE POLICY "vt_insert_v2"
ON public.venture_tasks FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid() AND (public.is_venture_owner(auth.uid(), venture_id) OR public.is_venture_member(auth.uid(), venture_id))
);

CREATE POLICY "vt_update_v2"
ON public.venture_tasks FOR UPDATE TO authenticated
USING (
  public.is_venture_owner(auth.uid(), venture_id) OR public.is_venture_member(auth.uid(), venture_id)
);

CREATE POLICY "vt_delete_v2"
ON public.venture_tasks FOR DELETE TO authenticated
USING (
  user_id = auth.uid() OR public.is_venture_owner(auth.uid(), venture_id)
);

-- venture_notes
DROP POLICY IF EXISTS "venture_notes_select" ON public.venture_notes;
DROP POLICY IF EXISTS "venture_notes_insert" ON public.venture_notes;
DROP POLICY IF EXISTS "venture_notes_update" ON public.venture_notes;
DROP POLICY IF EXISTS "venture_notes_delete" ON public.venture_notes;
DROP POLICY IF EXISTS "Users manage own venture notes" ON public.venture_notes;
DROP POLICY IF EXISTS "Members manage venture notes" ON public.venture_notes;

CREATE POLICY "vn_select_v2"
ON public.venture_notes FOR SELECT TO authenticated
USING (
  public.is_venture_owner(auth.uid(), venture_id) OR public.is_venture_member(auth.uid(), venture_id)
);

CREATE POLICY "vn_insert_v2"
ON public.venture_notes FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid() AND (public.is_venture_owner(auth.uid(), venture_id) OR public.is_venture_member(auth.uid(), venture_id))
);

CREATE POLICY "vn_delete_v2"
ON public.venture_notes FOR DELETE TO authenticated
USING (
  user_id = auth.uid() OR public.is_venture_owner(auth.uid(), venture_id)
);

-- venture_chat
DROP POLICY IF EXISTS "venture_chat_select" ON public.venture_chat;
DROP POLICY IF EXISTS "venture_chat_insert" ON public.venture_chat;
DROP POLICY IF EXISTS "venture_chat_delete" ON public.venture_chat;
DROP POLICY IF EXISTS "Users manage own venture chat" ON public.venture_chat;
DROP POLICY IF EXISTS "Members manage venture chat" ON public.venture_chat;

CREATE POLICY "vc_select_v2"
ON public.venture_chat FOR SELECT TO authenticated
USING (
  public.is_venture_owner(auth.uid(), venture_id) OR public.is_venture_member(auth.uid(), venture_id)
);

CREATE POLICY "vc_insert_v2"
ON public.venture_chat FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid() AND (public.is_venture_owner(auth.uid(), venture_id) OR public.is_venture_member(auth.uid(), venture_id))
);

CREATE POLICY "vc_delete_v2"
ON public.venture_chat FOR DELETE TO authenticated
USING (user_id = auth.uid());
