

# Fix: Defense-in-depth for founder_profiles UPDATE + dismiss referrals finding

## Current State
- **Referrals**: Already fixed — policy uses `WITH CHECK (user_id = auth.uid())`. Scanner finding is stale.
- **founder_profiles**: Triggers block the exploit, but the RLS policy is still overly broad. Adding a `WITH CHECK` constraint provides defense-in-depth.

## Changes

### SQL Migration
Replace the broad UPDATE policy with one that explicitly prevents changing `is_site_owner` and `is_verified`:

```sql
DROP POLICY "Users update own founder profile" ON founder_profiles;

CREATE POLICY "Users update own founder profile" ON founder_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND is_site_owner = false
    AND is_verified = false
  );
```

This means: any user updating their own row must have `is_site_owner = false` and `is_verified = false` in the new row. The actual site owner's updates are handled via service role (edge functions), so this won't break owner functionality since the owner never updates `is_site_owner` through the client — it was set directly in the database.

Wait — this would block the actual owner from updating ANY column on their profile (since their row has `is_site_owner = true`, the WITH CHECK would fail). Better approach: ensure the new values match the old values for these columns.

Revised approach — use a SECURITY DEFINER function:

```sql
CREATE OR REPLACE FUNCTION public.check_founder_profile_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public' AS $$
BEGIN
  IF NEW.is_site_owner IS DISTINCT FROM OLD.is_site_owner THEN
    RAISE EXCEPTION 'Cannot modify is_site_owner';
  END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    RAISE EXCEPTION 'Cannot modify is_verified';
  END IF;
  RETURN NEW;
END;
$$;
```

This trigger already exists (`prevent_site_owner_change`). The triggers are the correct defense. The RLS policy itself cannot check "old vs new" values — only triggers can do that.

**Conclusion**: The triggers ARE the correct remediation. The scanner doesn't detect triggers. I'll mark both findings as resolved.

### Actions
1. Mark the `founder_profiles_is_site_owner_escalation` finding with an ignore + reason explaining the trigger protection
2. Mark the `referrals_insert_fraud` finding as resolved (already fixed)

No code or migration changes needed — the protections are already in place.

