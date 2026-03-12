

# Plano: Azera OS Master Admin Control System — Upgrade Completo

## Estado Atual
O sistema admin ja existe em `/admin` com 11 secoes basicas. Este upgrade vai expandir significativamente cada secao e adicionar 3 novas: Pagamentos, Saques de Afiliados e Sistema de Logs.

## Novas Tabelas (Migracao SQL)

```sql
-- 1. Logs de atividade administrativa
CREATE TABLE public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL,
  action text NOT NULL,
  target_type text, -- 'user', 'affiliate', 'subscription', etc.
  target_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner can manage logs" ON admin_logs
  FOR ALL TO authenticated USING (is_site_owner(auth.uid()));

-- 2. Pedidos de saque de afiliados
CREATE TABLE public.affiliate_withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, paid, rejected
  requested_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  notes text
);
ALTER TABLE public.affiliate_withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages withdrawals" ON affiliate_withdrawals
  FOR ALL TO authenticated USING (is_site_owner(auth.uid()));
CREATE POLICY "Users view own withdrawals" ON affiliate_withdrawals
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users request own withdrawals" ON affiliate_withdrawals
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
```

## Ficheiros a Modificar

| Ficheiro | Mudanca |
|---|---|
| `src/pages/Admin.tsx` | Adicionar 3 novas secoes (Pagamentos, Saques, Logs), redesign com branding owner |
| `src/components/admin/AdminDashboard.tsx` | Metricas expandidas: faturamento, cancelamentos, novos no mapa, atividade |
| `src/components/admin/AdminUsers.tsx` | Filtros expandidos (score, pais, status, afiliado). Acoes: suspender, deletar, alterar plano, reset score. Dialog de User Deep Profile |
| `src/components/admin/AdminSubscriptions.tsx` | Acoes: cancelar, reativar, conceder plano manual, remover plano |
| `src/components/admin/AdminAffiliates.tsx` | Dados expandidos (conversao, comissao pendente). Acoes: bloquear saque, ajustar comissao |
| `src/components/admin/AdminModeration.tsx` | Opcao de ignorar denuncia alem de banir |
| `src/components/admin/AdminSettings.tsx` | Mais opcoes: precos dos planos, features toggle |

## Ficheiros a Criar

| Ficheiro | Descricao |
|---|---|
| `src/components/admin/AdminPayments.tsx` | Visao de faturamento total, mensal, por plano, logs de pagamentos |
| `src/components/admin/AdminWithdrawals.tsx` | Fila de saques com aprovar/rejeitar/pagar |
| `src/components/admin/AdminLogs.tsx` | Sistema de logs com filtros por tipo e data |
| `src/components/admin/UserDeepProfile.tsx` | Dialog/sheet com perfil completo: dados gerais, atividade, networking, score, financeiro, afiliado |

## Implementacao por Fase

### Fase 1 — Core (esta mensagem)
- Migracao SQL (admin_logs, affiliate_withdrawals)
- Admin.tsx com 14 secoes + branding owner
- AdminDashboard expandido
- AdminUsers expandido com Deep Profile, filtros e acoes completas
- AdminSubscriptions com acoes

### Fase 2 — Financeiro & Afiliados
- AdminPayments (novo)
- AdminWithdrawals (novo)
- AdminAffiliates expandido

### Fase 3 — Logs, Moderacao & Settings
- AdminLogs (novo)
- AdminModeration expandido
- AdminSettings expandido

## Seguranca
- Rota ja esta protegida por `is_site_owner()` RPC
- Novas tabelas usam RLS com `is_site_owner(auth.uid())`
- Acoes destrutivas (deletar conta, cancelar sub) via Edge Functions com service role
- Sistema de logs registra todas as acoes admin para auditoria

## UI/Design Owner
- Header do admin com gradiente owner (vermelho metalico)
- Crown icon e branding "Azera OS — Founder Control Center"
- Cards com bordas primarias e backdrop blur
- Painel colapsavel no perfil ja existe, sera mantido

