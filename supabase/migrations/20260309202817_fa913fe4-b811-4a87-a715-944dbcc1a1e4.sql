
-- 1. Fix venture_members: prevent pending members from self-approving
-- Drop existing UPDATE policy and recreate with WITH CHECK
DROP POLICY IF EXISTS "Members can update own status" ON public.venture_members;
CREATE POLICY "Members can update own status"
  ON public.venture_members FOR UPDATE TO authenticated
  USING (
    (user_id = auth.uid()) OR 
    (venture_id IN (SELECT id FROM ventures WHERE user_id = auth.uid()))
  )
  WITH CHECK (
    -- Owners can do anything
    (venture_id IN (SELECT id FROM ventures WHERE user_id = auth.uid()))
    OR
    -- Members can only update their own row and only set status to accepted/rejected
    (user_id = auth.uid() AND status IN ('accepted', 'rejected'))
  );

-- 2. Fix ventures SELECT: add status='accepted' filter for members
DROP POLICY IF EXISTS "Users manage own ventures" ON public.ventures;
CREATE POLICY "Users manage own ventures"
  ON public.ventures FOR ALL TO authenticated
  USING (
    (user_id = auth.uid()) OR 
    (id IN (SELECT venture_id FROM venture_members WHERE user_id = auth.uid() AND status = 'accepted'))
  )
  WITH CHECK (user_id = auth.uid());

-- 3. Fix opportunity-media storage: restrict uploads to own folder
DROP POLICY IF EXISTS "Auth users upload opportunity media" ON storage.objects;
CREATE POLICY "Auth users upload own opportunity media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'opportunity-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
