import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getLevel(score: number): string {
  if (score >= 81) return "Elite Founder";
  if (score >= 61) return "Operator";
  if (score >= 41) return "Builder";
  if (score >= 21) return "Explorer";
  return "New Founder";
}

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
    const { data: claimsData, error: claimsError } = await supabaseUser.auth.getUser(token);
    if (claimsError || !claimsData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = claimsData.user.id;

    // 1. PROFILE POINTS (max 15)
    const { data: profile } = await supabaseAdmin.from("founder_profiles").select("*").eq("user_id", userId).maybeSingle();
    let profilePts = 0;
    if (profile) {
      if (profile.avatar_url) profilePts += 2;
      if (profile.building) profilePts += 2;
      if (profile.skills?.length > 0) profilePts += 2;
      if (profile.interests?.length > 0) profilePts += 2;
      if (profile.city) profilePts += 1;
      if (profile.age) profilePts += 1;
      if (profile.industry?.length > 0) profilePts += 2;
      // 100% complete bonus
      const fields = [profile.avatar_url, profile.building, profile.skills?.length, profile.interests?.length, profile.city, profile.country, profile.industry?.length, profile.looking_for?.length, profile.commitment, profile.continent];
      if (fields.every(Boolean)) profilePts += 3;
    }
    profilePts = Math.min(profilePts, 15);

    // 2. NETWORKING POINTS (max 25)
    const { count: acceptedConns } = await supabaseAdmin.from("founder_connections").select("id", { count: "exact", head: true })
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`).eq("status", "accepted");
    const { count: msgsSent } = await supabaseAdmin.from("founder_messages").select("id", { count: "exact", head: true }).eq("from_user_id", userId);
    const { count: msgsReceived } = await supabaseAdmin.from("founder_messages").select("id", { count: "exact", head: true }).eq("to_user_id", userId).eq("read", true);

    let networkPts = Math.min((acceptedConns || 0) * 2, 10) + Math.min((msgsSent || 0) * 0.5, 5) + Math.min((msgsReceived || 0) * 1, 10);
    networkPts = Math.min(Math.round(networkPts), 25);

    // 3. PROJECT POINTS (max 25)
    const { count: venturesCreated } = await supabaseAdmin.from("ventures").select("id", { count: "exact", head: true }).eq("user_id", userId);
    const { count: venturesJoined } = await supabaseAdmin.from("venture_members").select("id", { count: "exact", head: true }).eq("user_id", userId);

    let projectPts = Math.min((venturesCreated || 0) * 8, 16) + Math.min((venturesJoined || 0) * 5, 10);
    projectPts = Math.min(projectPts, 25);

    // 4. ACTIVITY POINTS (max 20)
    const { count: oppsCount } = await supabaseAdmin.from("founder_opportunities").select("id", { count: "exact", head: true }).eq("user_id", userId);
    let activityPts = Math.min((oppsCount || 0) * 5, 15);
    if (profile?.is_published) activityPts += 5;
    activityPts = Math.min(activityPts, 20);

    // 5. INFLUENCE POINTS (max 15)
    const views = profile?.profile_views || 0;
    const { count: incomingConns } = await supabaseAdmin.from("founder_connections").select("id", { count: "exact", head: true }).eq("to_user_id", userId).eq("status", "accepted");

    let influencePts = Math.min(Math.round(views * 0.2), 10) + Math.min((incomingConns || 0) * 1, 5);
    influencePts = Math.min(influencePts, 15);

    // Plan bonus
    const { data: userPlan } = await supabaseAdmin.from("user_plans").select("plan").eq("user_id", userId).maybeSingle();
    let bonus = 0;
    if (userPlan?.plan === "business") bonus = 10;
    else if (userPlan?.plan === "pro") bonus = 5;

    const totalScore = Math.min(100, profilePts + networkPts + projectPts + activityPts + influencePts + bonus);
    const level = getLevel(totalScore);

    // Upsert
    const { error: upsertError } = await supabaseAdmin.from("founder_scores").upsert({
      user_id: userId,
      profile_points: profilePts,
      network_points: networkPts,
      project_points: projectPts,
      activity_points: activityPts,
      influence_points: influencePts,
      total_score: totalScore,
      level,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({
      profile_points: profilePts,
      network_points: networkPts,
      project_points: projectPts,
      activity_points: activityPts,
      influence_points: influencePts,
      total_score: totalScore,
      level,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
});
