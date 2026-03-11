

# Plan: Professional Affiliate System — Azera Club

## Overview

Replace the existing basic `PartnerSection` with a full-featured, fintech-style affiliate dashboard. This involves new database tables, an upgraded UI component, application/approval flow, wallet/withdrawal system, lead history, performance charts, and ranking page.

## Database Changes (Migration)

Drop or repurpose existing `partner_profiles` table. Create new tables:

```text
affiliate_requests     — Application form data + status (pending/approved/rejected)
affiliate_profiles     — Approved affiliates (link, rate, level, enabled)
affiliate_leads        — Tracked signups via referral link
affiliate_commissions  — Commission records with status lifecycle
affiliate_wallet       — Balance tracking (pending/available/total_paid)
affiliate_withdrawals  — Withdrawal requests with status
affiliate_payout_info  — Payment details (name, CPF, PIX, PayPal)
```

Key design decisions:
- Keep existing `referrals` and `commissions` tables for backward compatibility but the new affiliate system uses its own tables
- `affiliate_wallet` is a computed view or trigger-maintained table
- All tables have RLS policies scoped to `auth.uid()`
- Admin operations (approve/reject) done via edge function with service role

## Component Architecture

### 1. `src/components/AffiliateSection.tsx` (replaces `PartnerSection`)

A tabbed dashboard with 4 tabs:

**Tab: Visao Geral** — Fintech-style stat cards (gradient + glow + AnimatedCounter + mini sparkline via recharts):
- Leads totais, Taxa de conversao, Vendas realizadas, Comissao gerada, Saldo disponivel

**Tab: Leads** — Table listing referred users (name, plan, signup date, purchase date, commission amount, status). No email/phone/IP shown (LGPD).

**Tab: Performance** — Line chart (recharts) showing leads/day and conversions/week with neon styling.

**Tab: Financeiro** — Wallet balances, withdrawal form (min R$50), withdrawal history, payout info form.

### 2. Gate logic

- If plan is `free` or `basic`: show upgrade prompt with lock icon
- If PRO/BUSINESS but no application: show application form
- If application `pending`: show "Aguardando aprovacao" status
- If `rejected`: show rejection message with option to reapply
- If `approved`: show full dashboard

### 3. Application form fields
- Nome completo, Instagram, TikTok, YouTube, Twitter
- Audiencia aproximada (select: 1k-5k, 5k-20k, 20k-100k, 100k+)
- Textarea: Como pretende divulgar o Azera Club?

## Edge Functions

### `approve-affiliate/index.ts`
- Admin-only (checks `is_site_owner` via service role)
- Sets `affiliate_requests.status = 'approved'`
- Creates `affiliate_profiles` row with generated link
- Adds `influencer_azera` badge to `user_badges`

### Update `process-referral-commission/index.ts`
- Also write to `affiliate_commissions` and update `affiliate_wallet`

## Badges

Add to `badges.ts`:
- `influencer_azera` — "Influencer Azera" — Approved affiliate badge (auto-granted on approval)
- `affiliate_legend` — "Affiliate Legend" — 100+ sales

Update existing partner badges to also work with new system.

## Level System

Stored in `affiliate_profiles.level`:
- `starter` (0-9 sales)
- `partner` (10-49)
- `ambassador` (50-99)
- `legend` (100+)

Commission rates: 25% / 30% / 35% / 40% respectively.

## Pages

### Update `src/pages/Earn.tsx`
- Redesign as professional public landing page with fintech aesthetic
- Add affiliate ranking section (Top Divulgadores)
- Application CTA for logged-in PRO/BUSINESS users

### Update `src/pages/Profile.tsx`
- Replace `<PartnerSection />` with `<AffiliateSection />`

## Anti-Fraud Rules (in edge function)
- Block self-referral (referrer_id === user_id)
- Block duplicate email/IP/CPF
- 7-day pending period before approval

## Activity Timeline
Inside Visao Geral tab: recent activity feed showing lead registrations, sales, commission releases.

## Files Modified/Created

1. **DB migration** — 7 new tables with RLS
2. `src/components/AffiliateSection.tsx` — New comprehensive component (~600 lines)
3. `src/pages/Profile.tsx` — Swap PartnerSection for AffiliateSection
4. `src/pages/Earn.tsx` — Redesigned public page with ranking
5. `src/lib/badges.ts` — Add `influencer_azera`, `affiliate_legend`
6. `supabase/functions/approve-affiliate/index.ts` — Admin approval
7. `supabase/functions/process-referral-commission/index.ts` — Updated for new tables
8. `src/pages/Signup.tsx` — Write to `affiliate_leads` on referral signup
9. `src/App.tsx` — Update ref tracking to also use `/join` route

