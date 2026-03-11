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

    // Check for existing commission (old partner system)
    const { data: existingOld } = await supabaseAdmin
      .from("commissions")
      .select("id")
      .eq("user_id", user_id)
      .eq("affiliate_id", referral.referrer_id)
      .maybeSingle();

    // Check for existing commission (new affiliate system)
    const { data: existingNew } = await supabaseAdmin
      .from("affiliate_commissions")
      .select("id")
      .eq("user_id", user_id)
      .eq("affiliate_id", referral.referrer_id)
      .maybeSingle();

    if (existingOld || existingNew) {
      return new Response(JSON.stringify({ message: "Commission already exists" }), { headers: corsHeaders });
    }

    // Try new affiliate system first, fallback to old partner system
    const { data: affiliate } = await supabaseAdmin
      .from("affiliate_profiles")
      .select("affiliate_id, commission_rate, user_id, enabled")
      .eq("affiliate_id", referral.referrer_id)
      .eq("enabled", true)
      .maybeSingle();

    let rate = 0.25;
    let affiliateUserId: string | null = null;

    if (affiliate) {
      rate = affiliate.commission_rate || 0.25;
      affiliateUserId = affiliate.user_id;
    } else {
      // Fallback: old partner system
      const { data: partner } = await supabaseAdmin
        .from("partner_profiles")
        .select("commission_rate, partner_id, user_id")
        .eq("partner_id", referral.referrer_id)
        .eq("enabled", true)
        .maybeSingle();

      if (!partner) {
        return new Response(JSON.stringify({ message: "Affiliate/partner not found or disabled" }), { headers: corsHeaders });
      }
      rate = partner.commission_rate || 0.25;
    }

    const amount = plan_price * rate;

    // Insert into new affiliate_commissions table
    if (affiliate) {
      await supabaseAdmin.from("affiliate_commissions").insert({
        affiliate_id: referral.referrer_id,
        user_id,
        amount,
        status: "pending",
      });

      // Update wallet pending balance
      const { data: wallet } = await supabaseAdmin
        .from("affiliate_wallet")
        .select("*")
        .eq("user_id", affiliateUserId!)
        .maybeSingle();

      if (wallet) {
        await supabaseAdmin
          .from("affiliate_wallet")
          .update({
            balance_pending: Number(wallet.balance_pending || 0) + amount,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", affiliateUserId!);
      }

      // Update affiliate lead purchase date
      await supabaseAdmin
        .from("affiliate_leads")
        .update({ purchased_at: new Date().toISOString(), user_plan: "pro" })
        .eq("user_id", user_id)
        .eq("referrer_id", referral.referrer_id);

      // Notify affiliate
      await supabaseAdmin.from("founder_notifications").insert({
        user_id: affiliateUserId!,
        title: "Nova comissão gerada!",
        body: `Você ganhou R$${amount.toFixed(2)} de comissão. O valor estará disponível após 7 dias.`,
        type: "system",
        action_url: "/profile",
      });
    }

    // Also insert into old commissions table for backward compatibility
    await supabaseAdmin.from("commissions").insert({
      affiliate_id: referral.referrer_id,
      user_id,
      amount,
      status: "pending",
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

    if (affiliate && newRate !== rate) {
      await supabaseAdmin
        .from("affiliate_profiles")
        .update({ commission_rate: newRate, level: newLevel })
        .eq("affiliate_id", referral.referrer_id);
    }

    return new Response(JSON.stringify({ success: true, amount, newRate }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("process-referral-commission error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
