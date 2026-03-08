

## Sistema de Notificacoes Completo — AZERA CLUB

O sistema atual so gera notificacoes em 2 pontos (conexao e visualizacao de perfil). O plano e expandir para cobrir todos os 12 tipos, adicionar navegacao inteligente (clicar leva a pagina relevante), mais icones, e criar uma edge function que gera notificacoes automaticas baseadas em atividade.

---

### 1. Expandir tipos de notificacao no frontend

**Arquivos: `FounderNotifications.tsx` e `FounderNotificationsPage.tsx`**

Adicionar todos os 12 tipos com icones e navegacao:

| Tipo | Icone | Rota ao clicar |
|------|-------|----------------|
| connection | UserPlus | /founder-feed |
| message | MessageCircle | /founder-messages |
| profile_view | Eye | /founder-profile/:id |
| opportunity | Briefcase | /founder-opportunities |
| match | Sparkles | /founder-feed |
| startup_idea | Lightbulb | /ideas |
| venture_activity | Rocket | /venture-builder |
| investor_interest | TrendingUp | /founder-profile |
| team_invitation | Users | /venture-builder |
| weekly_report | FileText | /weekly-report |
| ranking_change | Trophy | /leaderboard |
| new_founders | UserPlus | /founder-feed |
| trending_industry | BarChart3 | /trend-scanner |
| ai_opportunity | Sparkles | /opportunity-radar |

Ao clicar na notificacao, marca como lida E navega para a rota correspondente (usando `related_user_id` ou dados do body quando aplicavel).

### 2. Gerar notificacoes automaticas nos pontos do app

Inserir notificacoes nos seguintes pontos existentes do codigo:

| Evento | Arquivo | Tipo |
|--------|---------|------|
| Novo membro no venture | VentureBuilder.tsx (invite) | team_invitation |
| Task atualizada no venture | VentureTasksTab.tsx | venture_activity |
| Chat no venture | VentureChatTab.tsx | venture_activity |
| Nova oportunidade postada | FounderOpportunities.tsx | opportunity |
| Nova ideia criada | IdeasVault.tsx | startup_idea |
| Mensagem recebida | FounderMessages.tsx | message |

### 3. Edge function para notificacoes inteligentes (nova)

**Criar: `supabase/functions/generate-notifications/index.ts`**

Funcao que pode ser chamada periodicamente ou on-demand para gerar notificacoes baseadas em:
- Novos founders que combinam com o perfil do usuario (match)
- Mudancas no ranking (comparar score atual vs anterior)
- Trending industries baseado em dados do trend_scans
- Resumo semanal (weekly_report)
- AI opportunity alerts baseados no perfil

A funcao busca dados relevantes, gera notificacoes e insere em `founder_notifications`.

### 4. Adicionar coluna `action_url` na tabela

**Migracao:** Adicionar coluna `action_url` (text nullable) em `founder_notifications` para armazenar a rota de navegacao de cada notificacao.

---

### Arquivos

| Acao | Arquivo |
|------|---------|
| Migration | Adicionar `action_url` em `founder_notifications` |
| Edit | `src/components/FounderNotifications.tsx` — icones completos + navegacao |
| Edit | `src/pages/FounderNotificationsPage.tsx` — icones completos + navegacao |
| Edit | `src/pages/VentureBuilder.tsx` — notificacao ao convidar membro |
| Edit | `src/components/venture/VentureTasksTab.tsx` — notificacao ao atualizar task |
| Edit | `src/pages/FounderFeed.tsx` — ja tem notificacao de conexao (ok) |
| Edit | `src/pages/FounderProfile.tsx` — ja tem notificacao de view (ok) |
| Create | `supabase/functions/generate-notifications/index.ts` — gerador inteligente |
| Edit | `supabase/config.toml` — registrar nova funcao |

Sem novas dependencias.

