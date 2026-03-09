# Plano de Correções e Melhorias — AZERA CLUB

## Diagnóstico

### 1. Sistema de Feed/Mensagens

O sistema **está funcionando corretamente** no código — usa Supabase Realtime, insere mensagens, carrega conversas. O banco está vazio (`founder_messages` e `founder_profiles` sem dados), o que significa que não há usuários publicados no feed ainda. Quando os usuários criarem perfis e publicarem, o feed funcionará.

### 2. Erro nos Valores dos Planos

**Problema identificado:** Os preços estão corretos em Libras (£19/mês, £190/ano), que é a moeda configurada no Stripe. MAS o plano anual está usando os mesmos Price IDs mensais — quando o usuário clica "Anual", o Stripe cobra mensalmente porque só existe UM price_id por plano.

**Solução:** Criar Price IDs anuais no Stripe e mapear corretamente.

### 3. Bordas Arredondadas

**Problema:** `--radius: 0.625rem` (10px) e `.glass-card` usa `rounded-[16px]`. O usuário quer bordas arredondadas mas não totalmente redondas.

**Solução:** Ajustar para `--radius: 0.75rem` (12px) globalmente.

### 4. Tema Business (Dourado Metálico + Aura)

**Problema:** O `gold-gradient` está idêntico ao `moss-gradient` (linha 247). Precisa de um gradiente dourado metálico real e animação de "aura minimalista subindo" nos botões.

### 5. Animações de Fundo em Loop

**Solução:** Adicionar `.page-bg-animation` com partículas/orbs flutuantes sutis em todas as telas principais.

---

## Alterações Planejadas

### Arquivo: `src/pages/Pricing.tsx`

- Adicionar `price_id_yearly` para cada tier
- Passar `period` para `create-checkout` e usar o price_id correto

### Arquivo: `supabase/functions/create-checkout/index.ts`

- Aceitar parâmetro `period` no body
- Mapear para o price_id correto (mensal vs anual)

### Arquivo: `src/components/ui/pricing-section.tsx`

- Passar `period` para `onSubscribe`

### Arquivo: `src/index.css`

1. Ajustar `--radius` para 12px
2. Criar `.gold-gradient` real (dourado metálico)
3. Adicionar `.gold-aura-btn` com animação de aura subindo
4. Criar `.page-bg-animation` para fundos animados em loop

### Arquivo: `tailwind.config.ts`

- Adicionar keyframe `goldAura` para animação de partículas subindo

---

## Detalhes Técnicos

### Novos Price IDs Necessários

O Stripe precisa de novos preços anuais. Vou criar:

- `pro_yearly`: £190/ano (billing: yearly)
- `business_yearly`: £490/ano (billing: yearly)

### Gold Gradient Metálico

```css
.gold-gradient {
  background: linear-gradient(
    135deg, 
    hsl(42 70% 55%),      /* Gold base */
    hsl(35 80% 60%),      /* Rose gold */
    hsl(48 65% 50%),      /* Deep gold */
    hsl(42 70% 55%)       /* Gold base */
  );
}
```

### Aura Rising Animation

```css
.gold-aura-btn::before {
  /* Partículas douradas subindo */
  background: linear-gradient(to top, 
    hsl(42 70% 55% / 0.4), 
    transparent
  );
  animation: auraRise 2s ease-out infinite;
}
```

### Border Radius

De `0.625rem` (10px) → `0.75rem` (12px) para bordas mais suaves mas não pill-shaped.