

## Plano: 3 Alterações Globais

### 1. Estilo de exibição nos Radares (tipo artigo/notícia)
O usuário quer que os resultados dos radares (Oportunidades, Tendências, Biblioteca de Conhecimento) sejam exibidos num estilo de artigo limpo — com títulos em negrito, parágrafos bem espaçados, como o print enviado (estilo editorial).

**Alterações:**
- **`src/pages/OpportunityRadar.tsx`**, **`src/pages/TrendsRadar.tsx`**, **`src/pages/KnowledgeLibrary.tsx`**: Substituir o card com `prose prose-sm` por um container de artigo mais editorial — fundo branco/glass, padding generoso, tipografia maior (`prose-base` ou `prose-lg`), títulos com `font-serif font-bold`, parágrafos com `leading-relaxed`, separadores entre seções. Remover o wrapper `Card` e usar um container estilizado tipo artigo de blog.
- Atualizar os system prompts para pedir formatação em estilo artigo/editorial (parágrafos longos, subtítulos claros, sem bullet points excessivos).

### 2. Renomear app para "Azera Club"
Substituir todas as referências "AZERA ELITE" / "Azera Elite" por "Azera Club" nos seguintes arquivos:
- **`src/pages/Login.tsx`**: `"AZERA ELITE"` → `"Azera Club"`
- **`src/pages/Landing.tsx`**: referências ao nome do app
- **`src/components/Footer.tsx`**: `"AZERA ELITE"` → `"Azera Club"` (2 ocorrências)
- **`src/pages/TermsOfService.tsx`**: todas as menções `"AZERA ELITE"`
- **`src/pages/PrivacyPolicy.tsx`**: todas as menções `"AZERA ELITE"`
- **`src/pages/Networking.tsx`**: `"Azera Elite"` → `"Azera Club"`
- **`src/pages/Signup.tsx`**: se houver referência

### 3. Planos: Elite → Business + 2 planos semanais PIX

**`src/pages/Pricing.tsx`:**
- Renomear o plano `elite` para `business` (key, name, buttonText)
- Adicionar 2 novos planos semanais (pagamento via PIX):
  - **Pro Semanal**: ~R$5/semana, com features do Pro
  - **Business Semanal**: ~R$12/semana, com features do Business
- Esses planos terão um botão que abre instruções de pagamento PIX (chave PIX ou QR code) em vez de Stripe checkout
- Adicionar uma terceira opção no switch de período: "Semanal" (ou separar os planos semanais numa seção abaixo)

**`src/components/ui/pricing-section.tsx`:**
- Adicionar suporte para `weeklyPrice` no tipo `PricingPlan`
- Expandir o `PricingSwitch` para 3 opções: Semanal / Mensal / Anual
- Adicionar lógica para exibir badge "PIX" nos planos semanais
- Grid responsivo: quando 5 planos, usar layout diferente (ou manter 3 cols com scroll/wrap)

**`src/contexts/SubscriptionContext.tsx`:**
- Renomear `"elite"` para `"business"` no `PlanTier` type e `PRODUCT_MAP`

**`src/components/FeatureLock.tsx`:**
- Atualizar `TIER_LABELS`: `elite` → `business: "Business"`

**`src/components/EliteBadge.tsx`:**
- Renomear referências `elite` → `business`

**`src/components/UpgradeCelebration.tsx`:**
- Renomear key `elite` → `business` no `PLAN_FEATURES`

**`supabase/functions/azera-ai/index.ts`** e **`supabase/functions/check-subscription/index.ts`:**
- Renomear `"elite"` → `"business"` no `PRODUCT_MAP` e `TIER_ORDER`

### Nota sobre PIX
Os planos semanais via PIX não passam pelo Stripe. O botão abrirá um dialog com a chave PIX e instruções. A ativação do plano será manual (ou futuramente automatizada via webhook de pagamento PIX). Por enquanto, o usuário precisará fornecer uma chave PIX para exibir.

