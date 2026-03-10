import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BADGE_DEFINITIONS } from "@/lib/badges";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock } from "lucide-react";

interface BadgeShowcaseProps {
  userId: string;
  showLocked?: boolean;
}

export default function BadgeShowcase({ userId, showLocked = false }: BadgeShowcaseProps) {
  const { user } = useAuth();
  const [earnedKeys, setEarnedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isSiteOwner, setIsSiteOwner] = useState(false);

  useEffect(() => {
    const fetchBadges = async () => {
      const [badgesRes, profileRes] = await Promise.all([
        supabase.from("user_badges").select("badge_key").eq("user_id", userId),
        supabase.from("founder_profiles").select("is_site_owner").eq("user_id", userId).maybeSingle(),
      ]);
      setEarnedKeys(new Set((badgesRes.data || []).map((b: any) => b.badge_key)));
      setIsSiteOwner(profileRes.data?.is_site_owner || false);
      setLoading(false);
    };
    fetchBadges();
  }, [userId]);

  const recalculate = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.functions.invoke("calculate-badges");
    const { data } = await supabase.from("user_badges").select("badge_key").eq("user_id", userId);
    setEarnedKeys(new Set((data || []).map((b: any) => b.badge_key)));
  };

  useEffect(() => {
    if (user?.id === userId) recalculate();
  }, [user?.id, userId]);

  if (loading) return null;

  // Site owner = all badges unlocked
  const ownerUnlock = isSiteOwner;

  const badges = showLocked
    ? BADGE_DEFINITIONS
    : BADGE_DEFINITIONS.filter(b => ownerUnlock || earnedKeys.has(b.key));

  if (badges.length === 0) return null;

  const totalEarned = ownerUnlock ? BADGE_DEFINITIONS.length : earnedKeys.size;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        🏆 Insígnias {showLocked && <span className="text-xs text-muted-foreground font-normal">({totalEarned}/{BADGE_DEFINITIONS.length})</span>}
      </h3>
      <div className="flex flex-wrap gap-2">
        <TooltipProvider delayDuration={200}>
          {badges.map(badge => {
            const earned = ownerUnlock || earnedKeys.has(badge.key);
            const Icon = badge.icon;
            return (
              <Tooltip key={badge.key}>
                <TooltipTrigger asChild>
                  <div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                      earned
                        ? `${badge.colorClass} badge-earned`
                        : "bg-muted/50 opacity-40 grayscale"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {!earned && showLocked && (
                      <Lock className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="font-semibold text-xs">{badge.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {earned ? badge.description : badge.criterion}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
