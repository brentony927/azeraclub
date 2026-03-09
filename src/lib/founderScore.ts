import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FounderScore {
  profile_points: number;
  network_points: number;
  project_points: number;
  activity_points: number;
  influence_points: number;
  total_score: number;
  level: string;
}

export const LEVEL_COLORS: Record<string, string> = {
  "New Founder": "text-muted-foreground",
  "Explorer": "text-blue-500",
  "Builder": "text-emerald-500",
  "Operator": "text-amber-500",
  "Elite Founder": "text-yellow-400",
};

export const SCORE_BADGES = [
  { key: "top_networker", label: "Top Networker", check: (s: FounderScore) => s.network_points >= 20, icon: "🤝" },
  { key: "startup_creator", label: "Startup Creator", check: (s: FounderScore) => s.project_points >= 20, icon: "🚀" },
  { key: "opportunity_hunter", label: "Opportunity Hunter", check: (s: FounderScore) => s.activity_points >= 15, icon: "🎯" },
  { key: "elite_founder", label: "Elite Founder", check: (s: FounderScore) => s.total_score >= 81, icon: "👑" },
];

export function useFounderScore(userId: string | undefined) {
  const [score, setScore] = useState<FounderScore | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("founder_scores")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) {
      setScore({
        profile_points: (data as any).profile_points,
        network_points: (data as any).network_points,
        project_points: (data as any).project_points,
        activity_points: (data as any).activity_points,
        influence_points: (data as any).influence_points,
        total_score: (data as any).total_score,
        level: (data as any).level,
      });
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const recalculate = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await supabase.functions.invoke("calculate-founder-score", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.data && !res.error) {
        setScore(res.data as FounderScore);
      }
    } catch (e) {
      console.error("Score recalc error:", e);
    }
    setLoading(false);
  }, []);

  return { score, loading, recalculate };
}
