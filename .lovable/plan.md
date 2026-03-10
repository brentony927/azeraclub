

# Plan: Replace Emojis with Animated 3D Icon Components

## Summary

Replace all emoji usage across the app with the existing `Icon3D` component, enhanced with a subtle CSS pulse/float animation. This affects ~25 files spanning toast messages, ticker items, empty states, category labels, content formatting, and inline decorations.

## Step 1 — Enhance Icon3D with animation

Add an optional `animated` prop to `Icon3D` that applies a subtle CSS keyframe (gentle float/pulse). Add the keyframe to `index.css`.

```tsx
// New prop: animated?: boolean
// When true, applies class "animate-icon3d-float"
```

```css
@keyframes icon3dFloat {
  0%, 100% { transform: perspective(80px) rotateX(-4deg) translateY(0); }
  50% { transform: perspective(80px) rotateX(-2deg) translateY(-2px); }
}
.animate-icon3d-float { animation: icon3dFloat 3s ease-in-out infinite; }
```

## Step 2 — Refactor EmptyState to accept ReactNode icon

Change `EmptyState` `icon` prop from `string` to `React.ReactNode` so it can receive `<Icon3D>` instead of emoji strings. Update all 6 call sites:

| Page | Emoji | Replacement |
|---|---|---|
| Travel | ✈️ | `<Icon3D icon={Plane} color="blue" size="lg" animated />` |
| Health | 💪 | `<Icon3D icon={Dumbbell} color="green" size="lg" animated />` |
| Social | 💎 | `<Icon3D icon={Gem} color="gold" size="lg" animated />` |
| Properties | 🏠 | `<Icon3D icon={Home} color="silver" size="lg" animated />` |
| Experiences | 🍷 | `<Icon3D icon={Wine} color="red" size="lg" animated />` |

## Step 3 — ActivityTicker

Replace emoji prefixes in ticker text with inline `<Icon3D>` components. Change items from plain strings to JSX:
- 🚀 → `<Icon3D icon={Rocket} color="gold" size="xs" animated />`
- 🤝 → `<Icon3D icon={Handshake} color="green" size="xs" animated />`
- 💡 → `<Icon3D icon={Lightbulb} color="gold" size="xs" animated />`
- 🌍 → `<Icon3D icon={Globe} color="blue" size="xs" animated />`
- 📈 → `<Icon3D icon={TrendingUp} color="green" size="xs" animated />`

This requires changing the ticker `text` field from `string` to `ReactNode`.

## Step 4 — KnowledgeLibrary categories

Replace emoji labels:
- 💼 → `<Icon3D icon={Briefcase} color="gold" size="xs" />`
- 🤝 → `<Icon3D icon={Handshake} color="green" size="xs" />`
- 🖥️ → `<Icon3D icon={Monitor} color="blue" size="xs" />`
- 🧠 → `<Icon3D icon={Brain} color="silver" size="xs" />`
- ⚡ → `<Icon3D icon={Zap} color="gold" size="xs" />`
- 💰 → `<Icon3D icon={Wallet} color="gold" size="xs" />`

Change `label` to `ReactNode` or split into icon + text.

## Step 5 — StartupRankings medals

Replace `MEDALS = ["🥇","🥈","🥉"]` with Icon3D components:
- 🥇 → `<Icon3D icon={Trophy} color="gold" size="sm" animated />`
- 🥈 → `<Icon3D icon={Trophy} color="silver" size="sm" animated />`
- 🥉 → `<Icon3D icon={Trophy} color="red" size="sm" animated />` (bronze ≈ red)

## Step 6 — Challenges page

Replace inline 🔥 and 🎉:
- `🔥` before title → `<Icon3D icon={Flame} color="red" size="xs" animated />`
- `Concluídos 🎉` → `Concluídos` + `<Icon3D icon={Sparkles} color="gold" size="xs" animated />`

## Step 7 — Toast messages (text-only context)

For toast strings containing emojis (e.g. `"Conexão aceita! 🤝"`), simply remove the emoji since toasts are plain text and Icon3D can't render there. This keeps toasts clean and minimalist. Affected files: FounderNotifications, FounderProfile, FounderFeed, GlobalFounderMap, MessageGroupDialog, CreateFounderPost, Challenges (~15 toast calls).

## Step 8 — CreateFounderPost tool config

Replace `emoji` field with icon reference for inline content formatting. Since these are used in markdown strings, replace emoji chars with text labels (e.g. `📝` → `[Diário]`, `💡` → `[Ideia]`).

## Step 9 — Travel/Properties placeholder images

Replace `<div className="...text-4xl">✈️</div>` and `🏠` with centered `<Icon3D icon={Plane/Home} size="lg" animated />`.

## Files Modified

1. `src/components/ui/icon-3d.tsx` — add `animated` prop
2. `src/index.css` — add `icon3dFloat` keyframe
3. `src/components/EmptyState.tsx` — change icon type to `ReactNode`
4. `src/pages/Travel.tsx` — EmptyState + placeholder
5. `src/pages/Health.tsx` — EmptyState
6. `src/pages/Social.tsx` — EmptyState
7. `src/pages/Properties.tsx` — EmptyState + placeholder
8. `src/pages/Experiences.tsx` — EmptyState
9. `src/components/ActivityTicker.tsx` — JSX ticker items
10. `src/pages/KnowledgeLibrary.tsx` — category labels
11. `src/pages/StartupRankings.tsx` — medals
12. `src/pages/Challenges.tsx` — inline icons + toasts
13. `src/components/CreateFounderPost.tsx` — tool config + toasts
14. `src/components/MessageGroupDialog.tsx` — toast
15. `src/components/FounderPostCard.tsx` — notification text
16. `src/components/FounderNotifications.tsx` — toasts
17. `src/pages/FounderFeed.tsx` — toasts
18. `src/pages/FounderProfile.tsx` — toasts
19. `src/pages/FounderNotificationsPage.tsx` — toasts
20. `src/pages/GlobalFounderMap.tsx` — notification text

