
-- Ventures table
CREATE TABLE public.ventures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  problem TEXT,
  solution TEXT,
  target_market TEXT,
  business_model TEXT,
  ai_roadmap TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.ventures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own ventures" ON public.ventures FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Venture members table
CREATE TABLE public.venture_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venture_id UUID NOT NULL REFERENCES public.ventures(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'co-founder',
  status TEXT NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.venture_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Venture owners and members can view" ON public.venture_members FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
);
CREATE POLICY "Venture owners can insert members" ON public.venture_members FOR INSERT TO authenticated WITH CHECK (
  venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
);
CREATE POLICY "Venture owners can delete members" ON public.venture_members FOR DELETE TO authenticated USING (
  venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
);
CREATE POLICY "Members can update own status" ON public.venture_members FOR UPDATE TO authenticated USING (
  user_id = auth.uid() OR venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
);

-- Venture notes table
CREATE TABLE public.venture_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venture_id UUID NOT NULL REFERENCES public.ventures(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.venture_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Venture participants can manage notes" ON public.venture_notes FOR ALL TO authenticated USING (
  user_id = auth.uid() OR venture_id IN (SELECT id FROM public.ventures WHERE user_id = auth.uid())
) WITH CHECK (
  user_id = auth.uid()
);

-- Bookmarks table
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Trend scans table
CREATE TABLE public.trend_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  source TEXT,
  link TEXT,
  ai_insight TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.trend_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own trend scans" ON public.trend_scans FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
