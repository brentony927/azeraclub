import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WEEKLY_LIMIT = 10;

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await authClient.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    const body = await req.json();
    const { to_user_id, content } = body;

    if (!to_user_id || !content) {
      return new Response(JSON.stringify({ error: "Missing to_user_id or content" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (to_user_id === userId) {
      return new Response(JSON.stringify({ error: "Cannot message yourself" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeContent = String(content).slice(0, 2000);

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const serviceClient = createClient(supabaseUrl, serviceKey);

    // Check if the recipient has blocked the sender
    const { data: blockData } = await serviceClient
      .from("user_blocks")
      .select("id")
      .or(`and(blocker_id.eq.${to_user_id},blocked_id.eq.${userId}),and(blocker_id.eq.${userId},blocked_id.eq.${to_user_id})`)
      .limit(1);

    if (blockData && blockData.length > 0) {
      return new Response(JSON.stringify({ error: "Blocked", blocked: true }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine plan server-side
    const { data: planData } = await serviceClient
      .from("user_plans")
      .select("plan")
      .eq("user_id", userId)
      .maybeSingle();

    const userPlan = planData?.plan || "free";
    const isLimitedPlan = userPlan === "free" || userPlan === "basic";

    if (isLimitedPlan) {
      const weekStart = getWeekStart();
      const { data: limitData } = await serviceClient
        .from("weekly_message_limits")
        .select("message_count")
        .eq("user_id", userId)
        .eq("week_start", weekStart)
        .maybeSingle();

      const currentCount = limitData?.message_count || 0;

      if (currentCount >= WEEKLY_LIMIT) {
        return new Response(JSON.stringify({ error: "Weekly message limit reached", limit_reached: true }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await serviceClient.from("weekly_message_limits").upsert({
        user_id: userId,
        week_start: weekStart,
        message_count: currentCount + 1,
      }, { onConflict: "user_id,week_start" });
    }

    const { data: inserted, error: insertError } = await serviceClient
      .from("founder_messages")
      .insert({
        from_user_id: userId,
        to_user_id,
        content: safeContent,
      })
      .select()
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: "Failed to send message" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Notify the recipient
    try {
      const { data: senderProfile } = await serviceClient
        .from("founder_profiles")
        .select("name")
        .eq("user_id", userId)
        .maybeSingle();
      const senderName = senderProfile?.name || "Alguém";
      await serviceClient.from("founder_notifications").insert({
        user_id: to_user_id,
        type: "message",
        title: `${senderName} enviou uma mensagem 💬`,
        action_url: "/founder-messages",
        related_user_id: userId,
      });
    } catch (_) { /* non-critical */ }

    return new Response(JSON.stringify({ message: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[send-founder-message]", error);
    return new Response(JSON.stringify({ error: "Failed to send message" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
