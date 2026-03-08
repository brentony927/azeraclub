

## Corrigir Sidebar Clara no Tema Escuro

### Problema
Os seletores CSS `.dark.pro-theme` e `.dark.business-theme` exigem ambas as classes no **mesmo elemento**. Porém:
- `.dark` é aplicado no `<html>` pelo next-themes
- `.pro-theme`/`.business-theme` é aplicado num `<div>` descendente no Layout.tsx

Resultado: as variáveis de dark mode para PRO/BUSINESS nunca são aplicadas — o sidebar (e tudo mais) usa as variáveis de light mode do PRO/BUSINESS mesmo no tema escuro.

### Solução
Alterar os seletores CSS de `.dark.pro-theme` para `.dark .pro-theme` (com espaço — descendente) em `src/index.css`. Isso faz com que as variáveis sejam aplicadas quando `.pro-theme` é filho de `.dark`.

### Arquivo: `src/index.css`
- Linha 313: `.dark.pro-theme` → `.dark .pro-theme`
- Linha 365: `.dark.business-theme` → `.dark .business-theme`

Apenas 2 seletores CSS precisam ser alterados.

