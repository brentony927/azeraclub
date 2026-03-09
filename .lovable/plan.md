

# Tema Preto & Branco para Founders (Plano Free)

## Problema
Atualmente o tema base (Founder/Free) usa tons de verde (hue 150-152) nos tokens CSS. O utilizador quer que Founders tenham apenas **preto e branco** — sem cores — mantendo animações e efeitos iguais.

## Solução
Alterar os tokens CSS base (`:root` e `.dark`) para **escala de cinza pura** (hue 0, saturation 0%), removendo qualquer toque de verde. Os temas PRO e BUSINESS continuam inalterados.

### `src/index.css`

**`:root` (light mode)** — trocar todos os hue 150/152 por tons neutros puros:
```
--background: 0 0% 99%;
--foreground: 0 0% 4%;
--card: 0 0% 99%;
--card-foreground: 0 0% 4%;
--popover: 0 0% 99%;
--popover-foreground: 0 0% 4%;
--primary: 0 0% 9%;
--primary-foreground: 0 0% 98%;
--secondary: 0 0% 95%;
--secondary-foreground: 0 0% 9%;
--muted: 0 0% 94%;
--muted-foreground: 0 0% 40%;
--accent: 0 0% 15%;
--accent-foreground: 0 0% 100%;
--border: 0 0% 88%;
--input: 0 0% 88%;
--ring: 0 0% 30%;
--chart-1 a 5: tons de cinza
--sidebar-*: tons neutros
```

**`.dark` (dark mode)** — mesma lógica, cinza puro:
```
--background: 0 0% 5%;
--foreground: 0 0% 96%;
--primary: 0 0% 85%;
--accent: 0 0% 70%;
--border: 0 0% 16%;
etc.
```

**Sparkles/gold tokens** — manter iguais (já são neutros no base)

### Ficheiros Afetados

| Ficheiro | Alteração |
|---|---|
| `src/index.css` | `:root` e `.dark` — substituir hue 150/152 por 0 0% (grayscale puro) |

Nenhuma alteração em componentes — as animações, efeitos, orbs e partículas continuam exatamente iguais. Apenas as variáveis de cor base mudam.

