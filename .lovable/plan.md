

# Auditoria de Segurança Completa - Azera Club

## Problemas Encontrados

### 1. CRITICO: Journal.tsx usa anon key em vez do token do utilizador
Em `src/pages/Journal.tsx` (linha 59), a chamada à AI usa `VITE_SUPABASE_PUBLISHABLE_KEY` como Bearer token em vez do access token do utilizador autenticado. Isso significa:
- A edge function `azera-ai` vai rejeitar com 401 (getClaims falha com anon key)
- OU pior: se não rejeitar, qualquer pessoa não autenticada poderia chamar a função

**Correção:** Usar `supabase.auth.getSession()` para obter o token real, como feito em todos os outros componentes (AI.tsx, AzeraChatbot.tsx, etc.).

### 2. BAIXO: Email visivel na sidebar
Em `src/components/AppSidebar.tsx` (linha 422), o email do utilizador é exibido na sidebar. Isso é comportamento padrão e aceitavel (apenas o proprio utilizador ve), mas vale confirmar que nao aparece em areas publicas.

### 3. OK: Edge functions validam auth corretamente
- `azera-ai`: Usa `getClaims()` para validar token
- `check-subscription`: Usa `getUser()` com retry
- `create-checkout` e `customer-portal`: Validam auth header
- `cancel-subscription`: Valida auth header

### 4. OK: Nenhum secret exposto no frontend
- Apenas `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (publicas por design)
- Secrets privados (STRIPE_SECRET_KEY, LOVABLE_API_KEY, etc.) apenas em edge functions via `Deno.env.get()`

### 5. OK: RLS policies robustas
- Todas as tabelas com dados de utilizador tem RLS ativo com `user_id = auth.uid()`
- Nenhuma tabela com PII exposta publicamente
- `founder_profiles` corretamente filtra por `is_published = true` para SELECT publico

### 6. OK: Sem console.log no frontend (nenhum encontrado)

### 7. OK: Sem dangerouslySetInnerHTML com input do utilizador (apenas chart.tsx com CSS gerado internamente)

### 8. OK: localStorage/sessionStorage usados apenas para preferencias UI, nada sensivel

---

## Plano de Correção

| Ficheiro | Alteração |
|---|---|
| `src/pages/Journal.tsx` | Substituir `VITE_SUPABASE_PUBLISHABLE_KEY` pelo access token real do utilizador via `supabase.auth.getSession()` |

### Detalhe Tecnico

Em `src/pages/Journal.tsx`, a funcao `analyzeEntry` sera corrigida para:
1. Obter a sessao atual com `const { data: { session } } = await supabase.auth.getSession()`
2. Usar `session?.access_token` no header Authorization
3. Rejeitar se nao houver sessao ativa

Todas as outras paginas (AI.tsx, AzeraChatbot.tsx, ContentStrategy.tsx, etc.) ja usam o token correto - apenas Journal.tsx tem este bug.

