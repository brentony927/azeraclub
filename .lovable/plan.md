

# Plano: Landing em Preto e Branco + Nova Tipografia

## 1. Landing Page — Esquema Preto e Branco

A seção hero da landing (visível no screenshot) usa classes `.moss-text` e `.moss-gradient` que aplicam verde. A solução é criar uma versão "landing-only" que sobrescreve essas classes para tons neutros (branco/cinza), sem remover efeitos, partículas ou animações.

### Alterações em `src/pages/Landing.tsx`
- Envolver todo o conteúdo num wrapper com classe `.landing-monochrome`
- Isso permite CSS scoped que neutraliza as cores verdes apenas na landing

### Alterações em `src/index.css`
Adicionar regras scoped:
```css
.landing-monochrome .moss-text {
  background: linear-gradient(135deg, hsl(0 0% 95%), hsl(0 0% 80%));
  /* clip text transparente mantido */
}
.landing-monochrome .moss-gradient {
  background: linear-gradient(135deg, hsl(0 0% 20%), hsl(0 0% 30%), hsl(0 0% 15%));
}
```
- Badge, botões CTA, ícones, bordas — todos convertidos para escala de cinza/branco dentro de `.landing-monochrome`
- Partículas, glassmorphism, gradient-border, card-shine — mantidos intactos

---

## 2. Tipografia — Modernidade, Tecnologia, Futuro

**Problema:** Playfair Display (serif clássico) não transmite tecnologia/futuro/dinheiro.

**Solução:** Substituir por **Space Grotesk** — uma fonte geométrica, moderna e tech-forward, muito usada em fintechs e plataformas de IA.

### Alterações em `index.html`
- Trocar o import do Google Fonts de `Playfair Display` para `Space Grotesk:wght@400;500;600;700`

### Alterações em `tailwind.config.ts`
- `fontFamily.serif` → `["'Space Grotesk'", ...]` (ou criar nova key `display`)

### Alterações em `src/index.css`
- `h1-h6` font-family → `'Space Grotesk'`

### Alterações em `src/pages/Landing.tsx`
- Classes `font-serif` nos headings continuam funcionando pois o token será atualizado

---

## Resumo de Ficheiros

| Ficheiro | Alteração |
|---|---|
| `index.html` | Trocar Google Font import |
| `tailwind.config.ts` | Atualizar `fontFamily.serif` |
| `src/index.css` | Atualizar h1-h6 font, adicionar `.landing-monochrome` overrides |
| `src/pages/Landing.tsx` | Adicionar wrapper `.landing-monochrome` |

