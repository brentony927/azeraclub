

## Plano: Cache React Query + Lazy Loading

### Diagnóstico

1. **Sem cache global** — `QueryClient` é criado sem `defaultOptions`. Cada query refaz fetch ao montar o componente (staleTime = 0 por defeito).
2. **Dashboard (Index.tsx) usa `useState` + `useEffect`** para 4 queries diretas ao Supabase, sem qualquer cache — cada visita ao dashboard = 4 requests.
3. **Hooks existentes (`useUserData.ts`)** já usam `useQuery` mas sem `staleTime` — dados ficam stale imediatamente.
4. **Imagens sem lazy loading** — avatares em FounderCard, FounderPostCard, FounderProfile, GlobalFounderMap, AppSidebar não têm `loading="lazy"`. Só Experiences/Travel/Properties têm.
5. **Componentes pesados** como `GlobalFounderMap` (Leaflet), `VentureBuilder`, e `FounderFeed` carregam tudo de uma vez sem skeleton/suspense interno.

### Correções

**1. `src/App.tsx` — Cache global no QueryClient**
- Configurar `defaultOptions.queries.staleTime: 2 * 60 * 1000` (2 min)
- `gcTime: 5 * 60 * 1000` (5 min garbage collection)
- `refetchOnWindowFocus: false` (evitar refetch desnecessário ao alt-tab)

**2. `src/hooks/useUserData.ts` — staleTime por hook**
- Adicionar `staleTime: 3 * 60 * 1000` em cada query (dados pessoais mudam pouco)

**3. `src/hooks/useDashboardData.ts` — Novo ficheiro, migrar Index.tsx para React Query**
- Criar hooks: `useTodayTasks`, `useWeekTasks`, `useUpcomingEvents`, `useDashboardNotifications`
- Cada um com `staleTime: 60_000` (1 min, dashboard deve ser mais fresco)
- Index.tsx deixa de usar `useState`/`useEffect` para fetch, usa os hooks

**4. `src/pages/Index.tsx` — Consumir novos hooks**
- Substituir os 4 `useEffect` fetches pelos hooks de `useDashboardData`
- Manter mutations (toggleTask, deleteNotification) com `invalidateQueries`

**5. Lazy loading em imagens — Adicionar `loading="lazy"` em:**
- `src/components/FounderCard.tsx` — avatar img
- `src/components/FounderPostCard.tsx` — avatar img + comment avatars
- `src/pages/FounderProfile.tsx` — avatar img
- `src/pages/GlobalFounderMap.tsx` — avatar imgs no popup/marker
- `src/components/AppSidebar.tsx` — avatar img

**6. `src/components/FounderCard.tsx` — Otimizar re-renders**
- Envolver com `React.memo` (recebe muitas props, renderizado em lista)

### Ficheiros a editar
- `src/App.tsx`
- `src/hooks/useUserData.ts`
- `src/hooks/useDashboardData.ts` (novo)
- `src/pages/Index.tsx`
- `src/components/FounderCard.tsx`
- `src/components/FounderPostCard.tsx`
- `src/pages/FounderProfile.tsx`
- `src/pages/GlobalFounderMap.tsx`
- `src/components/AppSidebar.tsx`

