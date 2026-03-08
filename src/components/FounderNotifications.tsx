import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, UserPlus, MessageCircle, Eye, Briefcase, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
}

const TYPE_ICONS: Record<string, typeof Bell> = {
  connection: UserPlus,
  message: MessageCircle,
  profile_view: Eye,
  opportunity: Briefcase,
  match: Sparkles,
};

export default function FounderNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

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
        if (data) setNotifications(data);
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

  const markAsRead = async (id: string) => {
    await supabase.from("founder_notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("founder_notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

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
            return (
              <button
                key={n.id}
                onClick={() => markAsRead(n.id)}
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
                {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
              </button>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
