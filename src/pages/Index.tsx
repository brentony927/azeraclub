import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Brain, Handshake, ArrowRight, Trophy, Zap, Bell, Trash2, Radar, Users, Flame } from "lucide-react";
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
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import {
  useTodayTasks,
  useWeekTasks,
  useUpcomingEvents,
  useDashboardNotifications,
  useToggleTask,
  useDeleteNotification,
  useDeleteAllNotifications,
  useMarkNotificationRead,
} from "@/hooks/useDashboardData";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function getGreeting(): { text: string; motivational: string } {
  const h = new Date().getHours();
  if (h < 12) return { text: "Bom dia", motivational: "Comece o dia com foco." };
  if (h < 18) return { text: "Boa tarde", motivational: "Mantenha o momentum." };
  return { text: "Boa noite", motivational: "Reflita sobre as conquistas de hoje." };
}

const AI_TIPS = [
  "Revise suas metas da semana antes de começar o dia.",
  "Networking consistente vale mais que networking intenso.",
  "Reserve 30 min para planejamento estratégico hoje.",
  "Pequenas vitórias diárias constroem grandes resultados.",
  "Conecte-se com alguém novo esta semana.",
];

const DAILY_INSIGHTS = [
  "Networking não é colecionar contatos. É criar valor antes de pedir algo.",
  "Produtividade real é fazer menos coisas, mas as certas.",
  "Um CEO não faz tudo — ele decide o que importa.",
  "Seu maior ativo é a capacidade de tomar decisões rápidas.",
  "Consistência supera intensidade em todos os campos.",
];

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aiTip] = useState(() => AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)]);
  const [insight] = useState(() => DAILY_INSIGHTS[Math.floor(Math.random() * DAILY_INSIGHTS.length)]);
  const [showTutorial, setShowTutorial] = useState(false);

  const { data: todayTasks = [] } = useTodayTasks();
  const { data: weekTasks = [] } = useWeekTasks();
  const { data: upcomingEvents = [] } = useUpcomingEvents();
  const { data: notifications = [] } = useDashboardNotifications();

  const toggleTaskMutation = useToggleTask();
  const deleteNotifMutation = useDeleteNotification();
  const deleteAllNotifMutation = useDeleteAllNotifications();
  const markReadMutation = useMarkNotificationRead();

  useEffect(() => {
    if (!user) return;
    if (localStorage.getItem(`onboarding-tutorial-${user.id}`)) return;
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

  const handleNotificationClick = (n: any) => {
    if (!n.read) markReadMutation.mutate(n.id);
    if (n.action_url) navigate(n.action_url);
  };

  const unreadCount = notifications.filter((n: any) => !n.read).length;
  const pendingCount = todayTasks.filter((t: any) => t.status === "pending").length;
  const doneCount = todayTasks.filter((t: any) => t.status === "done").length;

  const weekDone = weekTasks.filter((t: any) => t.status === "done").length;
  const weekTotal = weekTasks.length;
  const score = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  const greeting = getGreeting();

  return (
    <>
      {showTutorial && user && (
        <OnboardingTutorial userId={user.id} onComplete={() => setShowTutorial(false)} />
      )}
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20 md:pb-0">
      {/* Greeting */}
      <motion.div variants={item} className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground tracking-tight">
              {greeting.text}, {displayName.split(" ")[0]}.
            </h1>
            <p className="text-sm text-muted-foreground/60 mt-1">{greeting.motivational}</p>
          </div>

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
                  <button onClick={() => deleteAllNotifMutation.mutate()} className="text-xs text-destructive hover:underline">
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
                notifications.map((n: any) => (
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
                      onClick={(e) => { e.stopPropagation(); deleteNotifMutation.mutate(n.id); }}
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

        <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
          <span>{pendingCount} {pendingCount === 1 ? "tarefa pendente" : "tarefas pendentes"}</span>
          {doneCount > 0 && (
            <>
              <span className="w-px h-3 bg-border" />
              <span>{doneCount} concluída{doneCount > 1 ? "s" : ""}</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Quick Actions — Asymmetric Grid */}
      <motion.div variants={item} className="grid grid-cols-4 gap-2.5 md:gap-3">
        <Card
          className="glass-card card-shine border-border/20 cursor-pointer hover:border-primary/30 hover:scale-[1.01] transition-all group col-span-2 md:col-span-1"
          onClick={() => navigate("/ia")}
        >
          <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3 min-h-[100px]">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-semibold tracking-wide">AZERA IA</p>
          </CardContent>
        </Card>

        {[
          { icon: CalendarDays, label: "Agenda", url: "/agenda" },
          { icon: Users, label: "Founders", url: "/founder-match" },
          { icon: Radar, label: "Radar", url: "/radar-oportunidades" },
        ].map((action) => (
          <Card
            key={action.label}
            className="glass-card card-shine border-border/20 cursor-pointer hover:border-primary/30 hover:scale-[1.01] transition-all group col-span-1"
            onClick={() => navigate(action.url)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2.5 min-h-[100px]">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <action.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-[11px] font-semibold tracking-wide">{action.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Activity Ticker */}
      <motion.div variants={item} className="rounded-xl overflow-hidden border border-border/10">
        <ActivityTicker />
      </motion.div>

      {/* AZERA Score + AI Tip */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="gradient-border overflow-hidden">
          <CardContent className="p-5 relative">
            <p className="section-label mb-4">AZERA SCORE</p>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-5xl font-serif font-bold text-foreground tracking-tighter">{score}</span>
              <span className="text-sm text-muted-foreground/40 font-light">/ 100</span>
            </div>
            <Progress value={score} className="h-1.5 mb-2" />
            <p className="text-[11px] text-muted-foreground/50">
              {weekDone}/{weekTotal} tarefas esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card card-shine overflow-hidden border-border/20">
          <CardContent className="p-5 flex flex-col justify-between h-full relative">
            <div>
              <p className="section-label mb-3">AZERA AI</p>
              <div className="relative pl-4">
                <span className="absolute -left-0.5 top-0 text-2xl font-serif text-primary/15 leading-none select-none">"</span>
                <p className="text-sm text-foreground/80 italic leading-relaxed">{aiTip}</p>
              </div>
            </div>
            <button onClick={() => navigate("/ia")} className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors mt-4 self-start font-medium tracking-wide">
              Conversar →
            </button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Insight */}
      <motion.div variants={item}>
        <Card className="glass-card border-border/10 overflow-hidden">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/5 shrink-0">
              <Zap className="h-3.5 w-3.5 text-primary/60" />
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">{insight}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Agenda */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="section-label flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" /> Agenda de Hoje
          </p>
          <button onClick={() => navigate("/agenda")} className="text-[11px] text-muted-foreground/40 hover:text-foreground flex items-center gap-1 transition-colors font-medium tracking-wide">
            Ver tudo <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <Card className="glass-card border-border/10 p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-2">
              <CalendarDays className="h-4 w-4 text-primary/50" />
            </div>
            <p className="text-muted-foreground/50 text-sm">Nenhuma tarefa para hoje.</p>
            <button onClick={() => navigate("/agenda")} className="text-xs text-muted-foreground/40 hover:text-foreground font-medium tracking-wide">Adicionar tarefa</button>
          </Card>
        ) : (
          <div className="space-y-1.5">
            {todayTasks.map((t: any) => (
              <Card key={t.id} className={`glass-card border-border/10 transition-all group ${t.status === "done" ? "opacity-40" : "hover:border-primary/15"}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className={`w-1 h-7 rounded-full shrink-0 ${
                    t.type === "meeting" ? "bg-blue-500/50" : 
                    t.type === "health" ? "bg-red-500/50" : "bg-primary/25"
                  }`} />
                  <Checkbox checked={t.status === "done"} onCheckedChange={() => toggleTaskMutation.mutate({ id: t.id, currentStatus: t.status })} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${t.status === "done" ? "line-through text-muted-foreground/50" : "font-medium"}`}>{t.title}</p>
                  </div>
                  {t.time && <span className="text-[11px] text-muted-foreground/40 font-mono">{t.time.slice(0, 5)}</span>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upcoming Events */}
      <motion.div variants={item} className="space-y-3">
        <p className="section-label flex items-center gap-2">
          <Handshake className="h-3.5 w-3.5" /> Eventos no Radar
        </p>

        {upcomingEvents.length === 0 ? (
          <Card className="glass-card border-border/10 p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-2">
              <Handshake className="h-4 w-4 text-primary/50" />
            </div>
            <p className="text-muted-foreground/50 text-sm">Nenhum evento próximo.</p>
          </Card>
        ) : (
          <div className="space-y-1.5">
            {upcomingEvents.map((ev: any) => (
              <Card key={ev.id} className="glass-card border-border/10 hover:border-primary/15 transition-all">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-3.5 w-3.5 text-primary/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ev.title}</p>
                    {ev.location && <p className="text-[11px] text-muted-foreground/40 truncate">{ev.location}</p>}
                  </div>
                  {ev.date && <span className="text-[11px] text-muted-foreground/40 font-mono">{format(new Date(ev.date + "T12:00:00"), "dd MMM", { locale: ptBR })}</span>}
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
