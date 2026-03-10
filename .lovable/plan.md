

## Plano: Otimização, Mobile, Interface Owner Vermelha + Painel de Moderação

### 1. Tabela de moderação — `user_moderation`

Nova migração SQL para criar tabela de ações de moderação pelo owner:

```sql
CREATE TABLE public.user_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'ban', 'mute', 'warn'
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
CREATE POLICY "Owner can view all" ON public.user_moderation
FOR SELECT TO authenticated USING (public.is_site_owner(auth.uid()) OR user_id = auth.uid());

-- INSERT/UPDATE/DELETE: apenas owner
CREATE POLICY "Owner can manage" ON public.user_moderation
FOR ALL TO authenticated USING (public.is_site_owner(auth.uid()))
WITH CHECK (public.is_site_owner(auth.uid()));
```

### 2. Interface Owner toda vermelha — `src/components/Layout.tsx`

- Detectar `is_site_owner` no Layout via query ao `founder_profiles`
- Quando owner: aplicar classe `owner-theme` no wrapper principal
- Nova variável CSS `owner-theme` no `index.css` que sobrepõe as cores do tema com tons vermelhos:
  - `--primary`: vermelho
  - `--accent`: vermelho escuro
  - Header com gradiente vermelho
  - Sidebar com tint vermelho

### 3. Painel de moderação do Owner — `src/components/OwnerModPanel.tsx`

Novo componente com capacidades:
- **Banir usuário**: Insere `action: 'ban'` na `user_moderation`, impede login/acesso
- **Silenciar usuário**: Insere `action: 'mute'` com `expires_at`, impede posts/mensagens
- **Avisar usuário**: Insere `action: 'warn'`, envia notificação ao usuário

Acessível via dropdown no `FounderProfile.tsx` e `FounderCard.tsx` (apenas visível ao owner).

### 4. Verificação de ban/mute — `src/components/ProtectedLayout.tsx`

- Ao carregar, verificar se o user tem `action: 'ban'` ativo na `user_moderation`
- Se banido: redirecionar para página de "Conta Suspensa"
- Se silenciado: desabilitar inputs de post/mensagem com aviso

### 5. Otimizações Mobile

**`src/components/Layout.tsx`**:
- Padding inferior ajustado para `pb-24` no mobile (evitar sobreposição com bottom nav)

**`src/pages/Profile.tsx`**:
- Chips de skills/interests com `min-h-[44px]` (já tem em alguns, garantir em todos)
- Inputs com `min-h-[44px]` para touch targets
- ScrollArea nos selects longos

**`src/components/FounderCard.tsx`**:
- Botões com `min-h-[44px]` no mobile

**`src/index.css`**:
- Melhorar touch targets globais
- Ajustar scrollbar para mobile (ocultar)
- Safe area insets em formulários

### 6. Correções de bugs

- `Profile.tsx`: corrigir cast `as any` em queries para `profile_visits` e `founder_locations`
- `BadgeShowcase.tsx`: evitar chamada duplicada de `recalculate` quando `user.id === userId`
- `Layout.tsx`: memoizar detecção de owner para evitar re-renders

### Ficheiros a criar/editar
- Nova migração SQL (tabela `user_moderation` + função `is_site_owner`)
- `src/components/OwnerModPanel.tsx` (novo — painel de moderação)
- `src/components/Layout.tsx` (owner theme + mobile padding)
- `src/components/ProtectedLayout.tsx` (verificar ban)
- `src/pages/Profile.tsx` (mobile + bugs)
- `src/pages/FounderProfile.tsx` (botão moderação para owner)
- `src/components/FounderCard.tsx` (mobile touch + botão mod)
- `src/index.css` (owner-theme CSS + mobile tweaks)

