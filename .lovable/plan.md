

## Dashboard Visual Upgrade + Sino de Notificações

### Mudanças

**1. `src/index.css`**
- Alterar `.animated-bg::before` no tema claro (`:root`) para usar gradiente verde escuro em vez do quase-branco atual:
  - `radial-gradient(ellipse ... hsl(152 40% 20% / 0.12) ...)` — tons de verde dark
- Manter animações `bgFloat` intactas
- Manter dark mode como está (já escuro)
- Adicionar classe `.greeting-gradient-text` com gradiente verde→ciano animado para o texto de saudação

**2. `src/pages/Index.tsx`**
- Trocar `moss-text` no greeting por `greeting-gradient-text` para "Boa tarde, Nome." inteiro ficar gradiente
- Adicionar sino de notificações ao lado do texto "Hoje: X tarefas pendentes", no canto direito
- Sino usa `DropdownMenu` com lista de notificações do `founder_notifications` (últimas 20)
- Badge com contagem de não-lidas
- Opções: apagar todas, apagar individual (delete da tabela)
- Ao clicar numa notificação, marca como lida e navega

### Arquivos Afetados
| Arquivo | Mudança |
|---------|---------|
| `src/index.css` | Gradiente verde dark no light mode, classe greeting-gradient-text |
| `src/pages/Index.tsx` | Greeting gradiente, sino de notificações com dropdown |

