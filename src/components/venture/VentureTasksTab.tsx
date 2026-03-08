import { useState, useEffect } from "react";
import { Plus, Calendar, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Task = {
  id: string; venture_id: string; user_id: string; title: string;
  description: string | null; assigned_to: string | null;
  status: string; deadline: string | null; created_at: string;
};

type Member = { user_id: string; role: string };

const COLUMNS = [
  { key: "todo", label: "To Do", color: "bg-muted" },
  { key: "in_progress", label: "In Progress", color: "bg-primary/10" },
  { key: "done", label: "Done", color: "bg-green-500/10" },
];

export default function VentureTasksTab({ ventureId, members }: { ventureId: string; members: Member[] }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", assigned_to: "", deadline: "" });

  const fetchTasks = async () => {
    const { data } = await supabase.from("venture_tasks").select("*").eq("venture_id", ventureId).order("created_at", { ascending: false });
    setTasks((data as Task[]) || []);
  };

  useEffect(() => { fetchTasks(); }, [ventureId]);

  const createTask = async () => {
    if (!user || !form.title.trim()) return;
    setLoading(true);
    await supabase.from("venture_tasks").insert({
      venture_id: ventureId, user_id: user.id, title: form.title,
      description: form.description || null,
      assigned_to: form.assigned_to || null,
      deadline: form.deadline || null,
    });
    setForm({ title: "", description: "", assigned_to: "", deadline: "" });
    setOpen(false);
    fetchTasks();
    toast.success("Tarefa criada!");
    setLoading(false);
  };

  const moveTask = async (taskId: string, newStatus: string) => {
    await supabase.from("venture_tasks").update({ status: newStatus }).eq("id", taskId);
    // Notify venture members about task update
    if (user) {
      const task = tasks.find(t => t.id === taskId);
      for (const m of members) {
        if (m.user_id !== user.id) {
          await supabase.from("founder_notifications").insert({
            user_id: m.user_id,
            type: "venture_activity",
            title: `Tarefa "${task?.title || ""}" movida para ${newStatus}`,
            action_url: "/venture-builder",
            related_user_id: user.id,
          });
        }
      }
    }
    fetchTasks();
  };

  const deleteTask = async (taskId: string) => {
    await supabase.from("venture_tasks").delete().eq("id", taskId);
    fetchTasks();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Kanban Board</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-3.5 w-3.5 mr-1" /> Nova Tarefa</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Tarefa</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Atribuir a...</option>
                {members.map(m => <option key={m.user_id} value={m.user_id}>{m.role} ({m.user_id.slice(0, 8)})</option>)}
              </select>
              <Input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              <Button onClick={createTask} disabled={loading || !form.title.trim()} className="w-full">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Criar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(col => (
          <div key={col.key} className={`rounded-lg p-3 ${col.color} min-h-[200px]`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-3">{col.label} ({tasks.filter(t => t.status === col.key).length})</h4>
            <div className="space-y-2">
              {tasks.filter(t => t.status === col.key).map(task => (
                <Card key={task.id} className="cursor-pointer hover:border-primary/40 transition-all">
                  <CardContent className="p-3 space-y-2">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}
                    <div className="flex items-center gap-2 flex-wrap">
                      {task.deadline && (
                        <Badge variant="outline" className="text-[10px] gap-1"><Calendar className="h-2.5 w-2.5" />{task.deadline}</Badge>
                      )}
                      {task.assigned_to && (
                        <Badge variant="secondary" className="text-[10px] gap-1"><User className="h-2.5 w-2.5" />{task.assigned_to.slice(0, 8)}</Badge>
                      )}
                    </div>
                    <div className="flex gap-1 pt-1">
                      {COLUMNS.filter(c => c.key !== col.key).map(c => (
                        <button key={c.key} onClick={() => moveTask(task.id, c.key)} className="text-[10px] px-2 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-foreground/70">
                          → {c.label}
                        </button>
                      ))}
                      <button onClick={() => deleteTask(task.id)} className="text-[10px] px-2 py-0.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 ml-auto">
                        Excluir
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
