

## Simplificar Lógica de Logo — Sempre por Tema

### Mudança
Remover a lógica de plano da seleção de logo. A regra passa a ser:
- **Tema claro** → Logo preta
- **Tema escuro** → Logo branca
- Independente do plano (free, basic, pro, business)

### Arquivo
**`src/hooks/useAzeraLogo.ts`**
- `useAzeraLogo()` e `usePublicLogo()` passam a ter a mesma lógica: tema escuro → branca, tema claro → preta
- Remover imports de `logoGreen` e `logoGold`
- Remover dependência de `useSubscription`
- Simplificar `getLogoForPlanAndTheme` para apenas `getLogoForTheme`

