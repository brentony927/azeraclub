

## Plano: Feed Social de Founders + Mensagens Avançadas

Este é um conjunto grande de funcionalidades. Vou dividir em **duas fases** para manter qualidade e evitar bugs.

### FASE 1 — Feed Social com Posts (prioridade)

#### Novas tabelas no banco de dados
- `founder_posts` — publicações com texto, fotos (media_urls), user_id, created_at
- `founder_post_likes` — curtidas (user_id + post_id, unique)
- `founder_post_comments` — comentários (user_id, post_id, content, created_at)

#### Novas funcionalidades no Feed (`FounderFeed.tsx`)
- Adicionar formulário de criação de post (texto + upload de fotos) no topo do feed
- Renderizar timeline de posts abaixo dos perfis com: avatar, nome, texto, fotos, data
- Botões de Like (com contagem), Comentar (expansível), Compartilhar (copiar link)
- Autor do post pode excluir

#### Perfil do Founder (`FounderProfile.tsx`)
- Nova aba "Publicações" mostrando os posts do founder visitado

#### Storage
- Novo bucket `post-media` (público) para fotos dos posts

---

### FASE 2 — Mensagens Avançadas + Oportunidades

#### Responder a Oportunidades
- Botão "Responder" nas oportunidades que abre conversa com contexto da oportunidade
- Nova aba "Oportunidades" no `FounderMessages.tsx` filtrando mensagens iniciadas via oportunidade
- Adicionar campo `opportunity_id` na tabela `founder_messages` (nullable)

#### Grupos de Mensagens
- Nova tabela `message_groups` (name, photo_url, description, created_by)
- Nova tabela `message_group_members` (group_id, user_id, role: admin/member)
- Nova tabela `group_messages` (group_id, user_id, content, created_at)
- UI de criação de grupo (nome, foto, descrição) + gestão de membros/admins
- Grupos aparecem na lista de conversas

#### Fixar Conversas
- Novo campo `pinned_conversations` na tabela `profiles` (array de user_ids) ou tabela dedicada `pinned_conversations`
- Ícone de pin na lista de conversas, conversas fixadas aparecem no topo

---

### Arquivos a criar (Fase 1)
- `src/components/FounderPostCard.tsx` — card de post com like/comment/share
- `src/components/CreateFounderPost.tsx` — formulário de criação de post

### Arquivos a editar (Fase 1)
- `src/pages/FounderFeed.tsx` — integrar timeline de posts
- `src/pages/FounderProfile.tsx` — aba de publicações

### Arquivos a criar (Fase 2)
- `src/components/MessageGroupDialog.tsx` — criar/editar grupo
- `src/components/GroupChat.tsx` — chat de grupo

### Arquivos a editar (Fase 2)
- `src/pages/FounderMessages.tsx` — abas (Conversas / Oportunidades / Grupos), pin
- `src/pages/FounderOpportunities.tsx` — botão "Responder"
- `src/components/FounderChat.tsx` — contexto de oportunidade

### Migrações de banco (ambas fases)
- Fase 1: `founder_posts`, `founder_post_likes`, `founder_post_comments` + RLS + bucket `post-media`
- Fase 2: `message_groups`, `message_group_members`, `group_messages`, `pinned_conversations` + alteração em `founder_messages` (add `opportunity_id`) + RLS

---

**Nota:** Devido à complexidade, implementarei a **Fase 1 primeiro** (feed social com posts, likes, comentários, compartilhar, excluir) e depois a Fase 2 (mensagens avançadas) na sequência. Isto garante que cada funcionalidade é testável antes de avançar.

