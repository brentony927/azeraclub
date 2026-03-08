

## Sidebar Collapsible Groups com Animações e Glow

### Resumo
Transformar os grupos Ferramentas, Radares, Pro, Business e Plataforma em seções colapsáveis (fechadas por padrão). O label de cada grupo vira um botão clicável com chevron animado. Quando fechado, o label brilha com glow temático (verde PRO, dourado BUSINESS, neutro free). Quando aberto, o conteúdo expande com animação suave.

### Mudanças

**1. `src/components/AppSidebar.tsx`**
- Importar `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` de Radix
- Importar `ChevronRight` do lucide
- Adicionar state `openGroups` (Record<string, boolean>) para controlar quais grupos estão abertos
- Auto-abrir grupo se a rota ativa estiver dentro dele
- Criar componente/função `CollapsibleGroup` que renderiza:
  - `Collapsible` com `open`/`onOpenChange`
  - `CollapsibleTrigger` como label clicável com ícone do grupo + nome + chevron que roda 90° ao abrir
  - `CollapsibleContent` com animação CSS para expandir/colapsar
  - Classe CSS condicional `sidebar-group-glow` quando fechado
- Aplicar nos 5 grupos: Ferramentas, Radares, Pro, Business, Plataforma
- Manter mainItems e founderItems sempre visíveis (sem colapso)

**2. `src/index.css`**
- Adicionar keyframe `@keyframes sidebarGroupGlow` — pulso suave de box-shadow/border
- Classes `.sidebar-group-label-collapsed` com glow animado
- Variantes temáticas:
  - `.pro-theme .sidebar-group-label-collapsed` — glow verde
  - `.business-theme .sidebar-group-label-collapsed` — glow dourado
  - Default (free/basic) — glow cinza/branco sutil
- Dark mode overrides para cada variante
- Animação de chevron: `transition-transform duration-300 rotate-90` quando aberto
- `CollapsibleContent` animation: usar `data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up` (já existem no projeto)

### Arquivos
| Arquivo | Mudança |
|---------|---------|
| `src/components/AppSidebar.tsx` | Wrapping 5 grupos com Collapsible, state de abertura, auto-open por rota |
| `src/index.css` | Glow keyframes + classes temáticas para labels colapsados |

