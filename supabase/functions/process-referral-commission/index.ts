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

    // Check if commission already exists for this user
    const { data: existing } = await supabaseAdmin
      .from("commissions")
      .select("id")
      .eq("user_id", user_id)
      .eq("affiliate_id", referral.referrer_id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ message: "Commission already exists" }), { headers: corsHeaders });
    }

    // Get partner's commission rate
    const { data: partner } = await supabaseAdmin
      .from("partner_profiles")
      .select("commission_rate, partner_id")
      .eq("partner_id", referral.referrer_id)
      .eq("enabled", true)
      .maybeSingle();

    if (!partner) {
      return new Response(JSON.stringify({ message: "Partner not found or disabled" }), { headers: corsHeaders });
    }

    const rate = partner.commission_rate || 0.25;
    const amount = plan_price * rate;

    // Insert commission
    await supabaseAdmin.from("commissions").insert({
      affiliate_id: referral.referrer_id,
      user_id,
      amount,
      status: "pending",
    });

    // Check if commission rate tier should be upgraded
    const { count: totalSales } = await supabaseAdmin
      .from("commissions")
      .select("id", { count: "exact", head: true })
      .eq("affiliate_id", referral.referrer_id);

    let newRate = 0.25;
    if ((totalSales || 0) >= 100) newRate = 0.40;
    else if ((totalSales || 0) >= 50) newRate = 0.35;
    else if ((totalSales || 0) >= 10) newRate = 0.30;

    if (newRate !== rate) {
      await supabaseAdmin
        .from("partner_profiles")
        .update({ commission_rate: newRate })
        .eq("partner_id", referral.referrer_id);
    }

    return new Response(JSON.stringify({ success: true, amount, newRate }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("process-referral-commission error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
