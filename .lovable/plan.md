

## Plano: Tornar o Site Mais Fluido

### Problemas Identificados

1. **`backdrop-filter: blur(40px)`** em TODOS os `.glass-card` — operação de GPU muito cara, especialmente com múltiplos cards na tela
2. **`animated-bg::before`** com `inset: -50%` — elemento gigante (3x a tela) animando continuamente
3. **3 orbs de fundo** com `filter: blur(80px)` + animação de 20-25s — composição pesada
4. **PageTransition** usa `filter: blur(6px)` na entrada — força repaint durante navegação
5. **ScrollReveal** inicia com `filter: blur(10px)` e `scale(0.95)` — pesado ao scrollar
6. **EliteBackground** renderiza 36 partículas + 5 orbs animados (PRO/Business)
7. **Falta de `will-change`** nos elementos animados base

### Alterações

#### 1. `src/index.css` — Otimizar CSS

| Elemento | Antes | Depois |
|----------|-------|--------|
| `.glass-card` backdrop-filter | `blur(40px) saturate(1.6)` | `blur(16px) saturate(1.2)` |
| `.page-bg-orb` filter | `blur(80px)` | `blur(60px)` + `will-change: transform` |
| `.page-bg-orb` opacity | `0.06` | `0.04` (mais sutil = menos composição) |
| `.animated-bg::before` inset | `-50%` | Remover completamente (redundante com orbs) |
| `.glass-card-hover:hover` | `translateY(-2px) scale(1.005)` | `translateY(-1px)` apenas |
| Adicionar | — | `will-change: transform` em elementos animados |
| `.card-shine` | Rotação contínua de conic-gradient | Simplificar para opacity transition |

#### 2. `src/components/PageTransition.tsx` — Remover blur

- Remover `filter: "blur(6px)"` / `"blur(4px)"` das animações
- Reduzir duração de `0.45s` para `0.3s`
- Manter apenas `opacity` + `y` (GPU-friendly)

#### 3. `src/components/ScrollReveal.tsx` — Simplificar

- Remover `filter: "blur(10px)"` e `scale: 0.95`
- Manter apenas `opacity` + `y` com duração menor (`0.5s` vs `0.8s`)

#### 4. `src/components/EliteBackground.tsx` — Reduzir partículas

- Reduzir de 36 para 16 partículas
- Adicionar `will-change: transform, opacity` inline

#### 5. `src/components/Layout.tsx` — Remover animated-bg redundante

- Remover a div `.animated-bg::before` (já temos os 3 orbs que fazem o mesmo efeito)
- Ou remover classe `animated-bg` do wrapper

### Resultado Esperado
- Menos layers de composição GPU (backdrop-filter mais leve)
- Menos elementos animados simultâneos
- Transições de página sem blur (operação cara)
- Scroll mais suave sem blur nos reveals
- ~50% menos partículas no background premium

