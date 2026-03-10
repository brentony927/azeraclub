

## Plano: Limpeza de ficheiros não utilizados

### Ficheiros a remover (sem nenhuma importação no projeto)

1. **`src/components/CustomCursor.tsx`** — cursor customizado, nunca importado
2. **`src/components/UpgradeCelebration.tsx`** — componente nunca importado (o context tem a lógica mas o componente nunca é renderizado)
3. **`src/data/mockData.ts`** — 407 linhas de dados mock, nenhuma importação
4. **`src/components/ui/hero-section.tsx`** — componente UI nunca usado
5. **`src/components/ui/spiral-animation.tsx`** — animação nunca importada
6. **`src/test/example.test.ts`** — teste placeholder vazio

### Impacto
- ~500+ linhas de código morto removidas
- Zero impacto funcional (nenhum destes ficheiros é importado)
- Bundle mais leve

### Ficheiros a eliminar
- `src/components/CustomCursor.tsx`
- `src/components/UpgradeCelebration.tsx`
- `src/data/mockData.ts`
- `src/components/ui/hero-section.tsx`
- `src/components/ui/spiral-animation.tsx`
- `src/test/example.test.ts`

