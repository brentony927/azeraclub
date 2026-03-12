

# Plano: Azera OS — Founder Control Center

## Visão Geral

Criar um painel administrativo completo acessível apenas pelo owner, em uma rota dedicada `/admin`. No perfil do owner, substituir o `OwnerDashboardPanel` por um botão/link que leva ao painel admin completo. A verificação de acesso é feita via `is_site_owner()` RPC no banco.

## Arquitetura

```text
/admin (nova rota protegida)
├── AdminLayout (verifica is_site_owner via RPC, redireciona se não)
│   ├── Sidebar lateral com navegação entre seções
│   └── Conteúdo principal:
│       ├── Dashboard (stats gerais)
│       ├── Usuários (lista + filtros + ações)
│       ├── Assinaturas (Stripe overview)
│       ├── Afiliados (migrar AffiliateManagerPanel)
│       ├── Sugestões (migrar SuggestionsManagerPanel)
│       ├── Insígnias (dar/remover badges)
│       ├── Mapa Global (gerenciar perfis)
│       ├── Oportunidades (moderar posts)
│       ├── Moderação (fila de denúncias)
│       ├── Analytics (uso de features)
│       └── Configurações (limites, comissões)
```

## Segurança

- A rota `/admin` fica dentro do `ProtectedLayout` (requer auth)
- O componente `AdminLayout` faz uma chamada RPC `is_site_owner(auth.uid())` e redireciona para `/dashboard` se `false`
- Todas as queries admin usam as policies RLS existentes que já verificam `is_site_owner()`
- Ações destrutivas (ban, remover badge) continuam via Edge Functions com service role

## Ficheiros a Criar

| Ficheiro | Descrição |
|---|---|
| `src/pages/Admin.tsx` | Página principal com sidebar + tabs para as 11 seções |
| `src/components/admin/AdminDashboard.tsx` | Dashboard com stats (users, receita, atividade) |
| `src/components/admin/AdminUsers.tsx` | Lista de usuários com filtros e ações |
| `src/components/admin/AdminSubscriptions.tsx` | Overview de assinaturas |
| `src/components/admin/AdminAffiliates.tsx` | Migração do AffiliateManagerPanel |
| `src/components/admin/AdminSuggestions.tsx` | Migração do SuggestionsManagerPanel |
| `src/components/admin/AdminBadges.tsx` | Dar/remover badges |
| `src/components/admin/AdminMap.tsx` | Gerenciar perfis no mapa |
| `src/components/admin/AdminOpportunities.tsx` | Moderar oportunidades |
| `src/components/admin/AdminModeration.tsx` | Fila de moderação |
| `src/components/admin/AdminAnalytics.tsx` | Uso de features |
| `src/components/admin/AdminSettings.tsx` | Configurações da plataforma |

## Ficheiros a Modificar

| Ficheiro | Mudança |
|---|---|
| `src/App.tsx` | Adicionar rota `/admin` dentro do ProtectedLayout |
| `src/pages/Profile.tsx` | Substituir `OwnerDashboardPanel` por botão "Abrir Azera OS" que navega para `/admin` |
| `src/components/AppSidebar.tsx` | Adicionar link "Azera OS" visível apenas para owner |

## Banco de Dados (Migração SQL)

Criar tabela `platform_settings` para configurações editáveis:
```sql
CREATE TABLE public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only owner can manage settings" ON platform_settings
  FOR ALL TO authenticated
  USING (is_site_owner(auth.uid()))
  WITH CHECK (is_site_owner(auth.uid()));
```

Criar tabela `content_reports` para denúncias (se não existir):
```sql
CREATE TABLE public.content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  content_type text NOT NULL, -- 'post', 'profile', 'opportunity'
  content_id uuid NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own reports" ON content_reports
  FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Owner can manage all reports" ON content_reports
  FOR ALL TO authenticated
  USING (is_site_owner(auth.uid()))
  WITH CHECK (is_site_owner(auth.uid()));
```

## Implementação por Seção

### 1. Dashboard
Queries agregadas: `count` em `profiles`, `founder_profiles`, `affiliate_profiles`, `suggestions`, `founder_posts`, `founder_opportunities`. Filtros por data (hoje, semana, mês).

### 2. Usuários
Query `founder_profiles` + `profiles` + `user_plans` + `founder_scores`. Filtros client-side. Ações via `user_moderation` insert (ban/suspend) e `user_badges` insert/delete.

### 3. Assinaturas
Query `user_plans` + stats. Ações via Edge Functions existentes (`cancel-subscription`).

### 4-5. Afiliados e Sugestões
Migrar lógica existente dos componentes atuais para formato full-page.

### 6. Insígnias
Query `user_badges` + `founder_profiles`. Interface para selecionar user + badge e inserir/deletar em `user_badges`.

### 7-9. Mapa, Oportunidades, Moderação
Queries nas tabelas existentes com ações de delete/update via RLS de owner.

### 10. Analytics
Contagens agrupadas por tabela para medir uso de features.

### 11. Configurações
CRUD na tabela `platform_settings`.

## UI

- Sidebar escura com ícones + labels para cada seção
- Layout responsivo (sidebar colapsa em mobile)
- Cards com stats usando `NumberFlow` para animação
- Tabelas com `Table` component existente
- Ações confirmadas via `AlertDialog`

## Nota sobre Escopo

Este é um módulo grande (11 seções). Será implementado em fases para manter qualidade:
- **Fase 1**: AdminLayout + Dashboard + Usuários + Sugestões + Afiliados (core)
- **Fase 2**: Insígnias + Moderação + Oportunidades
- **Fase 3**: Analytics + Configurações + Mapa

Vou implementar a Fase 1 completa agora e as demais em seguida.

