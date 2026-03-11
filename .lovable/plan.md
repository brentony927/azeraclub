# Plan: Dual Payout — Stripe + PIX Manual

## Problem

Currently only Stripe Connect is offered. Many Brazilian affiliates don't have Stripe. Need a manual PIX withdrawal option as fallback.

## Solution

Offer two payout methods:

1. **Stripe Connect** — automatic transfers (existing)
2. **PIX Manual** — affiliate enters PIX key, requests withdrawal, admin processes manually

## Changes

### 1. `src/components/AffiliateSection.tsx` — Finance tab redesign

- Add "Método de pagamento" selector: **Stripe (automático)** or **PIX (manual)**
- If PIX selected:
  - Show form: Nome completo, CPF, Chave PIX (already in `affiliate_payout_info` table)
  - Show "Solicitar saque" button (min R$100) that inserts into `affiliate_withdrawals`
  - Show withdrawal history list
- If Stripe selected: show existing Stripe Connect flow
- Save payout preference to `affiliate_payout_info` table

### 2. DB Migration

- Add `payout_method text DEFAULT 'pix'` to `affiliate_payout_info` table
- This stores the user's preferred payout method ('stripe' or 'pix')

### 3. `supabase/functions/process-affiliate-payout/index.ts`

- Skip affiliates whose payout method is 'pix' (those are processed manually by admin)
- Only auto-transfer for affiliates with Stripe connected AND payout_method = 'stripe'

### 4. Admin visibility (existing `OwnerModPanel`)

- PIX withdrawal requests appear in `affiliate_withdrawals` table for admin to process manually

## Flow

```text
Affiliate chooses payout method:
├─ Stripe → connects account → payouts are automatic after 7 days
└─ PIX → fills PIX key/CPF → requests withdrawal manually → admin processes in 24h
```

## Files

1. `src/components/AffiliateSection.tsx` — Add PIX payout UI alongside Stripe
2. DB migration — Add `payout_method` column to `affiliate_payout_info`
3. `supabase/functions/process-affiliate-payout/index.ts` — Respect payout method