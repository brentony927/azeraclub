

## Bug Analysis: "Interface da IA" Appearing on All Pages

### Root Cause

The issue is the **UpgradeCelebration overlay** — a full-screen modal (`z-[9999]`) that displays "ACESSO ELITE LIBERADO" on top of ALL page content. This overlay:

1. Triggers every time the subscription context detects an Elite plan and `localStorage` key `azera_last_celebrated_plan` doesn't match
2. Blocks the entire UI until the user clicks "Começar a Explorar"
3. Can re-trigger on page reload if localStorage is cleared, or if there's a timing issue with the 60-second auto-refresh

The pages themselves (Agenda, Networking, Profile) render correctly underneath — they're just hidden by this overlay.

### Fix Plan

**File: `src/contexts/SubscriptionContext.tsx`**
- Move the celebration check to only trigger on **initial load** (not on 60-second refreshes)
- Add a `sessionStorage` guard so the celebration only shows **once per browser session**, preventing repeated triggers
- Keep `localStorage` to prevent showing on future sessions for the same plan

**File: `src/components/UpgradeCelebration.tsx`**
- Add an auto-dismiss timeout (e.g. 8 seconds) so even if the user doesn't click, the overlay disappears
- Add a click-anywhere-to-dismiss behavior as a fallback

### Files to Modify

| File | Change |
|------|--------|
| `src/contexts/SubscriptionContext.tsx` | Add `sessionStorage` guard + only celebrate on initial load, not on interval refreshes |
| `src/components/UpgradeCelebration.tsx` | Add auto-dismiss timeout + click-outside-to-close |

