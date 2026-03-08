

## Fundo Dourado Gradiente nos Itens do Founder Match

Atualizar os estilos CSS dos itens do Founder Match na sidebar para que todos tenham um fundo com gradiente dourado visível (não apenas o item ativo).

### Alterações

**Arquivo: `src/index.css`** (linhas 563-574)

Atualizar as classes:

- **`.founder-sidebar-item`**: Adicionar `background` com gradiente dourado sutil (transparência ~10-15%) para que todos os itens tenham fundo dourado mesmo quando inativos
- **`.founder-sidebar-item:hover`**: Intensificar o gradiente dourado no hover (~20-25%)  
- **`.founder-sidebar-item-active`**: Manter o gradiente mais forte que já existe, mas aumentar a opacidade para ~25-30% com brilho mais pronunciado
- Adicionar `border-radius: 8px` e `border` dourada sutil em todos os estados

Resultado visual: todos os itens do Founder Match terão um fundo dourado gradiente permanente, ficando mais intenso no hover e no estado ativo.

