

## Plano: Chat com Ações (Excluir/Bloquear) + Página "Como Usar"

### Parte 1: Ações no Chat de Founders

**Problema**: O chat não tem opções de excluir conversas, bloquear ou denunciar usuários.

#### 1.1 Criar tabela `user_blocks` (migração)
```sql
CREATE TABLE public.user_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL,
  blocked_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
-- Users manage own blocks
CREATE POLICY "Users manage own blocks" ON public.user_blocks FOR ALL TO authenticated
  USING (blocker_id = auth.uid()) WITH CHECK (blocker_id = auth.uid());
```

#### 1.2 Adicionar DELETE policy em `founder_messages`
Permitir que participantes apaguem mensagens da sua conversa (apenas as suas próprias mensagens enviadas):
```sql
CREATE POLICY "Users can delete own sent messages" ON public.founder_messages
  FOR DELETE TO authenticated USING (from_user_id = auth.uid());
```

#### 1.3 Atualizar `FounderChat.tsx` — Header com menu de ações
- Adicionar `DropdownMenu` no header do chat com 3 opções:
  - **Apagar Conversa**: Deleta todas as mensagens enviadas pelo usuário nessa conversa (client-side remove todas, server deleta as do user)
  - **Bloquear Usuário**: Insere na tabela `user_blocks` e remove a conversa da lista
  - **Denunciar**: Abre o `ReportUserDialog` existente
- Callback `onBlock` e `onDeleteConversation` passados via props para `FounderMessages` atualizar a lista

#### 1.4 Atualizar `FounderMessages.tsx` — Context menu na lista de conversas
- Long-press / right-click em cada conversa mostra opções rápidas de excluir/bloquear
- Ao bloquear, filtra conversas de usuários bloqueados (busca `user_blocks` no fetch inicial)
- Ao excluir, remove da lista e deleta mensagens

#### 1.5 Atualizar `send-founder-message` Edge Function
- Verificar se o destinatário bloqueou o remetente antes de enviar (query `user_blocks`)

---

### Parte 2: Página "Como Usar" com Guia Visual

#### 2.1 Criar página `src/pages/HowToUse.tsx`
Página com seções explicativas de cada área do site, usando:
- Cards com ícone + título + descrição para cada funcionalidade
- Screenshots/ilustrações usando componentes estilizados (mockups visuais em CSS/HTML, não prints reais)
- Setas visuais com CSS (`→`, borders, pseudo-elements)
- Seções: Dashboard, IA, Agenda, Founder Alignment (mensagens, oportunidades, ventures), Ferramentas PRO, Business

Cada seção terá:
- Título com ícone
- Descrição curta
- "Mini-preview" estilizado mostrando a interface com anotações

#### 2.2 Adicionar rota `/como-usar` em `App.tsx`

#### 2.3 Adicionar item na sidebar (`AppSidebar.tsx`)
- Novo item no `mainItems`: `{ title: "Como Usar", url: "/como-usar", icon: HelpCircle }`

---

### Arquivos a criar/editar

| Arquivo | Ação |
|---|---|
| Migração SQL | Criar tabela `user_blocks` + DELETE policy em `founder_messages` |
| `src/components/FounderChat.tsx` | Adicionar dropdown menu com ações |
| `src/pages/FounderMessages.tsx` | Filtrar bloqueados, callbacks de delete/block |
| `supabase/functions/send-founder-message/index.ts` | Verificar bloqueios |
| `src/pages/HowToUse.tsx` | Criar página guia visual |
| `src/App.tsx` | Adicionar rota `/como-usar` |
| `src/components/AppSidebar.tsx` | Adicionar "Como Usar" no menu |

