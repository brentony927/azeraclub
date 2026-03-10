

## Plano: Auditoria de Segurança e Correção de Bugs

### Problemas Encontrados

---

### SEGURANÇA (Críticos)

#### 1. Venture ownership hijack — Membros podem roubar ventures
A política UPDATE da tabela `ventures` permite que membros aceitos alterem o `user_id`, transferindo a propriedade para si mesmos. O scan de segurança confirmou: "Accepted venture members can steal venture ownership".

**Correção:** Separar a política ALL em políticas por comando. Na UPDATE, impedir alteração do `user_id` por não-proprietários.

#### 2. Coordenadas GPS precisas expostas a todos os usuários autenticados
A tabela `founder_profiles` expõe `latitude` e `longitude` exatas via SELECT para qualquer usuário autenticado com `is_published = true`. Já existe a função `get_rounded_coordinates()` mas não é usada — os dados brutos são acessíveis diretamente.

**Correção:** Criar uma view ou política que restrinja acesso às colunas de coordenadas precisas. Como RLS não opera no nível de coluna, a solução é: (1) mover lat/lng para uma tabela separada `founder_locations` com RLS restritivo (só o dono vê os dados precisos), e (2) expor apenas coordenadas arredondadas via a função existente.

#### 3. Venture members podem restaurar próprio status após remoção
A política UPDATE de `venture_members` permite que um membro altere seu status de volta para "accepted" mesmo após ser removido pelo dono.

**Correção:** Restringir a branch de self-update para permitir transição apenas de "pending" para "accepted"/"rejected".

#### 4. Leaked Password Protection desabilitada
O scan indica que a proteção contra senhas vazadas (HaveIBeenPwned) está desativada.

**Correção:** Ativar via `cloud--configure_auth` ou equivalente.

#### 5. handleDeleteConversation — Bug de SQL que deleta mensagens erradas
Em `FounderChat.tsx` linha 158-162:
```typescript
.delete()
.eq("from_user_id", user.id)
.or(`to_user_id.eq.${otherUserId}`)
```
O `.or()` após `.eq()` cria a condição: `from_user_id = user.id OR to_user_id = otherUserId`. Isso deleta TODAS as mensagens de qualquer pessoa enviadas para `otherUserId`, não apenas as do usuário atual nessa conversa.

**Correção:** Mudar para `.eq("from_user_id", user.id).eq("to_user_id", otherUserId)`.

---

### BUGS FUNCIONAIS

#### 6. Contagem de likes/comments não sincroniza com estado local
Em `FounderPostCard.tsx`, quando o componente recebe novas props (`likesCount`, `commentsCount`), o estado local (`likes`, `localCommentsCount`) inicializado em `useState` NÃO atualiza porque `useState` só usa o valor inicial. Ao fazer refresh (onRefresh), o `FounderFeed` busca dados novos mas o card mantém o estado antigo.

**Correção:** Adicionar `useEffect` para sincronizar props → estado local quando os valores mudam.

#### 7. ReportUserDialog — implementação de trigger duplicada e incorreta
Em `FounderChat.tsx` linhas 277-288, há duas instâncias de `ReportUserDialog`, uma com trigger oculta e outra que tenta click programático via ref. Isso é frágil e pode não funcionar.

**Correção:** Usar uma única instância com controle de estado `open/onOpenChange`.

#### 8. Group messages — sem validação de conteúdo no frontend
Em `GroupChat.tsx`, mensagens são enviadas sem limite de tamanho nem sanitização. Alguém pode enviar mensagens enormes.

**Correção:** Adicionar `maxLength` ao input e truncar no submit.

#### 9. CreateFounderPost — previews de URL não são liberadas (memory leak)
`URL.createObjectURL` é chamado mas `URL.revokeObjectURL` nunca é chamado ao remover arquivos ou ao desmontar o componente.

**Correção:** Adicionar `revokeObjectURL` no `removeFile` e cleanup no unmount.

---

### Arquivos a editar

**Migração SQL** (1 migration com 3 fixes):
- Fix ventures UPDATE policy (ownership hijack)
- Fix venture_members UPDATE policy (self-restore)
- Criar tabela `founder_locations` e migrar lat/lng

**Componentes:**
- `src/components/FounderChat.tsx` — fix delete query + fix ReportDialog
- `src/components/FounderPostCard.tsx` — sync state from props
- `src/components/GroupChat.tsx` — input maxLength
- `src/components/CreateFounderPost.tsx` — revokeObjectURL cleanup

**Auth config:**
- Ativar leaked password protection

