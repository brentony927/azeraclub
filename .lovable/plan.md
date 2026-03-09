

## Plano: Otimização de Performance do Site

### Problemas Identificados

Performance atual medida:
- **First Contentful Paint: 7000ms** (deveria ser < 1800ms)
- **108 scripts carregados**, **3121 DOM nodes**, **405 event listeners**
- CSS com **1684 linhas** cheio de animações pesadas
- `backdrop-filter: blur()` usado extensivamente (pesado na GPU)
- `tsparticles` carregado diretamente em 6 páginas (biblioteca pesada)
- `CustomCursor` com MutationObserver no body inteiro (nunca usado no Layout)
- Múltiplas animações CSS simultâneas (orbs, particles, shimmer, glow, float, gradient)
- Google Fonts bloqueando render

### Correções Planeadas

#### 1. Lazy-load tsparticles nas páginas Founder e Landing
- Envolver `ParticlesBackground` e `FounderParticlesBackground` com `React.lazy`
- Evita carregar ~200KB da biblioteca tsparticles no bundle inicial

#### 2. Reduzir backdrop-filter blur em mobile
- Reduzir `blur(16px)` → `blur(8px)` nos glass-cards em mobile via media query
- Reduzir `blur(40px)` → `blur(12px)` nos premium glass-cards em mobile

#### 3. Reduzir animações CSS pesadas
- Desativar `borderGlow`, `gradientShift`, `brandShimmer`, `sidebarGroupGlow` em mobile
- Reduzir número de orbs elite de 5 para 3 em mobile
- Adicionar `@media (max-width: 768px)` para desativar partículas CSS e animações de float

#### 4. Otimizar carregamento de fontes
- Adicionar `font-display=swap` ao link do Google Fonts (já está com `&display=swap`)
- Adicionar `<link rel="preload">` para as fontes principais

#### 5. Otimizar EliteBackground
- Reduzir partículas de 16 para 8 em mobile
- Usar `matchMedia` para detetar mobile e renderizar menos elementos

#### 6. Reduzir glass-card pseudo-elementos
- Simplificar `::before` e `::after` nos glass-cards premium — eliminar box-shadows pesados em mobile

#### 7. Otimizar SubscriptionProvider
- Aumentar intervalo de polling de 60s para 120s
- Aumentar debounce de 30s para 60s

### Arquivos a editar
- `src/index.css` — media queries mobile para reduzir animações e blur
- `src/components/EliteBackground.tsx` — reduzir partículas em mobile
- `src/pages/Landing.tsx` — lazy-load ParticlesBackground
- `src/pages/FounderFeed.tsx`, `FounderMatch.tsx`, `FounderMessages.tsx`, `FounderProfile.tsx`, `FounderOpportunities.tsx` — lazy-load FounderParticlesBackground
- `src/contexts/SubscriptionContext.tsx` — aumentar intervalos de polling
- `index.html` — preload de fontes

