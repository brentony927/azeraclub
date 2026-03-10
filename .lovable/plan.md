

## Plano: Perfil Owner Mais Vermelho e Chamativo

### Mudanças

**1. `src/index.css` — Intensificar estilos Owner**
- `.owner-profile-wrapper`: background vermelho mais forte (não só bordas), gradiente radial vermelho interior
- Novo `.owner-card-inner`: cards internos do perfil com tint vermelho, bordas vermelhas
- Novo `.owner-name`: nome em vermelho brilhante com text-shadow glow
- `.owner-badge`: refazer como badge metálico vermelho com gradiente metallic (dark red → bright red → dark red), shimmer animado, borda metálica
- `.owner-avatar-ring`: glow mais intenso, animação de pulso
- Novas classes para social proof cards vermelhos no perfil owner

**2. `src/pages/FounderProfile.tsx` — Aplicar classes**
- Nome `<h1>` com classe `owner-name` (vermelho brilhante com glow)
- Cards internos (header, social proof, bio, etc.) com classe `owner-card-inner` para tint vermelho
- Badge metálico redesenhado com gradiente metallic
- Avatar ring mais exagerado
- Progress bar vermelha para founder score

### Ficheiros a editar
- `src/index.css` (estilos owner intensificados)
- `src/pages/FounderProfile.tsx` (aplicar classes vermelhas em todo o perfil)

