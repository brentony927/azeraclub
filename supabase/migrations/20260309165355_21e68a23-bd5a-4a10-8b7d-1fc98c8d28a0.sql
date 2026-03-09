
-- Add media columns to founder_opportunities
ALTER TABLE public.founder_opportunities ADD COLUMN IF NOT EXISTS media_urls text[] DEFAULT '{}';
ALTER TABLE public.founder_opportunities ADD COLUMN IF NOT EXISTS media_type text DEFAULT null;

-- Create opportunity-media storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('opportunity-media', 'opportunity-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: anyone can read
CREATE POLICY "Public read opportunity media" ON storage.objects FOR SELECT USING (bucket_id = 'opportunity-media');

-- Storage RLS: authenticated users can upload
CREATE POLICY "Auth users upload opportunity media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'opportunity-media');

-- Storage RLS: users can delete own uploads
CREATE POLICY "Users delete own opportunity media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'opportunity-media' AND (storage.foldername(name))[1] = auth.uid()::text);
