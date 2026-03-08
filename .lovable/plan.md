

## Atualizar Logos do AZERA CLUB por Plano e Tema

### Lógica
| Plano | Tema Claro | Tema Escuro |
|-------|-----------|-------------|
| Free/Basic | Logo preta | Logo branca |
| Pro | Logo verde | Logo verde |
| Business | Logo dourada | Logo dourada |

### Mudanças

**1. Copiar as 4 logos para `src/assets/`**
- `image-13.png` → `src/assets/azera-logo-black.png`
- `image-14.png` → `src/assets/azera-logo-white.png`
- `image-16.png` → `src/assets/azera-logo-green.png`
- `image-15.png` → `src/assets/azera-logo-gold.png`

**2. Criar hook `src/hooks/useAzeraLogo.ts`**
- Importa as 4 logos
- Usa `useSubscription()` para ler o plano e `useTheme()` para ler o tema
- Retorna a logo correta baseada na lógica acima
- Reutilizável em todos os componentes

**3. Atualizar 8 arquivos que usam `azera-logo.jpg`**
Substituir `import azeraLogo from "@/assets/azera-logo.jpg"` pelo hook `useAzeraLogo`:
- `src/components/AppSidebar.tsx` — sidebar header
- `src/components/AzeraChatbot.tsx` — chatbot avatar
- `src/components/Footer.tsx` — footer logo
- `src/pages/Landing.tsx` — hero section
- `src/pages/Login.tsx` — login page
- `src/pages/Signup.tsx` — signup page
- `src/pages/ForgotPassword.tsx` — forgot password
- `src/pages/ResetPassword.tsx` — reset password

Nota: Nas páginas públicas (Landing, Login, Signup, ForgotPassword, ResetPassword) onde não há contexto de subscription, usar logo preta no claro e branca no escuro (comportamento padrão free/basic).

### Arquivos
| Arquivo | Ação |
|---------|------|
| `src/assets/azera-logo-*.png` | 4 novos ficheiros |
| `src/hooks/useAzeraLogo.ts` | Novo hook |
| 8 componentes/páginas | Substituir import estático pelo hook |

