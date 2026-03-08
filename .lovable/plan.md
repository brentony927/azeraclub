

## Fix: Fundo verde visível no light mode + cores corretas no dark mode

### Problema
1. **Light mode**: O gradiente verde no `.animated-bg::before` usa opacidade muito baixa (0.10-0.12) — praticamente invisível
2. **Dark mode**: Não existe override `.dark .animated-bg::before` — usa o mesmo gradiente do light mode, que fica com cores erradas no fundo escuro
3. **Sidebar dark mode**: As classes `.dark .founder-sidebar-item` existem mas podem ter problemas de especificidade com `.pro-theme` / `.business-theme`

### Mudanças em `src/index.css`

**1. Light mode — `.animated-bg::before`**
- Aumentar opacidade de 0.10-0.12 para **0.35-0.45** nos gradientes verdes
- Usar tons mais escuros e saturados: `hsl(152 50% 15%)` em vez de `hsl(152 40% 20%)`
- Resultado: fundo visivelmente verde escuro

**2. Dark mode — adicionar `.dark .animated-bg::before`**
- Gradientes com tons de verde escuro com opacidade moderada (0.15-0.25)
- Cores: `hsl(152 60% 30%)`, `hsl(160 50% 25%)` — verde profundo que funciona sobre fundo preto
- Manter animação `bgFloat`

**3. Sidebar dark mode — reforçar especificidade**
- Adicionar `.dark .sidebar-nav-item` com `color: hsl(0 0% 85%)` explícito
- Garantir que `.dark .sidebar-nav-item-active` tenha contraste suficiente

### Arquivos
| Arquivo | Mudança |
|---------|--------|
| `src/index.css` | Aumentar opacidade do bg verde light, adicionar dark override, reforçar sidebar dark |

