
DROP POLICY "System inserts affiliate leads" ON public.affiliate_leads;
CREATE POLICY "Users insert own affiliate lead" ON public.affiliate_leads FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
