

## Caixa de Sugestões — Página dedicada + destaque no Dashboard

### Resumo
Criar uma página `/sugestoes` onde utilizadores autenticados podem submeter sugestões de melhoria para o site e ver sugestões anteriores (próprias). As sugestões ficam salvas na base de dados. No dashboard, adicionar um card em destaque com CTA para a página.

### Mudanças

**1. Migração SQL — tabela `suggestions`**
- Colunas: `id` (uuid PK), `user_id` (uuid not null), `title` (text not null), `description` (text), `category` (text default 'geral'), `status` (text default 'pendente'), `created_at` (timestamptz default now())
- RLS: utilizadores gerem as próprias sugestões (ALL where user_id = auth.uid())

**2. Nova página `src/pages/Suggestions.tsx`**
- Formulário: título (obrigatório), descrição, categoria (select: UI/UX, Funcionalidade, Performance, Outro)
- Lista das sugestões do utilizador com badge de status
- Animações framer-motion consistentes com o resto da app
- Toast de sucesso/erro

**3. `src/pages/Index.tsx` — Card em destaque no dashboard**
- Adicionar um card visualmente destacado (gradiente, ícone Lightbulb) entre as secções existentes
- Texto: "Tem uma ideia para melhorar o Azera? Deixe sua sugestão!"
- Botão que navega para `/sugestoes`

**4. `src/App.tsx` — Rota protegida**
- Adicionar `<Route path="/sugestoes" element={<Suggestions />} />`

**5. `src/components/AppSidebar.tsx` — Link na sidebar**
- Adicionar item "Sugestões" com ícone `MessageSquarePlus` no grupo principal

### Arquivos
| Arquivo | Mudança |
|---------|---------|
| migração SQL | Criar tabela `suggestions` com RLS |
| `src/pages/Suggestions.tsx` | Nova página (formulário + lista) |
| `src/pages/Index.tsx` | Card destacado com CTA |
| `src/App.tsx` | Nova rota `/sugestoes` |
| `src/components/AppSidebar.tsx` | Link na sidebar |

