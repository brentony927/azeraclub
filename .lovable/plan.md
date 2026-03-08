

## Corrigir Precos Stripe — BRL para GBP

### Problema
Os precos atuais no Stripe estao em BRL:
- PRO: `price_1T7qrGFn0fMTE8T5jvCLKBT8` = R$299/mes (BRL)
- Business: `price_1T7qrVFn0fMTE8T5G08ePJ2r` = R$799/mes (BRL)

### Solucao
1. **Criar 2 novos precos no Stripe em GBP:**
   - PRO: £19/mes (1900 pence), recurring monthly, linked to product `prod_U62xpa0u9xDiJO`
   - Business: £49/mes (4900 pence), recurring monthly, linked to product `prod_U62xPut1mfd9CG`

2. **Atualizar `src/pages/Pricing.tsx`:**
   - Substituir os `price_id` antigos pelos novos IDs em GBP
   - Atualizar labels de moeda de `$` para `£`

3. **Atualizar `src/components/ui/pricing-section.tsx`:**
   - Mostrar simbolo `£` em vez de `$`

### Arquivos Afetados
| Arquivo | Mudanca |
|---------|---------|
| Stripe (via tool) | Criar 2 novos precos em GBP |
| `Pricing.tsx` | Atualizar price_ids e simbolo de moeda |
| `pricing-section.tsx` | Simbolo £ |

