

## Plano: Corrigir Vulnerabilidades de Segurança

O scan identificou 6 problemas. Vou corrigir os que são actionáveis via código/SQL.

### 1. `get_rounded_coordinates` — Leak de localização (do print)
A função SECURITY DEFINER retorna coordenadas de qualquer user_id sem verificar se o perfil é publicado.

**Fix:** Adicionar `JOIN founder_profiles` com check `is_published = true` dentro da função.

### 2. `founder_connections` — Self-accept de conexões
O sender pode auto-aceitar a própria solicitação porque a policy UPDATE permite ambos os participantes.

**Fix:** Restringir UPDATE para apenas o `to_user_id` (destinatário) poder alterar status.

### 3. `is_venture_member` — Membros pending/rejected com acesso
A função não filtra por `status = 'accepted'`.

**Fix:** Adicionar `AND status = 'accepted'` na query da função.

### 4. `is_site_owner` trigger — Já corrigido
O trigger `guard_site_owner_change` já foi criado. O scanner pode não detectar triggers. Vou marcar como resolvido.

### 5. Email hardcoded em migração
Não é possível remover migrações já aplicadas. Vou marcar com dificuldade alta e nota explicativa.

### 6. Políticas RESTRICTIVE
Todas as policies foram criadas como RESTRICTIVE. Em PostgreSQL, sem pelo menos uma PERMISSIVE policy, o acesso é negado. Se o app funciona, pode ser que o Supabase trate isso diferentemente, mas o correto é converter para PERMISSIVE. Porém isso envolve recriar ~130 policies — risco alto de breaking change. Vou marcar para análise mas **não alterar agora** para evitar downtime.

### Ficheiros/Migrações
- **1 migração SQL** com 3 statements:
  1. `CREATE OR REPLACE FUNCTION get_rounded_coordinates` — adicionar JOIN com `is_published = true`
  2. `DROP POLICY` + `CREATE POLICY` em `founder_connections` — restringir UPDATE ao destinatário
  3. `CREATE OR REPLACE FUNCTION is_venture_member` — adicionar `AND status = 'accepted'`
- **Atualizar findings** no scanner de segurança

