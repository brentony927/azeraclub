import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EARLY_BIRD_COUPON_ID = "pIVpHHsI";
const EARLY_BIRD_LIMIT = 100;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    const { priceId } = await req.json();
    if (!priceId) throw new Error("Price ID is required");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Check if user is eligible for early bird discount (first 100 users)
    const { count: userCount } = await supabaseClient
      .from("profiles")
      .select("id", { count: "exact", head: true });

    const isEarlyBird = (userCount || 0) <= EARLY_BIRD_LIMIT;
    console.log(`[create-checkout] User count: ${userCount}, Early bird eligible: ${isEarlyBird}`);

    // Check for referral — find affiliate with connected Stripe
    let transferData: Record<string, any> | undefined;
    let applicationFeePercent: number | undefined;
    let affiliateId: string | null = null;

    // Anti-fraud: prevent self-referral
    const { data: referral } = await supabaseClient
      .from("referrals")
      .select("referrer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (referral) {
      const { data: affiliate } = await supabaseClient
        .from("affiliate_profiles")
        .select("*")
        .eq("affiliate_id", referral.referrer_id)
        .eq("enabled", true)
        .maybeSingle();

      if (affiliate && affiliate.stripe_onboarding_complete && affiliate.stripe_account_id) {
        if (affiliate.user_id !== user.id) {
          transferData = { destination: affiliate.stripe_account_id };
          const commissionRate = affiliate.commission_rate || 0.25;
          applicationFeePercent = Math.round((1 - commissionRate) * 100);
          affiliateId = affiliate.affiliate_id;
          console.log(`[create-checkout] Affiliate split: ${commissionRate * 100}% to ${affiliate.stripe_account_id}`);
        } else {
          console.log("[create-checkout] Blocked self-referral");
        }
      }
    }

    // Build checkout session params
    const sessionParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?checkout=success`,
      cancel_url: `${req.headers.get("origin")}/planos`,
    };

    // Apply early bird coupon
    if (isEarlyBird) {
      sessionParams.discounts = [{ coupon: EARLY_BIRD_COUPON_ID }];
      console.log(`[create-checkout] Applied early bird coupon: ${EARLY_BIRD_COUPON_ID}`);
    }

    // Add Stripe Connect destination charges for subscriptions
    if (transferData) {
      sessionParams.subscription_data = {
        transfer_data: transferData,
        application_fee_percent: applicationFeePercent,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // If affiliate split was applied, record commission
    if (affiliateId && transferData) {
      await supabaseClient
        .from("affiliate_leads")
        .update({ purchased_at: new Date().toISOString(), user_plan: "pro" })
        .eq("user_id", user.id)
        .eq("referrer_id", affiliateId);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[create-checkout] Error:", error instanceof Error ? error.message : error);
    return new Response(JSON.stringify({ error: "An internal error occurred. Please try again." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
