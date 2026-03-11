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

    // Verify caller is site owner
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

    const { data: isOwner } = await supabaseAdmin.rpc("is_site_owner", { p_user_id: user.id });
    if (!isOwner) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }

    const { request_id, action } = await req.json();
    if (!request_id || !["approved", "rejected"].includes(action)) {
      return new Response(JSON.stringify({ error: "Invalid params" }), { status: 400, headers: corsHeaders });
    }

    // Get the request
    const { data: affReq } = await supabaseAdmin
      .from("affiliate_requests")
      .select("*")
      .eq("id", request_id)
      .single();

    if (!affReq) {
      return new Response(JSON.stringify({ error: "Request not found" }), { status: 404, headers: corsHeaders });
    }

    // Update request status
    await supabaseAdmin
      .from("affiliate_requests")
      .update({ status: action, updated_at: new Date().toISOString() })
      .eq("id", request_id);

    if (action === "approved") {
      // Get username for affiliate_id
      const { data: fp } = await supabaseAdmin
        .from("founder_profiles")
        .select("username")
        .eq("user_id", affReq.user_id)
        .maybeSingle();

      const affiliateId = fp?.username || affReq.user_id.slice(0, 8);

      // Get user email for Stripe
      const { data: { user: affiliateUser } } = await supabaseAdmin.auth.admin.getUserById(affReq.user_id);

      // Create Stripe Express connected account
      let stripeAccountId: string | null = null;
      try {
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2025-08-27.basil" });
        const account = await stripe.accounts.create({
          type: "express",
          country: "BR",
          email: affiliateUser?.email || undefined,
          capabilities: {
            transfers: { requested: true },
          },
          business_type: "individual",
        });
        stripeAccountId = account.id;
      } catch (stripeErr) {
        console.error("Stripe account creation failed:", stripeErr);
        // Continue without Stripe — affiliate can connect later
      }

      // Create affiliate profile
      await supabaseAdmin.from("affiliate_profiles").upsert({
        user_id: affReq.user_id,
        affiliate_id: affiliateId,
        commission_rate: 0.25,
        level: "starter",
        enabled: true,
        stripe_account_id: stripeAccountId,
        stripe_onboarding_complete: false,
      }, { onConflict: "user_id" });

      // Create wallet
      await supabaseAdmin.from("affiliate_wallet").upsert({
        user_id: affReq.user_id,
        balance_pending: 0,
        balance_available: 0,
        total_paid: 0,
      }, { onConflict: "user_id" });

      // Grant influencer badge
      const { data: existingBadge } = await supabaseAdmin
        .from("user_badges")
        .select("id")
        .eq("user_id", affReq.user_id)
        .eq("badge_key", "influencer_azera")
        .maybeSingle();

      if (!existingBadge) {
        await supabaseAdmin.from("user_badges").insert({
          user_id: affReq.user_id,
          badge_key: "influencer_azera",
        });
      }

      // Send notification
      await supabaseAdmin.from("founder_notifications").insert({
        user_id: affReq.user_id,
        title: "Você foi aprovado como Afiliado!",
        body: "Parabéns! Seu programa de afiliados está ativo. Acesse seu perfil para conectar sua conta Stripe e começar a receber comissões automaticamente.",
        type: "system",
        action_url: "/profile",
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("approve-affiliate error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
