
-- Tabela de moderação
CREATE TABLE public.user_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  reason TEXT,
  moderator_id UUID NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_moderation ENABLE ROW LEVEL SECURITY;

-- Função para verificar se é site_owner
CREATE OR REPLACE FUNCTION public.is_site_owner(p_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM founder_profiles WHERE user_id = p_user_id AND is_site_owner = true);
$$;

-- SELECT: owner vê tudo, users vêem próprias moderações
CREATE POLICY "Owner or self can view moderation"
ON public.user_moderation FOR SELECT TO authenticated
USING (public.is_site_owner(auth.uid()) OR user_id = auth.uid());

-- INSERT: apenas owner
CREATE POLICY "Owner can insert moderation"
ON public.user_moderation FOR INSERT TO authenticated
WITH CHECK (public.is_site_owner(auth.uid()));

-- UPDATE: apenas owner
CREATE POLICY "Owner can update moderation"
ON public.user_moderation FOR UPDATE TO authenticated
USING (public.is_site_owner(auth.uid()))
WITH CHECK (public.is_site_owner(auth.uid()));

-- DELETE: apenas owner
CREATE POLICY "Owner can delete moderation"
ON public.user_moderation FOR DELETE TO authenticated
USING (public.is_site_owner(auth.uid()));
