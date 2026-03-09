

## Plano: Corrigir Feed de Founders

### Diagnóstico

Analisei o código e identifiquei os problemas:

1. **Sem atualização em tempo real** — O feed só carrega dados uma vez no mount (`useEffect` com `[user]`). Quando um novo founder publica o perfil, os outros usuários NÃO veem até recarregar a página manualmente.

2. **Erros silenciosos** — As queries não verificam `error` nos resultados. Se a query falhar, o feed simplesmente fica vazio sem feedback.

3. **Sem mecanismo de refresh** — Não há polling, realtime subscription, nem botão de "atualizar" para o usuário.

### Alterações

#### 1. `src/pages/FounderFeed.tsx` — Adicionar Realtime + Error Handling

- Adicionar subscription Realtime na tabela `founder_profiles` para detectar novos perfis publicados
- Adicionar tratamento de erros nas queries com toast de feedback
- Adicionar botão de "Atualizar" manual no header
- Refetch automático quando o componente ganha foco (via `visibilitychange`)

#### 2. `src/components/FounderActivityFeed.tsx` — Error Handling

- Adicionar tratamento de erros nas queries do activity feed

#### 3. Migration SQL — Habilitar Realtime na tabela

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.founder_profiles;
```

### Resultado Esperado
- Novos perfis aparecem automaticamente no feed de outros usuários (via Realtime)
- Erros são reportados ao usuário via toast
- Botão de refresh manual como fallback
- Auto-refresh quando o usuário volta à aba

