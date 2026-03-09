

# Corrigir Recebimento de Plano Após Pagamento

## Problemas Encontrados

Existem **3 bugs críticos** que impedem o utilizador de receber o plano após pagar:

### 1. Product IDs desalinhados (BUG PRINCIPAL)
A página de Pricing usa product IDs **novos** para o checkout Stripe:
- Pro: `prod_U6wptLNnilCLi5`
- Business: `prod_U6wq54yOsZU99H`

Mas o `SubscriptionContext` mapeia product IDs **antigos**:
- `prod_U62xpa0u9xDiJO` → pro
- `prod_U62xPut1mfd9CG` → business

Resultado: Stripe devolve o product_id correto, mas o frontend não o reconhece e assume "free".

### 2. URL de sucesso errada
O `create-checkout` redireciona para `/` (landing page) após pagamento. Deveria ir para `/dashboard` para o utilizador ver o plano ativo.

### 3. Sem refresh imediato pós-checkout
Quando o utilizador volta do Stripe, não há refresh forçado da assinatura. O debounce de 30s pode atrasar a detecção.

---

## Solução

### `src/contexts/SubscriptionContext.tsx`
- Adicionar os product IDs novos ao `PRODUCT_MAP` (manter os antigos também para retrocompatibilidade)
- Adicionar handling do typo `"bussiness"` (presente na base de dados) mapeando para `"business"`
- Detectar `?checkout=success` na URL e forçar refresh imediato (bypass do debounce)

### `supabase/functions/create-checkout/index.ts`
- Mudar `success_url` de `/` para `/dashboard?checkout=success`

### `supabase/functions/check-subscription/index.ts`
- Atualizar `PLAN_PRODUCT_MAP` com os product IDs novos para consistência

| Ficheiro | Alteração |
|---|---|
| `src/contexts/SubscriptionContext.tsx` | Adicionar novos product IDs + handling "bussiness" + refresh pós-checkout |
| `supabase/functions/create-checkout/index.ts` | success_url → `/dashboard?checkout=success` |
| `supabase/functions/check-subscription/index.ts` | Atualizar PLAN_PRODUCT_MAP com novos IDs |

