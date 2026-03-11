

# Plano: Segurança, Limpeza, Sugestões com Recompensa e Painel Owner Organizado

## 1. Segurança: Impedir auto-promoção a owner

Os triggers `prevent_site_owner_change` e `force_site_owner_false_on_insert` já existem no banco e protegem `is_site_owner` e `is_verified`. A leitura do campo `is_site_owner` via client-side (Profile.tsx, Layout.tsx, FounderProfile.tsx) é apenas para exibir UI condicional — não há risco pois o banco impede alterações. **Nenhuma mudança necessária aqui.**

## 2. Limpeza: Excluir arquivo residual

`src/components/AffiliateRequestsPanel.tsx` não é importado em nenhum lugar (foi substituído por `AffiliateManagerPanel`). Será excluído.

## 3. Sistema de Sugestões com Recompensa

### Banco de dados (migração SQL)
- Adicionar policy RLS para site owner poder SELECT e UPDATE todas as sugestões
- A tabela `suggestions` já tem coluna `status` (pendente/implementado/recusado)

### Nova badge "Mente Fértil"
- Adicionar ao `src/lib/badges.ts`: key `fertile_mind`, ícone `Brain`, critério "5+ sugestões aprovadas"
- Adicionar ao `supabase/functions/calculate-badges/index.ts`: contar sugestões com `status = 'implementado'` para o user, regra `approvedSuggestions >= 5`
- Bónus de score: quando owner aprova sugestão, o calculate-founder-score pode considerar sugestões aprovadas

### Painel de review no perfil do owner
- Novo componente `SuggestionsManagerPanel.tsx`:
  - Collapsible como os outros painéis owner
  - Tabs: Pendentes | Analisadas
  - Cada sugestão mostra título, descrição, categoria, autor, data
  - Botões: Aprovar (muda status para `implementado`) | Recusar (muda para `recusado`)
  - Ao aprovar, recalcula badges do autor automaticamente

## 4. Painel Owner colapsável unificado

Em vez de ter `AffiliateManagerPanel` e `SuggestionsManagerPanel` soltos, criar uma seção "Painel do Dono" colapsável que agrupa tudo:

```text
┌─────────────────────────────────────────┐
│ 👑 Painel do Dono                  [▼]  │
├─────────────────────────────────────────┤
│ ┌─ Gerenciar Afiliados ──────────────┐  │
│ │ (AffiliateManagerPanel existente)  │  │
│ └────────────────────────────────────┘  │
│ ┌─ Caixa de Sugestões ──────────────┐  │
│ │ Pendentes | Analisadas             │  │
│ │ [Aprovar] [Recusar] cada sugestão  │  │
│ └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Ficheiros

| Ficheiro | Ação |
|---|---|
| `src/components/AffiliateRequestsPanel.tsx` | Excluir (residual) |
| `src/components/SuggestionsManagerPanel.tsx` | Criar — review de sugestões |
| `src/components/OwnerDashboardPanel.tsx` | Criar — painel colapsável que agrupa tudo |
| `src/pages/Profile.tsx` | Substituir `{isOwner && <AffiliateManagerPanel />}` por `{isOwner && <OwnerDashboardPanel />}` |
| `src/lib/badges.ts` | Adicionar badge `fertile_mind` |
| `supabase/functions/calculate-badges/index.ts` | Adicionar stat `approvedSuggestions` + regra |
| SQL Migration | RLS policies para owner ver/update todas as sugestões |

