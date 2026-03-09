

## Plano: Toggle Fundo Animado / Sólido para Planos Premium

### O que será feito
Adicionar um botão de alternância no header (ao lado do ThemeToggle) visível apenas para usuários Pro e Business, permitindo escolher entre o fundo animado (orbs/partículas) e um fundo sólido limpo. A preferência será salva em `localStorage`.

### Implementação

1. **Criar `src/components/BackgroundToggle.tsx`**
   - Botão com dois ícones (ex: `Sparkles` para animado, `Square` para sólido)
   - Estado controlado por `localStorage` key `azera-bg-mode` (valores: `animated` | `solid`)
   - Exporta um hook ou contexto para Layout consumir

2. **Editar `src/components/Layout.tsx`**
   - Importar `BackgroundToggle`
   - Usar estado `bgMode` para condicionalmente renderizar os orbs e `EliteBackground`
   - Colocar o toggle ao lado do `<ThemeToggle />` no header, apenas quando `isPremium`
   - Quando `solid`: esconder `.page-bg-animation` e `<EliteBackground />`

3. **Arquivos**
   - **Criar**: `src/components/BackgroundToggle.tsx`
   - **Editar**: `src/components/Layout.tsx`

