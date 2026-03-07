

## Stripe Integration Fix

The Stripe integration has been enabled and your secret key is now configured.

### Root Cause
The `create-checkout` and `customer-portal` edge functions were failing because the `STRIPE_SECRET_KEY` environment variable was not set. The logs confirmed: "Neither apiKey nor config.authenticator provided".

### What Was Done
- Enabled the Stripe integration, which securely stores your API key as a backend secret accessible by your edge functions.

### What to Verify
- Navigate to `/planos` and try subscribing to a Pro or Elite plan — the checkout should now open a Stripe payment page instead of showing an error.

### No Code Changes Needed
The existing `create-checkout`, `check-subscription`, and `customer-portal` edge functions already reference `STRIPE_SECRET_KEY` correctly. They just needed the secret to be configured.

