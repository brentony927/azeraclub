## Perfil Completo — Unificar Profile com Founder Profile

O problema: a página `/profile` ainda tem apenas campos basicos (nome, idade, cidade, profissao, bio, 5 interesses lifestyle). As 11 seções do perfil founder completo não existem na **visualização** (`/founder-profile/:id`) e nem **na edição** (`/profile`).

### Solução

Reescrever `src/pages/Profile.tsx` para incorporar todos os campos do perfil founder, permitindo editar:

1. **Avatar + Nome + Idade + Cidade/País/Continente** (já existe parcialmente)
2. **Bio / Elevator Pitch** (campo `building` do founder_profiles, limite 250 chars)
3. **Current Venture** — exibir venture atual (read-only, link para Venture Builder)
4. **Looking For** — multi-select com opções de `LOOKING_FOR_OPTIONS`
5. **Skills** — multi-select com `SKILL_OPTIONS`
6. **Interests** — substituir os 5 interesses lifestyle pelo array completo de `BUSINESS_INTERESTS` com busca
7. **Commitment Level** — select com `COMMITMENT_OPTIONS`
8. **Industry** — multi-select com `INDUSTRY_OPTIONS`
9. **Founder Score + Badge** — exibir (read-only)
10. **Social Proof Stats** — exibir (read-only)

### Fluxo de dados

A página carrega dados de **duas tabelas** em paralelo:

- `profiles` — avatar_url, display_name, age, location, profession, bio geral
- `founder_profiles` — skills, industry, building, looking_for, commitment, interests, country, city, continent, reputation_score, is_verified

O save atualiza ambas as tabelas.

### Arquivos


| Acao    | Arquivo                                                                 |
| ------- | ----------------------------------------------------------------------- |
| Rewrite | `src/pages/Profile.tsx` — página completa com todas as seções editáveis |


Importar constantes de `@/data/founderConstants.ts`. Sem migrações. Sem novas dependências.