

## Plano: Sistema de Insígnias Colecionáveis

### Visão Geral
Sistema de insígnias (badges) que os usuários conquistam automaticamente com base em progresso, projetos concluídos, atividade e plano de assinatura. As insígnias têm cores temáticas e são exibidas no perfil do founder.

### 1. Migração SQL — Tabela `user_badges`

Criar tabela para armazenar insígnias conquistadas:
```sql
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_key TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_key)
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
-- SELECT: qualquer autenticado pode ver (para exibir no perfil de outros)
-- INSERT/UPDATE/DELETE: apenas service_role (sistema concede automaticamente)
```

### 2. Definição das Insígnias — `src/lib/badges.ts`

Arquivo com todas as insígnias, suas cores, ícones e critérios:

| Badge Key | Nome | Cor | Critério |
|---|---|---|---|
| `first_venture` | Primeiro Venture | Branco | Criar 1 venture |
| `networker` | Networker | Preto | 5+ conexões aceitas |
| `builder` | Builder | Verde | 3+ projetos criados |
| `goal_crusher` | Esmagador de Metas | Amarelo | 5+ objetivos concluídos |
| `idea_machine` | Máquina de Ideias | Azul | 10+ ideias no cofre |
| `challenger` | Desafiante | Laranja | 3+ desafios concluídos |
| `social_butterfly` | Borboleta Social | Rosa | 10+ posts no feed |
| `habit_master` | Mestre dos Hábitos | Roxo | Streak 30+ em hábitos |
| `elite_achiever` | Elite Achiever | Dourado Metálico | Score 80+ |
| `trusted_pro` | Confiança Pro | Verde (gradiente) | Plano PRO ativo |
| `trusted_business` | Confiança Business | Dourado (gradiente) | Plano BUSINESS ativo |
| `verified_founder` | Fundador Verificado | Branco/Prata | Perfil verificado |

Cores com estilos CSS distintos (dourado metálico com shimmer para `elite_achiever`, gradientes para planos).

### 3. Edge Function — `calculate-badges`

Nova edge function que:
1. Consulta contagens do usuário (ventures, conexões, projetos, objetivos concluídos, ideias, desafios concluídos, posts, hábitos, score, plano)
2. Compara com critérios de cada insígnia
3. Insere novas insígnias conquistadas em `user_badges` (ON CONFLICT DO NOTHING)
4. Retorna lista completa de insígnias do usuário

Chamada automaticamente junto com `calculate-founder-score`.

### 4. Componente — `src/components/BadgeShowcase.tsx`

Componente reutilizável que:
- Recebe `userId` e busca insígnias de `user_badges`
- Exibe em grid com ícones estilizados por cor
- Insígnias não conquistadas ficam em cinza/bloqueadas (apenas no próprio perfil)
- Insígnias de plano (Pro/Business) têm shimmer animado
- Insígnia dourada metálica tem animação de brilho

### 5. Integração nos Perfis

**`src/pages/FounderProfile.tsx`**: Seção "Insígnias" após o Founder Score, mostrando apenas as conquistadas.

**`src/pages/Profile.tsx`**: Seção "Minhas Insígnias" com todas (conquistadas brilhantes, não conquistadas em cinza com dica do critério).

### 6. CSS — `src/index.css`

Classes para cada cor de insígnia:
- `.badge-white`, `.badge-black`, `.badge-green`, `.badge-yellow`, `.badge-blue`, `.badge-orange`, `.badge-pink`, `.badge-purple`
- `.badge-gold-metallic` com gradiente metálico + shimmer animation
- `.badge-trust-pro` / `.badge-trust-business` com gradiente de confiança

### 7. Pricing — Adicionar menção às insígnias

Atualizar `includes` dos planos Pro e Business em `src/pages/Pricing.tsx` para mencionar "Insígnia de Confiança Pro/Business".

### Ficheiros a criar/editar
- Nova migração SQL (tabela `user_badges`)
- `supabase/functions/calculate-badges/index.ts` (edge function)
- `src/lib/badges.ts` (definições)
- `src/components/BadgeShowcase.tsx` (componente)
- `src/index.css` (estilos das insígnias)
- `src/pages/FounderProfile.tsx` (integração)
- `src/pages/Profile.tsx` (integração)
- `src/pages/Pricing.tsx` (menção nos planos)

