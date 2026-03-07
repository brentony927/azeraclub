

## Mobile Experience Improvements

### Problems Identified

1. **Chatbot overlay blocks content on mobile**: The floating chatbot panel is fixed at `w-[400px] h-[540px]` positioned `bottom-6 right-6`, which overflows on small screens and can block navigation.

2. **Main content padding too large on mobile**: Layout uses `p-6 lg:p-8` which wastes space on small screens.

3. **Footer nav doesn't wrap on mobile**: Footer uses `flex items-center gap-8` with no wrapping, can overflow.

4. **AI page sidebar takes full screen but lacks clear UX**: The AI sidebar on mobile uses `absolute inset-0 z-50` which is good, but the main chat area height `h-[calc(100vh-4rem)]` doesn't account for the Layout header properly.

5. **Sidebar trigger may be too small**: The `SidebarTrigger` is `h-7 w-7` which is small for mobile touch targets (recommended 44x44px).

### Plan

1. **Make AzeraChatbot mobile-friendly**
   - On mobile, make the chat panel full-screen (`inset-0` or near full-width/height) instead of fixed 400x540px
   - Ensure the trigger button doesn't overlap with important UI elements

2. **Improve Layout for mobile**
   - Reduce main content padding on mobile: `p-4 sm:p-6 lg:p-8`
   - Increase touch target for SidebarTrigger on mobile

3. **Fix Footer for mobile**
   - Add `flex-wrap` and reduce gap on mobile

4. **Fix AI page mobile layout**
   - Adjust height calculation for mobile
   - Ensure the conversation sidebar dismisses properly and chat input is accessible

5. **Improve touch targets globally**
   - Ensure buttons and interactive elements meet minimum 44px touch targets on mobile

### Files to Modify

- `src/components/AzeraChatbot.tsx` — Full-screen chat on mobile
- `src/components/Layout.tsx` — Adjust padding, touch targets
- `src/components/Footer.tsx` — Responsive footer nav
- `src/pages/AI.tsx` — Fix mobile height/layout issues
- `src/components/AppSidebar.tsx` — Ensure menu items have adequate touch targets in the Sheet

