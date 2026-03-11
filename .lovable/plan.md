

# Insígnias 3D Animadas nos Planos

## Alterações

### 1. `src/pages/Pricing.tsx`
- Remover emojis 🛡️ das features "Insígnia Pro" e "Insígnia Business"

### 2. `src/components/ui/pricing-section.tsx`
- Importar `Icon3D` e o ícone `Shield` do lucide-react
- Na renderização das features (linha ~347-355), detectar se a feature contém "Insígnia"
- Se sim, renderizar `Icon3D` com ícone `Shield`, animado (`animated={true}`), no lugar do `Check`:
  - "Insígnia Pro" → `Icon3D` cor `green`, size `sm`
  - "Insígnia Business" → `Icon3D` cor `gold`, size `sm`
- O texto da insígnia fica ao lado do ícone 3D com estilo `font-semibold` para destaque

```text
Antes:  ✓ 🛡️ Insígnia Pro
Depois: [3D Shield verde animado] Insígnia Pro (bold)
```

### Ficheiros

| Ficheiro | Ação |
|---|---|
| `src/pages/Pricing.tsx` | Remover emojis das features de insígnia |
| `src/components/ui/pricing-section.tsx` | Renderizar Icon3D animado para features com "Insígnia" |

