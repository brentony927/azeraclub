

## Plano: Perfil do Dono 100% Desbloqueado + Elementos 3D no lugar de Emojis

### 1. Perfil do Dono totalmente desbloqueado — `src/pages/Profile.tsx`

Atualmente o perfil tem seções bloqueadas por `isPro` (analytics, "ver quem visitou"). Para o owner, tudo deve estar visível:

- Detectar `is_site_owner` do `founder_profiles` no `loadData()`
- Criar variável `isOwner` e usar `isPro || isOwner` em todas as gates de acesso
- Remover blur/lock overlay das seções de Social Proof e Profile Visits quando owner

### 2. Elementos 3D no lugar de Emojis — `src/components/ui/icon-3d.tsx` (novo)

Criar componente `Icon3D` que renderiza ícones Lucide dentro de esferas CSS com efeito 3D (gradiente radial, sombra interna, reflexo, transform perspective):

```tsx
<Icon3D icon={Trophy} color="gold" size="sm" />
```

Estilos CSS com:
- `background: radial-gradient(circle at 30% 30%, highlight, base, dark)` para efeito esférico
- `box-shadow: inset` para profundidade
- `transform: perspective(100px) rotateX(-5deg)` para 3D

### 3. Substituir emojis nos componentes

**`src/components/BadgeShowcase.tsx`**:
- `🏆 Insígnias` → `<Icon3D icon={Trophy} color="gold" /> Insígnias`

**`src/components/FounderCard.tsx`**:
- `👑 OWNER` → `<Icon3D icon={Crown} color="red" /> OWNER`
- `⭐ DESTAQUE` → `<Icon3D icon={Star} color="gold" /> DESTAQUE`

### 4. CSS para efeitos 3D — `src/index.css`

Adicionar classes `.icon-3d`, `.icon-3d-gold`, `.icon-3d-red`, `.icon-3d-blue` com gradientes radiais e sombras para simular profundidade 3D.

### Ficheiros a criar/editar
- `src/components/ui/icon-3d.tsx` (novo — componente 3D icon)
- `src/components/BadgeShowcase.tsx` (emoji → 3D)
- `src/components/FounderCard.tsx` (emoji → 3D)
- `src/pages/Profile.tsx` (owner = tudo desbloqueado)
- `src/index.css` (3D icon styles)

