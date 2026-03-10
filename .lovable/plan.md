

## Plano: Owner Vermelho Intenso Metálico + Mobile 100% + Fluidez

### Resumo
Intensificar o vermelho metálico brilhante do owner (sem mudar fundo branco/preto), aplicar vermelho no "AZERA CLUB" da sidebar para o owner, tornar o FounderCard do owner mais intenso com efeito metálico, e otimizar fluidez/performance mobile.

### 1. CSS — Intensificar Owner Red Metallic (`src/index.css`)

**Owner Card** — upgrade para vermelho metálico brilhante (estilo similar ao `badge-gold-metallic` mas em vermelho):
```css
.owner-card {
  border: 2px solid transparent;
  background-image: linear-gradient(var(--card), var(--card)),
    linear-gradient(145deg, #8b0000, #ff0000, #ff4444, #ff0000, #8b0000);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 0 30px hsl(0,100%,50%,0.4), 0 0 60px hsl(0,100%,50%,0.15);
}
```

**Owner Theme** — intensificar cores sem mudar fundo:
- `--primary` mais saturado/vibrante
- Header gradient line mais intenso
- Sidebar accent com tint vermelho mais forte

**"AZERA CLUB" vermelho para owner** — nova classe `.owner-theme .azera-brand-text`:
```css
.owner-theme .azera-brand-text {
  background: linear-gradient(145deg, #8b0000, #ff0000, #ff4444, #ff0000, #8b0000);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ownerBadgeShimmer 3s ease-in-out infinite;
}
```

**Mobile performance** — adicionar `will-change: transform` nos cards, reduzir animações pesadas em mobile, usar `transform: translateZ(0)` para GPU acceleration.

### 2. FounderCard — Metallic red intenso (`src/components/FounderCard.tsx`)

Já usa `owner-card` class. Apenas garantir que o CSS `.owner-card` é suficientemente intenso (feito no passo 1). Nenhuma mudança no componente necessária.

### 3. AppSidebar — "AZERA CLUB" vermelho (`src/components/AppSidebar.tsx`)

Nenhuma mudança no componente — o CSS `.owner-theme .azera-brand-text` herdará automaticamente pois o `.owner-theme` está no wrapper do Layout e o `azera-brand-text` já existe na sidebar.

### 4. Fluidez e leveza

- Adicionar `content-visibility: auto` em cards para lazy rendering
- Reduzir `animation-duration` em mobile
- Simplificar box-shadows em mobile para owner elements
- Usar `@media (prefers-reduced-motion)` para respeitar preferências do usuário

### Ficheiros a editar
- `src/index.css` (owner card metallic intenso, AZERA CLUB vermelho, mobile perf)

Apenas 1 ficheiro precisa ser editado — todas as mudanças são CSS.

