

## Plano: Corrigir Problemas Identificados

### Problema Principal: Recursão Infinita nas Policies de `ventures`

A tabela `ventures` tem policies SELECT que referenciam `venture_members`, e `venture_members` tem policies SELECT que referenciam `ventures`. Isto cria um loop infinito.

**Erro:** `"infinite recursion detected in policy for relation "ventures""`

**Causa:** Existem 6 policies sobrepostas na tabela `ventures`:
1. `Users manage own ventures` (ALL) — referencia `venture_members`
2. `Owners and members can view ventures` (SELECT) — referencia `venture_members`
3. `venture_select` (SELECT) — referencia `venture_members`
4. `venture_insert` (INSERT)
5. `venture_update` (UPDATE) — referencia `venture_members`
6. `venture_delete` (DELETE)

E `venture_members` tem policies que referenciam `ventures` de volta.

### Solução

1. **Migração SQL** para:
   - Criar uma função `SECURITY DEFINER` `is_venture_member(user_id, venture_id)` que consulta `venture_members` sem passar por RLS
   - Criar uma função `SECURITY DEFINER` `is_venture_owner(user_id, venture_id)` que consulta `ventures` sem passar por RLS
   - Remover TODAS as 6 policies existentes da tabela `ventures`
   - Remover as policies problemáticas de `venture_members`
   - Recriar policies simples usando as funções SECURITY DEFINER (quebrando o ciclo)

### Ficheiros a editar
- Nova migração SQL (corrigir RLS recursivo)

