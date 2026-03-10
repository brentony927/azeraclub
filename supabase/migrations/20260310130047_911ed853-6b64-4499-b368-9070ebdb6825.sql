
-- Phase 1: Social Feed tables

-- founder_posts
CREATE TABLE public.founder_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  media_urls text[] DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.founder_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view posts" ON public.founder_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own posts" ON public.founder_posts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own posts" ON public.founder_posts FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users update own posts" ON public.founder_posts FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- founder_post_likes
CREATE TABLE public.founder_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.founder_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.founder_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view likes" ON public.founder_post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own likes" ON public.founder_post_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own likes" ON public.founder_post_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- founder_post_comments
CREATE TABLE public.founder_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.founder_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.founder_post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view comments" ON public.founder_post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own comments" ON public.founder_post_comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own comments" ON public.founder_post_comments FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Phase 2: Advanced messaging tables

-- Add opportunity_id to founder_messages
ALTER TABLE public.founder_messages ADD COLUMN opportunity_id uuid REFERENCES public.founder_opportunities(id) ON DELETE SET NULL;

-- message_groups
CREATE TABLE public.message_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  photo_url text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.message_groups ENABLE ROW LEVEL SECURITY;

-- message_group_members
CREATE TABLE public.message_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.message_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);
ALTER TABLE public.message_group_members ENABLE ROW LEVEL SECURITY;

-- group_messages
CREATE TABLE public.group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.message_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- pinned_conversations
CREATE TABLE public.pinned_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  pinned_user_id uuid,
  pinned_group_id uuid REFERENCES public.message_groups(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, pinned_user_id),
  UNIQUE(user_id, pinned_group_id)
);
ALTER TABLE public.pinned_conversations ENABLE ROW LEVEL SECURITY;

-- RLS for message_groups: members can view
CREATE POLICY "Members can view groups" ON public.message_groups FOR SELECT TO authenticated
  USING (id IN (SELECT group_id FROM public.message_group_members WHERE user_id = auth.uid()) OR created_by = auth.uid());
CREATE POLICY "Users can create groups" ON public.message_groups FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Admins can update groups" ON public.message_groups FOR UPDATE TO authenticated
  USING (id IN (SELECT group_id FROM public.message_group_members WHERE user_id = auth.uid() AND role = 'admin') OR created_by = auth.uid());
CREATE POLICY "Creator can delete groups" ON public.message_groups FOR DELETE TO authenticated USING (created_by = auth.uid());

-- RLS for message_group_members
CREATE POLICY "Members can view members" ON public.message_group_members FOR SELECT TO authenticated
  USING (group_id IN (SELECT group_id FROM public.message_group_members mgm WHERE mgm.user_id = auth.uid()));
CREATE POLICY "Admins can insert members" ON public.message_group_members FOR INSERT TO authenticated
  WITH CHECK (group_id IN (SELECT group_id FROM public.message_group_members WHERE user_id = auth.uid() AND role = 'admin')
    OR group_id IN (SELECT id FROM public.message_groups WHERE created_by = auth.uid()));
CREATE POLICY "Admins can update members" ON public.message_group_members FOR UPDATE TO authenticated
  USING (group_id IN (SELECT group_id FROM public.message_group_members WHERE user_id = auth.uid() AND role = 'admin')
    OR group_id IN (SELECT id FROM public.message_groups WHERE created_by = auth.uid()));
CREATE POLICY "Admins can delete members" ON public.message_group_members FOR DELETE TO authenticated
  USING (group_id IN (SELECT group_id FROM public.message_group_members WHERE user_id = auth.uid() AND role = 'admin')
    OR group_id IN (SELECT id FROM public.message_groups WHERE created_by = auth.uid())
    OR user_id = auth.uid());

-- RLS for group_messages
CREATE POLICY "Members can view group messages" ON public.group_messages FOR SELECT TO authenticated
  USING (group_id IN (SELECT group_id FROM public.message_group_members WHERE user_id = auth.uid()));
CREATE POLICY "Members can insert group messages" ON public.group_messages FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND group_id IN (SELECT group_id FROM public.message_group_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own group messages" ON public.group_messages FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS for pinned_conversations
CREATE POLICY "Users manage own pins" ON public.pinned_conversations FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Storage bucket for post media
INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true);

-- RLS for post-media bucket
CREATE POLICY "Users can upload post media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'post-media' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Anyone can view post media" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'post-media');
CREATE POLICY "Users can delete own post media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'post-media' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.founder_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
