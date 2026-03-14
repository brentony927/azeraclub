import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Handshake, Activity, MapPin, Loader2, TrendingUp, Brain, Crown } from "lucide-react";

interface Stats {
  totalUsers: number;
  newToday: number;
  newWeek: number;
  totalAffiliates: number;
  pendingAffiliates: number;
  totalLeads: number;
  totalPosts: number;
  totalOpportunities: number;
  totalSuggestions: number;
  proUsers: number;
  businessUsers: number;
  totalLocations: number;
  totalConnections: number;
  totalComments: number;
  totalMessages: number;
  totalGroups: number;
}

interface TopFounder {
  user_id: string;
  name: string;
  reputation_score: number | null;
  country: string | null;
  level: string;
}

function getFounderLevel(score: number): string {
  if (score >= 1200) return "Elite Founder";
  if (score >= 600) return "Rising Founder";
  if (score >= 200) return "Active Founder";
  return "New Founder";
}

function getLevelColor(level: string): string {
  switch (level) {
    case "Elite Founder": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Rising Founder": return "bg-violet-500/20 text-violet-400 border-violet-500/30";
    case "Active Founder": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    default: return "bg-muted text-muted-foreground border-border";
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topFounders, setTopFounders] = useState<TopFounder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      usersRes, newTodayRes, newWeekRes,
      affiliatesRes, pendingAffRes, leadsRes,
      postsRes, oppsRes, suggestionsRes,
      proRes, businessRes, locationsRes,
      connectionsRes, commentsRes, messagesRes, groupsRes,
      topFoundersRes,
    ] = await Promise.all([
      supabase.from("founder_profiles").select("id", { count: "exact", head: true }),
      supabase.from("founder_profiles").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
      supabase.from("founder_profiles").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
      supabase.from("affiliate_profiles").select("id", { count: "exact", head: true }).eq("enabled", true),
      supabase.from("affiliate_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("affiliate_leads").select("id", { count: "exact", head: true }),
      supabase.from("founder_posts").select("id", { count: "exact", head: true }),
      supabase.from("founder_opportunities").select("id", { count: "exact", head: true }),
      supabase.from("suggestions").select("id", { count: "exact", head: true }).eq("status", "pendente"),
      supabase.from("user_plans").select("id", { count: "exact", head: true }).eq("plan", "pro"),
      supabase.from("user_plans").select("id", { count: "exact", head: true }).eq("plan", "business"),
      supabase.from("founder_locations").select("id", { count: "exact", head: true }),
      supabase.from("founder_connections").select("id", { count: "exact", head: true }).eq("status", "accepted"),
      supabase.from("founder_post_comments").select("id", { count: "exact", head: true }),
      supabase.from("founder_messages").select("id", { count: "exact", head: true }),
      supabase.from("message_groups").select("id", { count: "exact", head: true }),
      supabase.from("founder_profiles").select("user_id, name, reputation_score, country").order("reputation_score", { ascending: false }).limit(10),
    ]);

    setStats({
      totalUsers: usersRes.count || 0,
      newToday: newTodayRes.count || 0,
      newWeek: newWeekRes.count || 0,
      totalAffiliates: affiliatesRes.count || 0,
      pendingAffiliates: pendingAffRes.count || 0,
      totalLeads: leadsRes.count || 0,
      totalPosts: postsRes.count || 0,
      totalOpportunities: oppsRes.count || 0,
      totalSuggestions: suggestionsRes.count || 0,
      proUsers: proRes.count || 0,
      businessUsers: businessRes.count || 0,
      totalLocations: locationsRes.count || 0,
      totalConnections: connectionsRes.count || 0,
      totalComments: commentsRes.count || 0,
      totalMessages: messagesRes.count || 0,
      totalGroups: groupsRes.count || 0,
    });

    setTopFounders(
      (topFoundersRes.data || []).map(f => ({
        ...f,
        level: getFounderLevel(f.reputation_score || 0),
      }))
    );

    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cards = [
    { title: "Total Usuários", value: stats.totalUsers, icon: Users, sub: `+${stats.newToday} hoje · +${stats.newWeek} semana` },
    { title: "Assinantes Pagantes", value: stats.proUsers + stats.businessUsers, icon: DollarSign, sub: `${stats.proUsers} Pro · ${stats.businessUsers} Business` },
    { title: "Afiliados", value: stats.totalAffiliates, icon: Handshake, sub: `${stats.pendingAffiliates} pendentes · ${stats.totalLeads} leads` },
    { title: "Atividade", value: stats.totalPosts, icon: Activity, sub: `${stats.totalComments} comentários · ${stats.totalOpportunities} oportunidades` },
    { title: "Networking", value: stats.totalConnections, icon: MapPin, sub: `${stats.totalLocations} no mapa · ${stats.totalGroups} grupos` },
    { title: "Mensagens", value: stats.totalMessages, icon: TrendingUp, sub: `${stats.totalGroups} grupos ativos` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{c.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.totalSuggestions > 0 && (
        <Card className="border-primary/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm text-foreground">
              <strong>{stats.totalSuggestions}</strong> sugestões pendentes para revisão
            </p>
          </CardContent>
        </Card>
      )}

      {/* Founder Intelligence */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Founder Intelligence</h2>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {topFounders.map((f, idx) => (
                <div key={f.user_id} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-sm font-mono text-muted-foreground w-6 text-right">
                    {idx === 0 ? <Crown className="h-4 w-4 text-amber-400 inline" /> : `#${idx + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                    <p className="text-[11px] text-muted-foreground">{f.country || "—"}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${getLevelColor(f.level)}`}>
                    {f.level}
                  </Badge>
                  <span className="text-sm font-semibold text-foreground w-12 text-right">
                    {f.reputation_score || 0}
                  </span>
                </div>
              ))}
              {topFounders.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground text-center">Nenhum founder encontrado.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
