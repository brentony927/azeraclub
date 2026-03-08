## Perfil Completo de Founder — AZERA CLUB

Reformular completamente a página `FounderProfile.tsx` para se tornar um "cartão de visita de founder" profissional, inspirado no AngelList/LinkedIn. O perfil atual é básico — precisa de todas as seções solicitadas.

---

### Dados adicionais necessários (queries no load)

Além do `founder_profiles`, buscar:

- **Conexões**: count de `founder_connections` (accepted) do user
- **Ventures**: lista de `ventures` do user (nome, industry, status)
- **Oportunidades**: count de `founder_opportunities` do user
- **Atividade recente**: últimas 5 ações (conexões feitas, ventures criadas, oportunidades postadas) via queries combinadas
- **Shared interests**: intersecção entre `myProfile.interests` e `profile.interests`

Nenhuma migração necessária — todos os dados já existem nas tabelas.

---

### Estrutura visual do perfil (seções em ordem)

**1. Header**

- Avatar grande (96px), nome, verificação badge, cidade/país
- Founder Score com Progress bar + valor numérico
- Founder Badge baseado no commitment (Founder / Co-Founder / Builder / Investor / Developer / Designer / Marketer) — mapeado do campo `commitment` + `skills`
- Views count

**2. Social Proof Stats** (cards horizontais)

- Connections count
- Ventures Created count
- Projects Joined (venture_members count)
- Opportunities Posted count

**3. Bio / Elevator Pitch**

- Campo `building` renderizado como bio pitch

**4. Current Venture** (card destacado)

- Primeira venture ativa do usuário (query `ventures` where user_id)
- Nome, Industry, Stage (status), Team Size (venture_members count)
- Se não tem venture: "Nenhuma venture ativa"

**5. Looking For** (badges clicáveis)

- Array `looking_for` como badges

**6. Skills** (badges)

- Array `skills`

**7. Interests** (badges menores)

- Array `interests`

**8. Ventures / Portfólio** (lista de cards)

- Todas as ventures do usuário com nome, industry, status

**9. Compatibility** (só para visitantes)

- Match score + shared interests listados

**10. Activity Feed** (últimas 5 ações)

- Conexões recentes, ventures criadas, oportunidades postadas

**11. Action Buttons** (para visitantes)

- Connect, Message, Invite to Venture, Save Profile (bookmark)

---

### Arquivos


| Ação    | Arquivo                                                              |
| ------- | -------------------------------------------------------------------- |
| Rewrite | `src/pages/FounderProfile.tsx` — página completa com todas as seções |


Sem migrações. Sem novas dependências. Todos os dados vêm de tabelas existentes.

MUDAR O NOME DE FOUNDER MATCH PARA Founder Alignment