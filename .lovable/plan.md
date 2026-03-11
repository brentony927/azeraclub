

# Plan: Professional Visual Refinement

## Overview

Make the platform look more serious and trustworthy by refining 3D icons, badges, and the owner profile. Remove generic pulsing glows from badges, add metallic texture details, create a prominent animated 3D owner badge, and add a minimalist metallic animated background to the owner profile.

## 1. Badges — Remove Pulsing Glow, Add Metallic Detail

**File: `src/index.css`**

- Remove `badge-pulse` animation from `.badge-earned` class — replace with a subtle metallic inner shadow (no pulsing glow behind badges)
- Update all badge color classes to use metallic gradients instead of flat colors with glowing box-shadows
- Each badge gets a `background: linear-gradient(...)` with metallic highlights (light reflection at top, darker at bottom) and `inset` shadows for depth instead of outer glow

Example transformation:
```css
/* Before */
.badge-green {
  background: hsl(142 70% 45%);
  box-shadow: 0 0 8px hsl(142 70% 45% / 0.5);
}

/* After — metallic, no pulse */
.badge-green {
  background: linear-gradient(165deg, hsl(142 50% 60%), hsl(142 70% 40%), hsl(142 80% 25%));
  box-shadow: inset 0 1px 2px hsl(0 0% 100% / 0.3), inset 0 -1px 2px hsl(0 0% 0% / 0.3), 0 1px 3px hsl(0 0% 0% / 0.2);
}
```

Apply this metallic treatment to: `badge-white`, `badge-black`, `badge-green`, `badge-yellow`, `badge-blue`, `badge-orange`, `badge-pink`, `badge-purple`, `badge-gold-metallic`, `badge-trust-pro`, `badge-trust-business`.

## 2. Icon3D — More Serious, Less Generic

**File: `src/components/ui/icon-3d.tsx`**

- Deepen gradients — use darker base tones with sharper highlight (less candy, more brushed metal)
- Add a subtle 1px metallic border ring (`ring-1 ring-white/10`)
- Reduce outer glow shadow intensity
- Make the perspective transform slightly more pronounced for depth

## 3. Owner Profile — Prominent 3D Metallic Badge

**File: `src/pages/FounderProfile.tsx`**

Replace the current small `owner-badge` inline Badge with a larger, standalone 3D metallic component:
- Larger size (not inline text badge — a dedicated medallion element)
- Red metallic gradient with brushed steel highlights
- CSS 3D perspective + slow rotation animation
- Crown icon centered, with metallic text "DONO · AZERA CLUB"

**File: `src/index.css`**

Add new class `.owner-badge-3d-medallion` with:
- `width: 48px; height: 48px` rounded medallion
- Red-to-dark-red metallic gradient
- `perspective(200px) rotateY()` slow oscillation keyframe
- Inset metallic highlights (top-left light, bottom-right shadow)
- Subtle red outer glow (not pulsing — static or very slow fade)

## 4. Owner Profile — Minimalist Metallic Animated Background

**File: `src/index.css`**

Update `.owner-profile-wrapper::before` to use a metallic sheen animation:
- Replace current red tint with a brushed-metal sweep effect (linear gradient that shifts horizontally)
- Very subtle — dark metallic base with a slow-moving light reflection band
- Colors: dark gunmetal red (`hsl(0 30% 12%)`) with a traveling highlight (`hsl(0 60% 30% / 0.15)`)
- Animation: `owner-metallic-sheen 8s ease-in-out infinite` — a slow left-to-right light sweep

## Files to Modify

1. `src/index.css` — Badge metallic styles, remove pulse, owner medallion, metallic background
2. `src/components/ui/icon-3d.tsx` — Refined metallic gradients
3. `src/pages/FounderProfile.tsx` — Owner 3D medallion badge in header
4. `src/components/BadgeShowcase.tsx` — Remove `badge-earned` class usage (no more pulse)

