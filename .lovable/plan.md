

# Plan: Owner Profile 3D Animations + Partner/Leads System

## Part A — Owner Profile 3D Enhancements

Enhance the owner (`is_site_owner`) profile page (`FounderProfile.tsx`) with animated 3D elements using the existing `Icon3D` component and new CSS animations.

### Changes

1. **`src/index.css`** — Add new 3D owner animations:
   - `owner-3d-rotate`: slow 3D perspective rotation on the avatar container
   - `owner-3d-card-float`: cards subtly float with translateZ
   - `owner-3d-stats-pop`: stat numbers scale up on load
   - `owner-particle-bg`: animated radial gradient that shifts

2. **`src/pages/FounderProfile.tsx`** — For `isSiteOwner` profiles:
   - Avatar gets a 3D rotating ring effect with perspective transforms
   - Stats cards get `owner-3d-card-float` class with staggered delays
   - Social proof numbers use `AnimatedCounter` with 3D pop effect
   - Crown badge uses `Icon3D` with `Crown` icon animated instead of emoji
   - Section headers get `Icon3D` components (Rocket, Users, etc.)

---

## Part B — Partner/Referral System

### Database (4 new tables via migration)

```sql
-- Partner profiles
CREATE TABLE public.partner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  partner_id text NOT NULL UNIQUE,
  pix_key text,
  paypal_email text,
  full_name text,
  cpf text,
  commission_rate numeric DEFAULT 0.25,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.partner_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own partner profile" ON public.partner_profiles FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Referrals (link between referrer and referred user)
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id text NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners view own referrals" ON public.referrals FOR SELECT TO authenticated
  USING (referrer_id IN (SELECT partner_id FROM partner_profiles WHERE user_id = auth.uid()));
CREATE POLICY "System inserts referrals" ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (true);

-- Commissions
CREATE TABLE public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id text NOT NULL,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  paid_at timestamptz
);
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners view own commissions" ON public.commissions FOR SELECT TO authenticated
  USING (affiliate_id IN (SELECT partner_id FROM partner_profiles WHERE user_id = auth.uid()));

-- Payouts
CREATE TABLE public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners view own payouts" ON public.payouts FOR SELECT TO authenticated
  USING (affiliate_id IN (SELECT partner_id FROM partner_profiles WHERE user_id = auth.uid()));
```

### Referral Tracking Flow

1. **`src/App.tsx`** — On app mount, check URL for `?ref=` param. Save to `localStorage` with 30-day TTL.

2. **`src/pages/Signup.tsx`** — After successful signup, read `ref` from localStorage. If present, insert into `referrals` table.

3. **Edge Function: `process-referral-commission`** — Called from `create-checkout` success or `check-subscription` when a referred user subscribes. Checks `referrals` table, calculates 25% commission, inserts into `commissions`.

### Profile UI — Partner Section

4. **`src/pages/Profile.tsx`** — Add new "Programa de Parceiros" section:
   - Toggle button to activate partner mode
   - On activation: generates `partner_id` from username or random ID, inserts `partner_profiles`
   - Shows: invite link with copy button, stats (leads, conversions, commission balance)
   - Payout info form (name, CPF, PIX key or PayPal)

### Partner Stats Dashboard (inside Profile)

Display:
- Leads gerados (count from `referrals`)
- Assinaturas pagas (count from `commissions`)
- Taxa de conversao (computed)
- Saldo pendente / disponivel / total pago (from `commissions` grouped by status)

### Gamification Tiers

Commission rate escalation stored in `partner_profiles.commission_rate`:
- Default: 25%
- 10+ sales: 30%
- 50+ sales: 35%
- 100+ sales: 40%

Updated by the edge function when processing commissions.

### New Badges

Add to `src/lib/badges.ts`:
- `growth_partner` — 1+ referral conversion
- `azera_ambassador` — 10+ referral conversions
- `top_connector` — 50+ referral conversions

### Public Page

5. **`src/pages/Earn.tsx`** — Public landing page at `/earn` explaining the partner program with CTA to sign up.

6. **`src/App.tsx`** — Add route `/earn` (public).

### Terms Update

7. **`src/pages/TermsOfService.tsx`** — Add section 14 covering partner program legal disclaimers.

### Edge Function: `process-referral-commission`

- Triggered after subscription confirmation
- Checks if user has a referral entry
- Anti-fraud: checks for duplicate emails/same referrer patterns
- Calculates commission based on plan price and partner's commission rate
- Inserts into `commissions` table
- Updates commission rate tier if thresholds crossed

---

## Files Modified/Created

1. `src/index.css` — New 3D owner animations
2. `src/pages/FounderProfile.tsx` — 3D elements for owner
3. `src/pages/Profile.tsx` — Partner section
4. `src/pages/Earn.tsx` — New public page
5. `src/pages/Signup.tsx` — Referral capture on signup
6. `src/App.tsx` — Ref param capture + /earn route
7. `src/lib/badges.ts` — 3 new partner badges
8. `src/pages/TermsOfService.tsx` — Partner legal section
9. `supabase/functions/process-referral-commission/index.ts` — Commission processing
10. `supabase/functions/calculate-badges/index.ts` — Partner badge rules
11. DB migration — 4 new tables with RLS

