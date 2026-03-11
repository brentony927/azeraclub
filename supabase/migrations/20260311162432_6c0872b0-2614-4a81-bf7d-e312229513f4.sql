
CREATE POLICY "Site owner can view all affiliate requests"
ON public.affiliate_requests FOR SELECT TO authenticated
USING (public.is_site_owner(auth.uid()));
