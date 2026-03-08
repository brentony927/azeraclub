

## Cards de Pricing com Fundos Temáticos

Aplicar gradientes de fundo distintos nos cards PRO (verde neon) e BUSINESS (dourado) na página de planos, similar ao screenshot.

### Arquivo

| Ação | Arquivo |
|------|---------|
| Edit | `src/components/ui/pricing-section.tsx` — Adicionar classes/estilos de fundo por plano |

### Detalhes

Cada card recebe um estilo inline ou classe condicional baseado no `plan.key`:

- **PRO (`key === "pro"`)**: Fundo com gradiente escuro-verde `linear-gradient(135deg, hsl(152,100%,50%,0.08), hsl(152,80%,30%,0.15), hsl(0,0%,6%))`, border verde `border-[hsl(152,100%,50%,0.3)]`, sparkles verdes, checkmarks verdes
- **BUSINESS (`key === "business"`)**: Fundo com gradiente escuro-dourado `linear-gradient(135deg, hsl(51,100%,50%,0.08), hsl(42,60%,40%,0.15), hsl(0,0%,6%))`, border dourado `border-[hsl(51,100%,50%,0.3)]`, sparkles douradas, checkmarks dourados
- **BASIC**: Mantém o estilo neutro atual

Os checkmarks (`<Check>`) também mudam de cor: verde para PRO, dourado para BUSINESS, mantém accent para Basic.

O badge "Mais Popular" / "Seu Plano" no PRO usa gradiente verde; no BUSINESS usa gradiente dourado.

