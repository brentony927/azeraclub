

## Elite Premium Experience Overhaul

This is a large-scope change that touches CSS, layout, and every page. I'll break it into focused deliverables.

### 1. Enhanced Elite Theme CSS (`src/index.css`)

Rewrite the `.elite-theme` block with:
- **Color palette**: Black background (#0a0a0a), gold (`hsl(42,50%,56%)`) as primary, white (`#f5f5f5`) for text, creating a Black/Gold/White triad
- **Glass cards**: Stronger `backdrop-blur-3xl`, gold-tinted borders with glow
- **Animated gradient background**: Replace static `bgFloat` with a multi-layer animated gradient using gold/black orbiting blobs (`@keyframes eliteGradientOrbit`)
- **Floating elements keyframe**: `@keyframes eliteFloat` for subtle Y-axis + rotation float on cards/icons
- **All buttons get parallax-like hover**: Scale + translateY + gold glow shadow on hover with smooth spring-like transitions
- **Scrollbar**: Gold-tinted thumb with glow on hover
- **Enhanced blur**: More aggressive `backdrop-blur` on header, sidebar, cards

### 2. Elite Animated Background Component (`src/components/EliteBackground.tsx`)

Create a new component rendered inside Layout when `isElite`:
- Minimalist looping background with 3-4 animated gradient orbs (gold/black/white) using CSS animations
- Floating gold dots/particles (pure CSS, no library) with staggered `animation-delay`
- `pointer-events: none`, fixed position, `z-index: 0`

### 3. Layout Updates (`src/components/Layout.tsx`)

- Add `EliteBackground` for elite users
- Add a global **back button** in the header (using `useNavigate(-1)`) visible on all pages except home
- Header: stronger blur + gold border-bottom for elite
- Wrap `{children}` with a motion container for page transitions (fade + slide)

### 4. Global Back Button in Header

- In `Layout.tsx` header, add `<ArrowLeft>` button that calls `navigate(-1)` when `location.pathname !== "/"`
- Styled with elite gold accent when elite theme active

### 5. Enhanced Animations — Global Motion Wrapper

Create `src/components/PageTransition.tsx`:
- Wraps page content with `framer-motion` `AnimatePresence` + page enter/exit animations (fade + slide-up + blur)
- Applied in `Layout.tsx` around `{children}`

### 6. Elite Button Styles (`src/index.css` additions)

For `.elite-theme`:
- All `button`, `.btn-premium`, `[role="button"]`: 
  - `transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`
  - Hover: `translateY(-2px) scale(1.03)` + gold box-shadow glow
  - Active: `translateY(0) scale(0.98)`
- Cards: `transition: all 0.5s ease` + hover float effect

### 7. Elite Glass Effects on Cards

- `.elite-theme .glass-card`: `backdrop-blur-3xl`, gold gradient border (1px), subtle gold inner glow
- `.elite-theme .glass-card-hover:hover`: More dramatic lift (`translateY(-8px)`), stronger gold glow shadow

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/index.css` | **Modify** — Expand `.elite-theme` with animated gradients, floating keyframes, enhanced blur, button parallax, gold glow effects |
| `src/components/EliteBackground.tsx` | **Create** — Animated gradient orbs + floating particles background |
| `src/components/PageTransition.tsx` | **Create** — Framer Motion page transition wrapper |
| `src/components/Layout.tsx` | **Modify** — Add back button, EliteBackground, PageTransition wrapper, enhanced header blur |

### Technical Notes

- No new dependencies needed (framer-motion already installed)
- All elite enhancements scoped under `.elite-theme` class so free/basic/pro users are unaffected
- Back button uses `useNavigate()` + `useLocation()` from react-router-dom (already imported pattern)
- CSS animations preferred over JS for background effects (performance)
- Mobile responsive: floating elements scale down, parallax effects reduced via `prefers-reduced-motion`

