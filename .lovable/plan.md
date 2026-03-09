

## Plano: Sistema Completo de Founder Score + Notificações Floating

### 1. Notificações Floating (Sidebar Colapsada)

**Componente**: `src/components/FloatingNotification.tsx`
- Card animado (Framer Motion) que aparece no canto inferior esquerdo quando chega uma notificação e a sidebar está colapsada
- Auto-dismiss após 5 segundos, com botão de fechar
- Clicável — navega para a rota relevante
- Integrado no `Layout.tsx`, consome o canal Realtime de `founder_notifications`

### 2. Banco de Dados — Tabela `founder_scores`

```sql
CREATE TABLE public.founder_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  profile_points integer NOT NULL DEFAULT 0,
  network_points integer NOT NULL DEFAULT 0,
  project_points integer NOT NULL DEFAULT 0,
  activity_points integer NOT NULL DEFAULT 0,
  influence_points integer NOT NULL DEFAULT 0,
  total_score integer NOT NULL DEFAULT 0,
  level text NOT NULL DEFAULT 'New Founder',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.founder_scores ENABLE ROW LEVEL SECURITY;

-- Todos authenticated podem ver scores (leaderboard público)
CREATE POLICY "Anyone can view scores" ON public.founder_scores
  FOR SELECT TO authenticated USING (true);

-- Usuários gerenciam próprio score
CREATE POLICY "Users manage own score" ON public.founder_scores
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Atualizar founder_profiles.reputation_score via trigger
CREATE OR REPLACE FUNCTION sync_reputation_score()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE founder_profiles SET reputation_score = NEW.total_score WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_reputation_after_score_update
  AFTER INSERT OR UPDATE ON founder_scores
  FOR EACH ROW EXECUTE FUNCTION sync_reputation_score();
```

### 3. Edge Function — `calculate-founder-score`

Recebe `user_id`, calcula os 5 pilares consultando as tabelas relevantes, e faz upsert na `founder_scores`.

**Lógica dos pilares**:

```text
PERFIL (max 15):
  avatar_url → +2, building → +2, skills.length > 0 → +2,
  interests.length > 0 → +2, city → +1, age → +1,
  industry.length > 0 → +2, 100% completo → +3

NETWORKING (max 25):
  conexões aceitas × 2 (cap 10), mensagens enviadas × 0.5 (cap 5),
  mensagens respondidas × 1 (cap 10)

PROJETOS (max 25):
  ventures criadas × 8 (cap 16), membro de ventures × 5 (cap 10)

ATIVIDADE (max 20):
  oportunidades × 5 (cap 15), is_published → +5

INFLUÊNCIA (max 15):
  profile_views × 0.2 (cap 10), conexões recebidas × 1 (cap 5)
```

**Níveis**:
- 0–20: New Founder
- 21–40: Explorer
- 41–60: Builder
- 61–80: Operator
- 81–100: Elite Founder

**Bônus por plano**: PRO +5, BUSINESS +10 (cap total 100)

### 4. Integração no Frontend

**`src/lib/founderScore.ts`** — Hook `useFounderScore(userId)` que busca da tabela + função para recalcular.

**`src/pages/FounderProfile.tsx`** — Substituir barra de reputation_score estática pelo Founder Score real com nível, barra de progresso animada, e breakdown dos 5 pilares.

**`src/pages/FounderFeed.tsx`** — Ordenar por `total_score` do `founder_scores` (já sincronizado via trigger no `reputation_score`).

**`src/pages/FounderLeaderboard.tsx`** — Rankings Global / País / Cidade, com filtros e badges de nível.

**`src/components/FounderCard.tsx`** — Mostrar badge do nível (New Founder / Explorer / Builder / Operator / Elite Founder).

### 5. Recálculo Automático

O score é recalculado via chamada à edge function:
- Ao criar/atualizar perfil
- Ao enviar/receber conexão
- Ao criar venture/oportunidade
- Chamada manual no perfil ("Atualizar Score")

### 6. Badges Especiais

Exibidos no perfil e card:
- **Top Networker**: network_points ≥ 20
- **Startup Creator**: project_points ≥ 20
- **Opportunity Hunter**: activity_points ≥ 15
- **Elite Founder**: total_score ≥ 81

### Arquivos

- **Criar**: `src/components/FloatingNotification.tsx`, `src/lib/founderScore.ts`, `supabase/functions/calculate-founder-score/index.ts`
- **Editar**: `src/components/Layout.tsx`, `src/pages/FounderProfile.tsx`, `src/pages/FounderFeed.tsx`, `src/pages/FounderLeaderboard.tsx`, `src/components/FounderCard.tsx`, `src/pages/FounderMatch.tsx`
- **Migration SQL**: Tabela `founder_scores` + trigger + Realtime

