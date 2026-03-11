

# Profissionalizar o Visual com Gradientes Metálicos

## Objetivo
Tornar o site mais profissional adicionando gradientes metálicos sutis nos elementos-chave (cards, botões, badges, headers) e reduzindo levemente a saturação das cores, sem perder a identidade visual.

## Alterações

### 1. `src/index.css` — Gradiente metálico global + redução de cor

**Glass cards**: Adicionar um sutil brilho metálico (sheen) no topo dos cards com gradiente linear de branco/cinza transparente, criando um efeito de metal escovado.

**Botões (moss-gradient)**: Substituir o gradiente flat por um gradiente metálico com highlights de luz (cinza claro no meio) que simula metal polido.

**Stat cards**: Adicionar borda superior com efeito metálico mais refinado.

**Headers**: Intensificar a linha de gradiente inferior para um acabamento cromado.

**Redução de saturação**: Diminuir levemente a saturação nos temas Pro e Business (de 100% para ~85% nos valores mais intensos), mantendo a identidade mas com tom mais profissional.

**Novo utilitário `.metallic-surface`**: Card com gradiente metálico reutilizável.

**Novo utilitário `.metallic-text`**: Texto com gradiente metálico (cinza escuro → claro → escuro) para headings.

### 2. `src/components/ui/card.tsx` — Classe metallic-surface

Adicionar a classe `metallic-surface` como padrão nos cards para aplicar o acabamento metálico sutil automaticamente.

### 3. `src/components/ui/button.tsx` — Sheen metálico no hover

Adicionar um pseudo-elemento `::after` via CSS para botões `default` variant que cria um reflexo metálico sutil no hover.

### Detalhes técnicos

Novos estilos CSS a adicionar:

```css
/* Metallic surface — subtle brushed metal effect */
.metallic-surface {
  background-image: linear-gradient(
    180deg,
    hsl(0 0% 100% / 0.06) 0%,
    transparent 40%,
    hsl(0 0% 0% / 0.03) 100%
  );
}
.dark .metallic-surface {
  background-image: linear-gradient(
    180deg,
    hsl(0 0% 100% / 0.04) 0%,
    transparent 40%,
    hsl(0 0% 0% / 0.06) 100%
  );
}

/* Metallic text gradient */
.metallic-text {
  background: linear-gradient(135deg, hsl(0 0% 25%), hsl(0 0% 55%), hsl(0 0% 25%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.dark .metallic-text {
  background: linear-gradient(135deg, hsl(0 0% 70%), hsl(0 0% 95%), hsl(0 0% 70%));
}
```

Redução de saturação nos temas:
- PRO: `152 100%` → `152 85%` nos valores principais
- BUSINESS: `51 100%` → `51 85%` nos valores principais
- Manter glows e particles inalterados para não perder a "magia"

Gradiente metálico nos botões `.moss-gradient`:
```css
.moss-gradient {
  background: linear-gradient(135deg, hsl(0 0% 14%), hsl(0 0% 24%), hsl(0 0% 32%), hsl(0 0% 24%), hsl(0 0% 14%));
}
```

Header gradient line com acabamento cromado:
```css
.header-gradient-line {
  background: linear-gradient(90deg, transparent, hsl(0 0% 40% / 0.3), hsl(0 0% 70% / 0.5), hsl(0 0% 40% / 0.3), transparent);
}
```

| Ficheiro | Ação |
|---|---|
| `src/index.css` | Adicionar utilitários metálicos, reduzir saturação dos temas, refinar gradientes |
| `src/components/ui/card.tsx` | Aplicar classe metallic-surface |
| `src/components/ui/button.tsx` | Refinar variante default com sheen metálico |

