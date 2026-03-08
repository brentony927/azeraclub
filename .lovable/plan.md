

## Intensificar Cores PRO e BUSINESS

Após análise, identifiquei vários elementos que ainda usam cores genéricas (cinza/neutro) mesmo quando o tema PRO ou BUSINESS está ativo. O plano é colorir esses elementos.

### O que falta cor

1. **Sidebar active items** — usam `bg-primary/10` genérico, sem glow temático
2. **Sidebar section labels** (Pro, Business, Ferramentas) — cinza neutro, sem cor do tema
3. **PRO badge no header da sidebar** — hardcoded azul `hsl(210,40%,50%)` em vez de verde neon
4. **Inputs** — sem glow temático no focus
5. **Stat card top border** — linha genérica `hsl(var(--border))`
6. **Progress bars** — sem override de cor
7. **Separadores/borders** — sidebar e header sem tinting
8. **Avatar ring** — sem borda colorida
9. **Orbs opacity** — muito sutil, precisa intensificar
10. **Partículas** — poucas e fracas

### Arquivos

| Ação | Arquivo |
|------|---------|
| Edit | `src/index.css` — Intensificar orbs (+opacity), partículas (+opacity), adicionar regras para inputs, progress, stat-card borders, sidebar items, separators, avatar glow |
| Edit | `src/components/AppSidebar.tsx` — Aplicar classes temáticas nos labels, active items, badge, avatar ring |
| Edit | `src/components/EliteBackground.tsx` — Mais partículas (20 em vez de 12), tamanhos maiores |

### Detalhes CSS a adicionar

**PRO (verde neon):**
- Sidebar active: `bg-[hsl(152,100%,50%/0.12)]` + border verde + text verde
- Sidebar labels "Pro"/"Ferramentas": texto verde neon
- Inputs focus: glow verde `0 0 12px hsl(152 100% 50% / 0.2)`
- Stat-card top line: gradiente verde
- Progress bar: verde neon
- Avatar: border verde glow
- Orbs: opacity de 0.14→0.22, 0.12→0.18
- Partículas: opacity 0.6→0.8, tamanho maior

**BUSINESS (dourado):**
- Sidebar active: `bg-[hsl(51,100%,50%/0.12)]` + border dourado + text dourado
- Sidebar labels: texto dourado
- Inputs focus: glow dourado
- Stat-card top line: gradiente dourado
- Progress bar: dourado
- Avatar: border dourada glow
- Orbs: opacity de 0.12→0.20
- Partículas: opacity 0.6→0.8

