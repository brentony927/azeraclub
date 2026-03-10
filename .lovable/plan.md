

## Auditoria: Bugs, Lógica e Correções Pendentes

Após analisar o código atual, identifiquei os seguintes problemas:

### 1. Bug: GlobalFounderMap não usa nome personalizado na notificação de conexão
Em `GlobalFounderMap.tsx` linha 167, a notificação de conexão usa texto genérico `"Nova solicitação de conexão"` em vez do nome/username do remetente. As outras páginas (FounderProfile, FounderFeed) já foram corrigidas, mas esta ficou inconsistente.

### 2. Bug: Badge de não-lidas não reseta ao abrir Conversas
Quando o utilizador abre `/founder-messages` e lê as mensagens, o badge na sidebar só diminui se houver UPDATE realtime individual. Não há lógica para re-fetch da contagem ao navegar para a página de conversas, o que pode deixar o badge desatualizado.

### 3. Bug: Notificações Page não tem realtime
`FounderNotificationsPage.tsx` carrega notificações uma vez no mount mas **não tem subscription realtime** — novas notificações só aparecem ao recarregar a página. O dropdown (`FounderNotifications.tsx`) tem realtime, mas a página dedicada não.

### 4. Lógica: Posts "Minhas Publicações" depende de posts já carregados
A aba "Minhas Publicações" filtra do array `posts` que é carregado em `fetchPosts`. Se o utilizador tem muitos posts mas o fetch limita resultados (ex: últimos 50), posts antigos do próprio utilizador não aparecem na aba. Não há fetch separado para "meus posts".

### 5. Bug: Sidebar badge não aparece quando sidebar está colapsada
A condição `{!collapsed && <span>...title...</span>}` esconde o título quando colapsado, mas o badge de unread está dentro do mesmo fluxo. Quando a sidebar está colapsada (modo icon), o badge numérico pode ficar cortado ou invisível.

### 6. Lógica: `profile_view` notification não inclui `related_user_id`
Em `FounderProfile.tsx` linha 108, o `sendNotification` para `profile_view` não envia `related_user_id`. Isso impede que o receptor clique na notificação e navegue para o perfil de quem visitou.

---

### Plano de Correção

**Ficheiros a editar:**

1. **`src/pages/GlobalFounderMap.tsx`** — Usar nome/username do remetente no título da notificação de conexão (consistência)

2. **`src/pages/FounderProfile.tsx`** — Adicionar `related_user_id: user.id` no `sendNotification` de `profile_view`

3. **`src/pages/FounderNotificationsPage.tsx`** — Adicionar subscription realtime para novas notificações (mesmo padrão do dropdown)

4. **`src/components/AppSidebar.tsx`** — Re-fetch contagem de unread quando a rota muda para `/founder-messages`; garantir badge visível no modo colapsado

5. **`src/pages/FounderFeed.tsx`** — Sem mudança por agora (o limite de posts é aceitável para MVP, mas pode ser melhorado depois com paginação)

