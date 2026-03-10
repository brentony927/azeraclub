

## Plano: Tornar o Site Mais Fluido e Rápido

Após analisar o código, identifiquei os principais gargalos de performance:

### Problemas Encontrados

1. **CustomCursor** — MutationObserver observa o `document.body` inteiro com `subtree: true`, re-buscando TODOS os elementos interativos a cada mudança no DOM. Extremamente pesado.

2. **FounderParticlesBackground** — 70 partículas com links entre elas. Carrega a biblioteca tsparticles inteira. Consome GPU e CPU constantemente.

3. **ActivityTicker** — Animação Framer Motion infinita (`x: ["0%", "-50%"]`) recalculando layout continuamente.

4. **EliteBackground** — 16 partículas com `will-change: transform, opacity` em cada uma. Muitas layers de GPU desnecessárias.

5. **Backdrop-filter blur(16px)** — Glass cards usam blur pesado em todo o site. Cada card com blur cria uma camada de composição.

6. **AnimatePresence + PageTransition** — Exit animations bloqueiam a troca de página (espera a animação de saída antes de mostrar a nova).

### Correções

**Ficheiro `src/components/CustomCursor.tsx`:**
- Usar `requestAnimationFrame` para throttle do mousemove
- Remover MutationObserver — usar CSS `cursor: none` + `:hover` nos interativos em vez de JS event listeners
- Em mobile, não renderizar nada

**Ficheiro `src/components/FounderParticlesBackground.tsx`:**
- Reduzir partículas de 70 para 30
- Desativar links entre partículas (link rendering é o mais pesado)
- Limitar FPS a 30

**Ficheiro `src/components/ActivityTicker.tsx`:**
- Substituir animação Framer Motion por CSS `@keyframes` com `transform: translateX()` — muito mais leve (GPU-only, sem JS por frame)

**Ficheiro `src/components/EliteBackground.tsx`:**
- Reduzir partículas desktop de 16 para 8, mobile de 6 para 3
- Remover `will-change` inline — deixar o browser decidir

**Ficheiro `src/components/Layout.tsx`:**
- Remover `AnimatePresence mode="wait"` — o `mode="wait"` bloqueia a renderização da nova página até a exit animation terminar. Mudar para renderização direta sem exit animation.

**Ficheiro `src/components/PageTransition.tsx`:**
- Simplificar para apenas fade-in rápido (sem exit, sem translateY). Reduzir duração para 0.18s.

**Ficheiro `src/index.css`:**
- Reduzir blur do glass-card de 16px para 10px
- Adicionar `content-visibility: auto` nos cards para lazy rendering
- Simplificar `glass-card-hover` transition de 500ms para 200ms

### Ficheiros a editar
- `src/components/CustomCursor.tsx`
- `src/components/FounderParticlesBackground.tsx`
- `src/components/ActivityTicker.tsx`
- `src/components/EliteBackground.tsx`
- `src/components/Layout.tsx`
- `src/components/PageTransition.tsx`
- `src/index.css`

