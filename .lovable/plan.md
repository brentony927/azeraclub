

# Atualização Completa: Páginas Legais do Azera Club

## Resumo

Atualizar todos os conteúdos legais com o texto fornecido e criar 2 novas páginas de disclaimer (`/risk-disclaimer` e `/ai-disclaimer`) para proteção jurídica adicional.

## Alterações

### 1. Reescrever `src/pages/TermsOfService.tsx`
Substituir todo o conteúdo pelos novos termos fornecidos (10 secções), incluindo também as secções de Programa de Afiliados, Política de Reembolso e Isenção de Responsabilidade integradas no mesmo documento. Data: 2025.

### 2. Reescrever `src/pages/PrivacyPolicy.tsx`
Substituir pelo novo texto de Política de Privacidade (5 secções: Informações Coletadas, Uso, Pagamentos/Stripe, Compartilhamento, Segurança).

### 3. Reescrever `src/pages/CommunityGuidelines.tsx`
Substituir pelo texto simplificado das Diretrizes da Comunidade.

### 4. Criar `src/pages/RiskDisclaimer.tsx` (nova)
Página de aviso de risco cobrindo: networking, oportunidades, investimentos, decisões financeiras, conteúdo de terceiros.

### 5. Criar `src/pages/AIDisclaimer.tsx` (nova)
Página de disclaimer de IA cobrindo: natureza informativa da IA, não substituição de aconselhamento profissional, limitações, responsabilidade do utilizador.

### 6. Atualizar `src/App.tsx`
Adicionar rotas `/risk-disclaimer` e `/ai-disclaimer` nas rotas públicas, com lazy imports.

### 7. Atualizar `src/components/Footer.tsx`
Adicionar links "Risco" (`/risk-disclaimer`) e "IA" (`/ai-disclaimer`) ao array `legalLinks`.

### 8. Atualizar aviso no rodapé do Footer
Adicionar a frase legal: "Azera Club é uma plataforma digital destinada a networking entre empreendedores e não participa ou garante quaisquer acordos realizados entre usuários fora da plataforma."

### 9. Atualizar `src/pages/Landing.tsx`
Adicionar links para as novas páginas no footer da landing page.

## Ficheiros

| Ficheiro | Ação |
|---|---|
| `src/pages/TermsOfService.tsx` | Reescrever |
| `src/pages/PrivacyPolicy.tsx` | Reescrever |
| `src/pages/CommunityGuidelines.tsx` | Reescrever |
| `src/pages/RiskDisclaimer.tsx` | Criar |
| `src/pages/AIDisclaimer.tsx` | Criar |
| `src/App.tsx` | Editar (rotas + imports) |
| `src/components/Footer.tsx` | Editar (links + aviso legal) |
| `src/pages/Landing.tsx` | Editar (links no footer) |

