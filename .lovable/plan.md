

## Plano: Corrigir 6 Problemas de Performance

### Problemas e Soluções

**1. Melhorar entrega de imagens (136 KiB)**
- Adicionar `width`, `height` e `loading="lazy"` nas tags `<img>` da Landing e outros componentes
- Adicionar `fetchpriority="high"` no logo do hero (LCP element)

**2. Árvore de dependência de rede + Renderizar solicitações de bloqueio (40ms)**
- O Google Fonts já usa preload async — está correto
- Adicionar `<link rel="dns-prefetch">` para o domínio Supabase no `index.html`
- Adicionar `<link rel="modulepreload">` não é viável (Vite gera hashes), mas podemos melhorar o chunking

**3. Reduzir CSS não utilizado (20 KiB)**
- Economia pequena (20 KiB). Tailwind já faz purge. Sem ação significativa possível.

**4. Reduzir JavaScript não utilizado (156 KiB)**
- Configurar `build.rollupOptions.output.manualChunks` no Vite para separar vendor libs grandes (framer-motion, recharts, lucide, etc.) em chunks separados
- Isso permite lazy loading efetivo dos chunks não usados na landing

**5. Cache eficiente (567 KiB)**
- Problema de headers do servidor (CDN/hosting). Não controlável via código.
- Porém, o chunking melhor (item 4) já melhora o cache — chunks de vendor mudam menos que o app code.

### Ficheiros a editar
- `vite.config.ts` — manual chunks para code splitting
- `index.html` — dns-prefetch para Supabase
- `src/pages/Landing.tsx` — atributos de imagem (width/height/loading/fetchpriority)

