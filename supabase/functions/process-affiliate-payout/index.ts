import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });

    // Find commissions older than 7 days with status 'pending'
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: pendingCommissions } = await supabaseAdmin
      .from("affiliate_commissions")
      .select("*")
      .eq("status", "pending")
      .lt("created_at", sevenDaysAgo.toISOString());

    if (!pendingCommissions || pendingCommissions.length === 0) {
      return new Response(JSON.stringify({ message: "No commissions to process" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let processed = 0;
    let failed = 0;

    for (const commission of pendingCommissions) {
      try {
        // Get affiliate profile by affiliate_id
        const { data: affiliate } = await supabaseAdmin
          .from("affiliate_profiles")
          .select("*")
          .eq("affiliate_id", commission.affiliate_id)
          .maybeSingle();

        if (!affiliate || !affiliate.stripe_account_id || !affiliate.stripe_onboarding_complete) {
          console.log(`Skipping commission ${commission.id}: affiliate not ready for Stripe`);
          continue;
        }

        // Convert amount to cents (BRL)
        const amountCents = Math.round(Number(commission.amount) * 100);

        if (amountCents < 100) {
          console.log(`Skipping commission ${commission.id}: amount too small`);
          continue;
        }

        // Create transfer to connected account
        await stripe.transfers.create({
          amount: amountCents,
          currency: "brl",
          destination: affiliate.stripe_account_id,
          description: `Affiliate commission - ${commission.id}`,
        });

        // Update commission status
        await supabaseAdmin
          .from("affiliate_commissions")
          .update({
            status: "paid",
            paid_at: new Date().toISOString(),
          })
          .eq("id", commission.id);

        // Update wallet
        await supabaseAdmin.rpc("transfer_commission_to_paid", {
          p_user_id: affiliate.user_id,
          p_amount: Number(commission.amount),
        }).catch(() => {
          // Fallback: manual wallet update
          supabaseAdmin
            .from("affiliate_wallet")
            .update({
              balance_pending: Math.max(0, Number(affiliate.balance_pending || 0) - Number(commission.amount)),
              total_paid: Number(affiliate.total_paid || 0) + Number(commission.amount),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", affiliate.user_id);
        });

        // Notify affiliate
        await supabaseAdmin.from("founder_notifications").insert({
          user_id: affiliate.user_id,
          title: "Comissão paga!",
          body: `R$${Number(commission.amount).toFixed(2)} foi transferido para sua conta Stripe.`,
          type: "system",
          action_url: "/profile",
        });

        processed++;
      } catch (transferErr) {
        console.error(`Failed to process commission ${commission.id}:`, transferErr);
        failed++;
      }
    }

    return new Response(JSON.stringify({ processed, failed, total: pendingCommissions.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("process-affiliate-payout error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
