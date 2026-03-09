

## Plano: Remover traços de verde do plano Basic/Free

### Problema
Os estilos CSS base contêm cores verdes hardcoded (`hsl(152...)`) que afetam TODOS os planos, incluindo Basic/Free. Essas cores deveriam ser exclusivas do plano PRO.

### Locais com verde hardcoded (afetando Basic/Free)

1. **`.glass-card`** (linhas 146-148): box-shadow com `hsla(152, 20%, 10%, 0.08)` e border com verde
2. **`.dark .glass-card`** (linhas 164-168): box-shadow e border com `hsla(152, 40%, 50%,...)`
3. **`.glass-card-hover:hover`** (linha 158): shadow com `hsla(152, 30%, 10%, 0.12)`
4. **`.dark .glass-card-hover:hover`** (linhas 172-173): shadow com `hsla(152, 40%, 50%,...)`
5. **`.card-shine::before`** (linha 185): conic-gradient com `hsla(152, 40%, 50%, 0.04)`
6. **`.gradient-border::before`** (linha 218): gradiente verde `hsl(152 60% 45%)`
7. **`.moss-gradient`** (linha 229): gradiente verde base
8. **`.moss-text`** (linhas 234-245): texto verde
9. **`.animated-bg::before`** (linhas 415-417): fundo com verdes `hsl(152/160/145...)`
10. **`.dark .animated-bg::before`** (linhas 425-427): idem dark mode
11. **`.btn-premium`** (linhas 364-368): box-shadow com `hsl(152 38% 28%)`
12. **`.input-glow`** (linhas 388-391): glow verde `hsl(152 38% 36%)`
13. **`.chatbot-pulse`** (linha 447): border com `hsl(152 60% 45%)`

### Solução
Substituir todas as cores verdes hardcoded nos estilos BASE por equivalentes neutros usando CSS variables (`hsl(var(--primary))`, `hsl(var(--border))`, etc.) ou tons de cinza (`hsl(0 0% ...)`) puros. As cores verdes ficarão apenas nos seletores `.pro-theme` onde já estão corretamente escoped.

### Alterações em `src/index.css`

| Seletor | Antes (verde) | Depois (neutro) |
|---------|--------------|-----------------|
| `.glass-card` shadow | `hsla(152, 20%, 10%, 0.08)` | `hsla(0, 0%, 10%, 0.08)` |
| `.glass-card` border | `hsla(0, 0%, 100%, 0.06)` | sem mudança |
| `.dark .glass-card` | `hsla(152, 40%, 50%, 0.04/0.06)` | `hsla(0, 0%, 50%, 0.04/0.06)` |
| `.glass-card-hover:hover` | `hsla(152, 30%, 10%, 0.12)` | `hsla(0, 0%, 10%, 0.12)` |
| `.dark .glass-card-hover:hover` | `hsla(152, 40%, 50%, 0.08)` | `hsla(0, 0%, 50%, 0.08)` |
| `.card-shine::before` | `hsla(152, 40%, 50%, 0.04)` | `hsla(0, 0%, 50%, 0.04)` |
| `.gradient-border::before` | `hsl(152 60% 45%)` | `hsl(0 0% 50%)` |
| `.moss-gradient` | verde | `hsl(0 0% 18%)...` neutro |
| `.moss-text` / `.dark .moss-text` | verde | neutro cinza |
| `.animated-bg::before` | `hsl(152/160/145...)` | `hsl(0 0% 15/14/18%)` |
| `.dark .animated-bg::before` | `hsl(152/160/145...)` | `hsl(0 0% 30/25/28%)` |
| `.btn-premium` shadow | `hsl(152 38% 28%)` | `hsl(0 0% 20%)` |
| `.input-glow` | `hsl(152 38% 36%)` | `hsl(0 0% 40%)` |
| `.chatbot-pulse` | `hsl(152 60% 45%)` | `hsl(0 0% 50%)` |

### Arquivo a modificar
Apenas **`src/index.css`** — todas as mudanças são no CSS base (não-scoped a `.pro-theme`).

