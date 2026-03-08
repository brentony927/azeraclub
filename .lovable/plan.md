

## Auditoria Completa — AZERA CLUB

Resultado da analise de todo o sistema. Problemas organizados por severidade.

---

### CRITICAL

| # | Page/Feature | Issue | Fix |
|---|---|---|---|
| 1 | **FounderFeed — Connect** | `handleConnect` does NOT send `related_user_id` in the notification insert (line 102-107). The recipient's notification has `related_user_id = null`, so the Accept/Reject buttons in `FounderNotifications` won't work (`n.related_user_id` is null, query fails silently). | Add `related_user_id: user.id` to the notification insert in `FounderFeed.tsx` |
| 2 | **Realtime — founder_messages** | Realtime is enabled via migration, but the chat channel subscribes to ALL inserts on `founder_messages` without a server-side filter. Every user receives every message payload, filtered client-side. This leaks message metadata to other users. | Add `filter` param to the realtime subscription: `filter: "from_user_id=eq.X"` or use a composite filter |
| 3 | **No Report/Denunciar System** | Community Guidelines mention a report system, but NO report button or table exists anywhere in the codebase. Users cannot report fraud/spam/fake profiles. | Create `user_reports` table + Report User button on `FounderProfile` and `FounderCard` |
| 4 | **No Password Min Length on Login** | Signup enforces `minLength={6}` but Login has no client-side validation. More importantly, there's no server-side enforcement beyond what the auth provider does. | Add `minLength={6}` to the login password field for consistency |

---

### HIGH

| # | Page/Feature | Issue | Fix |
|---|---|---|---|
| 5 | **Profile View Spam** | Every time someone opens a founder profile, it increments `profile_views` AND creates a notification. No deduplication — refreshing the page creates infinite notifications and inflates view count. | Add deduplication: only count one view per visitor per 24h (check existing notification before inserting) |
| 6 | **Subscription Polling** | `check-subscription` is called on every route change (SubscriptionProvider re-renders) AND every 60s AND on auth state change. Network logs show 12+ calls in rapid succession. Excessive API usage. | Add a debounce/cache: skip if last check was <30s ago |
| 7 | **Messages — No Connection Required** | Any user can send messages to any other user without being connected. The `FounderProfile` page shows the "Message" button regardless of connection status. | Gate messaging behind `connectionStatus === "accepted"` |
| 8 | **FounderFeed — Missing Age Filter UI** | `ageRange` filter is used in logic but I don't see a slider/input in the filter panel for age range selection. Users can't actually use this filter. | Add a range slider or number inputs for age filtering |
| 9 | **Signup — Auto-confirm comment** | Line 46 comment says "Auto-confirm is enabled" but this means email verification is bypassed. Anyone can create accounts with any email. | Disable auto-confirm in auth settings unless intentional |

---

### MEDIUM

| # | Page/Feature | Issue | Fix |
|---|---|---|---|
| 10 | **FounderChat — No message deletion** | RLS on `founder_messages` explicitly blocks DELETE. Users cannot delete their own messages. | Add DELETE RLS policy for `from_user_id = auth.uid()` if desired |
| 11 | **In-App Legal Disclaimers Missing** | The legal plan specifies disclaimers on opportunities ("not verified"), messages ("be cautious"), and profiles ("not guaranteed"). None are implemented in the UI. | Add warning banners to `FounderOpportunities`, `FounderChat`, and `FounderProfile` |
| 12 | **Venture Builder — No input validation** | Venture name, problem, solution fields have no length limits. A user could paste enormous text causing layout issues. | Add `maxLength` to form inputs |
| 13 | **Landing Page — No legal links in hero/footer** | The Landing page uses its own `Footer` component which already has legal links, but the "Disclaimer" page mentioned in the legal plan doesn't exist as a separate page (it's inside Terms). | Either create a separate `/disclaimer` page or ensure Terms covers it (it does) |
| 14 | **Profile — No bio field** | The `founder_profiles` table uses `building` as bio. The `profiles` table has a `bio` field but it's never shown in Profile.tsx edit form. Confusing data model. | Clarify: use `profiles.bio` for personal bio, `founder_profiles.building` for project description |
| 15 | **Mobile — Messages layout** | The messages page uses `grid-cols-1 md:grid-cols-3 h-[70vh]`. On mobile, both conversation list and chat stack vertically at full height (70vh each), making the page very tall and chat hard to reach. | On mobile, show either the list OR the chat (toggle pattern), not both stacked |

---

### LOW

| # | Page/Feature | Issue | Fix |
|---|---|---|---|
| 16 | **Mixed language** | UI mixes Portuguese and English inconsistently ("Connect", "Looking For", "Skills" in English on Portuguese pages). | Standardize to one language throughout |
| 17 | **Login — Legal links** | Login page has links for Termos/Privacidade/Cookies but missing links for the 3 new pages (Diretrizes, Pagamentos, Seguranca). | Add remaining legal links |
| 18 | **Notification badge overflow** | If unread count > 99, the badge shows "9+" which is fine, but the threshold is >9. | Minor: cosmetic only |
| 19 | **No empty state for FounderProfile ventures** | When a user has no ventures, it shows "Nenhuma venture ativa" in the Current Venture card, but the Ventures Portfolio section is simply hidden. Inconsistent. | Show a consistent empty message |
| 20 | **ThemeToggle** | Theme toggle exists in the header but the app defaults to dark. Light mode may have contrast issues with glass-card styling not tested. | Test light mode styling |

---

### Summary

| Severity | Count |
|----------|-------|
| Critical | 4 |
| High | 5 |
| Medium | 6 |
| Low | 5 |
| **Total** | **20** |

### Recommended Fix Priority

1. **FounderFeed notification missing `related_user_id`** — Breaks the entire accept/reject flow for connections initiated from the feed
2. **Report system** — Legally promised but not implemented
3. **Profile view spam deduplication** — Creates noise and inflates metrics
4. **In-app legal disclaimers** — Part of the legal protection plan
5. **Subscription polling optimization** — Performance drain
6. **Mobile messages UX** — Broken layout on small screens
7. **Gate messaging behind connections** — Security/privacy

### Files to Edit

| File | Issues |
|------|--------|
| `src/pages/FounderFeed.tsx` | #1 (add `related_user_id`) |
| `src/pages/FounderProfile.tsx` | #5 (dedup views), #11 (disclaimer) |
| `src/components/FounderChat.tsx` | #2 (realtime filter), #11 (disclaimer) |
| `src/pages/FounderMessages.tsx` | #15 (mobile toggle) |
| `src/pages/FounderOpportunities.tsx` | #11 (disclaimer) |
| `src/contexts/SubscriptionContext.tsx` | #6 (debounce) |
| New: `src/components/ReportUserDialog.tsx` | #3 |
| New: DB migration for `user_reports` table | #3 |

