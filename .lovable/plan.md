

## Founder Match — Upgrade Completo

Este plano adiciona filtros avançados, match inteligente, notificações, animações premium e sistemas de reputação ao Founder Match existente. Dividido em blocos claros.

---

### 1. Banco de Dados (2 migrações)

**Tabela `founder_notifications`:**
- `id`, `user_id`, `type` (profile_view, message, connection, opportunity, match), `title`, `body`, `read` (bool, default false), `related_user_id` (nullable), `created_at`
- RLS: SELECT/UPDATE/DELETE apenas owner, INSERT para autenticados
- Realtime habilitado

**Alterar `founder_profiles`:**
- Adicionar coluna `interests text[] default '{}'` (os 50+ interesses de negócios)
- Adicionar coluna `city text` 
- Adicionar coluna `continent text`
- Adicionar coluna `reputation_score integer default 0`
- Adicionar coluna `is_verified boolean default false`
- Adicionar coluna `profile_views integer default 0`

---

### 2. Interesses de Negócios (constante compartilhada)

Criar `src/data/founderConstants.ts` com:
- `BUSINESS_INTERESTS`: array dos 52 interesses (AI, Machine Learning, SaaS, Startups, Fintech, E-commerce, Web3, Crypto, Blockchain, Marketing, Growth Hacking, Sales, Product Management, Design, UI/UX, Automation, Data Science, Cybersecurity, Mobile Apps, Cloud Computing, DevOps, Digital Products, Online Education, Content Creation, Influencer Business, Consulting, Business Strategy, Venture Capital, Angel Investing, Real Estate, PropTech, EdTech, HealthTech, BioTech, Climate Tech, Green Energy, Supply Chain, Logistics, Gaming, Game Development, AR/VR, Robotics, No-Code, Low-Code, Productivity Tools, Remote Work, Community Building, Creator Economy, Personal Branding, Digital Agencies, Startup Incubators, AI Automation)
- `CONTINENT_OPTIONS`: North America, South America, Europe, Asia, Africa, Oceania
- `SKILL_OPTIONS`, `INDUSTRY_OPTIONS`, `LOOKING_FOR_OPTIONS`, `COMMITMENT_OPTIONS` (mover das constantes duplicadas)

---

### 3. Formulário de Perfil (`FounderProfileForm.tsx`)

Adicionar novos campos:
- **City** (input texto)
- **Continent** (select com 6 opções)
- **Interests** (grid de tags clicáveis com os 52 interesses, agrupados por categoria, com busca inline)

Atualizar `FounderMatch.tsx` para enviar os novos campos ao inserir.

---

### 4. Feed com Filtros Avançados (`FounderFeed.tsx`)

Reescrever seção de filtros com:
- **Region Filter**: Continent (multi-select chips) + Country (input) + City (input)
- **Age Range**: Slider duplo animado (18-65) usando `@radix-ui/react-slider`
- **Interests Filter**: Tags clicáveis dos 52 interesses (com scroll horizontal ou grid colapsável)
- **Botão "Apply Filters"** e **"Clear Filters"**
- **Skeleton loading**: Enquanto carrega, mostrar 6 cards skeleton animados (foto, linhas de texto pulsando)
- **Counter animado**: Header "Founders on AZERA CLUB" com `@number-flow/react` animando de 0 ao total

---

### 5. Match Score Inteligente (`src/lib/founderMatch.ts`)

Função `calculateMatchScore(myProfile, otherProfile)` retornando 0-100%:
- **Interesses em comum**: peso 35% (interseção / união)
- **Skills complementares**: peso 25% (se eu procuro Developer e ele tem Developer)
- **Indústria em comum**: peso 20%
- **Looking_for compatível**: peso 15% (se ambos procuram o que o outro oferece)
- **Região próxima**: peso 5% (mesmo continente = bônus)

Mostrar badge "Match 87%" no `FounderCard` com cor baseada no score (verde >70%, amarelo >40%, cinza <40%).

---

### 6. Sistema de Notificações

**Novo componente `FounderNotifications.tsx`:**
- Dropdown bell icon no header do Founder Feed
- Lista de notificações com ícones por tipo
- Marcar como lida ao clicar
- Badge de contagem no ícone

**Triggers de notificação** (client-side, nos handlers existentes):
- Ao enviar conexão → notificar destinatário
- Ao enviar mensagem → notificar destinatário  
- Ao visualizar perfil → incrementar `profile_views` + notificar owner

**Nova rota `/founder-notifications`** para lista completa.

---

### 7. Perfil Completo (`FounderProfile.tsx`)

Adicionar:
- **Interests** como chips coloridos
- **Match Score** badge (se não é o próprio perfil)
- **Founder Score** com barra visual (baseado em reputation_score)
- **Verified badge** se `is_verified = true`
- **Profile views counter**
- Incrementar `profile_views` ao visitar

---

### 8. Founder Reputation & Activity

**Cálculo de reputation** (client-side ou edge function periódica):
- +10 por perfil completo
- +5 por conexão aceita
- +2 por mensagem enviada
- +15 por oportunidade publicada

**Activity Feed** no Founder Feed (lateral ou seção):
- "Lucas posted a new opportunity"
- "Anna is looking for a developer"
- Baseado nas últimas oportunidades e perfis criados

---

### 9. Animações Premium

- **Skeleton loading**: `FounderCardSkeleton` component com pulse animation
- **Counter animado**: `NumberFlow` no header do feed
- **Confetti**: Ao criar perfil e ao encontrar match >80% (usar CSS keyframes, sem lib extra)
- **Onboarding slides**: Modal na primeira visita ao Founder Match com 3 slides animados (framer-motion)
- **Card hover**: Scale + shadow elevation (já parcialmente implementado, melhorar)
- **Magnetic buttons**: Efeito sutil de follow-cursor nos botões Connect/Message (CSS transform via onMouseMove)

---

### 10. Sidebar Update

Adicionar ao grupo "Founder Match":
- Notificações (`/founder-notifications`) com ícone Bell

---

### Arquivos novos (~8):
- `src/data/founderConstants.ts`
- `src/lib/founderMatch.ts`
- `src/components/FounderCardSkeleton.tsx`
- `src/components/FounderNotifications.tsx`
- `src/components/FounderOnboarding.tsx`
- `src/components/FounderActivityFeed.tsx`
- `src/pages/FounderNotificationsPage.tsx`
- Migration SQL

### Arquivos editados (~8):
- `FounderProfileForm.tsx` (novos campos)
- `FounderFeed.tsx` (filtros, skeleton, counter, match score, activity)
- `FounderCard.tsx` (match badge, magnetic buttons, melhor hover)
- `FounderProfile.tsx` (interests, match, reputation, verified, views)
- `FounderMatch.tsx` (onboarding, confetti, novos campos)
- `AppSidebar.tsx` (notificações link)
- `App.tsx` (nova rota)
- `src/index.css` (animações confetti, magnetic)

