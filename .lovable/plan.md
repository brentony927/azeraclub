

## Restaurar o HeroSection na página de IA

### Problema
O componente `HeroSection` (`src/components/ui/hero-section.tsx`) existe no projeto mas não está sendo importado em nenhuma página. Ele era a tela inicial da página de IA com o título "Central de Inteligência Artificial", campo de prompt e sugestões — e foi perdido durante o refactoring de rotas.

### Solução
Integrar o `HeroSection` de volta na página de IA (`src/pages/AI.tsx`) como o estado vazio (quando não há mensagens). Substituir o bloco atual de empty state (linhas ~296-395) pelo `HeroSection`, conectando:

- `onSubmit` → função `send()` existente
- `suggestions` → array `SUGGESTIONS` já definido na página
- Manter os seletores de mood e o banner de limite abaixo do hero

### Alteração

**`src/pages/AI.tsx`**
- Importar `HeroSection` de `@/components/ui/hero-section`
- No bloco `!hasMessages`, substituir o título "O que posso fazer por você?" e o form duplicado pelo `<HeroSection onSubmit={send} suggestions={SUGGESTIONS} />`
- Manter moods e limit banner abaixo do hero

