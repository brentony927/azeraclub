

# Fix: Privilege Escalation via `is_site_owner`

## Problem
The `prevent_site_owner_change()` function exists but was **never attached as a trigger** to the `founder_profiles` table. Any user can `UPDATE founder_profiles SET is_site_owner = true` and gain full moderation control.

## Solution
Single migration to attach the existing trigger function to the table:

```sql
CREATE TRIGGER prevent_site_owner_change
  BEFORE UPDATE ON public.founder_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_site_owner_change();
```

This blocks any attempt to modify `is_site_owner` via UPDATE, raising an exception. No code changes needed — the function already exists and works correctly.

## Files
- 1 database migration (attach trigger)

