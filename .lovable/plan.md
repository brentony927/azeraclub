

## Plano: Corrigir 3 Vulnerabilidades de Segurança

### 1. `requireTier` bypass no `azera-ai` — `supabase/functions/azera-ai/index.ts`

O problema: o cliente envia `requireTier` no body. Se omitido, o check é ignorado.

**Fix**: Criar um mapa server-side que associa o system prompt (ou um `featureId`) ao tier mínimo. Adicionar um campo `featureId` no body (ex: `"ai-advisor"`, `"trends-radar"`) e validar server-side:

```ts
const FEATURE_TIERS: Record<string, string> = {
  "ai-advisor": "business",
  "investment-radar": "business", 
  "life-master-plan": "business",
  "opportunity-alerts": "business",
  "strategic-partners": "business",
  "wealth-planner": "business",
  "elite-library": "business",
  "life-simulation": "business",
  "investor-match": "business",
  "skill-growth": "pro",
  "weekly-review": "pro",
  "trends-radar": "pro",
  "content-strategy": "pro",
  "opportunity-radar": "pro",
  "productivity-insights": "pro",
  "goal-breakdown": "pro",
  "project-organizer": "pro",
  "daily-focus": "pro",
  "weekly-report": "pro",
  "trend-scanner": "pro",
  "venture-chat": "pro",
  "startup-rankings": "pro",
};
```

- Ler `featureId` do body em vez de `requireTier`
- Se `featureId` existe no mapa, validar tier server-side
- Se não existe no mapa, permitir (chatbot geral sem gate)
- Atualizar todas as ~19 páginas client-side para enviar `featureId` em vez de `requireTier`

### 2. Coordenadas GPS expostas em `founder_profiles` — Migração SQL

Remover as colunas `latitude` e `longitude` da tabela `founder_profiles` (já existem em `founder_locations` que tem RLS restritiva). O mapa já usa `get_rounded_coordinates()`.

- Migração: `ALTER TABLE founder_profiles DROP COLUMN latitude, DROP COLUMN longitude;`
- Atualizar código que referencia essas colunas diretamente (Profile.tsx no geocoding — salvar em `founder_locations` apenas)

### 3. Erros internos expostos em `send-notification` — `supabase/functions/send-notification/index.ts`

- Linha 87: `error.message` → `"Internal server error"` + `console.error`
- Linha 97: `String(error)` → `"Internal server error"` + `console.error`

### Ficheiros a editar
- `supabase/functions/azera-ai/index.ts` (feature tier map server-side)
- `supabase/functions/send-notification/index.ts` (erros genéricos)
- Migração SQL (drop lat/lon de founder_profiles)
- ~19 páginas client-side (`requireTier` → `featureId`)
- `src/pages/Profile.tsx` (remover referências a lat/lon de founder_profiles)

