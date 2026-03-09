

## Plano: Banner Global de Desenvolvimento com Botão de Fechar

### Problema
O banner vermelho está apenas no Dashboard (`Index.tsx`). Precisa aparecer em **todas as páginas** e ter um botão X para fechar, salvando no `localStorage`.

### Solução

1. **Criar componente `src/components/DevelopmentBanner.tsx`**
   - Banner vermelho pulsante com texto de aviso + botão "Deixar Feedback" + botão X para fechar
   - Estado controlado por `localStorage` key `dev-banner-dismissed`
   - Se já foi dispensado, não renderiza nada

2. **Adicionar no `src/components/Layout.tsx`**
   - Inserir `<DevelopmentBanner />` dentro do `<main>`, antes do `<Outlet />`, para que apareça em todas as páginas

3. **Remover o banner duplicado de `src/pages/Index.tsx`**
   - Remover o bloco `motion.div` do banner de desenvolvimento que já existe lá

