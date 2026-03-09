

# Upgrade Visual Completo — AZERA CLUB

## Diagnóstico Atual
O app já tem uma base sólida (glassmorphism, temas PRO/Business, animações). O que falta é **refinamento visual**: a paleta base é muito cinza/monótona, as cards parecem genéricas, a landing page não transmite "premium", e faltam micro-detalhes que separam um app bom de um app excepcional.

## Plano de Alterações

### 1. Paleta de Cores Base — De Cinza para Verde Sofisticado
**Arquivo:** `src/index.css`

O tema base (free/basic) usa cinza puro `0 0% X%`. Vamos adicionar um toque sutil de verde (a cor da marca) para dar personalidade mesmo sem ser premium:

- `:root` light → background com leve tint verde (`150 10% 99%`), cards com `150 8% 99%`, borders com `150 5% 88%`, accent passa a ser `152 38% 36%` (verde marca)
- `.dark` → background `150 6% 5%`, cards `150 5% 8%`, borders `150 5% 16%`, accent `152 60% 45%`
- Muted-foreground ganha mais contraste para legibilidade

### 2. Tipografia Premium
**Arquivo:** `index.html` + `src/index.css` + `tailwind.config.ts`

- Adicionar Google Font **Inter** (corpo) e **Playfair Display** (headings/serif) via `<link>` no `index.html`
- Atualizar `font-family` em `body` para `'Inter', system-ui, sans-serif`
- Atualizar headings para `'Playfair Display', Georgia, serif`
- Atualizar `tailwind.config.ts` `fontFamily.sans` e `fontFamily.serif`

### 3. Landing Page — Hero Cinematográfico
**Arquivo:** `src/pages/Landing.tsx`

- Hero: gradiente de fundo mais dramático, texto maior com `text-balance`, badge animado "✦ O Sistema Operacional para Vidas Ambiciosas"
- CTA primário com gradiente verde animado + brilho (glow) ao hover
- Mock do app no hero: adicionar borda gradiente animada ao redor do glass-card mockup
- Seção "Como Funciona": cards com ícone maior num círculo com gradient-border, número de step sobreposto
- Seção "Em Ação": adicionar subtle dot-grid pattern no fundo
- CTA Final: adicionar gradiente radial de fundo e testimonial placeholder

### 4. Dashboard (Index) — Cards com Vida
**Arquivo:** `src/pages/Index.tsx`

- Greeting: adicionar emoji dinâmico (☀️/🌤️/🌙) e subtle glow no texto
- AZERA Score card: adicionar gradient-border animado, ícone com glow, número com `@number-flow/react` para animar
- AI Tip card: adicionar aspas estilizadas (giant quote mark), fundo com subtle pattern
- Suggestion CTA: pulse animation no ícone, gradient-border sutil
- Agenda items: adicionar indicador colorido por tipo (dot), hover com slide-in de ações
- Empty states: ilustração SVG inline ao invés de apenas texto

### 5. Cards Globais — Profundidade e Elegância
**Arquivo:** `src/index.css`

- `.glass-card`: adicionar `backdrop-blur-3xl`, border-top de 1px com gradiente sutil (white shimmer), shadow mais profundo
- Hover: scale mais sutil (1.005), shadow expandido, border brightens
- Dark mode: inner glow sutil (inset box-shadow com cor primária)
- Novo `.card-shine` — pseudo-element com gradiente diagonal que move no hover (conic-gradient spotlight effect)

### 6. Login/Signup — Imersivo
**Arquivo:** `src/pages/Login.tsx`

- Fundo: adicionar animated-bg (o mesmo do dashboard) ao invés de fundo plano
- Card: aumentar blur, adicionar border-gradient animado
- Logo: adicionar glow-pulse animation
- Botões sociais: ícones com hover colorido (Google colors, Apple white)
- Divider "ou": adicionar sparkle no centro
- Inputs: focus state com glow verde sutil

### 7. Sidebar — Premium Feel
**Arquivo:** `src/components/AppSidebar.tsx` + `src/index.css`

- Header: logo com glow animation, brand text mais destacado
- Nav items: adicionar indicator dot animado quando ativo (ao invés de apenas border-left)
- Footer: avatar com ring gradient, status indicator (green dot)
- Scrollbar customizada dentro da sidebar (mais fina, colored)

### 8. Chatbot Widget — Polished
**Arquivo:** `src/components/AzeraChatbot.tsx`

- Botão flutuante: adicionar pulse ring animation (como WhatsApp), gradiente ao invés de cor sólida
- Panel: header com gradient subtle, mensagens do assistant com avatar mini
- Input: border com glow on focus, botão send com gradiente

### 9. Animações Globais Refinadas
**Arquivo:** `src/index.css` + `tailwind.config.ts`

- Novo keyframe `spotlight` — conic-gradient que roda, para cards premium
- Novo keyframe `borderGlow` — animação de border que brilha
- Novo `.gradient-border` utility — border animado com gradiente (usado em CTAs e cards destaque)
- Page transitions: adicionar blur mais suave, duração levemente maior

### 10. Footer — De Básico para Polido
**Arquivo:** `src/components/Footer.tsx`

- Adicionar gradiente subtle no topo (fade from transparent to border)
- Logo com animação de shimmer
- Links com hover underline animado
- Adicionar "Built with ♥ for ambitious minds" como tagline

## Escopo Total
- **6 arquivos** modificados significativamente
- **1 arquivo** novo (`index.html` link de fonts)
- **~800-1000 linhas** de alterações
- Zero mudanças de funcionalidade — 100% visual

