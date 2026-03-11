

# Fix: Security Findings Resolution

## Status of Each Finding

### 1. Affiliate Leads INSERT Policy — Already Fixed
The current RLS policy is `"Users insert own affiliate lead"` with `WITH CHECK (user_id = auth.uid())`. This is already correct. We just need to dismiss this false positive.

### 2. Client-Supplied `plan_price` — Needs Fix
The `process-referral-commission` function trusts `plan_price` from the request body. A user could pass `plan_price: 9999` to inflate commission records.

**Fix:** Remove `plan_price` from the request body entirely. Instead, look up the user's active Stripe subscription and get the real price from Stripe.

**File: `supabase/functions/process-referral-commission/index.ts`**

- Import Stripe SDK
- Remove `plan_price` from `req.json()`
- Look up user's email via auth, then find their Stripe customer
- Get active subscription price from Stripe (`subscription.items.data[0].price.unit_amount / 100`)
- Use that verified price for commission calculation
- If no active subscription found, return error

### 3. Site Owner Trigger — Already Resolved
Info-level finding confirming the trigger is active. Dismiss.

## Files to Modify
1. `supabase/functions/process-referral-commission/index.ts` — Replace client `plan_price` with Stripe lookup

## Security Findings to Dismiss
- `affiliate_leads_insert` (already has correct RLS)
- `site_owner_trigger` (info, confirmed active)
- `founder_profiles_is_site_owner_escalation` (protected by trigger)

