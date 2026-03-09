

## Plano: Auditoria Completa e Polimento para Lançamento

Depois de revisar todo o fluxo do site, identifiquei os seguintes pontos a corrigir e melhorar:

### Problemas Encontrados

1. **Chatbot sobrepõe a Bottom Nav no mobile** -- O botão flutuante do chatbot (`bottom-24`) pode conflitar com a `FloatingNotification` (`bottom-20 left-4`) no mobile, causando sobreposição visual.

2. **Footer "Início" linka para "/" ao invés de "/dashboard"** -- Dentro do layout protegido, o link "Início" no Footer aponta para `/`, mas deveria apontar para `/dashboard` para usuários logados.

3. **DevelopmentBanner com `animate-pulse` prejudica legibilidade** -- O `animate-pulse` faz o banner inteiro pulsar (incluindo texto e botão), dificultando a leitura e clique. Deveria pulsar apenas a borda.

4. **Falta `pb-safe` no MobileBottomNav** -- O `pb-safe` existe mas o container não tem height suficiente em iPhones com notch inferior -- a nav pode ficar parcialmente escondida.

5. **FloatingNotification posicionada atrás do MobileBottomNav** -- No mobile, a notificação flutuante (`bottom-20 left-4`) fica atrás/sobreposta à barra de navegação inferior.

6. **Chatbot abre fullscreen no mobile mas sem safe area no topo** -- Falta `pt-safe` para iPhones com notch.

7. **NotFound page não usa o design system** -- Página 404 usa `bg-muted` e um `<a>` simples, inconsistente com o resto do site.

### Correções Planejadas

**1. `src/components/DevelopmentBanner.tsx`**
- Remover `animate-pulse` do container
- Adicionar animação de pulso apenas na borda (via classe CSS customizada ou `animate-pulse` em um elemento wrapper da borda)

**2. `src/components/MobileBottomNav.tsx`**
- Garantir height adequado com safe-area (`pb-safe` + min-height)

**3. `src/components/FloatingNotification.tsx`**
- Ajustar posição no mobile para ficar acima da bottom nav (`bottom-24 md:bottom-20`)

**4. `src/components/AzeraChatbot.tsx`**
- Adicionar `pt-safe` no container fullscreen mobile
- Ajustar posição do botão flutuante para não sobrepor a FloatingNotification

**5. `src/components/Footer.tsx`**
- Corrigir link "Início" para "/dashboard" (já que o Footer só aparece dentro do layout protegido)

**6. `src/pages/NotFound.tsx`**
- Redesenhar com o design system (glass-card, animações, botão estilizado)

**7. `src/index.css`**
- Adicionar classe CSS para pulso na borda do banner de desenvolvimento

### Arquivos a editar
- `src/components/DevelopmentBanner.tsx`
- `src/components/MobileBottomNav.tsx`
- `src/components/FloatingNotification.tsx`
- `src/components/AzeraChatbot.tsx`
- `src/components/Footer.tsx`
- `src/pages/NotFound.tsx`
- `src/index.css` (adicionar animação de borda pulsante)

