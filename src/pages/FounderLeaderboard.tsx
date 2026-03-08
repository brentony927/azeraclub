import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Shield, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BookmarkButton from "@/components/BookmarkButton";

type LeaderEntry = {
  id: string; user_id: string; name: string; avatar_url: string | null;
  reputation_score: number | null; skills: string[] | null; is_verified: boolean | null;
  country: string | null; building: string | null;
};

const MEDALS = ["🥇", "🥈", "🥉"];

export default function FounderLeaderboard() {
  const [founders, setFounders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("founder_profiles")
      .select("id, user_id, name, avatar_url, reputation_score, skills, is_verified, country, building")
      .eq("is_published", true)
      .order("reputation_score", { ascending: false })
      .limit(50)
      .then(({ data }) => { setFounders((data as LeaderEntry[]) || []); setLoading(false); });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Trophy className="h-7 w-7 text-yellow-500" /> Top Founders
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Os membros mais ativos da comunidade AZERA</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>
      ) : founders.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Nenhum founder publicado ainda.</p>
      ) : (
        <div className="space-y-3">
          {founders.map((f, i) => {
            const initials = f.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
            const isTop3 = i < 3;
            return (
              <motion.div key={f.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className={`transition-all ${isTop3 ? "border-yellow-500/30 bg-yellow-500/5" : ""}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="text-2xl font-bold w-10 text-center shrink-0">
                      {isTop3 ? MEDALS[i] : <span className="text-muted-foreground text-lg">#{i + 1}</span>}
                    </div>
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={f.avatar_url || ""} />
                      <AvatarFallback className="bg-secondary text-foreground text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate">{f.name}</p>
                        {f.is_verified && <Shield className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {f.building && <span className="text-xs text-muted-foreground truncate">{f.building}</span>}
                        {f.country && <span className="text-xs text-muted-foreground">• {f.country}</span>}
                      </div>
                      {f.skills && f.skills.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {f.skills.slice(0, 3).map(s => <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">{s}</Badge>)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className={`font-bold text-lg ${isTop3 ? "text-yellow-600 dark:text-yellow-400" : "text-foreground"}`}>{f.reputation_score || 0}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</p>
                      </div>
                      <BookmarkButton itemType="founder" itemId={f.id} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
