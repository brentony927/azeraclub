## AZR AI com Contexto Completo do App

A IA atualmente responde sem conhecer os dados do usuario. O plano e fazer a edge function buscar todos os dados relevantes do usuario no banco e injetar como contexto no system prompt, para que a IA possa opinar, sugerir e comentar com base real.

---

### Abordagem

**Na edge function `azera-ai**`, antes de chamar o modelo, buscar os dados do usuario usando o `serviceClient` (service role) e montar um bloco de contexto que sera injetado no system prompt.

**No frontend `AzeraChatbot.tsx**`, enviar um flag `includeContext: true` para que a edge function saiba que deve carregar o contexto completo.

---

### Dados que serao buscados (edge function)

Usando o `userId` ja disponivel na funcao, buscar:

1. **Profile** (`profiles`) — nome, bio, idade, avatar
2. **Objetivos** (`objectives`) — ultimos 10 ativos
3. **Tarefas** (`tasks`) — ultimas 10 pendentes
4. **Diario** (`journal_entries`) — ultimas 5 entradas
5. **Habitos** (`habits`) — todos ativos
6. **Desafios** (`challenges`) — ativos
7. **Ideias** (`ideas`) — ultimas 10
8. **Projetos** (`projects`) — todos
9. **Viagens** (`trips`) — proximas 5
10. **Saude** (`health_appointments`) — proximos 5
11. **Eventos sociais** (`social_events`) — proximos 5
12. **Propriedades** (`properties`) — todas
13. **Founder Profile** (`founder_profiles`) — se existir
14. **Conexoes** (`founder_connections`) — contagem
15. **Oportunidades** (`founder_opportunities`) — ultimas 5 do usuario
16. **Plano do usuario** — ja disponivel na funcao
17. Notificações
18. Conversas

---

### Alteracoes

**1. Edge function `supabase/functions/azera-ai/index.ts`:**

Nova funcao `async function getUserContext(userId)` que:

- Faz queries paralelas (Promise.all) a todas as tabelas acima
- Monta uma string formatada tipo:

```
--- CONTEXTO DO USUARIO ---
Nome: Lucas, 28 anos, Brasil
Plano: Pro

OBJETIVOS ATIVOS:
1. Lancar MVP do SaaS (status: ativo, prazo: 2026-04-01)
...

TAREFAS PENDENTES:
1. Revisar landing page (prioridade: alta)
...

HABITOS:
1. Meditacao (frequencia: diaria, streak: 12)
...
--- FIM DO CONTEXTO ---
```

- Injeta esse contexto no system prompt junto com instrucao: "Use esses dados para personalizar suas respostas. Quando relevante, faca referencias aos objetivos, tarefas e projetos do usuario. De sugestoes baseadas no contexto real."

**2. Frontend `src/components/AzeraChatbot.tsx`:**

- Adicionar `includeContext: true` no body do fetch para o chatbot flutuante
- Nenhuma outra mudanca no frontend

**3. Pagina AI (`src/pages/AI.tsx`):**

- Tambem adicionar `includeContext: true` no body do streamChat

**4. System prompt atualizado:**

Adicionar ao prompt base instrucoes para a IA usar o contexto:

- Referenciar dados do usuario naturalmente
- Sugerir proximos passos baseados em objetivos/tarefas
- Comentar sobre progresso de habitos/desafios
- Opinar sobre ideias e projetos quando perguntada

---

### Arquivos editados (3):


| Arquivo                                | Mudanca                                         |
| -------------------------------------- | ----------------------------------------------- |
| `supabase/functions/azera-ai/index.ts` | Nova funcao `getUserContext`, injecao no prompt |
| `src/components/AzeraChatbot.tsx`      | Adicionar `includeContext: true` no body        |
| `src/pages/AI.tsx`                     | Adicionar `includeContext: true` no body        |


Sem mudancas no banco de dados. Sem novas dependencias.