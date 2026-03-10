

## Plano: Aba "Minhas Publicações" no Founder Feed

### O que será feito
Adicionar uma terceira aba no Founder Feed chamada **"Minhas Publicações"** onde o utilizador pode ver, filtrar e excluir as suas próprias publicações.

### Filtros disponíveis
- **Ordenação**: Mais recente / Mais antiga
- **Tipo**: Todas / Com foto / Só texto

### Implementação

**Ficheiro**: `src/pages/FounderFeed.tsx`

1. Alterar `TabsList` de `grid-cols-2` para `grid-cols-3` e adicionar tab `"my-posts"` com label "Minhas Publicações"
2. Adicionar estados para os filtros:
   - `myPostsSort`: `"recent"` | `"oldest"`
   - `myPostsType`: `"all"` | `"photo"` | `"text"`
3. Criar `TabsContent value="my-posts"` que:
   - Filtra `posts` onde `post.user_id === user.id`
   - Aplica filtro de tipo (com media_urls vs sem)
   - Ordena por `created_at` conforme o sort escolhido
   - Mostra barra de filtros com botões chip (Recente/Antiga, Todas/Com Foto/Só Texto)
   - Renderiza cada post com `FounderPostCard` (que já tem botão de excluir para posts próprios)
   - Mostra estado vazio se não houver publicações

### Ficheiros a editar
- `src/pages/FounderFeed.tsx` — adicionar aba + filtros + conteúdo

