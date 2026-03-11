
-- Allow site owner to SELECT all suggestions
CREATE POLICY "Site owner can view all suggestions"
ON public.suggestions
FOR SELECT
TO authenticated
USING (is_site_owner(auth.uid()));

-- Allow site owner to UPDATE all suggestions (approve/reject)
CREATE POLICY "Site owner can update all suggestions"
ON public.suggestions
FOR UPDATE
TO authenticated
USING (is_site_owner(auth.uid()))
WITH CHECK (is_site_owner(auth.uid()));
