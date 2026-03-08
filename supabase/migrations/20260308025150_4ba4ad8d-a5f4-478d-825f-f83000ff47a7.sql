
-- Create founder_notifications table
CREATE TABLE public.founder_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'connection',
  title text NOT NULL,
  body text,
  read boolean NOT NULL DEFAULT false,
  related_user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.founder_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.founder_notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.founder_notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own notifications" ON public.founder_notifications FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Authenticated users can insert notifications" ON public.founder_notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.founder_notifications;

-- Add new columns to founder_profiles
ALTER TABLE public.founder_profiles ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';
ALTER TABLE public.founder_profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.founder_profiles ADD COLUMN IF NOT EXISTS continent text;
ALTER TABLE public.founder_profiles ADD COLUMN IF NOT EXISTS reputation_score integer DEFAULT 0;
ALTER TABLE public.founder_profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE public.founder_profiles ADD COLUMN IF NOT EXISTS profile_views integer DEFAULT 0;
