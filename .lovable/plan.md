

## Plano: Corrigir Notificações e Lógicas Faltantes

### Problemas Identificados

1. **Like em post → sem notificação** — `toggleLike()` no `FounderPostCard.tsx` não envia notificação ao autor do post
2. **Comentário em post → sem notificação** — `handleComment()` não notifica o autor do post
3. **Mensagem direta → sem notificação** — `send-founder-message` edge function insere mensagem mas nunca notifica o destinatário
4. **Resposta a oportunidade → sem notificação** — clicar "Responder" em `FounderOpportunities` navega para mensagens sem notificar o dono da oportunidade
5. **Contagem de comentários não atualiza localmente** — após comentar, o `commentsCount` no card não reflete o novo comentário até reload completo
6. **Post criado → sem notificação para conexões** — quando um founder publica, suas conexões não são notificadas

### Correções

#### 1. FounderPostCard.tsx — Notificação ao curtir e comentar
- Em `toggleLike()`: se não é o próprio post, chamar `sendNotification()` com type `post_like`, título "[nome] curtiu sua publicação"
- Em `handleComment()`: se não é o próprio post, chamar `sendNotification()` com type `post_comment`, título "[nome] comentou na sua publicação"
- Receber `myName` como prop para usar no título da notificação

#### 2. send-founder-message edge function — Notificar destinatário
- Após insert bem-sucedido, inserir na tabela `founder_notifications` com type `message`, título "[nome] enviou uma mensagem"
- Buscar nome do remetente via `founder_profiles`

#### 3. FounderOpportunities.tsx — Notificar ao responder oportunidade
- Antes de navegar para mensagens, chamar `sendNotification()` com type `opportunity_reply`

#### 4. FounderPostCard.tsx — Atualizar commentsCount local
- Após comentário bem-sucedido, incrementar o commentsCount local no estado

#### 5. Adicionar types de notificação ao send-notification
- Verificar que os novos types (`post_like`, `post_comment`, `message`, `opportunity_reply`) estão na lista de tipos permitidos da edge function

### Arquivos a editar
- `src/components/FounderPostCard.tsx` — adicionar sendNotification em like/comment + commentsCount local
- `supabase/functions/send-founder-message/index.ts` — notificar destinatário após envio
- `supabase/functions/send-notification/index.ts` — adicionar novos types permitidos
- `src/pages/FounderOpportunities.tsx` — notificar ao responder oportunidade
- `src/pages/FounderFeed.tsx` — passar myName para FounderPostCard
- `src/components/FounderNotifications.tsx` — adicionar ícones/rotas para novos types
- `src/pages/FounderNotificationsPage.tsx` — adicionar ícones/rotas para novos types

