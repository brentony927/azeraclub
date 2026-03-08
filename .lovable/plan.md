

## Traduzir Todo o Site para Portugues Elegante

O site tem uma mistura de portugues e ingles. As paginas internas (Login, Signup, Pricing, etc.) ja estao em portugues. O conteudo em ingles concentra-se em:

### Arquivos a alterar

**1. `src/pages/Landing.tsx`** — Pagina principal, toda em ingles
- Hero: "Your Life. Organized, Optimized and Strategized by AI." → "A Sua Vida. Organizada, Otimizada e Estrategizada por IA."
- Features, weekPlan, opportunities, CTAs, section titles — tudo traduzido para PT elegante
- Links: "Start Free" → "Começar Grátis", "See How It Works" → "Veja Como Funciona", etc.

**2. `src/pages/FAQ.tsx`** — Perguntas e respostas em ingles
- Todas as 8 FAQs traduzidas para portugues
- Titulo, subtitulo, link "Back" → "Voltar", "Contact us" → "Fale connosco"

**3. `src/pages/Contact.tsx`** — Formulario em ingles
- Labels: Name → Nome, Email, Message → Mensagem
- Placeholders, titulos, toast messages — tudo em PT
- "Send Message" → "Enviar Mensagem", "Contact Us" → "Fale Connosco"

**4. `src/pages/PrivacyPolicy.tsx`** — Toda em ingles
- Traduzir titulo, secoes (Informacoes que Coletamos, Como Usamos, Protecao de Dados, etc.)

**5. `src/pages/TermsOfService.tsx`** — Toda em ingles
- Traduzir titulo e todas as 8 secoes para portugues formal

**6. `src/pages/CookiePolicy.tsx`** — Toda em ingles
- Traduzir titulo e secoes

**7. `src/pages/NotFound.tsx`** — Em ingles
- "Page not found" → "Página não encontrada", "Return to Home" → "Voltar ao Início"

**8. `src/components/AppSidebar.tsx`** — Items Pro e Business em ingles
- proItems: "Skill Growth" → "Crescimento", "Goal Planner" → "Plano de Metas", "Daily Focus" → "Foco Diário", "Content Strategy" → "Estratégia de Conteúdo", "Habits" → "Hábitos", "Projects" → "Projetos", "Weekly Review" → "Revisão Semanal"
- businessItems: "Investments" → "Investimentos", "Life Simulation" → "Simulação de Vida", "Wealth Strategy" → "Estratégia Financeira", "Elite Events" → "Eventos Exclusivos", "Partners" → "Parceiros", "Investor Match" → "Match de Investidores", "Elite Library" → "Biblioteca Elite", "Alerts" → "Alertas", "AI Advisor" → "Consultor IA", "Life Master Plan" → "Plano de Vida"

**9. `src/components/Footer.tsx`** — Links mistos
- "Início" ja esta em PT, "Contact" → "Contacto", "Perfil" ja esta

**10. `src/components/ui/minimal-dock.tsx`** — Labels em ingles
- "Home" → "Início", "Experiences" → "Experiências", "Travel" → "Viagens", "Properties" → "Imóveis", "Social" → "Social", "Health" → "Saúde", "Profile" → "Perfil"

**11. Todas as 20 paginas Pro/Business** — `featureName` em ingles
- Traduzir os featureName para portugues (ex: "Strategic Life Simulation" → "Simulação de Vida Estratégica")
- Traduzir titulos h1/h2, labels de input, placeholders e botoes dessas paginas

**12. `index.html`** — title tag
- "Lovable Generated Project" → "AZERA CLUB — Sua Vida Estratégica"

### Abordagem
- Portugues brasileiro elegante e formal
- Manter termos de marca como "AZERA", "AZR", nomes de planos (Basic, Pro, Business)
- Traduzir todo conteudo voltado ao utilizador, incluindo toasts e placeholders

