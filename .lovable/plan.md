

## Plano: Diferenciais Visuais e de Experiência

### Problema
O site tem aspecto de SaaS genérico — cards estáticos, layout previsível, sem elementos que transmitam exclusividade ou comunidade viva.

### Adições (6 elementos diferenciadores)

#### 1. Ticker de Atividade ao Vivo (Landing + Dashboard)
Marquee horizontal animado mostrando atividade real da comunidade: "João criou um venture · Maria conectou com Pedro · 3 founders online agora". Cria sensação de plataforma viva e FOMO.

#### 2. Contadores Animados com NumberFlow (Landing)
Seção de stats na landing com números animados (usando `@number-flow/react` já instalado): "250+ Founders · 12 Países · 45 Ventures Criados". Contadores animam ao entrar na viewport.

#### 3. Command Palette (K) no Dashboard
Usar `cmdk` (já instalado) para um command palette estilo Spotlight/Raycast. Ctrl+K abre busca rápida por páginas, ações e ferramentas. Dá feeling de app premium/power-user.

#### 4. Greeting Contextual com Ambient
Trocar o emoji genérico do greeting por uma saudação mais rica com a data por extenso, frase motivacional contextual e um indicador visual de "streak" (dias consecutivos de login).

#### 5. Seção "Clube Exclusivo" na Landing
Badge de exclusividade com contagem de membros e texto "Uma comunidade curada de mentes ambiciosas" — reforça o posicionamento de clube vs ferramenta genérica.

#### 6. Quick Actions Bento Grid no Dashboard
Substituir o layout linear do dashboard por um bento grid com ações rápidas estilizadas (IA, Agenda, Founders, Radar) com ícones grandes e micro-animações hover.

### Arquivos a criar
- `src/components/ActivityTicker.tsx` — marquee de atividade
- `src/components/CommandPalette.tsx` — command palette com cmdk
- `src/components/AnimatedCounter.tsx` — wrapper de NumberFlow

### Arquivos a editar
- `src/pages/Landing.tsx` — adicionar ticker, contadores, seção exclusividade
- `src/pages/Index.tsx` — bento grid, greeting melhorado, ticker
- `src/components/Layout.tsx` — montar CommandPalette
- `src/index.css` — estilos do ticker marquee e bento grid

