

# Fix: Secure `process-referral-commission` Endpoint

## Problem
The edge function accepts arbitrary `user_id` and `plan_price` with **zero authentication**. Anyone can call it with a simple `curl` to generate fake commissions, trigger tier upgrades, and send fraudulent payout notifications.

## Solution
Add JWT authentication at the top of the handler, matching the pattern used in `send-founder-message`. The authenticated user's ID will be used instead of the request body's `user_id`, preventing impersonation.

**File: `supabase/functions/process-referral-commission/index.ts`**

1. Extract `Authorization` header and reject if missing
2. Create an auth client with the user's token, call `auth.getUser()` to validate
3. Use `user.id` as the trusted `user_id` instead of accepting it from the request body
4. Keep `plan_price` from the body (validated as a positive number)
5. Mask internal errors in the response

This ensures only authenticated users can trigger commission processing, and only for themselves.

