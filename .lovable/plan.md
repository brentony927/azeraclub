

## Plano: Atualizar Logos da AZERA CLUB

### O que fazer
Substituir os ficheiros de logo existentes pelas novas versões carregadas:

1. **Copiar as novas logos para `src/assets/`**:
   - `LOGO_PRINCIPAL.jpeg` (logo preta, fundo branco) → `src/assets/azera-logo-black.png` — usada no tema claro
   - `LOGO_PRETA.png` (logo branca, fundo preto) → `src/assets/azera-logo-white.png` — usada no tema escuro

2. **Copiar para `public/og-image.png`** a versão principal para pré-visualização social.

Nenhuma alteração de código é necessária — o hook `useAzeraLogo.ts` já seleciona `logoBlack` para tema claro e `logoWhite` para tema escuro, que é exactamente a lógica pedida.

### Arquivos a substituir
- `src/assets/azera-logo-black.png` ← `LOGO_PRINCIPAL.jpeg`
- `src/assets/azera-logo-white.png` ← `LOGO_PRETA.png`
- `public/og-image.png` ← `LOGO_PRINCIPAL.jpeg`

