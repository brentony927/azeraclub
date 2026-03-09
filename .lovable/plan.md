

## Plano: 4 Correções no Sistema de Founders + Mobile

### 1. Sidebar mobile fecha automaticamente ao navegar

**Problema**: No mobile, a sidebar (Sheet) permanece aberta após clicar num link.

**Solução**: No `AppSidebar.tsx`, usar `useSidebar().setOpenMobile(false)` ao clicar em qualquer `NavLink`. Criar um wrapper que chama `setOpenMobile(false)` no `onClick`.

### 2. Feed de Founders — diagnóstico e correção

**Diagnóstico**: Verifiquei o banco e só existe **1 perfil** publicado. A query do feed funciona corretamente (retorna esse perfil para outros usuários). O Realtime está ativado. O problema é que o **segundo perfil nunca foi inserido com sucesso** — provavelmente ocorreu um erro silencioso.

**Causa provável**: O `FounderMatch.tsx` não inclui o campo `username` no insert. Se houve qualquer erro, o toast pode não ter sido visível. Além disso, o formulário não tem campo de username, mas o perfil na rota usa username para navegação.

**Correções**:
- Adicionar campo `username` ao formulário de criação (`FounderProfileForm`) — obrigatório, gerado automaticamente a partir do nome
- Melhorar feedback de erro no insert com mensagens mais claras
- Adicionar log de debug no `fetchData` do feed para garantir visibilidade dos erros

### 3. Upload de fotos/vídeos nas Oportunidades

**Alterações**:
- **Migration SQL**: Adicionar colunas `media_urls text[]` e `media_type text` na tabela `founder_opportunities`
- **Storage**: Criar bucket `opportunity-media` (público)
- **`FounderOpportunities.tsx`**: Adicionar input de upload de imagens/vídeos no dialog de criação, upload para Storage, salvar URLs no banco
- Exibir as imagens/vídeos nos cards de oportunidade

### 4. Ordenar founders por completude + confiança

**Solução**: Criar função `calculateProfileScore(profile)` que pontua:
- Nome preenchido: +10
- Avatar: +15
- Building: +10
- Skills (1+): +10
- Industry (1+): +10
- Interests (3+): +10
- Looking_for (1+): +5
- País/Cidade: +10
- Continent: +5
- Commitment: +5
- is_verified: +10

**Ordenação no feed**: Primeiro por `profileScore` (desc), depois por `matchScore` (desc). Founders com perfis mais completos e verificados aparecem no topo.

### Arquivos alterados
- `src/components/AppSidebar.tsx` — auto-close mobile
- `src/components/FounderProfileForm.tsx` — adicionar campo username
- `src/pages/FounderMatch.tsx` — incluir username no insert
- `src/pages/FounderFeed.tsx` — ordenação por completude + confiança
- `src/pages/FounderOpportunities.tsx` — upload de mídia
- `src/lib/founderMatch.ts` — função `calculateProfileScore`
- Migration SQL — colunas media na tabela + bucket de storage

