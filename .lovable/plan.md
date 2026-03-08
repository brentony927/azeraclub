

## Integrar NewsAPI nos Radares e Biblioteca de Conhecimento

### Objetivo
Usar a API key do NewsAPI (`ab4c449f32184282bea250cd6ac3f288`) para buscar notícias reais e alimentar a IA com dados atualizados, em vez de depender apenas do conhecimento interno do modelo.

### Abordagem
Criar uma nova edge function `news-search` que busca notícias reais do NewsAPI e retorna os resultados. Os radares e a biblioteca vão primeiro buscar notícias reais, depois passar essas notícias como contexto para a IA gerar análises e insights.

### Alterações

**1. Armazenar o secret `NEWSAPI_KEY`**
- Usar a ferramenta de secrets para salvar `ab4c449f32184282bea250cd6ac3f288` como `NEWSAPI_KEY`

**2. Nova edge function: `supabase/functions/news-search/index.ts`**
- Recebe `query` (termo de busca), `language` (default: `pt`), `pageSize` (default: 5)
- Chama `https://newsapi.org/v2/everything` com a API key
- Retorna os artigos (título, descrição, fonte, URL, data)
- CORS headers inclusos
- JWT não obrigatório (será chamado pela azera-ai ou diretamente)

**3. Atualizar `supabase/functions/azera-ai/index.ts`**
- Quando receber um campo `newsContext: true` no body, a function primeiro chama o NewsAPI internamente (usando `NEWSAPI_KEY`) para buscar notícias relacionadas ao tema
- Injeta os resultados no system prompt como contexto real antes de enviar para a IA
- Assim a IA gera análises baseadas em notícias reais, não inventadas

**4. Atualizar páginas dos radares**
- `src/pages/OpportunityRadar.tsx`: Adicionar `newsContext: true` e um `newsQuery` com a cidade + área no body da request
- `src/pages/TrendsRadar.tsx`: Adicionar `newsContext: true` e `newsQuery` com o tópico selecionado
- `src/pages/KnowledgeLibrary.tsx`: Adicionar `newsContext: true` e `newsQuery` com a categoria selecionada

### Fluxo
```text
Usuário clica "Buscar"
  → Frontend envia { messages, newsContext: true, newsQuery: "tecnologia São Paulo" }
  → azera-ai recebe, busca NewsAPI com a query
  → Recebe 5-8 artigos reais
  → Injeta no system prompt: "Baseie sua resposta nestas notícias reais: [artigos]"
  → IA gera resposta com dados reais
  → Stream de volta para o frontend
```

### Resultado
- Notícias reais e atualizadas em vez de conteúdo inventado pela IA
- Uma única edge function centraliza a lógica (azera-ai)
- Nenhuma mudança na UI, apenas dados melhores

