
CREATE TABLE public.profile_backgrounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  active_background text DEFAULT 'none',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profile_backgrounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active backgrounds"
  ON public.profile_backgrounds FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users manage own background"
  ON public.profile_backgrounds FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own background"
  ON public.profile_backgrounds FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
