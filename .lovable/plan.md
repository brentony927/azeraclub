

## Plano: Botão de Excluir Oportunidade Própria

### Alteração

**`src/pages/FounderOpportunities.tsx`**

- Importar `AlertDialog` components e `Trash2` icon
- No card de cada oportunidade, se `opp.user_id === user?.id`, mostrar um botão de lixeira (Trash2)
- Ao clicar, abrir um `AlertDialog` de confirmação ("Tem certeza que deseja excluir?")
- Ao confirmar, executar `supabase.from("founder_opportunities").delete().eq("id", opp.id)` e remover do estado local
- Toast de sucesso/erro

RLS já permite DELETE para o próprio usuário (`user_id = auth.uid()`), então não precisa de migration.

