

## Memória Persistente para AZR AI

A IA já tem histórico de conversas e contexto do usuário (tarefas, objetivos, etc). O que falta é **memória entre conversas** — a IA lembrar de preferências, fatos pessoais e decisões mencionadas pelo usuário em conversas anteriores.

---

### Como funciona

1. **Tabela `ai_memories`** — armazena fatos extraídos das conversas (ex: "Usuário prefere acordar às 5h", "Startup dele é no setor de IA")
2. **Extração automática** — ao final de cada conversa (quando o assistant responde), a edge function analisa as últimas mensagens e extrai fatos relevantes usando tool calling
3. **Injeção no prompt** — as memórias são carregadas junto com o contexto do usuário e injetadas no system prompt

---

### 1. Migração — tabela `ai_memories`

Nova tabela:
- `id` uuid PK
- `user_id` uuid NOT NULL
- `content` text NOT NULL (o fato/memória)
- `category` text (preferencia, fato, decisao, meta)
- `created_at` timestamptz
- `source_conversation_id` uuid nullable

RLS: usuário gerencia as próprias memórias.

### 2. Edge function `azera-ai` — alterações

- Após montar `finalMessages`, buscar memórias do usuário (`ai_memories`, limit 30, mais recentes)
- Injetar bloco `--- MEMÓRIAS DA IA ---` no system prompt com os fatos
- Adicionar endpoint separado: quando o body contém `{ extractMemories: true, conversation: [...] }`, usar tool calling para extrair fatos e salvar na tabela

### 3. Frontend `AI.tsx` — alterações

- Após a resposta do assistant ser finalizada (`onDone`), fazer uma chamada assíncrona (fire-and-forget) para extrair memórias das últimas mensagens
- Adicionar seção "Memórias" no sidebar com botão para ver/deletar memórias salvas
- Badge mostrando quantidade de memórias

### 4. Nova página/modal de Memórias

- Lista de memórias com categoria, data e botão de deletar
- Acessível pelo sidebar do chat

---

### Arquivos

| Ação | Arquivo |
|------|---------|
| Migration | Nova tabela `ai_memories` |
| Edit | `supabase/functions/azera-ai/index.ts` — injetar memórias + endpoint de extração |
| Edit | `src/pages/AI.tsx` — extração automática + UI de memórias no sidebar |

