

# Acesso Completo no Mobile — Menu com Todas as Secções

## Problema
A barra inferior do mobile só tem 5 itens (Início, IA, Agenda, Rede, Perfil). A sidebar completa existe e já funciona como Sheet no mobile, mas o botão para abri-la está oculto (`hidden md:flex`).

## Solução
Substituir um dos itens da bottom nav por um botão "Menu" (ícone de hambúrguer) que abre a sidebar completa em Sheet. O utilizador terá acesso a todas as secções da plataforma.

### Alterações

**`src/components/MobileBottomNav.tsx`**
- Trocar o 5º item ("Perfil") por "Menu" com ícone `Menu` (hambúrguer)
- O botão "Menu" chama `setOpenMobile(true)` do `useSidebar()` para abrir a sidebar como Sheet
- Manter 5 itens: Início, IA, Agenda, Rede, Menu
- O perfil continua acessível pela sidebar

**`src/components/Layout.tsx`**
- Remover `hidden md:flex` do `SidebarTrigger` no header — torná-lo visível em todos os tamanhos (backup)
- Ou manter oculto já que o bottom nav agora abre a sidebar

| Ficheiro | Ação |
|---|---|
| `src/components/MobileBottomNav.tsx` | Substituir "Perfil" por "Menu" que abre sidebar |
| `src/components/Layout.tsx` | Nenhuma alteração necessária (sidebar Sheet já funciona) |

