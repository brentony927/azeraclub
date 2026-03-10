import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Brain, Handshake, ArrowRight, Trophy, Zap, Bell, Trash2, Lightbulb, Radar, Users, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActivityTicker from "@/components/ActivityTicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format, startOfWeek, endOfWeek, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import OnboardingTutorial from "@/components/OnboardingTutorial";

interface Task {
  id: string;
  title: string;
  time: string | null;
  type: string;
  status: string;
  date: string | null;
}

interface SocialEvent {
  id: string;
  title: string;
  date: string | null;
  location: string | null;
}

interface Notification {
  id: string;
  title: string;
  body: string | null;
  type: string;
  read: boolean;
  created_at: string;
  action_url: string | null;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Bom dia", emoji: "☀️" };
  if (h < 18) return { text: "Boa tarde", emoji: "🌤️" };
  return { text: "Boa noite", emoji: "🌙" };
}

const AI_TIPS = [
  "Revise suas metas da semana antes de começar o dia.",
  "Networking consistente vale mais que networking intenso.",
  "Reserve 30 min para planejamento estratégico hoje.",
  "Pequenas vitórias diárias constroem grandes resultados.",
  "Conecte-se com alguém novo esta semana.",
];

const DAILY_INSIGHTS = [
  "💡 Networking não é colecionar contatos. É criar valor antes de pedir algo.",
  "💡 Produtividade real é fazer menos coisas, mas as certas.",
  "💡 Um CEO não faz tudo — ele decide o que importa.",
  "💡 Seu maior ativo é a capacidade de tomar decisões rápidas.",
  "💡 Consistência supera intensidade em todos os campos.",
];

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [weekTasks, setWeekTasks] = useState<Task[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<SocialEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [aiTip] = useState(() => AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)]);
  const [insight] = useState(() => DAILY_INSIGHTS[Math.floor(Math.random() * DAILY_INSIGHTS.length)]);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Fast cache check
    if (localStorage.getItem(`onboarding-tutorial-${user.id}`)) return;
    // Confirm with DB
    supabase.from("profiles").select("has_seen_onboarding").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data && !data.has_seen_onboarding) {
          setShowTutorial(true);
        } else if (data?.has_seen_onboarding) {
          localStorage.setItem(`onboarding-tutorial-${user.id}`, "true");
        }
      });
  }, [user]);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const today = format(new Date(), "yyyy-MM-dd");
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

  useEffect(() => {
    if (!user) return;

    supabase.from("tasks").select("*").eq("user_id", user.id).eq("date", today)
      .order("time", { ascending: true, nullsFirst: false })
      .then(({ data }) => { if (data) setTodayTasks(data as Task[]); });

    supabase.from("tasks").select("*").eq("user_id", user.id)
      .gte("date", weekStart).lte("date", weekEnd)
      .then(({ data }) => { if (data) setWeekTasks(data as Task[]); });

    supabase.from("social_events").select("*").eq("user_id", user.id)
      .gte("date", today).order("date", { ascending: true }).limit(3)
      .then(({ data }) => { if (data) setUpcomingEvents(data as SocialEvent[]); });

    supabase.from("founder_notifications").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => { if (data) setNotifications(data as Notification[]); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id);
    setTodayTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    setWeekTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from("founder_notifications").delete().eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notificação removida");
  };

  const deleteAllNotifications = async () => {
    if (!user) return;
    await supabase.from("founder_notifications").delete().eq("user_id", user.id);
    setNotifications([]);
    toast.success("Todas as notificações removidas");
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.read) {
      await supabase.from("founder_notifications").update({ read: true }).eq("id", n.id);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    }
    if (n.action_url) navigate(n.action_url);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingCount = todayTasks.filter((t) => t.status === "pending").length;
  const doneCount = todayTasks.filter((t) => t.status === "done").length;

  const weekDone = weekTasks.filter((t) => t.status === "done").length;
  const weekTotal = weekTasks.length;
  const score = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  const greeting = getGreeting();

  return (
    <>
      {showTutorial && user && (
        <OnboardingTutorial userId={user.id} onComplete={() => setShowTutorial(false)} />
      )}
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-5 md:space-y-8 pb-20 md:pb-0">
      {/* Greeting + Notification Bell */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold greeting-gradient-text">
          {greeting.emoji} {greeting.text}, {displayName.split(" ")[0]}.
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            📅 Hoje: {pendingCount} {pendingCount === 1 ? "tarefa pendente" : "tarefas pendentes"}
            {doneCount > 0 && ` · ${doneCount} concluída${doneCount > 1 ? "s" : ""}`}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-semibold">Notificações</span>
                {notifications.length > 0 && (
                  <button onClick={deleteAllNotifications} className="text-xs text-destructive hover:underline">
                    Apagar todas
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nenhuma notificação
                </div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className="flex items-start gap-3 px-3 py-2.5 cursor-pointer"
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                        <p className={`text-sm truncate ${!n.read ? "font-semibold" : "text-muted-foreground"}`}>
                          {n.title}
                        </p>
                      </div>
                      {n.body && <p className="text-xs text-muted-foreground truncate mt-0.5">{n.body}</p>}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteNotification(n.id, e)}
                      className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* AZERA Score + AI Tip row */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="gradient-border overflow-hidden">
          <CardContent className="p-5 relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center moss-gradient shadow-lg shadow-primary/20">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AZERA SCORE</p>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold font-serif text-foreground">{score}</span>
              <span className="text-lg text-muted-foreground mb-1">/ 100</span>
            </div>
            <Progress value={score} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {weekDone}/{weekTotal} tarefas esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card card-shine overflow-hidden border-border/20">
          <CardContent className="p-5 flex flex-col justify-between h-full relative">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AZERA AI sugere</p>
              </div>
              <div className="relative pl-4">
                <span className="absolute -left-1 top-0 text-3xl font-serif text-primary/20 leading-none">"</span>
                <p className="text-sm text-foreground/90 italic leading-relaxed">{aiTip}</p>
              </div>
            </div>
            <button onClick={() => navigate("/ia")} className="text-xs text-primary hover:text-foreground transition-colors mt-3 self-start font-medium">
              Conversar →
            </button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Suggestions CTA */}
      <motion.div variants={item}>
        <Card className="glass-card card-shine border-primary/20 cursor-pointer hover:border-primary/30 transition-all group" onClick={() => navigate("/sugestoes")}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
              <Lightbulb className="h-5 w-5 text-primary animate-float" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Tem uma ideia para melhorar o Azera?</p>
              <p className="text-xs text-muted-foreground">Deixe sua sugestão e ajude a construir a plataforma!</p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0 border-primary/20 text-primary hover:bg-primary/10">
              Sugerir
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Insight */}
      <motion.div variants={item}>
        <Card className="glass-card border-border/20 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 shrink-0">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-foreground/80">{insight}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Agenda */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Sua Agenda
          </h2>
          <button onClick={() => navigate("/agenda")} className="text-xs text-primary hover:text-foreground flex items-center gap-1 transition-colors font-medium">
            Ver tudo <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <Card className="glass-card border-border/20 p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">Nenhuma tarefa para hoje.</p>
            <button onClick={() => navigate("/agenda")} className="text-xs text-primary hover:underline font-medium">Adicionar tarefa</button>
          </Card>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((t) => (
              <Card key={t.id} className={`glass-card border-border/20 transition-all group ${t.status === "done" ? "opacity-50" : "hover:border-primary/20"}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={`w-1.5 h-8 rounded-full shrink-0 ${
                    t.type === "meeting" ? "bg-blue-500/60" : 
                    t.type === "health" ? "bg-red-500/60" : "bg-primary/40"
                  }`} />
                  <Checkbox checked={t.status === "done"} onCheckedChange={() => toggleTask(t)} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${t.status === "done" ? "line-through text-muted-foreground" : "font-medium"}`}>{t.title}</p>
                  </div>
                  {t.time && <span className="text-xs text-muted-foreground font-mono">{t.time.slice(0, 5)}</span>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upcoming Events */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Handshake className="h-4 w-4 text-primary" /> Eventos no Radar
        </h2>

        {upcomingEvents.length === 0 ? (
          <Card className="glass-card border-border/20 p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Handshake className="h-5 w-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">Nenhum evento próximo.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {upcomingEvents.map((ev) => (
              <Card key={ev.id} className="glass-card border-border/20 hover:border-primary/20 transition-all">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ev.title}</p>
                    {ev.location && <p className="text-xs text-muted-foreground truncate">{ev.location}</p>}
                  </div>
                  {ev.date && <span className="text-xs text-muted-foreground font-mono">{format(new Date(ev.date + "T12:00:00"), "dd MMM", { locale: ptBR })}</span>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
    </>
  );
}
