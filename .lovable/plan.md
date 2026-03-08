

## Traduzir Todo o Site para Português Brasileiro

### Resumo
Existem dezenas de strings em inglês espalhadas pelo projeto. O plano é traduzir todas para PT-BR mantendo coerência com o tom elegante já estabelecido.

### Arquivos e Traduções

**1. `src/components/AppSidebar.tsx`** — Labels do sidebar
- "Founder Feed" → "Feed de Founders"
- "Global Map" → "Mapa Global"
- "Venture Builder" → "Construtor de Ventures"
- "Ranking Startups" → "Ranking de Startups"
- "Leaderboard" → "Classificação"
- "Trend Scanner" → "Scanner de Tendências"
- "Weekly Report" → "Relatório Semanal"
- "Founder Alignment" → "Alinhamento de Founders"

**2. `src/data/founderConstants.ts`** — Constantes usadas em formulários
- `CONTINENT_OPTIONS`: "North America" → "América do Norte", etc.
- `SKILL_OPTIONS`: "Developer" → "Desenvolvedor", "Sales" → "Vendas", "Product" → "Produto", "Finance" → "Finanças", "Operations" → "Operações"
- `INDUSTRY_OPTIONS`: "Education" → "Educação", "Health" → "Saúde", "Agency" → "Agência"
- `LOOKING_FOR_OPTIONS`: "Co-founder" → "Co-fundador", "Developer" → "Desenvolvedor", "Investor" → "Investidor", "Marketing Partner" → "Parceiro de Marketing"
- `COMMITMENT_OPTIONS/LABELS`: "Side Project" → "Projeto Paralelo", "Startup Idea" → "Ideia de Startup", "Full Business" → "Negócio Completo"
- `BUSINESS_INTERESTS`: manter em inglês (termos de indústria universais)

**3. `src/pages/VentureBuilder.tsx`** — Textos do Venture Builder
- "Create Venture" → "Criar Venture"
- "Startup Name" → "Nome da Startup"
- "Industry" → "Indústria"
- "Problem" → "Problema"
- "Solution" → "Solução"
- "Target Market" → "Mercado Alvo"
- "Business Model" → "Modelo de Negócio"
- "Goal" → "Objetivo"
- "Build With AI" → "Construir com IA"
- Tab labels: "Overview" → "Visão Geral", "Tasks" → "Tarefas", "Chat" → "Chat", "Team" → "Equipa", "Notes" → "Notas"
- Role options: "Co-founder" → "Co-fundador", "Developer" → "Desenvolvedor", "Designer" → "Designer", "Marketing" → "Marketing", "Investor" → "Investidor"

**4. `src/components/venture/VentureTasksTab.tsx`** — Kanban
- "To Do" → "A Fazer", "In Progress" → "Em Progresso", "Done" → "Concluído"
- "Kanban Board" → "Quadro Kanban"

**5. `src/components/venture/VentureChatTab.tsx`** — Chat da venture
- "Team Chat" → "Chat da Equipa"
- "Ask AI Co-Founder" → "Perguntar ao Co-Fundador IA"
- "AI Co-Founder" → "Co-Fundador IA"

**6. `src/components/venture/VentureRoadmapTab.tsx`**
- "Build With AI" → "Construir com IA"

**7. `src/pages/Contact.tsx`** — Página de contacto
- "Contact Us" → "Contacte-nos"
- "Have a question..." → "Tem uma pergunta, sugestão ou proposta de parceria? Adoraríamos ouvir de si."
- "Email us directly" → "Envie-nos um email"
- "Name" → "Nome", "Your name" → "Seu nome"
- "Email" → "Email"
- "Message" → "Mensagem", "How can we help?" → "Como podemos ajudar?"
- "Send Message" → "Enviar Mensagem"
- "Sending..." → "Enviando..."
- "Back" → "Voltar"

**8. `src/pages/FounderProfile.tsx`** — Perfil do founder
- "Connect" → "Conectar"
- "Message" → "Mensagem"
- "Invite to Venture" → "Convidar para Venture"
- Role labels: "Founder", "Co-Founder", "Developer", "Designer", "Marketer", "Investor", "Builder" → traduzir para PT-BR

**9. `src/pages/Profile.tsx`** — Perfil do utilizador
- Role labels traduzidos

**10. `src/pages/FounderOpportunities.tsx`**
- `LOOKING_OPTIONS` traduzido

**11. `src/pages/WeeklyOpportunityReport.tsx`**
- "Weekly Report" label já está em PT no featureName, verificar conteúdo

### Nota
Termos técnicos de indústria (SaaS, AI, Fintech, Web3, etc.) e nomes de marca (AZERA, Venture Builder como conceito) permanecem em inglês quando são termos universais do ecossistema de startups.

