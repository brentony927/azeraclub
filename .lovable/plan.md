

# Corrigir Bordas Arredondadas nos Cards PRO e BUSINESS

## Problema
Os cards PRO e BUSINESS usam `borderImage` com gradiente para a borda colorida. O CSS `border-image` **não suporta `border-radius`** — ele força cantos quadrados, ignorando qualquer arredondamento.

## Solução
Substituir `borderImage` por uma técnica de **pseudo-elemento `::before`** com gradiente de fundo, que respeita `border-radius`. A abordagem:

1. Remover `borderImage`, `borderWidth` e `borderStyle` do `style` inline dos cards PRO/BUSINESS
2. Adicionar classes CSS customizadas (`.card-border-pro` e `.card-border-business`) que usam um `::before` absoluto com o gradiente, `padding` de 2px simulando a borda, e `border-radius` herdado
3. O conteúdo interno mantém o background original sobre o gradiente

### Ficheiro: `src/index.css`
Adicionar duas classes utilitárias:
```css
.card-border-pro,
.card-border-business {
  position: relative;
  border: none !important;
}
.card-border-pro::before,
.card-border-business::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  z-index: 0;
}
.card-border-pro::before {
  background: linear-gradient(135deg, hsl(152,100%,50%), hsl(170,90%,50%), hsl(140,80%,45%));
}
.card-border-business::before {
  background: linear-gradient(135deg, hsl(51,100%,50%), hsl(42,70%,55%), hsl(20,80%,50%));
}
```

### Ficheiro: `src/components/ui/pricing-section.tsx`
- Remover o bloco `borderImage`/`borderWidth`/`borderStyle` do `style` inline
- Adicionar `card-border-pro` ou `card-border-business` como className nos cards correspondentes

| Ficheiro | Alteração |
|---|---|
| `src/index.css` | Adicionar `.card-border-pro` e `.card-border-business` com mask-composite |
| `src/components/ui/pricing-section.tsx` | Trocar borderImage inline por classes CSS |

