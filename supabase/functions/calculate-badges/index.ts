import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BadgeRule {
  key: string;
  check: (stats: Stats) => boolean;
}

interface Stats {
  ventures: number;
  connections: number;
  projects: number;
  objectivesCompleted: number;
  ideas: number;
  challengesCompleted: number;
  posts: number;
  maxHabitStreak: number;
  totalScore: number;
  plan: string;
  isVerified: boolean;
}

const BADGE_RULES: BadgeRule[] = [
  { key: "first_venture", check: s => s.ventures >= 1 },
  { key: "networker", check: s => s.connections >= 5 },
  { key: "builder", check: s => s.projects >= 3 },
  { key: "goal_crusher", check: s => s.objectivesCompleted >= 5 },
  { key: "idea_machine", check: s => s.ideas >= 10 },
  { key: "challenger", check: s => s.challengesCompleted >= 3 },
  { key: "social_butterfly", check: s => s.posts >= 10 },
  { key: "habit_master", check: s => s.maxHabitStreak >= 30 },
  { key: "elite_achiever", check: s => s.totalScore >= 80 },
  { key: "trusted_pro", check: s => s.plan === "pro" || s.plan === "business" },
  { key: "trusted_business", check: s => s.plan === "business" },
  { key: "verified_founder", check: s => s.isVerified },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseUser.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = userData.user.id;

    // Gather stats in parallel
    const [
      venturesRes,
      connectionsRes,
      projectsRes,
      objectivesRes,
      ideasRes,
      challengesRes,
      postsRes,
      habitsRes,
      scoreRes,
      planRes,
      profileRes,
    ] = await Promise.all([
      supabaseAdmin.from("ventures").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("founder_connections").select("id", { count: "exact", head: true })
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`).eq("status", "accepted"),
      supabaseAdmin.from("projects").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("objectives").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "concluido"),
      supabaseAdmin.from("ideas").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("challenges").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "concluido"),
      supabaseAdmin.from("founder_posts").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("habits").select("streak").eq("user_id", userId).order("streak", { ascending: false }).limit(1),
      supabaseAdmin.from("founder_scores").select("total_score").eq("user_id", userId).maybeSingle(),
      supabaseAdmin.from("user_plans").select("plan").eq("user_id", userId).maybeSingle(),
      supabaseAdmin.from("founder_profiles").select("is_verified").eq("user_id", userId).maybeSingle(),
    ]);

    const stats: Stats = {
      ventures: venturesRes.count || 0,
      connections: connectionsRes.count || 0,
      projects: projectsRes.count || 0,
      objectivesCompleted: objectivesRes.count || 0,
      ideas: ideasRes.count || 0,
      challengesCompleted: challengesRes.count || 0,
      posts: postsRes.count || 0,
      maxHabitStreak: habitsRes.data?.[0]?.streak || 0,
      totalScore: scoreRes.data?.total_score || 0,
      plan: planRes.data?.plan || "free",
      isVerified: profileRes.data?.is_verified || false,
    };

    // Determine earned badges
    const earnedKeys = BADGE_RULES.filter(r => r.check(stats)).map(r => r.key);

    // Insert new badges (ON CONFLICT DO NOTHING)
    if (earnedKeys.length > 0) {
      const rows = earnedKeys.map(key => ({ user_id: userId, badge_key: key }));
      await supabaseAdmin.from("user_badges").upsert(rows, { onConflict: "user_id,badge_key", ignoreDuplicates: true });
    }

    // Fetch all badges for user
    const { data: allBadges } = await supabaseAdmin.from("user_badges").select("badge_key, earned_at").eq("user_id", userId);

    return new Response(JSON.stringify({
      badges: allBadges || [],
      stats,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    console.error("calculate-badges error:", err);
    return new Response(JSON.stringify({ error: "Failed to calculate badges" }), { status: 500, headers: corsHeaders });
  }
});
