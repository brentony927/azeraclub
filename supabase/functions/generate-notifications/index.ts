import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const notifications: any[] = [];

    // 1. New founders joined (notify users who have published profiles)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: newFounders } = await supabase
      .from("founder_profiles")
      .select("user_id, name, country")
      .eq("is_published", true)
      .gte("created_at", oneDayAgo);

    if (newFounders && newFounders.length > 0) {
      const { data: allPublished } = await supabase
        .from("founder_profiles")
        .select("user_id")
        .eq("is_published", true)
        .lt("created_at", oneDayAgo);

      const newIds = new Set(newFounders.map((f: any) => f.user_id));

      for (const profile of allPublished || []) {
        if (newIds.has(profile.user_id)) continue;
        notifications.push({
          user_id: profile.user_id,
          type: "new_founders",
          title: `${newFounders.length} novos founders entraram na plataforma`,
          body: newFounders.slice(0, 3).map((f: any) => f.name).join(", ") + (newFounders.length > 3 ? "..." : ""),
          action_url: "/founder-feed",
        });
      }
    }

    // 2. Ranking changes - notify founders whose rank changed
    const { data: topFounders } = await supabase
      .from("founder_profiles")
      .select("user_id, name, reputation_score")
      .eq("is_published", true)
      .order("reputation_score", { ascending: false })
      .limit(20);

    if (topFounders) {
      for (let i = 0; i < Math.min(3, topFounders.length); i++) {
        const f = topFounders[i];
        if ((f.reputation_score || 0) > 0) {
          notifications.push({
            user_id: f.user_id,
            type: "ranking_change",
            title: `Você está no Top ${i + 1} do Leaderboard!`,
            body: `Seu score atual é ${f.reputation_score}. Continue engajando!`,
            action_url: "/leaderboard",
          });
        }
      }
    }

    // 3. Trending industries from trend_scans
    const { data: recentTrends } = await supabase
      .from("trend_scans")
      .select("category")
      .gte("created_at", oneDayAgo);

    if (recentTrends && recentTrends.length > 0) {
      const catCount: Record<string, number> = {};
      for (const t of recentTrends) {
        if (t.category) catCount[t.category] = (catCount[t.category] || 0) + 1;
      }
      const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];
      if (topCat) {
        const { data: allUsers } = await supabase.from("founder_profiles").select("user_id").eq("is_published", true);
        for (const u of allUsers || []) {
          notifications.push({
            user_id: u.user_id,
            type: "trending_industry",
            title: `${topCat[0]} está em alta entre os founders`,
            body: `${topCat[1]} scans nessa categoria nas últimas 24h.`,
            action_url: "/trend-scanner",
          });
        }
      }
    }

    // 4. AI opportunity alerts for users with opportunity_alerts configured
    const { data: alerts } = await supabase
      .from("opportunity_alerts")
      .select("user_id, industries")
      .eq("active", true);

    for (const alert of alerts || []) {
      if (alert.industries && alert.industries.length > 0) {
        notifications.push({
          user_id: alert.user_id,
          type: "ai_opportunity",
          title: "Novas oportunidades detectadas pelo AI",
          body: `Oportunidades em ${alert.industries.slice(0, 2).join(", ")} podem estar disponíveis.`,
          action_url: "/opportunity-radar",
        });
      }
    }

    // Deduplicate: don't insert if same user+type already got one today
    const inserted: string[] = [];
    for (const n of notifications) {
      const key = `${n.user_id}:${n.type}`;
      if (inserted.includes(key)) continue;

      const { data: existing } = await supabase
        .from("founder_notifications")
        .select("id")
        .eq("user_id", n.user_id)
        .eq("type", n.type)
        .gte("created_at", oneDayAgo)
        .limit(1);

      if (existing && existing.length > 0) continue;

      await supabase.from("founder_notifications").insert(n);
      inserted.push(key);
    }

    return new Response(JSON.stringify({ generated: inserted.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
