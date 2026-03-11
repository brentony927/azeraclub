

# Fix: Profile Data Not Persisting + Code Cleanup

## Problem
When you save your name, age, country, city etc on the Profile page and leave, the data disappears. The root cause is that `handleSave` uses `.update()` on the `profiles` table, which silently does nothing if no row exists (returns success with 0 rows affected). Additionally, the `founder_profiles` save uses separate insert/update paths that can fail in edge cases.

## Fix 1: Profile Save — Use `upsert` Instead of `update`

**File: `src/pages/Profile.tsx`**

### Change `profiles` table save (line ~185-194)
Replace `.update()` with `.upsert({ ... }, { onConflict: "user_id" })`. This guarantees the row is created if it doesn't exist, or updated if it does. Also sync the `location` field from city/country.

### Change `founder_profiles` save (line ~232-239)
Replace the `if (hasFounderProfile) update else insert` pattern with a single `.upsert(founderData, { onConflict: "user_id" })`. This eliminates race conditions and simplifies the logic.

### Remove unused state variable
Remove the `location` state variable (line 64) since location is now derived from `city` + `country`.

## Fix 2: Code Cleanup

**File: `src/pages/Profile.tsx`**
- Remove unused `location` state (was never displayed in the form UI)
- Remove the `hasFounderProfile` branching logic (upsert handles both cases)

**File: `src/components/AffiliateSection.tsx`**
- Remove unnecessary `as any` type casts on Supabase queries where types exist

## Files Modified
1. `src/pages/Profile.tsx` — Fix save logic, remove unused state
2. `src/components/AffiliateSection.tsx` — Minor cleanup of type casts

