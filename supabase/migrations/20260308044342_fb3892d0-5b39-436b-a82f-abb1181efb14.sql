
-- venture_tasks table
CREATE TABLE public.venture_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venture_id uuid NOT NULL REFERENCES public.ventures(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  assigned_to uuid,
  status text NOT NULL DEFAULT 'todo',
  deadline date,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.venture_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Venture owner or member can select tasks" ON public.venture_tasks FOR SELECT USING (
  venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
  OR venture_id IN (SELECT venture_id FROM public.venture_members WHERE user_id = auth.uid())
);
CREATE POLICY "Venture owner or member can insert tasks" ON public.venture_tasks FOR INSERT WITH CHECK (
  venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
  OR venture_id IN (SELECT venture_id FROM public.venture_members WHERE user_id = auth.uid())
);
CREATE POLICY "Venture owner or member can update tasks" ON public.venture_tasks FOR UPDATE USING (
  venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
  OR venture_id IN (SELECT venture_id FROM public.venture_members WHERE user_id = auth.uid())
);
CREATE POLICY "Venture owner or member can delete tasks" ON public.venture_tasks FOR DELETE USING (
  venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
  OR venture_id IN (SELECT venture_id FROM public.venture_members WHERE user_id = auth.uid())
);

-- venture_chat table
CREATE TABLE public.venture_chat (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venture_id uuid NOT NULL REFERENCES public.ventures(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  is_ai boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.venture_chat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Venture owner or member can select chat" ON public.venture_chat FOR SELECT USING (
  venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
  OR venture_id IN (SELECT venture_id FROM public.venture_members WHERE user_id = auth.uid())
);
CREATE POLICY "Venture owner or member can insert chat" ON public.venture_chat FOR INSERT WITH CHECK (
  venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
  OR venture_id IN (SELECT venture_id FROM public.venture_members WHERE user_id = auth.uid())
);

-- Add goal and total_score to ventures
ALTER TABLE public.ventures ADD COLUMN IF NOT EXISTS goal text;
ALTER TABLE public.ventures ADD COLUMN IF NOT EXISTS total_score integer NOT NULL DEFAULT 0;

-- Enable realtime for venture_chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.venture_chat;

-- Add SELECT policy for ventures so rankings page can show active ventures
CREATE POLICY "Anyone authenticated can view active ventures" ON public.ventures FOR SELECT TO authenticated USING (status = 'active');
