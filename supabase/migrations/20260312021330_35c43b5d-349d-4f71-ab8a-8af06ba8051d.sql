
-- Fix: drop duplicate and recreate
DROP POLICY IF EXISTS "Site owner can view all suggestions" ON suggestions;
CREATE POLICY "Site owner can view all suggestions" ON suggestions
  FOR SELECT TO authenticated
  USING (is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Site owner can update suggestions" ON suggestions;
CREATE POLICY "Site owner can update suggestions" ON suggestions
  FOR UPDATE TO authenticated
  USING (is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Site owner can manage posts" ON founder_posts;
CREATE POLICY "Site owner can manage posts" ON founder_posts
  FOR ALL TO authenticated
  USING (is_site_owner(auth.uid()))
  WITH CHECK (is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Site owner can manage opportunities" ON founder_opportunities;
CREATE POLICY "Site owner can manage opportunities" ON founder_opportunities
  FOR ALL TO authenticated
  USING (is_site_owner(auth.uid()))
  WITH CHECK (is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Site owner can view all reports" ON user_reports;
CREATE POLICY "Site owner can view all reports" ON user_reports
  FOR SELECT TO authenticated
  USING (is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Site owner can update reports" ON user_reports;
CREATE POLICY "Site owner can update reports" ON user_reports
  FOR UPDATE TO authenticated
  USING (is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Site owner can view all locations" ON founder_locations;
CREATE POLICY "Site owner can view all locations" ON founder_locations
  FOR SELECT TO authenticated
  USING (is_site_owner(auth.uid()));

DROP POLICY IF EXISTS "Site owner can delete locations" ON founder_locations;
CREATE POLICY "Site owner can delete locations" ON founder_locations
  FOR DELETE TO authenticated
  USING (is_site_owner(auth.uid()));
