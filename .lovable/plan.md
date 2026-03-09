

# Plano: Experiência Mobile Fluida

## Problemas Identificados

1. **MobileBottomNav link quebrado**: O botão "Perfil" aponta para `/perfil` mas a rota real é `/profile` — o link não funciona no mobile
2. **Agenda**: Calendar sidebar ocupa muito espaço no mobile; layout `lg:grid-cols` não se adapta bem; botão de delete usa `group-hover` que não funciona em touch
3. **AI page**: Input inferior precisa de `pb-safe` para não ficar atrás da barra do sistema em iPhones
4. **Profile page**: Tem botão "Voltar" duplicado (já existe no Layout header)
5. **Touch targets insuficientes**: Botões de delete em tasks/conversations são `opacity-0 group-hover:opacity-100` — invisíveis no mobile
6. **Chatbot input**: Precisa de `pb-safe` mais robusto no mobile
7. **Landing page**: Botões CTA poderiam ser full-width no mobile para melhor usabilidade
8. **Founder Messages**: Layout 3-colunas não adaptado para mobile

## Alterações por Ficheiro

### `src/components/MobileBottomNav.tsx`
- Corrigir path `/perfil` → `/profile`
- Melhorar detecção de rota ativa com `startsWith` em vez de igualdade exata

### `src/pages/Agenda.tsx`
- Esconder calendário sidebar no mobile, mostrar apenas como collapsible ou abaixo da lista
- Tornar botões de delete sempre visíveis no mobile (não depender de hover)
- Adicionar swipe ou tap-to-reveal para ações

### `src/pages/AI.tsx`
- Adicionar `pb-safe` ao input inferior quando há mensagens
- Fechar sidebar ao selecionar conversa no mobile

### `src/pages/Profile.tsx`
- Remover botão "Voltar" duplicado (Layout já tem)
- Garantir que chips de seleção tenham touch targets mínimos de 44px

### `src/pages/Index.tsx`
- Garantir que cards de notificação não cortam no mobile
- Touch target do botão de delete de notificações

### `src/components/AzeraChatbot.tsx`
- Garantir que o panel full-screen no mobile respeita `pb-safe` no input

### `src/pages/Landing.tsx`
- Botões CTA em `flex-col` no mobile já funcionam, apenas garantir `w-full` nos botões

### `src/index.css`
- Adicionar classe utilitária `.touch-action-visible` para mobile que substitui `group-hover:opacity-100` por sempre visível em touch devices
- Melhorar `.pb-safe` para incluir bottom nav height

### `src/pages/FounderMessages.tsx`
- Garantir que a lista de conversas e o chat se alternam corretamente no mobile (já existe lógica, verificar se funciona)

## Resumo

| Ficheiro | Alteração Principal |
|---|---|
| `MobileBottomNav.tsx` | Fix path `/perfil` → `/profile`, melhorar active detection |
| `Agenda.tsx` | Calendar collapsible no mobile, delete buttons visíveis em touch |
| `AI.tsx` | `pb-safe` no input, fechar sidebar ao selecionar conversa mobile |
| `Profile.tsx` | Remover back button duplicado |
| `Index.tsx` | Touch targets em notificações |
| `AzeraChatbot.tsx` | `pb-safe` robusto no mobile |
| `Landing.tsx` | Botões full-width no mobile |
| `index.css` | Utility classes para touch devices |

