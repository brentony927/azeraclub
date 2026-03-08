

## Melhorar Experiência Mobile

### Problemas identificados
1. **Sem navegação rápida mobile** — Dashboard e maioria das páginas não têm bottom navigation; utilizador depende do sidebar (hamburger menu)
2. **Footer ocupa espaço excessivo** no mobile — muitos links legais ocupam scroll
3. **Chatbot floating button sobrepõe conteúdo** — `bottom-20` posiciona no meio do footer
4. **Cards do dashboard sem padding adequado** — espaçamento `space-y-8` é exagerado em telas pequenas
5. **Greeting text muito grande** — `text-3xl` ocupa metade da tela no mobile
6. **Sem safe area para bottom nav** — conteúdo fica cortado sob a barra de navegação

### Mudanças

**1. Bottom Navigation Mobile (`src/components/MobileBottomNav.tsx`) — NOVO**
- Barra fixa no bottom com 5 ícones: Início, IA, Agenda, Networking, Perfil
- Só aparece em mobile (`md:hidden`)
- Touch targets de 48px, labels pequenos, ícone ativo com cor accent
- Design clean com backdrop-blur

**2. `src/components/Layout.tsx`**
- Importar e renderizar `MobileBottomNav` dentro do layout
- Adicionar `pb-20 md:pb-0` no `<main>` para safe area da bottom nav
- Remover `Footer` no mobile (mover para dentro de páginas específicas ou esconder com `hidden md:block`)

**3. `src/pages/Index.tsx` — Ajustes mobile**
- Reduzir greeting: `text-2xl md:text-3xl lg:text-4xl`
- Reduzir `space-y-8` → `space-y-5 md:space-y-8`
- Grid score/AI: `grid grid-cols-1 sm:grid-cols-2` (empilhar no mobile)
- Cards com `p-4 md:p-5` para padding mais compacto

**4. `src/components/AzeraChatbot.tsx`**
- Ajustar posição do botão flutuante: `bottom-24 md:bottom-6` para não sobrepor a bottom nav
- Garantir que o chat fullscreen no mobile usa `pb-safe` corretamente

**5. `src/components/Footer.tsx`**
- Adicionar `hidden md:block` no wrapper — esconder no mobile (navegação já é feita pelo bottom nav)

**6. `src/index.css`**
- Adicionar utilitário `pb-safe` com `env(safe-area-inset-bottom)` se não existir

### Arquivos
| Arquivo | Mudança |
|---------|---------|
| `src/components/MobileBottomNav.tsx` | Novo — bottom navigation mobile |
| `src/components/Layout.tsx` | Integrar bottom nav + padding bottom |
| `src/pages/Index.tsx` | Tipografia e spacing responsivos |
| `src/components/AzeraChatbot.tsx` | Posição do FAB ajustada |
| `src/components/Footer.tsx` | Esconder no mobile |
| `src/index.css` | Safe area utility |

