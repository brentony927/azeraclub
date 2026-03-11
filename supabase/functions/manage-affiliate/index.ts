import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    const { action, user_id } = await req.json();
    if (!user_id || !["disable", "enable", "delete"].includes(action)) {
      return new Response(JSON.stringify({ error: "Invalid params" }), { status: 400, headers: corsHeaders });
    }

    if (action === "disable") {
      await supabaseAdmin
        .from("affiliate_profiles")
        .update({ enabled: false })
        .eq("user_id", user_id);

      await supabaseAdmin.from("founder_notifications").insert({
        user_id,
        title: "Seu programa de afiliados foi desativado",
        body: "Seu perfil de afiliado foi temporariamente desativado pelo administrador.",
        type: "system",
      });
    } else if (action === "enable") {
      await supabaseAdmin
        .from("affiliate_profiles")
        .update({ enabled: true })
        .eq("user_id", user_id);

      await supabaseAdmin.from("founder_notifications").insert({
        user_id,
        title: "Seu programa de afiliados foi reativado!",
        body: "Seu perfil de afiliado está ativo novamente. Continue compartilhando seu link!",
        type: "system",
      });
    } else if (action === "delete") {
      // Delete affiliate profile, wallet and update request status
      await supabaseAdmin.from("affiliate_profiles").delete().eq("user_id", user_id);
      await supabaseAdmin.from("affiliate_wallet").delete().eq("user_id", user_id);
      await supabaseAdmin
        .from("affiliate_requests")
        .update({ status: "deleted", updated_at: new Date().toISOString() })
        .eq("user_id", user_id)
        .eq("status", "approved");

      // Remove influencer badge
      await supabaseAdmin
        .from("user_badges")
        .delete()
        .eq("user_id", user_id)
        .eq("badge_key", "influencer_azera");

      await supabaseAdmin.from("founder_notifications").insert({
        user_id,
        title: "Seu perfil de afiliado foi removido",
        body: "Seu perfil de afiliado foi removido pelo administrador.",
        type: "system",
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("manage-affiliate error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
