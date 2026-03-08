

## Username System for Founder Profiles

Replace UUID-based profile IDs in URLs with user-editable usernames (e.g., `/founder-profile/joao123` instead of `/founder-profile/87f20064-...`). Users can edit, copy, and search by username.

### Database Change

Add a `username` column to `founder_profiles`:

```sql
ALTER TABLE public.founder_profiles ADD COLUMN username text UNIQUE;
CREATE INDEX idx_founder_profiles_username ON public.founder_profiles(username);
```

Username is unique, nullable (existing profiles won't have one yet), and indexed for fast lookups.

### Files to Edit

| File | Change |
|------|--------|
| DB migration | Add `username` column with unique constraint |
| `src/pages/Profile.tsx` | Add username field (editable input with validation: lowercase, no spaces, 3-20 chars). Add copy button. Save username on upsert |
| `src/pages/FounderProfile.tsx` | Change `useParams` to accept username OR uuid. Query by `username` first, fallback to `id`. Show username with copy button |
| `src/App.tsx` | Keep route as `/founder-profile/:id` (works for both username and uuid) |
| `src/components/FounderCard.tsx` | Pass `username` prop, navigate to `/founder-profile/{username}` when available |
| `src/pages/FounderFeed.tsx` | Include `username` in fetched data, pass to FounderCard. Add username to search filter |
| `src/components/FounderNotifications.tsx` | Resolve navigation using username instead of uuid |
| `src/pages/FounderNotificationsPage.tsx` | Same navigation fix |
| `src/pages/FounderLeaderboard.tsx` | Include username, link to profile by username |

### Username Rules

- 3-20 characters
- Lowercase letters, numbers, underscores only
- Regex: `/^[a-z0-9_]{3,20}$/`
- Unique (enforced by DB + client check before save)
- Displayed as `@username` in UI

### Profile Page UX

- New field "Nome de Utilizador" with `@` prefix
- Copy button next to username
- Validation feedback (available/taken)
- Shown prominently on the founder profile page

### Search Enhancement

The FounderFeed search will also match against `username`, so users can find others by typing their username.

