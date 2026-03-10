## Plano: Elevar a Identidade Visual — De Genérico para Exclusivo

### Diagnóstico

Analisando o screenshot e o código, o site tem uma aparência de "SaaS template" por estes motivos:

- Greeting com emojis textuais (☀️, 📅) parece amador
- Cards do bento grid são todos iguais (ícone + texto centralizado) — layout previsível
- Falta hierarquia visual — tudo tem o mesmo peso
- Header e footer sem personalidade
- Ausência de texturas e profundidade — tudo é flat com blur

### Mudanças Propostas

**1. `src/index.css` — Textura e profundidade premium**

- Adicionar textura de noise/grain sutil sobre o fundo (via pseudo-element no body) para eliminar o aspecto "flat digital"
- Refinar `.glass-card` com bordas mais finas, sombra interna mais suave e micro-brilho no topo
- Novo estilo `.section-heading` com letter-spacing amplo e weight refinado
- Header com gradient line sutil no bottom em vez de border sólido
- Footer mais minimal com opacidade reduzida e espaçamento refinado

**2. `src/pages/Index.tsx` — Dashboard premium**

- Remover emojis textuais do greeting (☀️ → nada, usar apenas texto elegante)
- Greeting em formato "Bom dia, [nome]." com subtítulo menor sem emoji
- Quick actions: layout assimétrico — 1 card grande (IA) + 3 menores, com ícones maiores e descrições removidas
- AZERA Score: número grande com tipografia display, sem card wrapper redundante
- Remover card de "Sugestões" (CTA genérico)
- Sections com label uppercase tracking-widest mais discreto

**3. `src/components/Layout.tsx` — Header refinado**

- Substituir border-b por gradient line (transparent → border → transparent)
- Reduzir altura do header de h-14 para h-12 — mais compacto e elegante

**4. `src/components/Footer.tsx` — Minimal e sofisticado**

- Remover "Built with ♥" — não profissional
- Layout horizontal single-line no desktop
- Separador com · entre links legais

**5. `src/components/DevelopmentBanner.tsx` — Tom profissional**

- Trocar estilo vermelho agressivo por banner sutil com borda amarela/amber
- Remover emojis (🚧, 💡)  
- Tom mais discreto mas visível

### Ficheiros a editar

- `src/index.css`
- `src/pages/Index.tsx`
- `src/components/Layout.tsx`
- `src/components/Footer.tsx`
- `src/components/DevelopmentBanner.tsx`