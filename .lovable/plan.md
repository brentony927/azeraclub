

## Adicionar rota `/inicio` com a Landing Page dentro do layout protegido

### O que será feito
O usuário quer que a Landing Page (hero "Your Life. Organized...") esteja acessível em `/inicio` dentro da área autenticada, aparecendo como primeiro item na sidebar.

### Alterações

**1. `src/App.tsx`**
- Adicionar rota `/inicio` dentro do `<ProtectedLayout />` apontando para `<Landing />`

**2. `src/components/AppSidebar.tsx`**
- Alterar o primeiro item de `mainItems`: `{ title: "Início", url: "/inicio", icon: LayoutDashboard }`
- Manter `/dashboard` como rota separada (não muda)

**3. `src/components/HomeRoute.tsx`**
- Redirecionar usuários autenticados para `/inicio` em vez de `/dashboard`

**4. Outros arquivos com referência `/dashboard`**
- `Layout.tsx` (`showBack`): manter lógica de "voltar" para `/inicio`
- `Login.tsx`, `Signup.tsx`, `ResetPassword.tsx`: redirecionar pós-login para `/inicio`
- `Profile.tsx`, `AI.tsx`, `UpgradeCelebration.tsx`: atualizar navegação de "voltar" para `/inicio`

### Resultado
- `/inicio` mostra a Landing Page dentro do layout protegido (com sidebar)
- `/dashboard` continua existindo como a página Index
- Sidebar mostra "Início" apontando para `/inicio`

