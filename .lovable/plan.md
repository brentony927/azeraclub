## Reestruturação Completa de Monetização — AZERA CLUB

Implementar o novo modelo de planos: Founder (grátis) → PRO ($19/mês) → BUSINESS ($49/mês), com limitações estratégicas no plano gratuito para criar gatilhos de upgrade sem destruir o crescimento da rede.

### 1. Renomear Tiers e Atualizar Preços

`**src/contexts/SubscriptionContext.tsx**`

- Manter `PlanTier = "free" | "basic" | "pro" | "business"` internamente, mas `free`/`basic` → exibido como "Founder"
- Atualizar `TIER_ORDER`

`**src/pages/Pricing.tsx**`

- Renomear "Basic" → "Founder" em `plans[]`
- PRO: $19/mês, $190/ano
- BUSINESS: $49/mês, $490/ano
- Atualizar descrições e features conforme o spec

`**src/components/ui/pricing-section.tsx**` — Atualizar labels

`**src/components/FeatureLock.tsx**` — Label "Founder" em vez de "Free"

`**src/components/AppSidebar.tsx**` — Badge "FOUNDER" para free, manter PRO/BUSINESS

### 2. Sistema de Limitação de Mensagens (10/semana para Founder)

**Database migration**: Criar tabela `weekly_message_limits`

```sql
CREATE TABLE public.weekly_message_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  week_start date NOT NULL,
  message_count integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, week_start)
);
ALTER TABLE public.weekly_message_limits ENABLE ROW LEVEL SECURITY;
-- RLS: users manage own rows
```

`**src/components/FounderChat.tsx**`

- Antes de enviar, verificar count da semana atual
- Se Founder e >= 10, mostrar upgrade prompt em vez de enviar
- Exibir "X/10 mensagens esta semana" para Founder

`**src/pages/FounderMessages.tsx**` — Mostrar banner de limite quando próximo

### 3. Gatilho "Quem Visitou Seu Perfil"

**Database migration**: Criar tabela `profile_visits`

```sql
CREATE TABLE public.profile_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id uuid NOT NULL,
  visitor_user_id uuid NOT NULL,
  visited_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_user_id, visitor_user_id, visited_at::date)
);
ALTER TABLE public.profile_visits ENABLE ROW LEVEL SECURITY;
-- SELECT: users can view visits to their own profile
-- INSERT: authenticated users can insert
```

`**src/pages/FounderProfile.tsx**`

- Ao visitar perfil de outro, inserir em `profile_visits` (em vez de só incrementar counter)
- No próprio perfil (Profile.tsx): mostrar "X pessoas visitaram seu perfil"
  - PRO+: mostrar lista de quem visitou
  - Founder: mostrar count + "Upgrade para ver quem"

### 4. Radar Limitado (5 sugestões para Founder)

`**src/pages/FounderFeed.tsx**`

- Após calcular matches, se plan === "free": mostrar apenas 5 primeiros
- Abaixo dos 5 resultados, card de upgrade: "X mais founders combinam com você. Desbloqueie com PRO"

### 5. Filtros Limitados para Founder

`**src/pages/FounderFeed.tsx**`

- Founder: apenas filtros de cidade e interesses
- PRO+: filtros de indústria, skills, commitment, continent, age
- Filtros bloqueados mostram ícone de lock com tooltip

### 6. Analytics Bloqueado

`**src/pages/Profile.tsx**`

- Cards de stats (views, connections, engagement): visíveis apenas para PRO+
- Founder vê versão borrada com overlay "Upgrade para ver insights"

### 7. BUSINESS: Destaque e Prioridade

`**src/pages/FounderFeed.tsx**`

- Ordenação: BUSINESS profiles primeiro, depois PRO, depois Founder (antes do sort por match score, dar boost)
- Badge "Business Founder" no FounderCard para users Business

`**src/components/FounderCard.tsx**`

- Mostrar selo dourado "BUSINESS" se o founder tem plano Business

### 8. Upgrade Triggers (Componente Reutilizável)

`**src/components/UpgradeTrigger.tsx**` (novo)

- Componente genérico para mostrar gatilhos de upgrade
- Props: `message`, `stat?`, `targetPlan`
- Design: card semi-transparente com ícone de lock, mensagem, botão de upgrade
- Usado em: profile visits, radar limit, filters, analytics, message limit

### Arquivos Afetados


| Arquivo                   | Mudança                                                    |
| ------------------------- | ---------------------------------------------------------- |
| DB migration              | `profile_visits` + `weekly_message_limits` tables          |
| `SubscriptionContext.tsx` | Manter lógica, sem mudança estrutural                      |
| `Pricing.tsx`             | Renomear tiers, novos preços $19/$59, novas features lists |
| `pricing-section.tsx`     | Label updates                                              |
| `FeatureLock.tsx`         | "Founder" label                                            |
| `AppSidebar.tsx`          | Badge "FOUNDER" para free                                  |
| `FounderChat.tsx`         | Weekly message limit check                                 |
| `FounderMessages.tsx`     | Limit banner                                               |
| `FounderFeed.tsx`         | 5-result cap, filter locks, Business priority              |
| `FounderCard.tsx`         | Business badge                                             |
| `Profile.tsx`             | Analytics lock, profile visits display                     |
| `FounderProfile.tsx`      | Record visits to `profile_visits`                          |
| `UpgradeTrigger.tsx`      | New reusable upgrade prompt component                      |


### Nota Importante

As features que geram valor na rede (criar ventures, postar ideias, oportunidades, comunidade) ficam **100% livres** para todos os planos. As limitações são apenas em **extração de valor do networking** (ver quem visitou, mensagens, filtros, analytics, destaque).