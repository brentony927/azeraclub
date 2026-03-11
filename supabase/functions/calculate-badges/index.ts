import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BadgeRule {
  key: string;
  check: (s: Stats) => boolean;
}

interface Stats {
  ventures: number;
  connections: number;
  projects: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  ideas: number;
  challengesCompleted: number;
  challengesTotal: number;
  posts: number;
  maxHabitStreak: number;
  totalScore: number;
  plan: string;
  isVerified: boolean;
  isSiteOwner: boolean;
  journalEntries: number;
  trips: number;
  opportunities: number;
  accountAgeDays: number;
  profileComplete: boolean;
  referralConversions: number;
  userPosition: number;
  approvedSuggestions: number;
}

const ALL_BADGE_KEYS = [
  "first_venture","networker","builder","goal_crusher","idea_machine","challenger",
  "social_butterfly","habit_master","elite_achiever","trusted_pro","trusted_business",
  "verified_founder","first_post","journal_writer","streak_7","streak_60","ten_ventures",
  "fifty_connections","hundred_ideas","investor_ready","community_leader","globe_trotter",
  "first_connection","five_ventures","twenty_connections","ten_objectives","fifty_ideas",
  "ten_challenges","thirty_posts","streak_14","streak_90","score_50","ten_projects",
  "first_idea","first_objective","first_challenge","journal_master","five_opportunities",
  "early_adopter","profile_complete","mentor","diamond_founder",
  "growth_partner","azera_ambassador","top_connector",
  "fertile_mind",
];

