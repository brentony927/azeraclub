

## Plano: Nomes nas Notificações + Badge de Conversas na Sidebar

### 3 Mudanças

#### 1. Profile view → Mostrar nome/username em vez de "Alguém"
Em `src/pages/FounderProfile.tsx` linha 107, o `sendNotification` envia `"Alguém visualizou seu perfil"`. O `myProfile` já está carregado na linha 115 com todos os campos. Mudar para:
```
title: `${myProfile?.name || myProfile?.username || "Alguém"} visualizou seu perfil 👀`
```

#### 2. Conexão → Já usa nome mas com fallback "Alguém" — manter consistente
- `FounderProfile.tsx` linha 169: já usa `myProfile?.name || "Alguém"` — adicionar username como fallback
- `FounderFeed.tsx` linha 251: mesma coisa
- `GlobalFounderMap.tsx` linha 168: mesma coisa

#### 3. Remover notificações de mensagem do sino + Adicionar badge de não-lidas em "Conversas" na sidebar

**Sino (FounderNotifications.tsx + FounderNotificationsPage.tsx):**
- Filtrar notificações de type `"message"` da lista exibida (não mostrá-las no dropdown nem na página)

**Sidebar (AppSidebar.tsx):**
- Buscar contagem de mensagens não lidas de `founder_messages` onde `to_user_id = user.id` e `read = false`
- Escutar realtime para INSERT em `founder_messages`
- Mostrar badge numérico ao lado de "Conversas" (estilo WhatsApp — bolinha verde com número)

**FloatingNotification.tsx:**
- Também filtrar type `"message"` para não mostrar floating notifications de mensagens

### Ficheiros a editar
- `src/pages/FounderProfile.tsx` — username na notificação de profile_view e conexão
- `src/pages/FounderFeed.tsx` — username no fallback de conexão
- `src/pages/GlobalFounderMap.tsx` — username no fallback de conexão
- `src/components/AppSidebar.tsx` — badge de não-lidas no item "Conversas"
- `src/components/FounderNotifications.tsx` — filtrar type "message"
- `src/pages/FounderNotificationsPage.tsx` — filtrar type "message"
- `src/components/FloatingNotification.tsx` — filtrar type "message"

