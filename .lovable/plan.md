

## Plano: HIBP + Shimmer "AZERA CLUB" por Plano

### 1. Ativar Password HIBP Check
Habilitar a proteção contra senhas vazadas (HaveIBeenPwned) na configuração de autenticação.

### 2. Corrigir cores do texto "AZERA CLUB" na sidebar

**Problema atual**: O texto base `.azera-brand-text` usa gradiente verde para todos os planos (incluindo free/basic). O PRO e BUSINESS já têm overrides corretos.

**Correção em `src/index.css`**:
- Alterar `.azera-brand-text` (base) para gradiente preto/branco/cinza (monocromático) com shimmer
- Alterar `.dark .azera-brand-text` para gradiente branco/cinza claro com shimmer
- Manter `.pro-theme .azera-brand-text` como está (verde)
- Manter `.business-theme .azera-brand-text` como está (dourado)

**Resultado visual**:
- Free/Basic: Shimmer preto e branco
- Pro: Shimmer verde
- Business: Shimmer dourado

### Arquivos a editar
- `src/index.css` (linhas 1282-1310 — base e dark)
- Configuração de auth (HIBP)

