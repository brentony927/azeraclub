

# Plan: Stripe Connect for Automatic Affiliate Payouts

## Current State

The system tracks commissions in the database but **does not transfer money**. The withdrawal button just inserts a record. No actual PIX/bank transfer happens.

## Solution: Stripe Connect

Stripe Connect allows your platform to automatically split payments with affiliates. Each affiliate gets a **Stripe Express account** (onboarding handled by Stripe), and when a referred user subscribes, a **Transfer** is automatically created to the affiliate's connected account after the 7-day hold.

## Flow

```text
Lead buys plan via Stripe Checkout
  → Payment goes to YOUR Stripe account (platform)
  → After 7 days, Edge Function transfers 25% to affiliate's connected Stripe account
  → Affiliate receives money directly in their bank (Stripe handles PIX/bank transfer)
```

## Changes

### 1. Edge Function: `create-connect-account`
- Creates a Stripe Express connected account for the affiliate
- Returns an onboarding link (Stripe-hosted form where affiliate enters bank/PIX details)
- Saves `stripe_account_id` to `affiliate_profiles`

### 2. DB Migration
- Add `stripe_account_id text` column to `affiliate_profiles`
- Add `stripe_onboarding_complete boolean DEFAULT false` to `affiliate_profiles`

### 3. Edge Function: `process-affiliate-payout`
- Scheduled (cron) or triggered manually
- Finds commissions older than 7 days with status `pending`
- Uses `stripe.transfers.create()` to send money to affiliate's connected account
- Updates commission status to `paid` and wallet balances

### 4. Update `create-checkout`
- After successful subscription of a referred user, call `process-referral-commission` to record the commission

### 5. Update `AffiliateSection.tsx`
- Replace PIX/PayPal payout form with "Connect your Stripe account" button
- Show onboarding status (pending/complete)
- When complete, show "Your payouts are automatic via Stripe"
- Remove manual withdrawal flow (Stripe handles it)

### 6. Update `approve-affiliate` Edge Function
- On approval, also create the Stripe Connect account and return onboarding URL

## Files Modified/Created

1. `supabase/functions/create-connect-account/index.ts` — New
2. `supabase/functions/process-affiliate-payout/index.ts` — New
3. `supabase/functions/approve-affiliate/index.ts` — Add Stripe account creation
4. `supabase/functions/process-referral-commission/index.ts` — Use `affiliate_profiles` table
5. `src/components/AffiliateSection.tsx` — Replace manual payout with Stripe Connect onboarding
6. DB migration — Add `stripe_account_id` and `stripe_onboarding_complete` to `affiliate_profiles`

## Important Note

Stripe Connect requires your Stripe account to be activated for Connect (in Stripe Dashboard → Settings → Connect). This is a Stripe platform feature that needs to be enabled on your account. The affiliate receives money directly to their bank account — Stripe handles PIX in Brazil automatically.

