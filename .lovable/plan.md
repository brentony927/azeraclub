

## Plano: Tutorial de Primeira Vez + Remover Animação Founder Intro

### O que será feito

1. **Criar tutorial de primeira vez** — Quando o usuário cria conta e entra no dashboard pela primeira vez, aparece um tutorial interativo (steps/slides) mostrando as funções principais do app, com destaque especial para o Founder Alignment.

2. **Remover a animação Three.js do Founder Alignment** — Eliminar o `FounderMatchIntro` (animação 3D de partículas formando "AZERA") que aparece ao entrar no FounderMatch e FounderFeed.

### Alterações

#### 1. Novo componente `src/components/OnboardingTutorial.tsx`
Tutorial com ~5 slides usando Framer Motion:
- **Slide 1**: "Bem-vindo à AZERA" — visão geral da plataforma
- **Slide 2**: "Organize sua vida" — Agenda, Diário, Objetivos
- **Slide 3**: "IA Pessoal" — Assistente inteligente
- **Slide 4**: "Founder Alignment" (destaque) — Encontre co-founders, networking global, Venture Builder
- **Slide 5**: "Comece agora" — CTA para explorar

Controle: `localStorage` com chave `onboarding-tutorial-${user.id}` para mostrar apenas na primeira vez.

#### 2. `src/pages/Index.tsx` — Integrar tutorial
- Importar e renderizar `OnboardingTutorial` condicionalmente (se não visto).

#### 3. `src/pages/FounderMatch.tsx` — Remover intro 3D
- Remover import e uso de `FounderMatchIntro`
- Remover estado `showIntro` e handler `handleIntroComplete`

#### 4. `src/pages/FounderFeed.tsx` — Remover intro 3D
- Remover import e uso de `FounderMatchIntro`
- Remover estado `showIntro` e handler `handleIntroComplete`

#### 5. `src/components/FounderMatchIntro.tsx` — Deletar arquivo
- Não mais utilizado (Three.js + GSAP pesado removido = melhor performance)

### Design do Tutorial
- Overlay fullscreen com backdrop blur
- Card central com ícone animado, título e descrição por slide
- Dots de progresso + botão "Próximo" / "Começar"
- Visual minimalista preto/branco, com o slide do Founder Alignment tendo um destaque dourado sutil

