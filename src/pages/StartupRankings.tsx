import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Target, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BookmarkButton from "@/components/BookmarkButton";
import Icon3D from "@/components/ui/icon-3d";

type RankedVenture = {
  id: string; name: string; industry: string | null; goal: string | null;
  total_score: number; status: string; user_id: string;
  member_count?: number;
};

const MEDALS = [
  <Icon3D icon={Trophy} color="gold" size="sm" animated />,
  <Icon3D icon={Trophy} color="silver" size="sm" animated />,
  <Icon3D icon={Trophy} color="red" size="sm" animated />,
];

export default function StartupRankings() {
  const [ventures, setVentures] = useState<RankedVenture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("ventures")
        .select("id, name, industry, goal, total_score, status, user_id")
        .eq("status", "active")
        .order("total_score", { ascending: false })
        .limit(50);

      if (data) {
        // Fetch member counts
        const ventureIds = data.map(v => v.id);
        const { data: membersData } = await supabase
          .from("venture_members")
          .select("venture_id")
          .in("venture_id", ventureIds);

        const countMap: Record<string, number> = {};
        membersData?.forEach(m => { countMap[m.venture_id] = (countMap[m.venture_id] || 0) + 1; });

        setVentures(data.map(v => ({ ...v, member_count: (countMap[v.id] || 0) + 1 })) as RankedVenture[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="h-7 w-7 text-primary" /> Startup Rankings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">As startups mais ativas da plataforma</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando rankings...</div>
      ) : ventures.length === 0 ? (
        <Card className="text-center py-12"><CardContent><p className="text-muted-foreground">Nenhuma startup ativa ainda.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {ventures.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`transition-all ${i < 3 ? "border-primary/30 bg-primary/5" : ""}`}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="text-2xl w-10 text-center shrink-0">
                    {i < 3 ? MEDALS[i] : <span className="text-sm text-muted-foreground font-bold">#{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground truncate">{v.name}</p>
                      {v.industry && <Badge variant="secondary" className="text-xs shrink-0">{v.industry}</Badge>}
                    </div>
                    {v.goal && <p className="text-xs text-muted-foreground mt-0.5 truncate">{v.goal}</p>}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{v.member_count} membros</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Target className="h-3 w-3" />Score: {v.total_score}</span>
                    </div>
                  </div>
                  <BookmarkButton itemType="venture" itemId={v.id} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
