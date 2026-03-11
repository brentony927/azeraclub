

# Correção de Vulnerabilidade Crítica de Segurança

## Problema Encontrado

Os triggers `prevent_site_owner_change` e `force_site_owner_false_on_insert` **não estão ativos no banco de dados**, apesar de terem migrações criadas. Isto significa que **qualquer utilizador autenticado pode se autopromover a site owner** editando o próprio `founder_profiles` e definindo `is_site_owner = true`.

Com isso, ganha acesso a:
- **Moderar qualquer utilizador** (ban/mute/warn via `user_moderation`)
- **Ver todas as solicitações de afiliados** (dados pessoais + redes sociais)
- **Aprovar/rejeitar afiliados**

## Solução

Uma única migração SQL que:

1. **Recria e ativa os triggers** que bloqueiam alterações em `is_site_owner`:
   - `BEFORE INSERT`: força `is_site_owner = false` em novos perfis
   - `BEFORE UPDATE`: impede alteração de `is_site_owner` (com `DROP TRIGGER IF EXISTS` primeiro)

2. **Também protege `is_verified`** com o mesmo padrão — impedir que utilizadores se auto-verifiquem

### Migração SQL

```sql
-- Drop any stale triggers
DROP TRIGGER IF EXISTS prevent_site_owner_change ON public.founder_profiles;
DROP TRIGGER IF EXISTS force_site_owner_false_on_insert ON public.founder_profiles;
DROP TRIGGER IF EXISTS prevent_verified_change ON public.founder_profiles;

-- Recreate functions
CREATE OR REPLACE FUNCTION public.prevent_site_owner_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF NEW.is_site_owner IS DISTINCT FROM OLD.is_site_owner THEN
    RAISE EXCEPTION 'Cannot modify is_site_owner';
  END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    RAISE EXCEPTION 'Cannot modify is_verified';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.force_site_owner_false_on_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  NEW.is_site_owner := false;
  NEW.is_verified := false;
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER prevent_site_owner_change
  BEFORE UPDATE ON public.founder_profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_site_owner_change();

CREATE TRIGGER force_site_owner_false_on_insert
  BEFORE INSERT ON public.founder_profiles
  FOR EACH ROW EXECUTE FUNCTION public.force_site_owner_false_on_insert();
```

Nenhuma alteração de código necessária — apenas a migração SQL para ativar os triggers no banco.

| Item | Estado |
|---|---|
| Triggers `is_site_owner` (INSERT) | Inativo → **Corrigir** |
| Triggers `is_site_owner` (UPDATE) | Inativo → **Corrigir** |
| Proteção `is_verified` | Inexistente → **Adicionar** |
| RLS `user_moderation` | OK (usa `is_site_owner()`) |
| RLS `affiliate_requests` | OK (usa `is_site_owner()`) |
| RLS demais tabelas | OK |

