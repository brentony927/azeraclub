## Founder Match — Cinematic Intro + Animated Background

Two new visual systems for the Founder Match section.

---

### 1. Cinematic Boot-Up Intro (`FounderMatchIntro.tsx`)

A fullscreen overlay that plays once per session when entering `/founder-match` or `/founder-feed`.

**Animation sequence (3-4s total, Three.js + @react-three/fiber):**

1. Screen starts black
2. ~200 small glowing particles spawn at center, drifting inward
3. Particles assemble into "AZERA" text shape (using text geometry or pre-computed positions)
4. Logo holds with neon blue/purple glow pulse (~0.5s)
5. Explosion: particles fly outward with velocity + fade
6. Overlay fades to transparent, revealing the page beneath
7. Camera does a subtle zoom-in during assembly, zoom-out during explosion

**Technical approach:**

- Use `@react-three/fiber` (v8) + `three` (v0.160) already installed
- `Canvas` component with transparent background, fixed overlay at `z-50`
- Custom `Points` geometry for the particle system (BufferGeometry + PointsMaterial with additive blending)
- Pre-compute logo positions by sampling text path or using a simple "AZERA" bitmap grid
- GSAP timeline controls the animation phases (already installed)
- After animation completes, `onComplete` callback sets state to hide overlay
- Store `sessionStorage` flag so it only plays once per browser session

**New file:** `src/components/FounderMatchIntro.tsx`

**Integration:** Wrap in `FounderMatch.tsx` and `FounderFeed.tsx` — show overlay before content renders. Use a shared state/context or sessionStorage check.

---

### 2. Neural Network Particle Background (`FounderParticlesBackground.tsx`)

A persistent subtle background for all Founder Match pages (feed, profile, messages, opportunities).

**Visual:**

- Dark background with ~80 small floating particles (blue/purple glow)
- Particles drift slowly in random directions
- When particles are within 150px of each other, thin glowing lines connect them
- Very subtle opacity (0.2-0.3) so it doesn't distract from content

**Technical approach:**

- Use the existing `react-tsparticles` + `tsparticles-slim` (already installed, same pattern as `ParticlesBackground.tsx`)
- Configure with blue/purple colors (`#6366f1`, `#8b5cf6`), linked particles enabled, slow speed (0.5-0.8)
- Positioned as `fixed inset-0 z-0 pointer-events-none`

**New file:** `src/components/FounderParticlesBackground.tsx`

**Integration:** Add to `FounderFeed.tsx`, `FounderMatch.tsx`, `FounderProfile.tsx`, `FounderMessages.tsx`, `FounderOpportunities.tsx` — or better, wrap all founder routes in a shared layout component.

---

### 3. Files Summary


| Action | File                                                                |
| ------ | ------------------------------------------------------------------- |
| Create | `src/components/FounderMatchIntro.tsx` — Three.js cinematic intro   |
| Create | `src/components/FounderParticlesBackground.tsx` — Neural network bg |
| Edit   | `src/pages/FounderMatch.tsx` — Add intro + background               |
| Edit   | `src/pages/FounderFeed.tsx` — Add intro + background                |
| Edit   | `src/pages/FounderProfile.tsx` — Add background                     |
| Edit   | `src/pages/FounderMessages.tsx` — Add background                    |
| Edit   | `src/pages/FounderOpportunities.tsx` — Add background               |


No database changes needed. No new dependencies needed (Three.js, react-three-fiber, tsparticles, GSAP all already installed).

&nbsp;

**ABA:**  

- DEIXE A ABA FOUNDER MATCH LA EM CIMA  ACIMA DE FERRAMENTAS, TODAS AS OPÇÕES DO FOUNDER MATCH BRILHANDO EM DOURADO GRADIENTE COM SOMBRA, E O AVIÃOZINHO DO FOUNDER MATCH DECOLANDO E SUPER ANIMADO TROCANDO DE COR EM LOOP INFINITO