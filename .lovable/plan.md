

## Correções do Sistema de Networking — Founder Alignment

Analisei todo o fluxo: buscar usuários, conectar, aceitar conexões, conversar. Encontrei 3 problemas principais:

### Problemas encontrados

1. **Não existe fluxo para ACEITAR conexões** — O usuário A envia pedido de conexão para B, mas B não tem como aceitar ou recusar. O status fica "pending" para sempre. Este é o maior problema.

2. **Bug de navegação nas notificações** — Quando alguém visualiza seu perfil, a notificação navega para `/founder-profile/${related_user_id}`, mas `related_user_id` é o `user_id` e a rota espera o `id` da tabela `founder_profiles`. Resultado: "Perfil não encontrado".

3. **Notificação de conexão não leva ao lugar certo** — Clicar numa notificação de conexão vai para `/founder-feed` em vez de mostrar opções de aceitar/recusar.

### Plano de correção

| Acao | Arquivo | O que |
|------|---------|-------|
| Edit | `src/components/FounderNotifications.tsx` | Adicionar botoes Aceitar/Recusar inline nas notificacoes de tipo "connection". Corrigir navegacao de profile_view para buscar o `id` correto do founder_profile |
| Edit | `src/pages/FounderNotificationsPage.tsx` | Mesmas correcoes: aceitar/recusar conexoes + fix navegacao profile_view |
| Edit | `src/pages/FounderProfile.tsx` | Adicionar botao "Aceitar Conexao" quando `connectionStatus === "pending"` e o pedido veio do outro usuario (ou seja, o usuario atual eh o `to_user_id`) |

### Detalhes da correção de aceitação

Nas notificações de tipo `connection`:
- Mostrar botões "Aceitar" e "Recusar" diretamente na notificação
- Aceitar: `UPDATE founder_connections SET status = 'accepted' WHERE from_user_id = related_user_id AND to_user_id = auth.uid()`
- Recusar: `DELETE FROM founder_connections WHERE from_user_id = related_user_id AND to_user_id = auth.uid()`
- Enviar notificação de volta ao remetente informando que foi aceito

### Correção de navegação profile_view

Quando `related_user_id` está presente, buscar o `id` do `founder_profiles` via `user_id` antes de navegar:
```typescript
const { data } = await supabase.from("founder_profiles").select("id").eq("user_id", n.related_user_id).maybeSingle();
if (data) navigate(`/founder-profile/${data.id}`);
```

### Correção no FounderProfile

No perfil do outro usuário, se existe uma conexão pending onde o visitante é o `to_user_id`, mostrar botão "Aceitar Conexão" ao lado de "Pendente" em vez de desabilitar completamente.

