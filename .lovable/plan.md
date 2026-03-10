

## Plano: Remover Warnings/Erros

Não existem erros de runtime. Os avisos no console são deprecation warnings do React Router v6 sobre a v7. Correções:

### 1. React Router future flags — `src/App.tsx`

Adicionar `future` prop ao `BrowserRouter` para silenciar os 2 warnings:
```tsx
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

### 2. Remover `as any` desnecessários — `src/pages/Profile.tsx`

As tabelas `profile_visits` e `founder_locations` existem nos types. Remover casts desnecessários:
- Linha 148: `"profile_visits" as any` → `"profile_visits"`
- Linha 168: `{ avatar_url: newUrl } as any` → `{ avatar_url: newUrl }`
- Linha 192: `} as any)` → `})`
- Linha 242: `"founder_locations" as any` → `"founder_locations"`
- Linha 470: `as any` no select de username — remover

### Ficheiros a editar
- `src/App.tsx` (1 linha — future flags)
- `src/pages/Profile.tsx` (5 linhas — remover `as any`)

