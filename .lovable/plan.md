## Startup Teams — Sistema Completo de Equipes

Expandir o Venture Builder existente com um sistema de Teams completo, chat interno, Kanban de tarefas, roadmap visual, e rankings de startups.

---

### O que ja existe

- Tabelas: `ventures`, `venture_members`, `venture_notes`
- Pagina `VentureBuilder.tsx` com criacao de ventures, AI roadmap, team invite, notes
- `FounderLeaderboard.tsx` com ranking de founders

### O que falta

1. **Teams como conceito separado** (ou estender ventures com seções extras)
2. **Kanban de tarefas por venture** (To Do / In Progress / Done)
3. **Chat interno por venture/team**
4. **Roadmap visual (timeline)**
5. **AI Co-Founder** (IA responde perguntas da equipe no chat)
6. **Ranking de Startups** (alem do ranking de founders)

---

### 1. Banco de Dados (1 migracao)

**Novas tabelas:**

- `**venture_tasks**` — id, venture_id (FK), user_id, title, description, assigned_to (uuid nullable), status (todo/in_progress/done), deadline (date nullable), created_at
- `**venture_chat**` — id, venture_id (FK), user_id, content, is_ai (boolean default false), created_at

**Alterar tabela `ventures`:**

- Adicionar coluna `goal` (text nullable)
- Adicionar coluna `total_score` (integer default 0) — para ranking de startups

**RLS:**

- `venture_tasks`: SELECT/INSERT/UPDATE/DELETE para membros do venture (owner ou member via venture_members)
- `venture_chat`: SELECT/INSERT para membros do venture; realtime habilitado

**Habilitar realtime** em `venture_chat`.

---

### 2. Expandir VentureBuilder.tsx

Adicionar 3 novas tabs ao venture selecionado:

**Tab "Tasks" (Kanban):**

- 3 colunas: To Do, In Progress, Done
- Cards arrastáveis (ou clique para mudar status)
- Criar tarefa: title, description, assigned_to (select de members), deadline
- Badge com assignee e deadline

**Tab "Chat":**

- Chat simples em tempo real (subscribe `venture_chat`)
- Mensagens com avatar/nome do sender
- Botão "Ask AI Co-Founder" — envia mensagem com flag `is_ai`, chama `azera-ai` com contexto da venture, resposta salva como mensagem AI no chat
- Mensagens AI com badge especial

**Tab "Roadmap" (visual):**

- Timeline vertical com meses
- Extrair fases do `ai_roadmap` se existir, ou permitir adicionar manualmente
- Visual com linha vertical e nodes por fase

---

### 3. Nova pagina: Startup Rankings (`/startup-rankings`)

- Query `ventures` com `status = 'active'`, ordenado por `total_score` DESC
- Score calculado por: numero de membros, tasks completas, notas, chat activity
- Top 3 com destaque visual (ouro/prata/bronze)
- Cards com: nome, industria, goal, score, numero de membros
- Bookmark button em cada card

**Adicionar rota** ao `App.tsx` e item na sidebar grupo "Plataforma".

---

### 4. AI Co-Founder no Chat

Reutilizar `azera-ai` edge function. Quando usuario clica "Ask AI":

- Envia contexto da venture (name, industry, problem, solution, members, recent tasks)
- IA responde como "consultor de startups"
- Resposta salva em `venture_chat` com `is_ai = true`

---

### Arquivos


| Acao      | Arquivo                                                                            |
| --------- | ---------------------------------------------------------------------------------- |
| Migration | Nova migracao SQL (venture_tasks, venture_chat, alter ventures)                    |
| Rewrite   | `src/pages/VentureBuilder.tsx` — adicionar tabs Tasks, Chat, Roadmap               |
| Create    | `src/pages/StartupRankings.tsx` — ranking de startups                              |
| Edit      | `src/App.tsx` — nova rota `/startup-rankings`                                      |
| Edit      | `src/components/AppSidebar.tsx` — adicionar "Ranking Startups" ao grupo Plataforma |


Sem novas dependencias. Sem nova edge function.

FAZER AS TEAMS NA ABA FOUNDER