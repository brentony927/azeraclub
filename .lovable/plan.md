
Objetivo: corrigir definitivamente o visual “claro” da área de abas/sidebar quando o app está em tema escuro.

Diagnóstico (baseado no código atual):
- O `ThemeProvider` aplica `.dark` no elemento raiz (`html`).
- O plano (`.pro-theme` / `.business-theme`) é aplicado em um `div` no `Layout`.
- Ainda existem muitos seletores em `src/index.css` no formato `.dark.pro-theme` e `.dark.business-theme` (sem espaço), que exigem ambas classes no mesmo elemento — isso não acontece.
- Como resultado, vários overrides de dark mode não entram; em especial, a sidebar fica com fundo claro por causa de regras com `!important` da versão light.

Plano de implementação:
1) Normalizar TODOS os seletores quebrados de tema escuro em `src/index.css`
- Substituir globalmente:
  - `.dark.pro-theme` → `.dark .pro-theme`
  - `.dark.business-theme` → `.dark .business-theme`
- Isso inclui blocos de: animated background, glass-card, header, scrollbar, bordas e fundo da sidebar.

2) Blindar a sidebar para não voltar a quebrar
- Trocar regras hardcoded de fundo claro da sidebar para variáveis de tema:
  - usar `hsl(var(--sidebar-background))` e `hsl(var(--sidebar-border))` nos blocos de sidebar PRO/BUSINESS.
- Assim, o claro/escuro passa a depender dos tokens já definidos no tema, reduzindo regressões por seletor.

3) Verificação técnica final no CSS
- Fazer busca no projeto para garantir que não restou nenhuma ocorrência de:
  - `.dark.pro-theme`
  - `.dark.business-theme`
- Confirmar que os blocos de dark da sidebar estão em formato descendente e com precedência correta.

Validação visual (fim-a-fim):
- Testar no preview em `/dashboard`:
  - PRO + dark: sidebar e “abas” com fundo/contraste escuros corretos.
  - PRO + light: manter aparência clara esperada.
  - BUSINESS + dark/light: mesmo comportamento correto.
- Validar estados: item ativo, hover, grupos colapsáveis, header e footer da sidebar.

Detalhes técnicos (objetivo “de uma vez por todas”):
- Causa raiz não é componente React, é especificidade/estrutura dos seletores CSS.
- A correção principal é estrutural (descendente + tokens), não apenas pontual em 1-2 linhas.
- Isso resolve o bug atual e evita repetição quando novos blocos premium forem adicionados.
