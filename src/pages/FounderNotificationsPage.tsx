import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bell, UserPlus, MessageCircle, Eye, Briefcase, Sparkles,
  Lightbulb, Rocket, TrendingUp, Users, FileText, Trophy, BarChart3, Loader2,
  Check, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
  action_url: string | null;
  related_user_id: string | null;
}

const TYPE_ICONS: Record<string, typeof Bell> = {
  connection: UserPlus,
  message: MessageCircle,
  profile_view: Eye,
  opportunity: Briefcase,
  match: Sparkles,
  startup_idea: Lightbulb,
  venture_activity: Rocket,
  investor_interest: TrendingUp,
  team_invitation: Users,
  weekly_report: FileText,
  ranking_change: Trophy,
  new_founders: UserPlus,
  trending_industry: BarChart3,
  ai_opportunity: Sparkles,
};

const TYPE_ROUTES: Record<string, string> = {
  connection: "/founder-feed",
  message: "/founder-messages",
  profile_view: "/founder-profile",
  opportunity: "/founder-opportunities",
  match: "/founder-feed",
  startup_idea: "/ideas",
  venture_activity: "/venture-builder",
  investor_interest: "/founder-profile",
  team_invitation: "/venture-builder",
  weekly_report: "/weekly-review",
  ranking_change: "/leaderboard",
  new_founders: "/founder-feed",
  trending_industry: "/trend-scanner",
  ai_opportunity: "/opportunity-radar",
};

export default function FounderNotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("founder_notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (data) setNotifications(data as Notification[]);
        setLoading(false);
      });
  }, [user]);

  const resolveProfileNavigation = async (userId: string) => {
    const { data } = await supabase.from("founder_profiles").select("id, username").eq("user_id", userId).maybeSingle();
    if (data) navigate(`/founder-profile/${(data as any).username || data.id}`);
  };

  const handleAcceptConnection = async (n: Notification) => {
    if (!user || !n.related_user_id) return;
    setActionLoading(n.id);
    const { error } = await supabase.from("founder_connections").update({ status: "accepted" })
      .eq("from_user_id", n.related_user_id).eq("to_user_id", user.id).eq("status", "pending");
    if (!error) {
      await supabase.from("founder_notifications").update({ read: true }).eq("id", n.id);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
      const { data: myProfile } = await supabase.from("founder_profiles").select("name").eq("user_id", user.id).maybeSingle();
      await supabase.from("founder_notifications").insert({
        user_id: n.related_user_id,
        type: "connection",
        title: `${myProfile?.name || "Alguém"} aceitou sua conexão! 🎉`,
        related_user_id: user.id,
      });
      toast({ title: "Conexão aceita! 🤝" });
    }
    setActionLoading(null);
  };

  const handleRejectConnection = async (n: Notification) => {
    if (!user || !n.related_user_id) return;
    setActionLoading(n.id);
    await supabase.from("founder_connections").delete()
      .eq("from_user_id", n.related_user_id).eq("to_user_id", user.id).eq("status", "pending");
    await supabase.from("founder_notifications").update({ read: true }).eq("id", n.id);
    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    toast({ title: "Conexão recusada" });
    setActionLoading(null);
  };

  const handleClick = async (n: Notification) => {
    if (!n.read) {
      await supabase.from("founder_notifications").update({ read: true }).eq("id", n.id);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    }
    if (n.action_url) {
      navigate(n.action_url);
    } else if ((n.type === "profile_view" || n.type === "connection") && n.related_user_id) {
      await resolveProfileNavigation(n.related_user_id);
    } else {
      const route = TYPE_ROUTES[n.type];
      if (route) navigate(route);
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("founder_notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const isConnectionPending = (n: Notification) => n.type === "connection" && !n.read && n.related_user_id && n.title.includes("conectar");

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6" /> Notificações
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{unread} não lidas</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma notificação.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const Icon = TYPE_ICONS[n.type] || Bell;
            const showActions = isConnectionPending(n);
            return (
              <Card
                key={n.id}
                className={`cursor-pointer transition-all hover:bg-secondary/30 ${!n.read ? "border-primary/20 bg-primary/5" : "border-border/50 bg-card/80"}`}
                onClick={() => !showActions && handleClick(n)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{format(new Date(n.created_at), "dd/MM/yyyy HH:mm")}</p>
                    </div>
                    {!n.read && !showActions && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                  </div>
                  {showActions && (
                    <div className="flex gap-2 mt-3 ml-8">
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs"
                        disabled={actionLoading === n.id}
                        onClick={(e) => { e.stopPropagation(); handleAcceptConnection(n); }}
                      >
                        <Check className="h-3 w-3 mr-1" /> Aceitar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs"
                        disabled={actionLoading === n.id}
                        onClick={(e) => { e.stopPropagation(); handleRejectConnection(n); }}
                      >
                        <X className="h-3 w-3 mr-1" /> Recusar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
