

## Plano: 30 Novas Insígnias + Owner Desbloqueio Total + Busca por Username + Perfil Verificado

### 1. Adicionar 30 novas insígnias — `src/lib/badges.ts`

Expandir de 12 para 42 insígnias com critérios variados usando as cores existentes. Exemplos:

| Badge | Cor | Critério |
|---|---|---|
| `first_post` | Branco | 1º post no feed |
| `journal_writer` | Azul | 5+ entradas no diário |
| `streak_7` | Verde | Streak 7 dias em hábitos |
| `streak_60` | Dourado | Streak 60 dias |
| `ten_ventures` | Laranja | 10+ ventures |
| `fifty_connections` | Rosa | 50+ conexões |
| `hundred_ideas` | Roxo | 100+ ideias |
| `investor_ready` | Amarelo | 3+ oportunidades criadas |
| `community_leader` | Preto | 50+ posts |
| `globe_trotter` | Azul | 5+ países em conexões |
| ... +20 mais variações |

### 2. Owner desbloqueia TODAS — `src/components/BadgeShowcase.tsx` + `supabase/functions/calculate-badges/index.ts`

- No `BadgeShowcase`, se o user é site_owner (checar `founder_profiles.is_site_owner`), marcar todas as insígnias como earned
- Na edge function `calculate-badges`, se o user for site_owner, conceder automaticamente TODAS as badges

### 3. Busca por username no Feed — `src/pages/FounderFeed.tsx`

A busca já filtra por `username` (linha 278). Está funcional. Verificar que o placeholder indica "Buscar por nome ou @username".

### 4. Perfil preenchido com informações atualizadas — `src/pages/Profile.tsx`

O perfil já carrega dados de `profiles` e `founder_profiles`. Garantir que `displayName` usa fallback do `founder_profiles.name` se `profiles.display_name` estiver vazio.

### 5. Insígnia "Verificado" visível para o criador — `src/pages/FounderProfile.tsx` + edge function

- Na edge function, se `is_site_owner = true`, conceder `verified_founder` automaticamente
- No `FounderProfile.tsx`, o ícone de verificação já aparece quando `is_verified = true`

### 6. Todas as insígnias no banco de dados

- A tabela `user_badges` já existe. As insígnias são inseridas automaticamente pela edge function
- Atualizar a edge function para suportar os 30 novos critérios

### Ficheiros a editar
- `src/lib/badges.ts` (adicionar 30 insígnias)
- `src/components/BadgeShowcase.tsx` (owner = todas desbloqueadas)
- `supabase/functions/calculate-badges/index.ts` (30 novos critérios + owner = all)
- `src/pages/FounderFeed.tsx` (placeholder do search)
- `src/pages/Profile.tsx` (fallback nome do founder_profiles)

