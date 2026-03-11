

# Plan: Stripe Connect Destination Charges — Automatic Revenue Splitting

## Summary

Replace the current manual payout system (wallet, withdrawals, PIX, cron) with **Stripe Connect destination charges**. When a referred user buys a plan, Stripe automatically splits the payment: 75% to platform, 25% to affiliate. No cron, no wallets, no manual transfers.

## Database Changes

**Migration:**
- Drop tables: `affiliate_wallet`, `affiliate_withdrawals`, `affiliate_payout_info`
- Remove columns from `affiliate_profiles`: `level` (keep for display only — actually keep it)
- Ensure `affiliate_profiles` has: `stripe_account_id`, `stripe_onboarding_complete`, `commission_rate`, `level`
- The `affiliate_commissions` table stays for tracking/display but status is now set by the checkout flow (auto-paid)

## Edge Function Changes

### 1. `create-checkout/index.ts` — Add destination charges

Before creating the checkout session:
- Look up `referrals` table for the buyer's `referrer_id`
- Look up `affiliate_profiles` for that referrer (must be enabled + `stripe_onboarding_complete = true`)
- If found, add `payment_intent_data.transfer_data.destination` and `payment_intent_data.application_fee_amount` to the checkout session
- Also record the commission in `affiliate_commissions` with status `paid` (since Stripe handles it)
- Update `affiliate_leads.purchased_at`

Key code addition:
```typescript
// If referral exists and affiliate has Stripe connected
payment_intent_data: {
  transfer_data: {
    destination: affiliateStripeAccountId,
  },
  application_fee_amount: Math.round(priceAmount * 0.75 * 100), // platform keeps 75%
}
```

**Note:** For subscriptions with `mode: "subscription"`, we use `subscription_data.transfer_data.destination` and `subscription_data.application_fee_percent` instead.

### 2. `create-connect-account/index.ts` — Keep as-is
Already works correctly.

### 3. `approve-affiliate/index.ts` — Keep as-is
Already creates Stripe Express account on approval.

### 4. `process-referral-commission/index.ts` — Simplify
Remove wallet updates. Just record the commission as `paid` since Stripe handles the transfer. Keep lead tracking and tier upgrades.

### 5. `process-affiliate-payout/index.ts` — Delete
No longer needed. Stripe handles payouts automatically.

## Frontend: `AffiliateSection.tsx`

Remove from Finance tab:
- PIX form (name, CPF, key)
- Withdrawal request button
- Wallet balances (pending/available/total_paid)
- Payout method selector
- Withdrawal history

Replace with:
- Stripe Connect onboarding button (if not connected)
- "Payouts are automatic" message (if connected)
- Commission history (kept)
- Total earnings display (sum of commissions)

Remove state variables: `payoutMethod`, `pixName`, `pixCpf`, `pixKey`, `savingPayout`, `requestingWithdraw`, `withdrawals`, `wallet`

## Files

1. **DB migration** — Drop `affiliate_wallet`, `affiliate_withdrawals`, `affiliate_payout_info` tables
2. `supabase/functions/create-checkout/index.ts` — Add destination charges for subscriptions
3. `supabase/functions/process-referral-commission/index.ts` — Remove wallet logic
4. `supabase/functions/process-affiliate-payout/index.ts` — Delete file
5. `src/components/AffiliateSection.tsx` — Remove manual payout UI, simplify to Stripe-only
6. `supabase/config.toml` — Remove `process-affiliate-payout` entry

