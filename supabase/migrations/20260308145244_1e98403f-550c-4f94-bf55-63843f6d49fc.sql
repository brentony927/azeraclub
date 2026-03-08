
-- Profile visits table
CREATE TABLE public.profile_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id uuid NOT NULL,
  visitor_user_id uuid NOT NULL,
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  visited_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_user_id, visitor_user_id, visit_date)
);
ALTER TABLE public.profile_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view visits to own profile" ON public.profile_visits
  FOR SELECT TO authenticated
  USING (profile_user_id = auth.uid());

CREATE POLICY "Authenticated users can insert visits" ON public.profile_visits
  FOR INSERT TO authenticated
  WITH CHECK (visitor_user_id = auth.uid());

-- Weekly message limits table
CREATE TABLE public.weekly_message_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  week_start date NOT NULL,
  message_count integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, week_start)
);
ALTER TABLE public.weekly_message_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own message limits" ON public.weekly_message_limits
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
