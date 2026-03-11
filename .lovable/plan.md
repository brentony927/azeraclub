

# Painel Completo de Gestão de Afiliados (Owner)

## Objetivo
Substituir o `AffiliateRequestsPanel` atual por um painel expandível completo no perfil do dono, com todas as opções de gestão: pendentes, afiliados ativos, resultados, conversar, banir, excluir, etc.

## Componente: `AffiliateManagerPanel.tsx`

Novo componente que substitui `AffiliateRequestsPanel` no perfil do owner. Usa `Collapsible` para expandir/recolher.

### Estrutura

```text
┌─────────────────────────────────────────┐
│ 👥 Gerenciar Afiliados          [▼]     │
├─────────────────────────────────────────┤
│ Tabs: Pendentes | Ativos | Histórico    │
│                                         │
│ [PENDENTES]                             │
│  ┌─ Nome · Redes · Estratégia ────────┐ │
│  │  [Aprovar] [Recusar]               │ │
│  └────────────────────────────────────┘ │
│                                         │
│ [ATIVOS]                                │
│  ┌─ Nome · Level · Leads · Vendas ───┐  │
│  │  [Ver Resultados] [Conversar]     │  │
│  │  [Desativar] [Excluir]            │  │
│  └───────────────────────────────────┘  │
│                                         │
│ [HISTÓRICO]                             │
│  Lista de rejeitados/desativados        │
└─────────────────────────────────────────┘
```

### Dados carregados (via service role RLS — owner já tem SELECT em `affiliate_requests`)
- `affiliate_requests` (todas: pending, approved, rejected)
- `affiliate_profiles` (todos os afiliados ativos)
- `affiliate_leads` + `affiliate_commissions` (resultados por afiliado)
- `founder_profiles` (nomes/avatares dos afiliados)

### Ações disponíveis
| Ação | Implementação |
|---|---|
| Aprovar/Recusar pendente | Edge function `approve-affiliate` (já existe) |
| Ver resultados | Expande card com leads, vendas, comissão, taxa |
| Conversar | Navega para `/founder-messages` com o user_id |
| Desativar afiliado | UPDATE `affiliate_profiles.enabled = false` (nova edge function) |
| Reativar afiliado | UPDATE `affiliate_profiles.enabled = true` |
| Excluir afiliado | DELETE `affiliate_profiles` + reset (nova edge function) |
| Banir usuário | Usa `OwnerModPanel` inline |

### Nova Edge Function: `manage-affiliate`
Aceita ações `disable`, `enable`, `delete` sobre um afiliado. Verifica que o caller é site owner.

### Alterações em RLS
- `affiliate_profiles`: adicionar policy SELECT para site owner ver todos
- `affiliate_leads`: adicionar policy SELECT para site owner ver todos
- `affiliate_commissions`: adicionar policy SELECT para site owner ver todos

### Ficheiros

| Ficheiro | Ação |
|---|---|
| `src/components/AffiliateManagerPanel.tsx` | Criar — painel completo |
| `supabase/functions/manage-affiliate/index.ts` | Criar — disable/enable/delete |
| SQL Migration | RLS policies para owner ver affiliate data |
| `src/pages/Profile.tsx` | Trocar `AffiliateRequestsPanel` por `AffiliateManagerPanel` |

