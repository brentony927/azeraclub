

## Fix: Light Theme Not Applied to Sidebar (Elite/Pro)

### Problem
The `.elite-theme` class is applied to the wrapper `div` unconditionally for Pro/Elite users. This class hardcodes dark colors for ALL CSS variables (background, sidebar, cards, etc.), completely overriding the light/dark theme toggle. The sidebar stays black even when "light" theme is selected because `.elite-theme` sets `--sidebar-background: 0 0% 3%` regardless of the active theme.

### Solution
Scope the `.elite-theme` overrides so they only apply in dark mode. In light mode, the standard light CSS variables should be used, with optional gold accents for premium users.

### Changes

**File: `src/index.css`**
- Wrap the entire `.elite-theme { ... }` block inside `.dark.elite-theme { ... }` so it only activates when dark mode is on
- Add a new `.elite-theme` (without `.dark`) block with light-mode-friendly premium styling: light backgrounds, gold accents on primary/accent/ring, light sidebar colors

**File: `src/components/Layout.tsx`**
- No changes needed — the `elite-theme` class stays, but its CSS effect now respects light/dark

### What Changes in Practice
- **Dark mode + Elite/Pro**: Same premium black & gold experience as now
- **Light mode + Elite/Pro**: Clean light backgrounds everywhere (including sidebar), with gold accent colors for buttons, borders, and highlights — a premium light experience
- **Free users**: Completely unaffected

