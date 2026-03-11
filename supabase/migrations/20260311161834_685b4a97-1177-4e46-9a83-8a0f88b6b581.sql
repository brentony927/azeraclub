
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-bg-media', 'profile-bg-media', true);

CREATE POLICY "Users upload own bg media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-bg-media' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public read bg media"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-bg-media');

CREATE POLICY "Users delete own bg media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profile-bg-media' AND (storage.foldername(name))[1] = auth.uid()::text);
