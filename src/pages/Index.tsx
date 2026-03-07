import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Brain, Handshake, ArrowRight, Trophy, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

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

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
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
  const [aiTip] = useState(() => AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)]);
  const [insight] = useState(() => DAILY_INSIGHTS[Math.floor(Math.random() * DAILY_INSIGHTS.length)]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id);
    setTodayTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    setWeekTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
  };

  const pendingCount = todayTasks.filter((t) => t.status === "pending").length;
  const doneCount = todayTasks.filter((t) => t.status === "done").length;

  // AZERA Score calculation
  const weekDone = weekTasks.filter((t) => t.status === "done").length;
  const weekTotal = weekTasks.length;
  const score = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div variants={item} className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-serif font-bold">
          {getGreeting()}, <span className="moss-text">{displayName.split(" ")[0]}</span>.
        </h1>
        <p className="text-muted-foreground text-sm">
          📅 Hoje: {pendingCount} {pendingCount === 1 ? "tarefa pendente" : "tarefas pendentes"}
          {doneCount > 0 && ` · ${doneCount} concluída${doneCount > 1 ? "s" : ""}`}
        </p>
      </motion.div>

      {/* AZERA Score + AI Tip row */}
      <motion.div variants={item} className="grid sm:grid-cols-2 gap-3">
        {/* AZERA Score */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="h-5 w-5 text-accent" />
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AZERA SCORE</p>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-foreground">{score}</span>
              <span className="text-lg text-muted-foreground mb-1">/ 100</span>
            </div>
            <Progress value={score} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {weekDone}/{weekTotal} tarefas esta semana
            </p>
          </CardContent>
        </Card>

        {/* AI Tip */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-accent" />
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">AZERA AI sugere</p>
              </div>
              <p className="text-sm text-foreground/90 italic">"{aiTip}"</p>
            </div>
            <button onClick={() => navigate("/ia")} className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-3 self-start">
              Conversar →
            </button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Insight */}
      <motion.div variants={item}>
        <Card className="bg-secondary/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="h-4 w-4 text-accent shrink-0" />
            <p className="text-sm text-foreground/80">{insight}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Agenda */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> Sua Agenda
          </h2>
          <button onClick={() => navigate("/agenda")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            Ver tudo <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground text-sm">Nenhuma tarefa para hoje.</p>
            <button onClick={() => navigate("/agenda")} className="text-xs text-accent hover:underline mt-1">Adicionar tarefa</button>
          </Card>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((t) => (
              <Card key={t.id} className={`transition-all ${t.status === "done" ? "opacity-50" : "hover:border-primary/20"}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <Checkbox checked={t.status === "done"} onCheckedChange={() => toggleTask(t)} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${t.status === "done" ? "line-through text-muted-foreground" : "font-medium"}`}>{t.title}</p>
                  </div>
                  {t.time && <span className="text-xs text-muted-foreground">{t.time.slice(0, 5)}</span>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* Upcoming Events */}
      <motion.div variants={item} className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Handshake className="h-4 w-4" /> Eventos no Radar
        </h2>

        {upcomingEvents.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground text-sm">Nenhum evento próximo.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {upcomingEvents.map((ev) => (
              <Card key={ev.id} className="hover:border-primary/20 transition-colors">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ev.title}</p>
                    {ev.location && <p className="text-xs text-muted-foreground truncate">{ev.location}</p>}
                  </div>
                  {ev.date && <span className="text-xs text-muted-foreground">{format(new Date(ev.date + "T12:00:00"), "dd MMM", { locale: ptBR })}</span>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
