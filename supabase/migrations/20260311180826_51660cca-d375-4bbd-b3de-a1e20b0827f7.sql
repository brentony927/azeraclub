
-- Site owner can view all affiliate profiles
CREATE POLICY "Site owner can view all affiliate profiles"
ON public.affiliate_profiles
FOR SELECT
TO authenticated
USING (is_site_owner(auth.uid()));

-- Site owner can view all affiliate leads
CREATE POLICY "Site owner can view all affiliate leads"
ON public.affiliate_leads
FOR SELECT
TO authenticated
USING (is_site_owner(auth.uid()));

-- Site owner can view all affiliate commissions
CREATE POLICY "Site owner can view all affiliate commissions"
ON public.affiliate_commissions
FOR SELECT
TO authenticated
USING (is_site_owner(auth.uid()));
