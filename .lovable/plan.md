

# Plan: Fix Errors and Clean Up Unused Code

## Issues Found

### 1. Unnecessary `as any` type casts on Supabase table names
All tables (`affiliate_requests`, `affiliate_profiles`, `affiliate_leads`, `affiliate_commissions`, `founder_posts`, `founder_post_likes`, `founder_post_comments`, `user_moderation`, `user_reports`) exist in the generated types file. The `as any` casts suppress TypeScript type checking and can hide real bugs.

**Files to fix:**
- `src/components/AffiliateSection.tsx` — Remove `as any` from all `.from()` calls (6 instances)
- `src/components/FounderPostCard.tsx` — Remove `as any` from `.from()` calls (4 instances)
- `src/pages/FounderFeed.tsx` — Remove `as any` from `.from()` calls (4 instances)
- `src/components/ProtectedLayout.tsx` — Remove `as any` from `user_moderation` query
- `src/components/OwnerModPanel.tsx` — Remove `as any` from `user_moderation` insert
- `src/components/ReportUserDialog.tsx` — Remove `as any` from `user_reports` insert

### 2. Unused legacy component: `PartnerSection.tsx`
This component references the old partner system (`partner_profiles`, `commissions`, `payouts` tables) and is not imported anywhere. It should be deleted to reduce bundle size and avoid confusion.

**Action:** Delete `src/components/PartnerSection.tsx`

### 3. Legacy tables still in the database
The `partner_profiles`, `commissions`, and `payouts` tables are leftovers from the old partner system (replaced by the affiliate system). They serve no purpose.

**Action:** Drop tables `partner_profiles`, `commissions`, `payouts` via migration.

### 4. No runtime errors detected
Network requests all return 200. No console errors. No edge function errors. The profile persistence fix from the previous change is working correctly with `upsert`.

## Summary of Changes

1. Remove `as any` casts from ~20 Supabase `.from()` calls across 6 files
2. Delete `src/components/PartnerSection.tsx` (unused)
3. DB migration to drop legacy tables: `partner_profiles`, `commissions`, `payouts`

