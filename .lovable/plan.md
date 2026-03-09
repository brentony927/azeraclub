

## Revisão de Segurança da Aplicação

A varredura de segurança identificou **2 vulnerabilidades críticas** e **3 avisos** que precisam ser corrigidos antes do lançamento.

---

### CRÍTICO 1: Usuários podem manipular suas próprias pontuações de reputação

**Problema**: A tabela `founder_scores` tem uma policy ALL que permite INSERT e UPDATE por qualquer usuário autenticado na sua própria linha. Um usuário mal-intencionado pode atribuir `total_score = 99999` via console do navegador.

**Correção**:
- Remover a policy "Users manage own score" (ALL)
- Criar policy apenas de SELECT para o próprio usuário
- Manter a policy "Anyone can view scores" (SELECT) existente
- As pontuações devem ser escritas APENAS pela Edge Function `calculate-founder-score` (que já usa service role)

### CRÍTICO 2: Qualquer usuário pode escrever notas em qualquer venture

**Problema**: A policy de `venture_notes` permite INSERT com `WITH CHECK (user_id = auth.uid())` mas não verifica se o usuário é membro/dono da venture.

**Correção**:
- Alterar a policy para adicionar verificação de membership, similar ao padrão usado em `venture_tasks` e `venture_chat`

### AVISO 1: Membros pendentes/rejeitados de ventures têm acesso total

**Problema**: As policies de `venture_tasks` e `venture_chat` verificam presença em `venture_members` mas não filtram por `status = 'accepted'`.

**Correção**:
- Adicionar `AND venture_members.status = 'accepted'` em todas as subqueries de membership nas policies de `venture_tasks` e `venture_chat`

### AVISO 2: Coordenadas GPS precisas expostas

**Problema**: `founder_profiles` expõe `latitude` e `longitude` com precisão submétrica para todos os usuários autenticados.

**Correção**:
- Criar uma view que arredonda coordenadas para 2 casas decimais (~1km de precisão)
- Ou criar uma database function que retorna coordenadas arredondadas e ajustar o código frontend

### AVISO 3: Proteção contra senhas vazadas desabilitada

**Problema**: A proteção contra senhas comprometidas (HaveIBeenPwned) está desativada.

**Correção**:
- Habilitar via configuração de autenticação

---

### Implementação

**Migração SQL** com as seguintes alterações:

1. Drop policy "Users manage own score" em `founder_scores`
2. Criar policy SELECT-only para o próprio usuário em `founder_scores`
3. Recriar policy de `venture_notes` com verificação de membership
4. Atualizar 5 policies de `venture_tasks` e `venture_chat` para filtrar `status = 'accepted'`
5. Criar function `public.round_coordinates()` para arredondar lat/lng
6. Habilitar leaked password protection via `configure_auth`

**Arquivos a editar**: Nenhum arquivo de código precisa mudar -- todas as correções são no banco de dados e configuração de auth.

