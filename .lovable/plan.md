## Landing Page for AZERA

Currently, unauthenticated users only see a Login page. The plan is to create a public landing page at `/` that showcases AZERA's value proposition and redirects authenticated users to the dashboard.

### Architecture

- Create a new `**src/pages/Landing.tsx**` — the full landing page with all sections
- Move the current `Index.tsx` dashboard to render only for authenticated users
- Update `**src/App.tsx**` routing: `/` renders `Landing` for unauthenticated users, dashboard for authenticated ones (or use a new `/dashboard` route)

### Landing Page Sections (in order)

**1. Hero Section**

- Particle background (reuse existing `ParticlesBackground` component)
- Gradient overlay: moss green to black
- Headline: "Your Life. Organized, Optimized and Strategized by AI."
- Subheadline: "Plan your life, discover opportunities and make better decisions with an AI built for ambitious people."
- Authority line: "Built for entrepreneurs, creators and ambitious minds."
- Two CTAs: "Start Free" (primary, links to `/signup`) + "See How It Works" (secondary/outline, scrolls down)
- Trust line below buttons: "Free plan available · No credit card required"
- Animated app mockup preview (CSS-only mock of the dashboard UI)

**2. How AZERA Works — 3 Cards**

- Section title: "How AZERA Works"
- Three cards side by side (stacked on mobile) with icons, titles, descriptions:
  1. AI Life Strategist — "AI That Thinks With You"
  2. Opportunity Radar — "Discover Opportunities"
  3. Strategic Networking — "Build Powerful Connections"
- Bottom tagline: "AZERA was designed to transform your life into a strategic system."
- Scroll-reveal animations (reuse `ScrollReveal` component)

**3. See AZERA In Action — Example Cards**

- Section title: "See AZERA In Action" + subtitle
- Three animated example cards simulating real interactions:
  1. AI chat planning a week
  2. AI detecting opportunities
  3. Weekly Intelligence Report panel (score, goals, recommendations)
- Bottom tagline: "AZERA is not just an assistant. It is a strategic system for your life."

**4. Final CTA**

- Repeat CTA: "Start Free" + trust line
- Link to `/planos` for pricing details

**5. Footer**

- Reuse existing Footer component

### Files to Create/Modify


| File                                | Action                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| `src/pages/Landing.tsx`             | **Create** — Full landing page with all 4 sections                                   |
| `src/App.tsx`                       | **Modify** — Add `/` as public Landing route, move dashboard to handle auth redirect |
| `src/components/ProtectedRoute.tsx` | **Check** — May need minor update for redirect logic                                 |


### Technical Details

- All animations use existing `framer-motion` + `ScrollReveal`
- Particle background via existing `ParticlesBackground` component
- Mobile-first responsive design: cards stack vertically, hero text scales down
- Dark theme by default (matches current `.dark` CSS variables)
- No new dependencies needed

&nbsp;

**PREÇOS**

- Quero que o preço de visualização seja o preço de cobrança 

&nbsp;

**PREMIUM**

- Faça a conta do [brentonybss2025@gmail.com](mailto:brentonybss2025@gmail.com) premium