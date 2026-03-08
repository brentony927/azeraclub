
-- 1. founder_profiles
CREATE TABLE public.founder_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  age integer,
  country text,
  skills text[] DEFAULT '{}',
  industry text[] DEFAULT '{}',
  building text,
  looking_for text[] DEFAULT '{}',
  commitment text DEFAULT 'startup_idea',
  avatar_url text,
  is_published boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.founder_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view published profiles" ON public.founder_profiles FOR SELECT TO authenticated USING (is_published = true OR user_id = auth.uid());
CREATE POLICY "Users manage own founder profile" ON public.founder_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own founder profile" ON public.founder_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own founder profile" ON public.founder_profiles FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 2. founder_connections
CREATE TABLE public.founder_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid NOT NULL,
  to_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);
ALTER TABLE public.founder_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view connections" ON public.founder_connections FOR SELECT TO authenticated USING (from_user_id = auth.uid() OR to_user_id = auth.uid());
CREATE POLICY "Users can send connection requests" ON public.founder_connections FOR INSERT TO authenticated WITH CHECK (from_user_id = auth.uid());
CREATE POLICY "Participants can update connections" ON public.founder_connections FOR UPDATE TO authenticated USING (from_user_id = auth.uid() OR to_user_id = auth.uid());
CREATE POLICY "Participants can delete connections" ON public.founder_connections FOR DELETE TO authenticated USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

-- 3. founder_messages
CREATE TABLE public.founder_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid NOT NULL,
  to_user_id uuid NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.founder_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view messages" ON public.founder_messages FOR SELECT TO authenticated USING (from_user_id = auth.uid() OR to_user_id = auth.uid());
CREATE POLICY "Users can send messages" ON public.founder_messages FOR INSERT TO authenticated WITH CHECK (from_user_id = auth.uid());
CREATE POLICY "Users can update own messages" ON public.founder_messages FOR UPDATE TO authenticated USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.founder_messages;

-- 4. founder_opportunities
CREATE TABLE public.founder_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  project text,
  equity_available boolean DEFAULT false,
  looking_for text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.founder_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view opportunities" ON public.founder_opportunities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users manage own opportunities" ON public.founder_opportunities FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own opportunities" ON public.founder_opportunities FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users delete own opportunities" ON public.founder_opportunities FOR DELETE TO authenticated USING (user_id = auth.uid());
