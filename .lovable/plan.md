

## Plano: Botão "Enviar Mensagem" nas Oportunidades

### Problema
Os cards de oportunidades não têm como o usuário entrar em contato com quem publicou. Não há botão de mensagem nem informação do autor.

### Correção em `src/pages/FounderOpportunities.tsx`

1. **Buscar nomes dos autores**: Após carregar as oportunidades, buscar os `founder_profiles` (name, username) dos `user_id`s únicos para exibir o nome do autor.

2. **Exibir nome do autor** em cada card (ex: "Publicado por João").

3. **Adicionar botão "Mensagem"** (ícone `MessageCircle`) em cada card de oportunidade que **não** seja do próprio usuário. Ao clicar, navega para `/founder-messages` passando `state: { selectedUser: opp.user_id, selectedUserName: authorName }` — reaproveitando o sistema de chat existente (`FounderMessages` + `FounderChat`).

4. O botão só aparece para usuários logados e **não** aparece no próprio post do usuário (onde já aparece o botão de excluir).

### Arquivos a editar
- `src/pages/FounderOpportunities.tsx` — adicionar fetch de profiles, nome do autor, e botão de mensagem com `useNavigate`

