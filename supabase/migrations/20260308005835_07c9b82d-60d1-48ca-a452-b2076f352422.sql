
-- Habits table (Habit Builder)
CREATE TABLE public.habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  frequency text DEFAULT 'daily',
  streak integer DEFAULT 0,
  last_checked date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own habits" ON public.habits FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Projects table (Project Organizer)
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  ai_structure text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own projects" ON public.projects FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Project tasks
CREATE TABLE public.project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own project tasks" ON public.project_tasks FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Skill plans (Skill Growth Planner)
CREATE TABLE public.skill_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  skill text NOT NULL,
  plan_content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.skill_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own skill plans" ON public.skill_plans FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Goal breakdowns
CREATE TABLE public.goal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal text NOT NULL,
  breakdown text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.goal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own goal plans" ON public.goal_plans FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Elite events (Private Networking Events)
CREATE TABLE public.elite_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date,
  location text,
  category text DEFAULT 'networking',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.elite_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view events" ON public.elite_events FOR SELECT TO authenticated USING (true);

-- Event invitations
CREATE TABLE public.event_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.elite_events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.event_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own invitations" ON public.event_invitations FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Saved insights (Elite Knowledge Library)
CREATE TABLE public.saved_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'business',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.saved_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own insights" ON public.saved_insights FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Opportunity alerts preferences
CREATE TABLE public.opportunity_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  industries text[] DEFAULT '{}',
  active boolean DEFAULT true,
  last_alert_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.opportunity_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own alerts" ON public.opportunity_alerts FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
