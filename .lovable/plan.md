

## Gerenciar Assinatura — Dialog de Cancelamento

Substituir o comportamento atual do botão "Gerenciar" (que tenta abrir o Stripe portal e falha para planos manuais) por um Dialog inline na página de Planos com as informações do plano atual e opção de cancelar.

### Arquivos

| Ação | Arquivo |
|------|---------|
| Edit | `src/pages/Pricing.tsx` — Adicionar Dialog de gerenciamento com info do plano + botão cancelar + confirmação |

### Comportamento

1. Botão "Gerenciar" abre um Dialog (não mais chama `customer-portal`)
2. Dialog mostra: nome do plano atual, status ativo, data de renovação (se houver)
3. Botão "Cancelar Plano" abre AlertDialog de confirmação
4. Ao confirmar cancelamento:
   - Para planos Stripe: chama `customer-portal` e abre o portal (onde o user pode cancelar)
   - Para planos manuais: chama uma nova edge function `cancel-subscription` que remove o registro da tabela `user_plans`
5. Após cancelamento manual: refresh do subscription context e toast de confirmação

### Edge Function necessária

| Ação | Arquivo |
|------|---------|
| Create | `supabase/functions/cancel-subscription/index.ts` — Deleta o registro do user na tabela `user_plans` |

A function autentica o usuário, deleta o row em `user_plans` onde `user_id = auth.uid()`, e retorna sucesso.

### Detalhes do Dialog

- Título: "Gerenciar Assinatura"
- Info: Plano atual (Pro/Business), status "Ativo", data de renovação
- Seção de cancelamento com aviso: "Ao cancelar, você perderá acesso às funcionalidades premium ao final do período."
- Botão vermelho "Cancelar Minha Assinatura" → AlertDialog de confirmação → executa cancelamento
- Sem mudanças no layout da pricing section, apenas no comportamento do `onManage`

