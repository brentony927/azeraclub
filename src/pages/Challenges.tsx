import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  duration_days: number;
  current_day: number;
  status: string;
  started_at: string;
}

const PRESETS = [
  { title: "7 Dias de Foco Total", description: "Elimine distrações e foque no que importa por 7 dias.", duration: 7 },
  { title: "Desafio Networking", description: "Conecte-se com 1 pessoa nova por dia durante 14 dias.", duration: 14 },
  { title: "Produtividade Extrema", description: "Complete 3 tarefas importantes por dia durante 21 dias.", duration: 21 },
  { title: "30 Dias de Evolução", description: "Um mês de hábitos consistentes e melhoria contínua.", duration: 30 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Challenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("7");

  const fetchChallenges = async () => {
    if (!user) return;
    const { data } = await supabase.from("challenges").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setChallenges(data as Challenge[]);
  };

  useEffect(() => { fetchChallenges(); }, [user]);

  const createChallenge = async (t?: string, d?: string, dur?: number) => {
    if (!user) return;
    await supabase.from("challenges").insert({
      user_id: user.id,
      title: t || title.trim(),
      description: d || description.trim() || null,
      duration_days: dur || parseInt(duration),
    });
    setTitle(""); setDescription(""); setDuration("7"); setDialogOpen(false);
    fetchChallenges();
    toast.success("Desafio iniciado! 🔥");
  };

  const advanceDay = async (ch: Challenge) => {
    const newDay = ch.current_day + 1;
    const status = newDay >= ch.duration_days ? "concluido" : "ativo";
    await supabase.from("challenges").update({ current_day: newDay, status }).eq("id", ch.id);
    if (status === "concluido") toast.success("Desafio concluído! 🎉");
    fetchChallenges();
  };

  const deleteChallenge = async (id: string) => {
    await supabase.from("challenges").delete().eq("id", id);
    fetchChallenges();
  };

  const active = challenges.filter((c) => c.status === "ativo");
  const completed = challenges.filter((c) => c.status === "concluido");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Desafios de Evolução</h1>
          <p className="text-muted-foreground text-sm mt-1">Crie hábitos e evolua com desafios progressivos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Criar Desafio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Desafio</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Desafios prontos</p>
                <div className="grid gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.title}
                      onClick={() => createChallenge(p.title, p.description, p.duration)}
                      className="text-left p-3 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-secondary/50 transition-all"
                    >
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.duration} dias</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-border/40 pt-4 space-y-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Ou crie o seu</p>
                <Input placeholder="Nome do desafio" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Textarea placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
                <Input type="number" placeholder="Dias" value={duration} onChange={(e) => setDuration(e.target.value)} min="1" max="365" />
                <Button onClick={() => createChallenge()} disabled={!title.trim()} className="w-full">Iniciar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {challenges.length === 0 ? (
        <motion.div variants={item}>
          <Card className="p-12 text-center">
            <Flame className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Nenhum desafio ativo.</p>
            <p className="text-muted-foreground text-xs mt-1">Comece um desafio para evoluir consistentemente.</p>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ativos ({active.length})</h3>
              {active.map((ch) => (
                <motion.div key={ch.id} variants={item}>
                  <Card className="group hover:border-primary/20 transition-colors">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium flex items-center gap-2">🔥 {ch.title}</p>
                          {ch.description && <p className="text-xs text-muted-foreground mt-0.5">{ch.description}</p>}
                        </div>
                        <button onClick={() => deleteChallenge(ch.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={(ch.current_day / ch.duration_days) * 100} className="flex-1 h-2" />
                        <span className="text-xs font-medium text-muted-foreground">{ch.current_day}/{ch.duration_days}</span>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => advanceDay(ch)} className="w-full gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Marcar dia {ch.current_day + 1}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {completed.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Concluídos 🎉 ({completed.length})</h3>
              {completed.map((ch) => (
                <Card key={ch.id} className="opacity-60">
                  <CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{ch.title}</p>
                    <span className="text-xs text-muted-foreground ml-auto">✓ {ch.duration_days} dias</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
