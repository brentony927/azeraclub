

## Plano: Banner de Aviso "Projeto em Desenvolvimento" no Dashboard

### Alteração

**`src/pages/Index.tsx`**

- Adicionar um banner/card vermelho pulsante no topo do dashboard (antes do greeting)
- Texto: aviso de que o site ainda é um projeto em desenvolvimento, que podem haver erros, e pedido para deixar opinião/feedback/ideias
- Estilo: fundo vermelho semi-transparente, borda vermelha, texto branco, com animação `animate-pulse` do Tailwind
- Incluir um link/botão para a página de sugestões (`/sugestoes`)
- Possibilidade de fechar o banner (dismiss) com `localStorage` para não irritar o usuário

