
DROP POLICY "System inserts referrals" ON public.referrals;
CREATE POLICY "Users insert own referral" ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
