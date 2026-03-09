

## Plano: Destaque Brilhante Minimalista no Item "Planos"

### Situação Atual
O item "Planos" já tem uma classe `.sidebar-plans-glow` com `text-shadow` dourado pulsante, mas o efeito é muito sutil — praticamente invisível.

### Solução
Intensificar o destaque com um efeito de brilho mais visível mas ainda minimalista — combinando um fundo sutil com bordas iluminadas e o texto com brilho dourado.

### Alterações

#### `src/index.css` — Reforçar `.sidebar-plans-glow`
```css
.sidebar-plans-glow {
  position: relative;
  background: linear-gradient(135deg, hsl(42 70% 50% / 0.08), hsl(42 80% 60% / 0.04));
  border: 1px solid hsl(42 70% 50% / 0.15);
  border-radius: 0.5rem;
  animation: plansGlow 3s ease-in-out infinite;
}

@keyframes plansGlow {
  0%, 100% {
    text-shadow: 0 0 6px hsl(42 80% 50% / 0.4);
    box-shadow: 0 0 8px hsl(42 70% 50% / 0.1);
    border-color: hsl(42 70% 50% / 0.15);
  }
  50% {
    text-shadow: 0 0 10px hsl(42 80% 50% / 0.7);
    box-shadow: 0 0 14px hsl(42 70% 50% / 0.2);
    border-color: hsl(42 70% 50% / 0.3);
  }
}
```

Efeito: fundo dourado translúcido + borda pulsante + texto brilhante — elegante e chamativo sem ser excessivo.

