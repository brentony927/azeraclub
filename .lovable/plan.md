

## Plano: Owner Card Vermelho Intenso + Publicar Ferramentas no Feed

### 1. FounderCard Owner — Estilo Vermelho Intenso

**`src/index.css`** — Intensificar `.owner-card`:
- Background com gradiente vermelho mais forte (radial + linear)
- Border mais grossa com glow pulsante
- Animação `owner-glow` no card
- Nome do owner em vermelho brilhante (`.owner-card .font-semibold`)
- Badges com tint vermelho
- Botões com accent vermelho

**`src/components/FounderCard.tsx`**:
- Quando `isSiteOwner`, aplicar classe `owner-name` no nome `<h3>`
- Ring do avatar mais intenso (ring-3 em vez de ring-2)
- Badges de skills com tint vermelho

### 2. Publicar Ferramentas no Feed (Diário, Ideias, Objetivos, Desafios)

**`src/components/CreateFounderPost.tsx`** — Adicionar botões de ferramentas ao lado do botão Foto:
- Botão "Diário" — abre dropdown/dialog para selecionar uma entrada do diário e publicar como post
- Botão "Ideias" — selecionar uma ideia do cofre e publicar
- Botão "Objetivos" — selecionar um objetivo e publicar progresso
- Botão "Desafios" — selecionar um desafio ativo e publicar status

Cada botão abre um dialog que:
1. Busca dados do user na tabela correspondente (`journal_entries`, `ideas`, `objectives`, `challenges`)
2. Lista os itens recentes
3. Ao selecionar, formata o conteúdo automaticamente com emoji + título + descrição
4. Preenche o textarea do post com o conteúdo formatado
5. O user pode editar antes de publicar

### Ficheiros a editar
- `src/index.css` (estilos owner-card intensificados)
- `src/components/FounderCard.tsx` (classes vermelhas no nome/avatar)
- `src/components/CreateFounderPost.tsx` (botões de ferramentas + dialogs de seleção)

