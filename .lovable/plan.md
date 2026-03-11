

# Fundos de Perfil Desbloqueáveis + Fundo Metálico Animado do Dono

## Resumo
Criar um sistema de 30 fundos de perfil desbloqueáveis por progressão (Founder Score), com um fundo metálico animado exclusivo para o dono. Apenas o fundo ativo é visível publicamente no perfil do utilizador.

## Alterações

### 1. Base de Dados — Nova tabela `profile_backgrounds`
Migração SQL para armazenar o fundo ativo do utilizador:

```sql
CREATE TABLE public.profile_backgrounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  active_background text DEFAULT 'none',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profile_backgrounds ENABLE ROW LEVEL SECURITY;

-- Qualquer autenticado pode VER o fundo ativo (público)
CREATE POLICY "Anyone can view active backgrounds"
  ON public.profile_backgrounds FOR SELECT TO authenticated
  USING (true);

-- Só o próprio pode inserir/atualizar
CREATE POLICY "Users manage own background"
  ON public.profile_backgrounds FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own background"
  ON public.profile_backgrounds FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### 2. `src/lib/profileBackgrounds.ts` — Definição dos 30 fundos
Ficheiro com array de 30 fundos, cada um com: `key`, `name`, `css` (classe ou inline style), `type` (solid/gradient/animated), `minScore` (requisito de desbloqueio).

Distribuição por score:
- **0-10** (6 fundos): Gradientes suaves — cinza, azul, verde, roxo, laranja, teal
- **11-25** (6 fundos): Gradientes duplos mais vibrantes
- **26-40** (6 fundos): Gradientes animados (shifting colors)
- **41-60** (6 fundos): Gradientes metálicos (prata, bronze, ouro, esmeralda, safira, ametista)
- **61-80** (4 fundos): Fundos animados premium (aurora, neon wave, galaxy, cyber)
- **81-100** (2 fundos): Fundos ultra-premium (diamond shimmer, platinum pulse)

Sem vermelho em nenhum fundo. Paletas: azul, verde, roxo, dourado, teal, laranja, prata, esmeralda.

### 3. `src/components/ProfileBackgroundPicker.tsx` — Componente de seleção
Secção expansível (Collapsible) no perfil com:
- Grid de previews dos 30 fundos (mini-cards 60×40px com o gradiente)
- Fundos bloqueados: overlay com cadeado + "Score: X necessário"
- Fundos desbloqueados: clicável, borda highlight quando selecionado
- Botão "Aplicar" que salva na tabela `profile_backgrounds`
- Fundo "Nenhum" como opção padrão

### 4. `src/components/ProfileBackgroundRenderer.tsx` — Renderizador do fundo
Componente que recebe o `backgroundKey` e renderiza o CSS correspondente como `div` absolutamente posicionada atrás do conteúdo do perfil. Usado tanto no perfil próprio quanto no público.

### 5. `src/pages/Profile.tsx` — Integração no perfil próprio
- Importar `ProfileBackgroundPicker` e `ProfileBackgroundRenderer`
- Buscar `profile_backgrounds` no `loadData()`
- Adicionar a secção expansível após o Badge Showcase
- Renderizar o fundo ativo atrás do conteúdo

### 6. `src/pages/FounderProfile.tsx` — Fundo visível para visitantes
- Buscar `profile_backgrounds.active_background` do utilizador visitado
- Se `is_site_owner`, forçar fundo metálico animado exclusivo (override)
- Renderizar `ProfileBackgroundRenderer` atrás do conteúdo do perfil

### 7. `src/index.css` — Animações CSS dos fundos
Adicionar keyframes para os fundos animados:
- `@keyframes bg-shift` — gradiente que se move
- `@keyframes bg-aurora` — efeito aurora boreal
- `@keyframes bg-shimmer` — brilho metálico
- `@keyframes bg-pulse` — pulsação suave
- `.owner-metallic-bg` — fundo metálico animado exclusivo do dono (gradiente prata/cinza escuro com shimmer)

### Detalhes técnicos

Fundo do dono (override automático):
```css
.owner-metallic-bg {
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #533483, #16213e, #1a1a2e);
  background-size: 400% 400%;
  animation: bg-shift 8s ease infinite;
}
```

Exemplo de fundo desbloqueável (score 50):
```ts
{ key: "metallic-gold", name: "Ouro Metálico", minScore: 50, type: "animated",
  css: "bg-gradient-metallic-gold" }
```

| Ficheiro | Ação |
|---|---|
| Migração SQL | Criar tabela `profile_backgrounds` com RLS |
| `src/lib/profileBackgrounds.ts` | Criar — definição dos 30 fundos |
| `src/components/ProfileBackgroundPicker.tsx` | Criar — seletor expansível |
| `src/components/ProfileBackgroundRenderer.tsx` | Criar — renderizador |
| `src/pages/Profile.tsx` | Editar — integrar picker + renderer |
| `src/pages/FounderProfile.tsx` | Editar — mostrar fundo ativo + override dono |
| `src/index.css` | Editar — adicionar keyframes e classes dos fundos |

