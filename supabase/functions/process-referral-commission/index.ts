import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { user_id, plan_price } = await req.json();
    if (!user_id || !plan_price) {
      return new Response(JSON.stringify({ error: "Missing user_id or plan_price" }), { status: 400, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if user came via referral
    const { data: referral } = await supabaseAdmin
      .from("referrals")
      .select("referrer_id")
      .eq("user_id", user_id)
      .maybeSingle();

    if (!referral) {
      return new Response(JSON.stringify({ message: "No referral found" }), { headers: corsHeaders });
    }

    // Check for existing commission
    const { data: existingNew } = await supabaseAdmin
      .from("affiliate_commissions")
      .select("id")
      .eq("user_id", user_id)
      .eq("affiliate_id", referral.referrer_id)
      .maybeSingle();

    if (existingNew) {
      return new Response(JSON.stringify({ message: "Commission already exists" }), { headers: corsHeaders });
    }

    // Look up affiliate
    const { data: affiliate } = await supabaseAdmin
      .from("affiliate_profiles")
      .select("affiliate_id, commission_rate, user_id, enabled, stripe_onboarding_complete")
      .eq("affiliate_id", referral.referrer_id)
      .eq("enabled", true)
      .maybeSingle();

    if (!affiliate) {
      return new Response(JSON.stringify({ message: "Affiliate not found or disabled" }), { headers: corsHeaders });
    }

    const rate = affiliate.commission_rate || 0.25;
    const amount = plan_price * rate;

    // Record commission as "paid" — Stripe Connect handles the actual transfer
    const status = affiliate.stripe_onboarding_complete ? "paid" : "pending";

    await supabaseAdmin.from("affiliate_commissions").insert({
      affiliate_id: referral.referrer_id,
      user_id,
      amount,
      status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    });

    // Update affiliate lead purchase date
    await supabaseAdmin
      .from("affiliate_leads")
      .update({ purchased_at: new Date().toISOString(), user_plan: "pro" })
      .eq("user_id", user_id)
      .eq("referrer_id", referral.referrer_id);

    // Notify affiliate
    await supabaseAdmin.from("founder_notifications").insert({
      user_id: affiliate.user_id,
      title: "Nova comissão gerada!",
      body: status === "paid"
        ? `Você ganhou R$${amount.toFixed(2)} de comissão. O valor será transferido automaticamente via Stripe.`
        : `Você ganhou R$${amount.toFixed(2)} de comissão. Conecte sua conta Stripe para receber automaticamente.`,
      type: "system",
      action_url: "/profile",
    });

    // Check if commission rate tier should be upgraded
    const { count: totalSales } = await supabaseAdmin
      .from("affiliate_commissions")
      .select("id", { count: "exact", head: true })
      .eq("affiliate_id", referral.referrer_id);

    let newRate = 0.25;
    let newLevel = "starter";
    if ((totalSales || 0) >= 100) { newRate = 0.40; newLevel = "legend"; }
    else if ((totalSales || 0) >= 50) { newRate = 0.35; newLevel = "ambassador"; }
    else if ((totalSales || 0) >= 10) { newRate = 0.30; newLevel = "partner"; }

    if (newRate !== rate) {
      await supabaseAdmin
        .from("affiliate_profiles")
        .update({ commission_rate: newRate, level: newLevel })
        .eq("affiliate_id", referral.referrer_id);
    }

    return new Response(JSON.stringify({ success: true, amount, status, newRate }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("process-referral-commission error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
