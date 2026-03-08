

## Sidebar Visual Upgrade — Gradiente AZERA CLUB + Animações nas Abas

### Mudanças

**1. `src/components/AppSidebar.tsx`**
- Trocar classe `moss-text` do "AZERA CLUB" por nova classe `azera-brand-text` com gradiente vibrante animado (verde/cyan para PRO, ouro/amber para BUSINESS, verde/teal default)
- Todas as abas (não-Founder) ganham classes de animação: hover com scale sutil, transição suave de cores, e um leve glow no item ativo
- Manter Founder Alignment com destaque dourado existente — as outras seções ficam minimalistas em comparação
- Abas regulares: tema claro = fundo claro com texto escuro, tema escuro = fundo escuro com texto claro (sem fundo colorido forte, apenas transições suaves)

**2. `src/index.css`**
- Nova classe `.azera-brand-text` com gradiente animado (background-size 200%, animação shimmer) — cor muda por tema
- Nova classe `.sidebar-nav-item` para todas as abas não-Founder:
  - Hover: translateX(2px) + leve background fade-in + glow sutil
  - Active: borda left com cor do tema + background sutil
  - Transição suave de 300ms em tudo
- `.sidebar-nav-item-active`: left border accent, leve glow
- Garantir que no tema claro os itens tenham `color: foreground` e `bg: transparent`, e no escuro também — sem background colorido forte fora do Founder Alignment
- Animação `@keyframes brandShimmer` para o texto AZERA CLUB

### Resultado
- "AZERA CLUB" em gradiente animado chamativo
- Abas com micro-animações (hover slide, glow ativo) mas minimalistas
- Founder Alignment permanece o único com gradiente dourado forte — destaque visual claro
- Funciona bem em light e dark mode

### Arquivos
| Arquivo | Mudança |
|---------|---------|
| `src/components/AppSidebar.tsx` | Classe `azera-brand-text`, classes `sidebar-nav-item` nas abas |
| `src/index.css` | Novas classes de animação sidebar, gradiente brand |

