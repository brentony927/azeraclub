import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Check, CalendarDays, Target, ListTodo, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Task {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  time: string | null;
  type: string;
  status: string;
  created_at: string;
}

const TYPE_ICONS: Record<string, typeof ListTodo> = {
  task: ListTodo,
  event: CalendarDays,
  goal: Target,
};

const TYPE_LABELS: Record<string, string> = {
  task: "Tarefa",
  event: "Evento",
  goal: "Meta",
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Agenda() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("task");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const fetchTasks = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true, nullsFirst: false });
    if (data) setTasks(data as Task[]);
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async () => {
    if (!user || !newTitle.trim()) return;
    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title: newTitle.trim(),
      description: newDescription.trim() || null,
      type: newType,
      date: newDate || null,
      time: newTime || null,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Adicionado!" });
      setNewTitle("");
      setNewDescription("");
      setNewType("task");
      setNewDate("");
      setNewTime("");
      setDialogOpen(false);
      fetchTasks();
    }
  };

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === "done" ? "pending" : "done";
    await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    fetchTasks();
  };

  const filtered = tasks.filter((t) => {
    if (filter !== "all" && t.type !== filter) return false;
    if (selectedDate && t.date) {
      return t.date === format(selectedDate, "yyyy-MM-dd");
    }
    return true;
  });

  const pending = filtered.filter((t) => t.status === "pending");
  const done = filtered.filter((t) => t.status === "done");

  const formatDateLabel = (dateStr: string | null) => {
    if (!dateStr) return "Sem data";
    const d = parseISO(dateStr);
    if (isToday(d)) return "Hoje";
    if (isTomorrow(d)) return "Amanhã";
    return format(d, "dd MMM", { locale: ptBR });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Agenda</h1>
          <p className="text-muted-foreground text-sm mt-1">Tarefas, eventos e metas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <Input placeholder="Título" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <Textarea placeholder="Descrição (opcional)" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={2} />
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Tarefa</SelectItem>
                  <SelectItem value="event">Evento</SelectItem>
                  <SelectItem value="goal">Meta</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-3">
                <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="flex-1" />
                <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-32" />
              </div>
              <Button onClick={addTask} className="w-full">Criar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Calendar + Filters — collapsible on mobile */}
        <motion.div variants={item} className="space-y-4">
          {/* Filters always visible */}
          <Card>
            <CardContent className="px-4 py-3 space-y-1">
              <div className="flex flex-wrap gap-2 lg:flex-col">
                {["all", "task", "event", "goal"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 rounded-md text-sm transition-colors min-h-[44px] lg:w-full lg:text-left ${
                      filter === f ? "bg-primary/10 text-foreground font-medium" : "text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {f === "all" ? "Todos" : TYPE_LABELS[f]}
                  </button>
                ))}
              </div>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(undefined)}
                  className="w-full text-left px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[44px]"
                >
                  Limpar data ✕
                </button>
              )}
            </CardContent>
          </Card>

          {/* Calendar hidden on mobile */}
          <Card className="hidden lg:block">
            <CardContent className="p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Task list */}
        <motion.div variants={item} className="space-y-4">
          {pending.length === 0 && done.length === 0 ? (
            <Card className="p-12 text-center">
              <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Nenhum item encontrado.</p>
              <p className="text-muted-foreground text-xs mt-1">Crie uma tarefa, evento ou meta para começar.</p>
            </Card>
          ) : (
            <>
              {pending.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Pendentes ({pending.length})
                  </h3>
                  {pending.map((t) => {
                    const Icon = TYPE_ICONS[t.type] || ListTodo;
                    return (
                      <Card key={t.id} className="group hover:border-primary/20 transition-colors">
                        <CardContent className="p-4 flex items-center gap-3">
                          <Checkbox
                            checked={false}
                            onCheckedChange={() => toggleTask(t)}
                          />
                          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{t.title}</p>
                            {t.description && (
                              <p className="text-xs text-muted-foreground truncate">{t.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {t.time && <span>{t.time.slice(0, 5)}</span>}
                            <span>{formatDateLabel(t.date)}</span>
                          </div>
                          <button
                            onClick={() => deleteTask(t.id)}
                            className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-destructive transition-all"
                          >
                            ✕
                          </button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {done.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Concluídos ({done.length})
                  </h3>
                  {done.map((t) => {
                    const Icon = TYPE_ICONS[t.type] || ListTodo;
                    return (
                      <Card key={t.id} className="opacity-60 group hover:opacity-80 transition-opacity">
                        <CardContent className="p-4 flex items-center gap-3">
                          <Checkbox
                            checked={true}
                            onCheckedChange={() => toggleTask(t)}
                          />
                          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-through truncate">{t.title}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDateLabel(t.date)}</span>
                          <button
                            onClick={() => deleteTask(t.id)}
                            className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-destructive transition-all"
                          >
                            ✕
                          </button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
