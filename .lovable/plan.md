

## Fix Global Founder Map — react-leaflet version mismatch

### Root Cause
`react-leaflet` v5 requires React 19, but this project uses React 18.3.1. This causes a runtime crash ("render2 is not a function").

### Fix
1. **Downgrade `react-leaflet` to v4.2.1** and add `@react-leaflet/core@2.1.0` in `package.json`
   - `react-leaflet`: `^5.0.0` → `4.2.1`
   - Add `@react-leaflet/core`: `2.1.0`
   - Keep `leaflet` and `@types/leaflet` as-is (v1.x compatible)

2. **Add `react-leaflet` to Vite dedupe** in `vite.config.ts` to prevent duplicate React instances:
   - Add `"react-leaflet"` to the existing `resolve.dedupe` array

### Files
| File | Change |
|------|--------|
| `package.json` | Downgrade react-leaflet, add @react-leaflet/core |
| `vite.config.ts` | Add react-leaflet to dedupe |

No code changes needed in `GlobalFounderMap.tsx` — the v4 API is identical for `MapContainer`, `TileLayer`, `Marker`, `Popup`, and `useMap`.

