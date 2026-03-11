import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    // Check if user is an approved affiliate
    const { data: affiliate } = await supabaseAdmin
      .from("affiliate_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!affiliate) {
      return new Response(JSON.stringify({ error: "Not an approved affiliate" }), { status: 403, headers: corsHeaders });
    }

    // If already has a Stripe account, create a new onboarding link
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });

    let accountId = affiliate.stripe_account_id;

    if (!accountId) {
      // Create Express account
      const account = await stripe.accounts.create({
        type: "express",
        country: "BR",
        email: user.email,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: "individual",
      });
      accountId = account.id;

      // Save to DB
      await supabaseAdmin
        .from("affiliate_profiles")
        .update({ stripe_account_id: accountId })
        .eq("user_id", user.id);
    }

    // Check if onboarding is already complete
    const account = await stripe.accounts.retrieve(accountId);
    if (account.details_submitted) {
      await supabaseAdmin
        .from("affiliate_profiles")
        .update({ stripe_onboarding_complete: true })
        .eq("user_id", user.id);

      return new Response(JSON.stringify({ already_complete: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create onboarding link
    const origin = req.headers.get("origin") || "https://azeraclub.lovable.app";
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/profile`,
      return_url: `${origin}/profile?stripe_onboarding=complete`,
      type: "account_onboarding",
    });

    return new Response(JSON.stringify({ url: accountLink.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-connect-account error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
