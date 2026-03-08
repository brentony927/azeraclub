

## 5 Novos Recursos para o AZERA CLUB

Implementacao completa de Venture Builder, Founder Leaderboard, AI Trend Scanner, Weekly Report e Bookmark System.

---

### 1. Banco de Dados (1 migracao)

**Novas tabelas:**

- **`ventures`** — id, user_id, name, industry, problem, solution, target_market, business_model, ai_roadmap (text), status (draft/active/completed), created_at, updated_at
- **`venture_members`** — id, venture_id (FK ventures), user_id, role (co-founder/developer/investor), invited_at, status (pending/accepted)
- **`venture_notes`** — id, venture_id (FK ventures), user_id, content, created_at
- **`bookmarks`** — id, user_id, item_type (founder/venture/opportunity/trend), item_id (uuid), created_at. Unique constraint on (user_id, item_type, item_id)
- **`trend_scans`** — id, user_id, title, summary, source, link, ai_insight, category, created_at

Todas com RLS por user_id. `venture_members` e `venture_notes` com RLS baseado em membership ou ownership.

**Habilitar realtime** em `founder_notifications` (ja existe).

---

### 2. Novas Paginas (5)

| Rota | Pagina | Tier |
|------|--------|------|
| `/venture-builder` | VentureBuilder.tsx | Pro |
| `/leaderboard` | FounderLeaderboard.tsx | Free |
| `/trend-scanner` | TrendScanner.tsx | Pro |
| `/weekly-report` | WeeklyReport.tsx | Pro |
| `/saved` | SavedItems.tsx | Free |

---

### 3. Venture Builder (`/venture-builder`)

- Lista de ventures do usuario
- Dialog "Create Venture" com formulario (name, industry, problem, solution, target_market, business_model)
- Botao "Build With AI" chama edge function `azera-ai` com prompt estruturado para gerar roadmap, primeiras acoes e riscos
- Salva resultado em `ai_roadmap`
- Cada venture tem tabs: Overview, Team, Roadmap, Notes
- Tab Team: convidar usuarios (busca por nome em `founder_profiles`), insere em `venture_members`
- Tab Notes: CRUD simples em `venture_notes`

---

### 4. Founder Leaderboard (`/leaderboard`)

- Query `founder_profiles` ordenado por `reputation_score` DESC, limit 50
- Top 3 com medalhas douradas/prateadas/bronze
- Cards com avatar, nome, score, skills, verified badge
- Calculo de reputation ja existe no schema — atualizar via client-side apos acoes (criar projeto, conectar, postar oportunidade) ou manter calculo existente

---

### 5. AI Trend Scanner (`/trend-scanner`)

- Usa edge function `azera-ai` com `newsContext: true` (ja suportado) para buscar tendencias por categoria
- Categorias: AI, Fintech, SaaS, E-commerce, Web3, HealthTech
- Resultados renderizados em cards com Title, Summary, Source
- Abaixo de cada card: "Opportunity Insight" gerado pela IA
- Salva em `trend_scans` para historico
- Botao bookmark em cada card

---

### 6. Weekly Report (`/weekly-report`)

- Botao "Generate Report" busca dados da semana (novos founders, trending industries, oportunidades, conexoes recomendadas)
- Chama `azera-ai` com contexto semanal para gerar relatorio formatado
- Renderiza com `AIArticleRenderer`
- Botao "Download PDF" usando `window.print()` com CSS `@media print` otimizado
- Botao "Share" copia link ou texto

---

### 7. Bookmark System (`/saved`)

- Componente `BookmarkButton` reutilizavel (toggle star) que insere/deleta em `bookmarks`
- Integrar nos cards de: FounderCard, venture cards, opportunity cards, trend cards
- Pagina `/saved` com tabs: Founders, Ventures, Opportunities, Trends
- Cada tab busca bookmarks por `item_type` e faz join com a tabela correspondente

---

### 8. Sidebar e Rotas

Adicionar ao `AppSidebar.tsx` novo grupo "Plataforma":
- Venture Builder (Rocket icon)
- Leaderboard (Trophy icon)
- Trend Scanner (TrendingUp icon)
- Weekly Report (FileText icon)
- Saved (Star icon)

Adicionar 5 rotas protegidas ao `App.tsx`.

---

### 9. Edge Function

Sem nova edge function. Reutilizar `azera-ai` existente com prompts especificos para:
- Venture roadmap generation
- Trend analysis com `newsContext`
- Weekly report generation

Adicionar `verify_jwt = false` ao `config.toml` se ainda nao existir para `azera-ai`.

---

### Arquivos novos (~7):
- `src/pages/VentureBuilder.tsx`
- `src/pages/FounderLeaderboard.tsx`
- `src/pages/TrendScanner.tsx`
- `src/pages/WeeklyOpportunityReport.tsx`
- `src/pages/SavedItems.tsx`
- `src/components/BookmarkButton.tsx`
- Migration SQL

### Arquivos editados (~4):
- `src/App.tsx` (5 novas rotas)
- `src/components/AppSidebar.tsx` (novo grupo)
- `src/components/FounderCard.tsx` (bookmark button)
- `src/index.css` (estilos leaderboard)

