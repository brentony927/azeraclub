import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BookmarkButton from "@/components/BookmarkButton";
import { LEVEL_COLORS } from "@/lib/founderScore";

type LeaderEntry = {
  id: string; user_id: string; name: string; avatar_url: string | null;
  reputation_score: number | null; skills: string[] | null; is_verified: boolean | null;
  country: string | null; building: string | null; username: string | null;
  city: string | null;
};

const MEDALS = ["🥇", "🥈", "🥉"];

function getLevel(score: number): string {
  if (score >= 81) return "Elite Founder";
  if (score >= 61) return "Operator";
  if (score >= 41) return "Builder";
  if (score >= 21) return "Explorer";
  return "New Founder";
}

export default function FounderLeaderboard() {
  const [founders, setFounders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"global" | "country" | "city">("global");
  const [filterValue, setFilterValue] = useState("");
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("founder_profiles")
        .select("id, user_id, name, avatar_url, reputation_score, skills, is_verified, country, building, username, city")
        .eq("is_published", true)
        .order("reputation_score", { ascending: false })
        .limit(50);
      const list = (data as LeaderEntry[]) || [];
      setFounders(list);
      setCountries([...new Set(list.map(f => f.country).filter(Boolean) as string[])]);
      setCities([...new Set(list.map(f => f.city).filter(Boolean) as string[])]);
      setLoading(false);
    };
    load();
  }, []);

  let displayed = founders;
  if (filter === "country" && filterValue) {
    displayed = founders.filter(f => f.country === filterValue);
  } else if (filter === "city" && filterValue) {
    displayed = founders.filter(f => f.city === filterValue);
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Trophy className="h-7 w-7 text-yellow-500" /> Top Founders
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Os membros mais ativos da comunidade AZERA</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Select value={filter} onValueChange={(v) => { setFilter(v as any); setFilterValue(""); }}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="global">🌍 Global</SelectItem>
            <SelectItem value="country">🏳️ País</SelectItem>
            <SelectItem value="city">🏙️ Cidade</SelectItem>
          </SelectContent>
        </Select>
        {filter === "country" && countries.length > 0 && (
          <Select value={filterValue || "all"} onValueChange={v => setFilterValue(v === "all" ? "" : v)}>
            <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
        {filter === "city" && cities.length > 0 && (
          <Select value={filterValue || "all"} onValueChange={v => setFilterValue(v === "all" ? "" : v)}>
            <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Todas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>
      ) : displayed.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Nenhum founder encontrado.</p>
      ) : (
        <div className="space-y-3">
          {displayed.map((f, i) => {
            const initials = f.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
            const isTop3 = i < 3;
            const score = f.reputation_score || 0;
            const level = getLevel(score);
            return (
              <motion.div key={f.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} onClick={() => window.location.href = `/founder-profile/${f.username || f.id}`} className="cursor-pointer">
                <Card className={`transition-all hover:scale-[1.01] ${isTop3 ? "border-yellow-500/30 bg-yellow-500/5" : ""}`}>
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
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${LEVEL_COLORS[level] || ""}`}>{level}</Badge>
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
                        <p className={`font-bold text-lg ${isTop3 ? "text-yellow-600 dark:text-yellow-400" : "text-foreground"}`}>{score}</p>
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