const BADGE_RULES: BadgeRule[] = [
  // Original 12
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
  { key: "verified_founder", check: s => s.isVerified || s.isSiteOwner },
  // 30 new
  { key: "first_post", check: s => s.posts >= 1 },
  { key: "journal_writer", check: s => s.journalEntries >= 5 },
  { key: "streak_7", check: s => s.maxHabitStreak >= 7 },
  { key: "streak_60", check: s => s.maxHabitStreak >= 60 },
  { key: "ten_ventures", check: s => s.ventures >= 10 },
  { key: "fifty_connections", check: s => s.connections >= 50 },
  { key: "hundred_ideas", check: s => s.ideas >= 100 },
  { key: "investor_ready", check: s => s.opportunities >= 3 },
  { key: "community_leader", check: s => s.posts >= 50 },
  { key: "globe_trotter", check: s => s.trips >= 5 },
  { key: "first_connection", check: s => s.connections >= 1 },
  { key: "five_ventures", check: s => s.ventures >= 5 },
  { key: "twenty_connections", check: s => s.connections >= 20 },
  { key: "ten_objectives", check: s => s.objectivesCompleted >= 10 },
  { key: "fifty_ideas", check: s => s.ideas >= 50 },
  { key: "ten_challenges", check: s => s.challengesCompleted >= 10 },
  { key: "thirty_posts", check: s => s.posts >= 30 },
  { key: "streak_14", check: s => s.maxHabitStreak >= 14 },
  { key: "streak_90", check: s => s.maxHabitStreak >= 90 },
  { key: "score_50", check: s => s.totalScore >= 50 },
  { key: "ten_projects", check: s => s.projects >= 10 },
  { key: "first_idea", check: s => s.ideas >= 1 },
  { key: "first_objective", check: s => s.objectivesTotal >= 1 },
  { key: "first_challenge", check: s => s.challengesTotal >= 1 },
  { key: "journal_master", check: s => s.journalEntries >= 30 },
  { key: "five_opportunities", check: s => s.opportunities >= 5 },
  { key: "early_adopter", check: s => s.userPosition <= 20 },
  { key: "profile_complete", check: s => s.profileComplete },
  { key: "mentor", check: s => s.totalScore >= 70 && s.connections >= 10 },
  { key: "diamond_founder", check: s => s.totalScore >= 95 && s.connections >= 50 },
  // Partner badges
  { key: "growth_partner", check: s => s.referralConversions >= 1 },
  { key: "azera_ambassador", check: s => s.referralConversions >= 10 },
  { key: "top_connector", check: s => s.referralConversions >= 50 },
  // Suggestion badge
  { key: "fertile_mind", check: s => s.approvedSuggestions >= 5 },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const supabaseUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseUser.auth.getUser(token);
    if (userError || !userData?.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    const userId = userData.user.id;

    // Gather stats in parallel
    const [
      venturesRes, connectionsRes, projectsRes, objectivesCompletedRes, objectivesTotalRes,
      ideasRes, challengesCompletedRes, challengesTotalRes, postsRes, habitsRes,
      scoreRes, planRes, profileRes, journalRes, tripsRes, opportunitiesRes, partnerRes,
    ] = await Promise.all([
      supabaseAdmin.from("ventures").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("founder_connections").select("id", { count: "exact", head: true })
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`).eq("status", "accepted"),
      supabaseAdmin.from("projects").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("objectives").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "concluido"),
      supabaseAdmin.from("objectives").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("ideas").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("challenges").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "concluido"),
      supabaseAdmin.from("challenges").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("founder_posts").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("habits").select("streak").eq("user_id", userId).order("streak", { ascending: false }).limit(1),
      supabaseAdmin.from("founder_scores").select("total_score").eq("user_id", userId).maybeSingle(),
      supabaseAdmin.from("user_plans").select("plan").eq("user_id", userId).maybeSingle(),
      supabaseAdmin.from("founder_profiles").select("is_verified, is_site_owner, name, city, country, skills, industry, building, looking_for, avatar_url, created_at").eq("user_id", userId).maybeSingle(),
      supabaseAdmin.from("journal_entries").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("trips").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("founder_opportunities").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabaseAdmin.from("partner_profiles").select("partner_id").eq("user_id", userId).maybeSingle(),
      supabaseAdmin.from("suggestions").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "implementado"),
    ]);

    const fp = profileRes.data;
    const isSiteOwner = fp?.is_site_owner || false;
    const accountCreated = fp?.created_at ? new Date(fp.created_at) : new Date();
    const accountAgeDays = Math.floor((Date.now() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));
    const profileComplete = !!(fp?.name && fp?.city && fp?.country && fp?.skills?.length && fp?.industry?.length && fp?.building && fp?.looking_for?.length && fp?.avatar_url);

    // Determine user's position (how many profiles were created before this one)
    const { count: earlierProfiles } = await supabaseAdmin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .lte("created_at", accountCreated.toISOString());
    const userPosition = earlierProfiles || 999;

    // Count referral conversions for partner badges
    let referralConversions = 0;
    const partnerData = (partnerRes as any)?.data;
    if (partnerData?.partner_id) {
      const { count: refCount } = await supabaseAdmin
        .from("commissions")
        .select("id", { count: "exact", head: true })
        .eq("affiliate_id", partnerData.partner_id);
      referralConversions = refCount || 0;
    }

    const stats: Stats = {
      ventures: venturesRes.count || 0,
      connections: connectionsRes.count || 0,
      projects: projectsRes.count || 0,
      objectivesCompleted: objectivesCompletedRes.count || 0,
      objectivesTotal: objectivesTotalRes.count || 0,
      ideas: ideasRes.count || 0,
      challengesCompleted: challengesCompletedRes.count || 0,
      challengesTotal: challengesTotalRes.count || 0,
      posts: postsRes.count || 0,
      maxHabitStreak: habitsRes.data?.[0]?.streak || 0,
      totalScore: scoreRes.data?.total_score || 0,
      plan: planRes.data?.plan || "free",
      isVerified: fp?.is_verified || false,
      isSiteOwner,
      journalEntries: journalRes.count || 0,
      trips: tripsRes.count || 0,
      opportunities: opportunitiesRes.count || 0,
      accountAgeDays,
      profileComplete,
      referralConversions,
      userPosition,
    };

    // Site owner gets ALL badges
    const earnedKeys = isSiteOwner
      ? [...ALL_BADGE_KEYS]
      : BADGE_RULES.filter(r => r.check(stats)).map(r => r.key);

    if (earnedKeys.length > 0) {
      const rows = earnedKeys.map(key => ({ user_id: userId, badge_key: key }));
      await supabaseAdmin.from("user_badges").upsert(rows, { onConflict: "user_id,badge_key", ignoreDuplicates: true });
    }

    const { data: allBadges } = await supabaseAdmin.from("user_badges").select("badge_key, earned_at").eq("user_id", userId);

    return new Response(JSON.stringify({ badges: allBadges || [], stats }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("calculate-badges error:", err);
    return new Response(JSON.stringify({ error: "Failed to calculate badges" }), { status: 500, headers: corsHeaders });
  }
});
