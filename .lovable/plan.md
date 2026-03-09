

# Greeting Dourado + Destaque "Planos" na Sidebar

## Alterações

### 1. `src/index.css` — Greeting dourado
Mudar o `.greeting-gradient-text` de verde para **dourado** (mantendo a mesma animação shimmer):
- Light: `hsl(42 80% 50%)` → `hsl(38 70% 55%)` → `hsl(42 80% 50%)`
- Dark: `hsl(42 90% 55%)` → `hsl(38 85% 60%)` → `hsl(42 90% 55%)`

### 2. `src/index.css` — Classe `.sidebar-plans-glow` 
Adicionar uma classe CSS com um brilho sutil e pulsante dourado para o item "Planos":
```css
.sidebar-plans-glow {
  animation: plansGlow 3s ease-in-out infinite;
}
@keyframes plansGlow {
  0%, 100% { text-shadow: 0 0 4px hsl(42 80% 50% / 0.3); }
  50% { text-shadow: 0 0 8px hsl(42 80% 50% / 0.6); }
}
```

### 3. `src/components/AppSidebar.tsx` — Aplicar glow ao "Planos"
No `renderItems`, detectar quando `navItem.url === "/planos"` e adicionar a classe `sidebar-plans-glow` ao NavLink.

| Ficheiro | Alteração |
|---|---|
| `src/index.css` | Greeting dourado + classe `.sidebar-plans-glow` |
| `src/components/AppSidebar.tsx` | Aplicar glow no item "Planos" |

