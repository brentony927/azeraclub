

## Plano: Login/Signup/ForgotPassword em Preto e Branco

### Problema
As páginas públicas de autenticação (Login, Signup, ForgotPassword) ainda usam cores verdes (moss-gradient, moss-text, text-primary) em vez de um visual monocromático.

### Solução
Aplicar a mesma abordagem da Landing Page — usar a classe `landing-monochrome` como wrapper nas 3 páginas de auth, que já possui overrides CSS para `moss-text` e `moss-gradient` em preto/branco. Além disso, substituir referências diretas a `text-primary` por `text-foreground` ou neutros nessas páginas.

### Alterações

#### 1. `src/pages/Login.tsx`
- Adicionar `landing-monochrome` ao div raiz
- `moss-text` → já será neutralizado pelo CSS existente
- `moss-gradient` no botão → já neutralizado
- `text-primary/40` nos divisores ✦ → `text-muted-foreground/40`
- `text-primary` em links → `text-foreground`
- `hover:border-primary/20` → `hover:border-foreground/20`
- `focus:border-primary/40 focus:ring-primary/20` → `focus:border-foreground/40 focus:ring-foreground/20`
- `group-focus-within:text-primary` → `group-focus-within:text-foreground`
- `animate-glow-pulse` → remover (verde glow)

#### 2. `src/pages/Signup.tsx`
- Adicionar `landing-monochrome` ao div raiz
- `text-primary` em links → `text-foreground`
- `hover:text-primary` → `hover:text-foreground`
- `gold-gradient` no botão → substituir por classes monocromáticas (`bg-foreground text-background`)

#### 3. `src/pages/ForgotPassword.tsx`
- Adicionar `landing-monochrome` ao div raiz
- `gold-gradient` no botão → `bg-foreground text-background`
- `hover:text-primary` → `hover:text-foreground`

### Detalhes Técnicos
- A classe `.landing-monochrome` já existe em `src/index.css` e neutraliza `.moss-text` e `.moss-gradient` para tons cinza/preto
- Precisaremos adicionar um override CSS para `.landing-monochrome .gold-gradient` também (ainda não existe)
- Nenhuma mudança de backend necessária

