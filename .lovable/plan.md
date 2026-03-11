

# Security Audit Results & Fix Plan

## Audit Summary

### Resolved Findings (5 — all info level, already fixed)
- GPS Location leak — fixed
- Connection self-accept — fixed  
- Admin email in migration — acknowledged (historical, no runtime risk)
- is_site_owner UPDATE trigger — confirmed active
- plan_price client trust — fixed (Stripe server-side verification)

### Edge Function Test: `process-referral-commission`
- Authenticated correctly (returned 400 "No Stripe customer found" for the test user, which is expected since your account has a manual plan override, not a Stripe subscription)
- Auth gate works: unauthenticated requests would be rejected with 401

### New Finding: INSERT Gap on `is_site_owner`

The `guard_site_owner_change` and `prevent_site_owner_change` triggers only fire on **UPDATE** (tgtype=19). A user who deletes their `founder_profiles` row (allowed by RLS) and re-inserts it with `is_site_owner = true` would bypass the trigger and gain full moderation access.

**Severity:** High — same privilege escalation vector, different attack path.

## Fix

Single migration to add a `BEFORE INSERT` trigger on `founder_profiles` that forces `is_site_owner = false` on any new row:

```sql
CREATE OR REPLACE FUNCTION public.force_site_owner_false_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.is_site_owner := false;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_site_owner_on_insert
  BEFORE INSERT ON public.founder_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.force_site_owner_false_on_insert();
```

This silently forces `is_site_owner = false` on every INSERT, regardless of what the user passes. Combined with the existing UPDATE trigger, the column is fully locked down.

## Files
- 1 database migration (INSERT trigger)

