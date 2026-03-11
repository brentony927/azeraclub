

# Mobile Polish + Insígnia "BRENTONY OWNER" no Perfil

## 1. Insígnia Vermelha "BRENTONY OWNER" no Perfil

Adicionar uma insígnia vermelha metálica destacada no perfil do proprietário, visível logo ao lado do nome, com o texto **BRENTONY OWNER**. A insígnia terá:

- Gradiente vermelho metálico com animação shimmer (reutilizando o estilo `owner-badge` existente)
- Ícone de coroa (Crown) ao lado do texto
- Tamanho maior que badges normais para se destacar
- Glow vermelho ao redor

**Ficheiro:** `src/pages/Profile.tsx`
- Na secção do avatar/nome (linha ~337-341), quando `isOwner === true`, renderizar a insígnia "BRENTONY OWNER" com classe `owner-badge` e ícone Crown
- Substituir o badge genérico "Desenvolvedor" pelo badge exclusivo do owner

## 2. Polish Mobile

Melhorias para tornar a experiência mobile mais fluida:

**Ficheiro:** `src/pages/Profile.tsx`
- Interest chips (linha ~578-587): adicionar `min-h-[44px]` nos botões de interesses para cumprir touch targets
- Select triggers: garantir `min-h-[44px]` nos selects
- Username "Copiar Link" button: `min-h-[44px]`

**Ficheiro:** `src/components/MobileBottomNav.tsx`
- Sem mudanças necessárias, já tem touch targets corretos

**Ficheiro:** `src/index.css`
- Adicionar nova classe `.owner-profile-badge` com estilo metálico intensificado, maior que o badge normal do FounderCard, com shimmer e glow para destacar no perfil

## Ficheiros a modificar

| Ficheiro | Ação |
|---|---|
| `src/pages/Profile.tsx` | Adicionar insígnia owner + polish touch targets |
| `src/index.css` | Adicionar `.owner-profile-badge` com estilo metálico vermelho |

