
-- Create founder_scores table
CREATE TABLE public.founder_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  profile_points integer NOT NULL DEFAULT 0,
  network_points integer NOT NULL DEFAULT 0,
  project_points integer NOT NULL DEFAULT 0,
  activity_points integer NOT NULL DEFAULT 0,
  influence_points integer NOT NULL DEFAULT 0,
  total_score integer NOT NULL DEFAULT 0,
  level text NOT NULL DEFAULT 'New Founder',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.founder_scores ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view scores (leaderboard)
CREATE POLICY "Anyone can view scores" ON public.founder_scores
  FOR SELECT TO authenticated USING (true);

-- Users manage own score
CREATE POLICY "Users manage own score" ON public.founder_scores
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Sync reputation_score on founder_profiles
CREATE OR REPLACE FUNCTION public.sync_reputation_score()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE founder_profiles SET reputation_score = NEW.total_score WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_reputation_after_score_update
  AFTER INSERT OR UPDATE ON public.founder_scores
  FOR EACH ROW EXECUTE FUNCTION public.sync_reputation_score();

-- Enable realtime for founder_scores
ALTER PUBLICATION supabase_realtime ADD TABLE public.founder_scores;
