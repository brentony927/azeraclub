

## Plano: Emojis 3D + Background Owner Vermelho + Founders Parecidos + Fotos no Chat + Perfil com Nome/Foto + Botão Voltar nos Planos

### 1. Background vermelho para o Owner independente do plano — `src/components/Layout.tsx` + `src/components/EliteBackground.tsx` + `src/index.css`

- Em `Layout.tsx`: mostrar `EliteBackground` quando `isOwner`, independente de `isPremium`. Passar uma prop especial ou tratar `plan` como "owner".
- Em `EliteBackground.tsx`: aceitar `isOwner` prop. Quando owner, usar classes `owner-orb` e `owner-particle` em vez de pro/business.
- Em `index.css`: adicionar estilos `.owner-orb-1` a `-4` com gradientes vermelhos (from-red-600 to-red-900) e `.owner-particle` com brilho vermelho.

### 2. Substituir emojis por Icon3D em mais páginas

Páginas com emojis a substituir:
- **`Social.tsx`**: `typeIcons` (🎤→Mic, 🤝→Handshake, ✨→Sparkles, 💎→Gem) usar `Icon3D`; `EmptyState` icon `💎` → passar componente.
- **`AI.tsx`**: MOODS emojis (😊😌💡😔🔥👔) → `Icon3D` com ícones Lucide (Smile, Cloud, Lightbulb, Frown, Flame, Briefcase); `🔒` no limite → `Icon3D` Lock.
- **`FounderOpportunities.tsx`**: `⚠️` → `Icon3D` AlertTriangle; `🎯` em toasts → remover emoji.
- **`FounderChat.tsx`**: `⚠️` → `Icon3D` AlertTriangle silver.
- **`FounderFeed.tsx`**: sem emojis diretos no UI (só nos dados), skip.

### 3. Opção "Founders mais parecidos" no Radar (FounderFeed) — `src/pages/FounderFeed.tsx`

- Adicionar botão "Mais Parecidos Comigo" ao lado dos filtros na tab Founders.
- Quando ativo, ordenar `withScores` por `matchScore` descending em vez de `profileScore`.
- Estado: `const [sortByMatch, setSortByMatch] = useState(false)`.

### 4. Foto do remetente nas conversas privadas e grupos

**`src/components/FounderChat.tsx`**:
- Carregar `avatar_url` do `otherUserId` via `founder_profiles` no `useEffect`.
- Aceitar nova prop `otherUserAvatar?: string | null` ou fetch internamente.
- Renderizar avatar (mini circle 24px) ao lado de mensagens recebidas.
- Para mensagens enviadas por mim, carregar meu avatar de `founder_profiles`.

**`src/components/GroupChat.tsx`**:
- Já carrega `names` por user_id. Expandir para carregar `avatar_url` também.
- Renderizar avatar ao lado de cada mensagem.

**`src/pages/FounderMessages.tsx`**:
- Carregar `avatar_url` junto com `name` ao buscar profiles das conversas.
- Adicionar `avatarUrl` à interface `Conversation`.
- Passar `otherUserAvatar` ao `FounderChat`.

### 5. Nome e foto no perfil do usuário — `src/pages/Profile.tsx`

- Onde aparece `"Seu Nome"` (linha 343), mostrar `displayName` real (já faz isso: `{displayName || "Seu Nome"}`).
- No avatar (linhas 328-333): quando não tem foto, mostrar `initials` (já faz). Está correto — o `?` vem do `initials` que calcula como `"?"` quando `displayName` está vazio. Garantir que usa `founderName` ou `displayName` corretamente.
- Verificar que `initials` usa o nome do founder profile e não apenas o display_name do profiles table.

### 6. Botão "Voltar" na página de Planos — `src/pages/Pricing.tsx`

- Adicionar `<Button variant="ghost" onClick={() => navigate(-1)}>` no topo da página com ícone `ArrowLeft`.

### Ficheiros a editar
- `src/components/Layout.tsx` (owner background)
- `src/components/EliteBackground.tsx` (owner orbs/particles)
- `src/index.css` (owner-orb/particle CSS)
- `src/pages/Social.tsx` (emojis → Icon3D)
- `src/pages/AI.tsx` (emojis → Icon3D)
- `src/pages/FounderOpportunities.tsx` (⚠️ → Icon3D)
- `src/components/FounderChat.tsx` (⚠️ → Icon3D + avatar nas msgs)
- `src/components/GroupChat.tsx` (avatar nas msgs)
- `src/pages/FounderMessages.tsx` (carregar avatars + passar ao chat)
- `src/pages/FounderFeed.tsx` (botão "Mais Parecidos")
- `src/pages/Profile.tsx` (nome/foto)
- `src/pages/Pricing.tsx` (botão voltar)

