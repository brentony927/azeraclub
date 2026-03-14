

# Azera OS Ultimate — Plano de Implementação em Fases

Este pedido contém ~15 sistemas distintos. Para manter qualidade e evitar erros em cascata, a implementação será dividida em 5 fases progressivas.

---

## Fase 1 — Admin Polish + Chat UX Fixes + Onboarding

### Admin Improvements
- Adicionar seção "Founder Intelligence" ao Admin com Top Founders da semana, usuários mais ativos, e classificação automática (New/Active/Rising/Elite Founder)
- Expandir AdminDashboard com métricas de networking (conexões, founders no mapa) e retenção semanal
- Melhorar AdminUsers com filtro por data de criação e atividade

### Chat UX Fixes
- **FounderChat.tsx**: Tornar avatar clicável → navega para `/founder-profile/:userId`
- **FounderMessages.tsx**: Adicionar botão "Criar Grupo" visível na aba de grupos
- **FounderChat.tsx**: Adicionar opção no menu dropdown para "Adicionar a Grupo"

### Onboarding Tutorial Update
- Expandir `SLIDES` no OnboardingTutorial com novas páginas (Deal Marketplace, Circles, Reputation)
- Atualizar `HowToUse.tsx` com seções para todas as features novas

### Ficheiros modificados
`AdminDashboard.tsx`, `AdminUsers.tsx`, `FounderChat.tsx`, `FounderMessages.tsx`, `OnboardingTutorial.tsx`, `HowToUse.tsx`, `Admin.tsx`

---

## Fase 2 — Founder Reputation Economy + Design Overhaul

### Reputation Economy
O sistema de Founder Score já existe (`founder_scores`, `calculate-founder-score` edge function). Expandir:
- Adicionar pontuação por ação (oportunidade +20, sugestão aprovada +30, referral +40, venda +60)
- Atualizar edge function `calculate-founder-score` com as novas regras
- Criar componente `ReputationBadge` que mostra nível (New/Active/Rising/Elite) baseado no score
- Benefícios automáticos: ordenação por score no Founder Match e destaque no mapa

### Design Overhaul (Notion/LinkedIn Style)
- **Tipografia**: Reforçar Inter + Space Grotesk com hierarquia clara (sem gradientes excessivos)
- **Cards**: Bordas sutis, sombras leves, sem glass-morphism pesado — estilo Notion clean
- **Sidebar**: Mais compacta, ícones monocromáticos, hover states sutis
- **Profile**: Tabs colapsáveis com indicadores visuais (dot/badge) quando têm conteúdo
- **Cores**: Reduzir uso de gradientes, usar cores sólidas com acentos mínimos
- Ficheiros: `index.css` (variáveis base), `AppSidebar.tsx`, `Profile.tsx`, componentes de Card

### Ficheiros
`index.css`, `AppSidebar.tsx`, `Profile.tsx`, `FounderCard.tsx`, `Layout.tsx`, edge function `calculate-founder-score`

---

## Fase 3 — Founder Deal Marketplace + Private Circles

### Deal Marketplace (Nova Tabela + Página)
```sql
CREATE TABLE public.founder_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'startup',
  estimated_value text,
  equity_offered text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);
-- RLS: auth users can view all, manage own, owner manages all
```
- Nova página `/deals` com listagem, filtros por categoria e botão "Join Deal" (abre chat privado)
- Categorias: Startup, Investimento, Parceria, Tecnologia, Marketing, SaaS, Crypto, IA, E-commerce

### Private Founder Circles (Extensão de message_groups)
```sql
ALTER TABLE public.message_groups ADD COLUMN IF NOT EXISTS
  max_members integer DEFAULT 50,
  is_paid boolean DEFAULT false,
  entry_criteria text,
  circle_type text DEFAULT 'open'; -- open, invite, approval
```
- UI atualizada em FounderMessages para criar "Circles" com regras de entrada
- Página de discovery de circles públicos

### Ficheiros
Nova página `src/pages/Deals.tsx`, componentes `DealCard.tsx`, `CreateDealDialog.tsx`. Modificar `FounderMessages.tsx`, `MessageGroupDialog.tsx`, `App.tsx`

---

## Fase 4 — Pagamentos (Moeda) + Afiliados + Termos

### Pagamento Multi-Moeda
- Na página de Pricing, adicionar toggle GBP/BRL
- Taxa de conversão fixa (ex: 1 GBP = 7.5 BRL) ou via API
- No checkout (`create-checkout`), passar `currency: 'gbp'` ou `currency: 'brl'` baseado na escolha
- Stripe suporta ambas as moedas nativamente

### Afiliados Gratuitos para Todos
- Remover restrição de plano no `AffiliateSection.tsx`
- Qualquer usuário autenticado pode se tornar afiliado
- Manter aprovação manual pelo owner
- Pagamento automático via Stripe Connect (já configurado)

### Termos e Políticas Atualizados
- Atualizar `TermsOfService.tsx` com cláusulas sobre: Deal Marketplace, Circles, Reputation Economy, multi-moeda
- Atualizar `PrivacyPolicy.tsx` com dados adicionais coletados
- Data: "Última atualização: Março 2026"

### Ficheiros
`Pricing.tsx`, `create-checkout/index.ts`, `AffiliateSection.tsx`, `TermsOfService.tsx`, `PrivacyPolicy.tsx`

---

## Fase 5 — Founder Radar AI + Security + Cleanup

### Founder Radar AI
- Nova edge function `founder-radar-ai` que usa Lovable AI (gemini-2.5-flash) para analisar perfis e sugerir matches
- Input: perfil do usuário (skills, industry, building)
- Output: lista de 3-5 founders compatíveis com razão
- Componente na página `/founder-match` mostrando sugestões AI

### Security Hardening
- Auditar todas as RLS policies (já feito parcialmente)
- Confirmar triggers de proteção `is_site_owner` e `is_verified`
- Garantir que nenhum dado sensível (email, financeiro) é exposto via SELECT policies públicas

### Code Cleanup
- Identificar componentes não importados/usados
- Remover páginas órfãs sem rota
- Consolidar duplicações (ex: AffiliateManagerPanel vs AdminAffiliates)

### Ficheiros
Nova edge function, `FounderMatch.tsx`, revisão de RLS, remoção de ficheiros não usados

---

## Resumo de Novas Tabelas

| Tabela | Fase |
|---|---|
| `founder_deals` | Fase 3 |
| Alteração `message_groups` (circles) | Fase 3 |

## Prioridade de Implementação

Vou começar pela **Fase 1** (Admin + Chat UX + Onboarding) pois resolve bugs visíveis e melhora a experiência imediata.

