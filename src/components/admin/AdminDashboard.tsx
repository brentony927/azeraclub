import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Handshake, Activity, MapPin, Loader2 } from "lucide-react";

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
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
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
      connectionsRes, commentsRes,
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
    });
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
    { title: "Founders no Mapa", value: stats.totalLocations, icon: MapPin, sub: `${stats.totalConnections} conexões aceitas` },
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
    </div>
  );
}
