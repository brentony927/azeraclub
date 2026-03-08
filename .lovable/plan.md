

## Intensificar Design Visual PRO e BUSINESS — Cores, Gradientes e Responsividade

O objetivo é tornar a experiencia visual dos planos PRO (verde neon) e BUSINESS (dourado) significativamente mais rica, vibrante e imersiva, tanto no modo claro quanto no escuro.

### 1. Gradientes mais vibrantes e multi-color (`src/index.css`)

**PRO Theme:**
- Gradiente principal: de `hsl(152)` puro para um gradiente multi-stop com cyan (`hsl(170)`) e emerald, criando mais profundidade
- Orbs maiores e mais opacos (0.22 → 0.35), com um 5o orb adicionado
- Particulas com glow mais forte e tamanhos maiores
- Glass cards com brilho interno (inner glow) mais pronunciado
- Background animado com radial gradients mais intensos
- Modo claro: fundo com tint verde sutil, cards com borda verde visivel
- Headings (`h1-h3`) com gradient text automatico no tema PRO

**BUSINESS Theme:**
- Gradiente de ouro para rose-gold (`hsl(51)` → `hsl(35)` → `hsl(20)`), mais luxuoso
- Orbs com tons amber/champagne mais intensos
- Glass cards com shimmer dourado animado
- Modo claro: fundo com tint dourado quente, bordas douradas visiveis
- Headings com gradient text dourado automatico

**Ambos:**
- `.moss-gradient` e `.gold-gradient` com gradientes de 3 cores em vez de 2
- Botoes com glow mais forte no hover (shadow spread maior)
- Badges com animacao de shimmer sutil
- Separadores e bordas com mais saturacao de cor
- Links e textos interativos com a cor do tema

### 2. Responsividade de texto (`src/index.css` + `tailwind.config.ts`)

- Adicionar classes utilitarias `text-responsive-*` que usam `clamp()` para escalar de mobile a desktop
- Headings nas paginas: `text-2xl sm:text-3xl lg:text-4xl` patterns
- Cards: padding responsivo (`p-4 sm:p-5 lg:p-6`)
- Badge text sizes que escalam

### 3. Modo claro mais colorido (`src/index.css`)

Atualmente o modo claro dos temas PRO/BUSINESS e bastante sutil. Intensificar:
- **PRO light:** `--background` com leve tint verde, `--card` com tint verde, bordas mais saturadas
- **BUSINESS light:** `--background` com leve tint dourado quente, `--card` com tint gold
- Stat cards com top-border gradiente mais grosso (2px → 3px) e glow
- Sidebar com tint de fundo colorido no modo claro

### 4. Efeitos adicionais (`src/index.css`)

- Animacao `@keyframes shimmerBadge` para badges de plano
- Glass card com `::after` pseudo-element para brilho de borda superior
- Headings com text-shadow sutil no tema
- Botao primario com gradiente animado (background-size trick)

### 5. EliteBackground mais rico (`src/components/EliteBackground.tsx`)

- Adicionar mais particulas (24 → 36)
- Adicionar um 5o orb com cor complementar
- Variar mais os tamanhos das particulas

### 6. FounderCard com mais destaque visual (`src/components/FounderCard.tsx`)

- Business cards com borda gradiente animada
- Avatar com ring glow no tema
- Badge BUSINESS FOUNDER com shimmer

### 7. Pricing cards mais impactantes (`src/components/ui/pricing-section.tsx`)

- Cards PRO/BUSINESS com borda gradiente mais visivel
- Botoes com gradiente multi-cor
- Preco com text-shadow/glow

### Arquivos Afetados

| Arquivo | Mudanca |
|---------|---------|
| `src/index.css` | Gradientes intensificados, modo claro colorido, shimmer animations, text responsivo, headings gradient, glow effects |
| `tailwind.config.ts` | Font sizes responsivos com clamp |
| `src/components/EliteBackground.tsx` | Mais particulas e orbs |
| `src/components/FounderCard.tsx` | Borda gradiente para Business, glow effects |
| `src/components/ui/pricing-section.tsx` | Cards mais vibrantes, glow nos precos |

