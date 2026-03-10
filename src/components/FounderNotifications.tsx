import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bell, UserPlus, MessageCircle, Eye, Briefcase, Sparkles,
  Lightbulb, Rocket, TrendingUp, Users, FileText, Trophy, BarChart3,
  Check, X, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { sendNotification } from "@/lib/sendNotification";

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
  post_like: Heart,
  post_comment: MessageCircle,
  opportunity_reply: Briefcase,
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
  post_like: "/founder-feed",
  post_comment: "/founder-feed",
  opportunity_reply: "/founder-messages",
};

export default function FounderNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) return;

    supabase
      .from("founder_notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setNotifications(data as Notification[]);
      });

    const channel = supabase
      .channel("founder-notifications")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "founder_notifications",
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const resolveProfileNavigation = async (userId: string) => {
    const { data } = await supabase.from("founder_profiles").select("id, username").eq("user_id", userId).maybeSingle();
    if (data) navigate(`/founder-profile/${(data as any).username || data.id}`);
  };

  const handleAcceptConnection = async (n: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !n.related_user_id) return;
    setActionLoading(n.id);
    const { error } = await supabase.from("founder_connections").update({ status: "accepted" })
      .eq("from_user_id", n.related_user_id).eq("to_user_id", user.id).eq("status", "pending");
    if (!error) {
      await supabase.from("founder_notifications").update({ read: true }).eq("id", n.id);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
      // notify the sender
      const { data: myProfile } = await supabase.from("founder_profiles").select("name").eq("user_id", user.id).maybeSingle();
      await sendNotification({
        user_id: n.related_user_id!,
        type: "connection",
        title: `${myProfile?.name || "Alguém"} aceitou sua conexão! 🎉`,
      });
      toast({ title: "Conexão aceita! 🤝" });
    }
    setActionLoading(null);
  };

  const handleRejectConnection = async (n: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
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
    setOpen(false);

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

  // Check if a connection notification is still pending (unread + type connection + has related_user_id)
  const isConnectionPending = (n: Notification) => n.type === "connection" && !n.read && n.related_user_id && n.title.includes("conectar");

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto p-0">
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <h4 className="text-sm font-semibold text-foreground">Notificações</h4>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[11px] text-primary hover:underline">
              Marcar todas como lidas
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhuma notificação.</p>
        ) : (
          notifications.map(n => {
            const Icon = TYPE_ICONS[n.type] || Bell;
            const showActions = isConnectionPending(n);
            return (
              <div key={n.id}>
                <button
                  onClick={() => handleClick(n)}
                  className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-secondary/50 ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {n.title}
                    </p>
                    {n.body && <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{n.body}</p>}
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {format(new Date(n.created_at), "dd/MM HH:mm")}
                    </p>
                  </div>
                  {!n.read && !showActions && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                </button>
                {showActions && (
                  <div className="flex gap-2 px-3 pb-3 pl-10">
                    <Button
                      size="sm"
                      className="flex-1 h-7 text-xs"
                      disabled={actionLoading === n.id}
                      onClick={(e) => handleAcceptConnection(n, e)}
                    >
                      <Check className="h-3 w-3 mr-1" /> Aceitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-xs"
                      disabled={actionLoading === n.id}
                      onClick={(e) => handleRejectConnection(n, e)}
                    >
                      <X className="h-3 w-3 mr-1" /> Recusar
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
