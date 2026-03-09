## Plano: Botão de Excluir Perfil na Página de Perfil

### Objetivo

Adicionar um botão de exclusão de conta na página de perfil (`/profile`) com confirmação de segurança via AlertDialog.

### Implementação

#### 1. Componentes Necessários

- Usar `AlertDialog` existente para confirmação
- Botão vermelho (destructive) no final da página de perfil

#### 2. Fluxo de Exclusão

1. Usuário clica em "Excluir Perfil"
2. Modal de confirmação aparece com aviso sobre a ação irreversível
3. Usuário deve digitar "EXCLUIR" para confirmar
4. Sistema exclui dados do usuário (profiles, founder_profiles) e faz logout

#### 3. Alterações no Profile.tsx

- Adicionar imports: `AlertDialog` components, `Trash2` icon
- Adicionar estados: `deleteConfirmOpen`, `deleteConfirmText`, `deleting`
- Adicionar função `handleDeleteAccount()` que:
  - Valida confirmação de texto
  - Exclui `founder_profiles` (se existir)
  - Exclui `profiles`
  - Faz signOut
  - Redireciona para `/login`
- Adicionar seção "Zona de Perigo" com o botão e AlertDialog

#### 4. Layout

```text
┌────────────────────────────────────────┐
│ [SALVAR ALTERAÇÕES]                    │
├────────────────────────────────────────┤
│ ⚠️ Zona de Perigo                      │
│ ┌────────────────────────────────────┐ │
│ │ 🗑️ Excluir Perfil                 │ │
│ │ Esta ação é permanente...          │ │
│ │              [Excluir Perfil] 🔴   │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### Detalhes Técnicos

- RLS já permite que usuários deletem seu próprio `founder_profiles`
- RLS de `profiles` não permite DELETE — será necessário criar uma Edge Function ou adicionar política
- A exclusão via Supabase Auth (`supabase.auth.admin.deleteUser`) requer service_role, então criaremos uma Edge Function `delete-account`

### Arquivos a Modificar

1. **src/pages/Profile.tsx** — Adicionar UI do botão e AlertDialog
2. **supabase/functions/delete-account/index.ts** — Nova função para exclusão segura
3. **supabase/config.toml** — Configurar a função