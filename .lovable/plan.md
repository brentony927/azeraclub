

# Redesign da Página de Planos — Premium & Profissional

## Visão Geral

Redesenhar a página de pricing para transmitir confiança, profissionalismo e fluidez, com melhorias visuais significativas nos cards, layout, tipografia e elementos de confiança.

## Alterações

### 1. `src/components/ui/pricing-section.tsx` — Redesign completo

**Header melhorado:**
- Adicionar subtítulo com ícone de escudo (ShieldCheck) + "Pagamento seguro via Stripe"
- Badge de "Economize 17%" ao selecionar plano anual
- Tipografia mais impactante no título

**Cards redesenhados:**
- Card Pro com `scale-[1.03]` e `md:scale-105` para destaque visual (card central maior)
- Separador visual entre preço e features
- Ícones por categoria de feature (agrupar features com mini-headers)
- Hover com `translate-y` suave nos cards
- Remover emojis (🛡️) das features — usar ícone Check consistente
- Adicionar divisor sutil entre o botão e a lista de features

**Seção de confiança (trust bar):**
- Adicionar barra abaixo dos cards: "256-bit SSL · Cancele a qualquer momento · Sem taxas ocultas"
- Ícones: Lock, RefreshCw, Eye

**Yearly savings badge:**
- Quando anual selecionado, mostrar badge verde "Economize £X" em cada card pago

### 2. `src/pages/Pricing.tsx` — Polish do layout

- Adicionar padding superior mais generoso
- Garantia de devolução (texto sutil abaixo dos cards)
- FAQ compacto (2-3 perguntas) abaixo da trust bar: "Posso cancelar?", "Como funciona o upgrade?", "Meus dados são seguros?"

### 3. `src/index.css` — Novos estilos

- `.pricing-card-hover` com transform translateY(-4px) no hover
- `.trust-bar` estilo sutil com ícones e separadores

## Ficheiros

| Ficheiro | Ação |
|---|---|
| `src/components/ui/pricing-section.tsx` | Redesign visual completo |
| `src/pages/Pricing.tsx` | Trust bar + FAQ compacto + layout polish |
| `src/index.css` | Novos estilos de hover e trust bar |

