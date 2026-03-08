

## Fix: Sidebar tabs showing light theme in dark mode

### Problem
The sidebar navigation items (both regular and Founder Alignment) use hardcoded light-toned colors/backgrounds that don't adapt to dark mode. The `sidebar-nav-item` and `founder-sidebar-item` classes lack proper `.dark` overrides.

### Changes

**`src/index.css`** — Add dark mode overrides:

1. **Regular tabs (`.sidebar-nav-item`)**: Already has a `.dark` hover override but the active state `hsl(var(--primary) / 0.08)` may not be visible enough. Increase opacity and ensure text contrast.

2. **Founder Alignment items (`.founder-sidebar-item`)**: Currently hardcoded gold backgrounds (`hsla(42, 80%, 55%, 0.12)`) with no `.dark` variant. Add:
   - `.dark .founder-sidebar-item` — darker gold-tinted background, lighter gold text
   - `.dark .founder-sidebar-item:hover` — stronger gold glow on dark bg
   - `.dark .founder-sidebar-item-active` — more visible gold gradient on dark bg
   - `.dark .founder-sidebar-label` / `.dark .founder-sidebar-text` — brighter gold for readability

3. **Sidebar content area**: Ensure the sidebar wrapper uses `bg-sidebar` CSS variable correctly (already set to dark values in `.dark` — `0 0% 4%`). The issue may be theme class specificity — verify pro-theme dark overrides.

### Files
| File | Change |
|------|--------|
| `src/index.css` | Add `.dark` overrides for founder-sidebar-item, founder-sidebar-item-active, founder-sidebar-label, founder-sidebar-text; strengthen dark mode contrast for sidebar-nav-item-active |

