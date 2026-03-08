

## AZERA Founder Match — Sistema Completo

Este e um sistema social completo com 6 modulos. Dado o tamanho, vou dividir em **3 fases de implementacao** para evitar erros e manter qualidade. Este plano cobre a **Fase 1** (fundacao) que ja entrega valor.

---

### Fase 1 — Fundacao (este plano)

**Novas tabelas no banco de dados (4 tabelas):**

1. **`founder_profiles`** — perfil de fundador
   - `id`, `user_id`, `name`, `age`, `country`, `skills` (text[]), `industry` (text[]), `building` (text), `looking_for` (text[]), `commitment` (text), `avatar_url`, `is_published` (bool), `created_at`, `updated_at`
   - RLS: SELECT para todos autenticados, INSERT/UPDATE/DELETE apenas owner

2. **`founder_connections`** — conexoes entre fundadores
   - `id`, `from_user_id`, `to_user_id`, `status` (pending/accepted/rejected), `created_at`
   - RLS: SELECT/INSERT/UPDATE para participantes

3. **`founder_messages`** — mensagens diretas
   - `id`, `from_user_id`, `to_user_id`, `content`, `read` (bool), `created_at`
   - RLS: SELECT/INSERT para participantes
   - Realtime habilitado

4. **`founder_opportunities`** — posts de oportunidades
   - `id`, `user_id`, `title`, `description`, `project`, `equity_available` (bool), `looking_for` (text[]), `created_at`
   - RLS: SELECT para todos autenticados, INSERT/UPDATE/DELETE apenas owner

**Novas paginas (5 paginas):**

1. **`/founder-match`** — Hub principal
   - Se usuario nao tem perfil: tela "Crie seu Perfil de Fundador" com formulario completo (name, age, country, skills multi-select, industry multi-select, building textarea, looking_for multi-select, commitment select)
   - Se ja tem perfil: redireciona para o feed

2. **`/founder-feed`** — Feed de Fundadores
   - Cards com foto, nome, skills (badges), looking_for, country
   - Botoes "Ver Perfil" e "Conectar"
   - Filtros no topo: Skills, Industry, Country, Looking For, Commitment
   - Business users aparecem com destaque dourado e primeiro no feed (ordenacao por tier)

3. **`/founder-profile/:id`** — Perfil completo de fundador
   - Foto, nome, country, skills, industry, building, looking_for, commitment
   - Botoes: Conectar, Enviar Mensagem, Salvar Perfil

4. **`/founder-messages`** — Sistema de mensagens
   - Lista de conversas a esquerda, chat a direita
   - Realtime via Supabase channels
   - Limite Basic: 1000 msgs/dia; Pro/Business: ilimitado

5. **`/founder-opportunities`** — Feed de oportunidades
   - Cards com titulo, projeto, looking_for, equity badge
   - Botao "Publicar Oportunidade" (Pro+ apenas)
   - Dialog de criacao com campos: title, description, project, equity, looking_for

**Atualizacoes no sidebar:**

Nova secao "Founder Match" no `AppSidebar.tsx`:
- Founder Feed (`/founder-feed`)
- Buscar Fundadores (filtros no feed)
- Oportunidades (`/founder-opportunities`)
- Mensagens (`/founder-messages`)

**Sistema de planos (FeatureLock):**
- **Basic**: criar perfil, ver perfis, 1000 msgs/dia
- **Pro**: msgs ilimitadas, filtros avancados, postar oportunidades
- **Business**: destaque dourado no feed, aparecer primeiro, analytics de perfil

**Componentes novos:**
- `FounderCard.tsx` — card reutilizavel para feed
- `FounderProfileForm.tsx` — formulario de criacao/edicao
- `FounderChat.tsx` — componente de chat com realtime

**Rotas novas no `App.tsx`** (dentro do ProtectedLayout):
```
/founder-match
/founder-feed
/founder-profile/:id
/founder-messages
/founder-opportunities
```

**Estimativa**: ~15 arquivos novos/editados. Interface dark/glass consistente com o resto do app. Todo texto em portugues elegante, exceto termos de marca (Founder Match).

