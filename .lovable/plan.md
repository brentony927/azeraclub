

# Plan: Mobile Optimization

## Issues Found

1. **Quick Actions grid (Dashboard)** — 4-column grid puts "Radar" card alone on a new row on small screens. Should be 2x2 on mobile.
2. **FounderFeed header buttons overflow** — "Atualizar" and "Filtros" buttons with text overflow on mobile. Should show icon-only on small screens.
3. **FounderFeed tabs** — `max-w-md` on TabsList wastes space on mobile; should be full-width.
4. **Messages page height** — `h-[70vh]` doesn't account for bottom nav bar, cutting off content.
5. **AI page height** — `h-[calc(100dvh-3.5rem)]` doesn't account for bottom nav; input hidden behind it.
6. **Chatbot FAB position** — `bottom-28` on mobile overlaps with notification toast area inconsistently.
7. **FloatingNotification position** — `bottom-28` may overlap with chatbot FAB.
8. **Sidebar trigger** — On mobile, the sidebar trigger (hamburger) is visible but unnecessary since MobileBottomNav handles navigation. Should be hidden on mobile.
9. **Header back button + sidebar trigger** — Takes up space on small screens; sidebar trigger should hide on mobile.

## Changes

### 1. `src/pages/Index.tsx`
- Change quick actions grid from `grid-cols-4` to `grid-cols-2 sm:grid-cols-4` so all 4 cards display in a clean 2x2 grid on mobile.

### 2. `src/pages/FounderFeed.tsx`
- Header: wrap title and buttons in a responsive layout. On mobile, stack title above buttons or hide button text (icon-only).
- Remove `max-w-md` from TabsList so tabs stretch full-width on mobile.

### 3. `src/pages/FounderMessages.tsx`
- Change `h-[70vh]` to `h-[calc(70vh-4rem)]` on mobile to account for bottom nav, or use `h-[calc(100dvh-12rem)]` for better fit.

### 4. `src/pages/AI.tsx`
- Adjust `h-[calc(100dvh-3.5rem)]` to account for bottom nav on mobile: `h-[calc(100dvh-3.5rem)] pb-20 md:pb-0`.
- Bottom input already has `mb-16 md:mb-0` which is good.

### 5. `src/components/Layout.tsx`
- Hide `SidebarTrigger` on mobile (`hidden md:flex`) since MobileBottomNav handles navigation.
- This gives more header space on mobile.

### 6. `src/components/AzeraChatbot.tsx`
- Adjust FAB position: `bottom-20` on mobile (just above bottom nav) instead of `bottom-28`.

### 7. `src/components/FloatingNotification.tsx`
- Adjust position to `bottom-36 md:bottom-20` to sit above chatbot FAB on mobile.

### 8. `src/pages/Agenda.tsx`
- Title `text-3xl` → `text-2xl md:text-3xl` for mobile fit.
- Header flex layout: wrap on small screens.

