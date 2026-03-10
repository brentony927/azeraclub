

## Fix: Privilege Escalation — `is_site_owner` Self-Promotion

### Problem
Any authenticated user can run `update({ is_site_owner: true })` on their own `founder_profiles` row because the UPDATE RLS policy has no column restriction. This grants full moderation powers via the `is_site_owner()` function.

### Solution
Create a database trigger that prevents any change to the `is_site_owner` column. Only the service role (used in migrations/edge functions) can bypass triggers when needed.

### SQL Migration

```sql
CREATE OR REPLACE FUNCTION public.prevent_site_owner_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_site_owner IS DISTINCT FROM OLD.is_site_owner THEN
    RAISE EXCEPTION 'Cannot modify is_site_owner';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER guard_site_owner_change
  BEFORE UPDATE ON public.founder_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_site_owner_change();
```

This is a single migration. No code changes needed — all existing reads of `is_site_owner` continue to work. The trigger blocks any UPDATE that attempts to change the value, while INSERT still respects the `DEFAULT false`.

### Files
- 1 new SQL migration (trigger)

