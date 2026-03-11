

# Estado do Site — Diagnóstico

## O que está OK

- **Triggers de segurança ativos**: 4 triggers na tabela `founder_profiles` — `is_site_owner` e `is_verified` estão protegidos contra manipulação (INSERT e UPDATE bloqueados)
- **Autenticação e sessões**: funcionando normalmente
- **Subscrições**: a verificação de plano responde corretamente
- **RLS geral**: políticas ativas em todas as tabelas principais

## Problemas Encontrados

### 1. Vulnerabilidade: Membros rejeitados podem se re-aceitar em Ventures (REAL)
Um utilizador cujo convite para uma Venture foi **rejeitado** pode executar um UPDATE no próprio registro e mudar o status para `accepted`, ganhando acesso a notas, tarefas e chat da Venture.

**Correção**: Migração SQL para adicionar um trigger que impede a transição `rejected → accepted` por self-update.

```sql
CREATE OR REPLACE FUNCTION public.validate_venture_member_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  -- Only venture owner can change status from rejected
  IF OLD.status = 'rejected' AND NEW.status != 'rejected' THEN
    IF NOT is_venture_owner(auth.uid(), OLD.venture_id) THEN
      RAISE EXCEPTION 'Cannot change status from rejected';
    END IF;
  END IF;
  -- Only venture owner or self can accept (self only from pending)
  IF NEW.status = 'accepted' AND OLD.status != 'pending' THEN
    IF NOT is_venture_owner(auth.uid(), OLD.venture_id) THEN
      RAISE EXCEPTION 'Only venture owner can accept from this state';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_venture_member_status
  BEFORE UPDATE ON public.venture_members
  FOR EACH ROW EXECUTE FUNCTION public.validate_venture_member_status();
```

### 2. Acessibilidade: DialogContent sem DialogTitle (MENOR)
Vários dialogs no site não têm `DialogTitle`, gerando warnings no console. Não é um bug funcional mas afeta acessibilidade para leitores de tela.

**Correção**: Localizar os dialogs sem título e adicionar `<DialogTitle>` com `<VisuallyHidden>` wrapper onde o título não deve ser visível.

### Resumo

| Item | Estado | Prioridade |
|---|---|---|
| Triggers `is_site_owner` | OK | - |
| Triggers `is_verified` | OK | - |
| Auth/Sessões | OK | - |
| Subscrições | OK | - |
| Venture member status bypass | Vulnerável | Alta |
| Dialog acessibilidade | Warning | Baixa |

### Plano de Implementação

| Ficheiro | Ação |
|---|---|
| SQL Migration | Trigger para validar transições de status em `venture_members` |
| Componentes com Dialog | Adicionar `DialogTitle` onde falta (identificar quais) |

