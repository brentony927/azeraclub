
CREATE TABLE public.user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  reported_user_id uuid NOT NULL,
  reason text NOT NULL,
  details text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert reports" ON public.user_reports
  FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Users can view own reports" ON public.user_reports
  FOR SELECT TO authenticated
  USING (reporter_id = auth.uid());
