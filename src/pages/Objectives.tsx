import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Objective {
  id: string;
  title: string;
  category: string;
  target_date: string | null;
  progress: number;
  status: string;
  created_at: string;
}

const CATEGORIES = [
  { value: "financeira", label: "💰 Financeira" },
  { value: "carreira", label: "💼 Carreira" },
  { value: "saude", label: "🏃 Saúde" },
  { value: "pessoal", label: "🌱 Pessoal" },
  { value: "educacao", label: "📚 Educação" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Objectives() {
  const { user } = useAuth();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("carreira");
  const [targetDate, setTargetDate] = useState("");

  const fetchObjectives = async () => {
    if (!user) return;
    const { data } = await supabase.from("objectives").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setObjectives(data as Objective[]);
  };

  useEffect(() => { fetchObjectives(); }, [user]);

  const addObjective = async () => {
    if (!user || !title.trim()) return;
    await supabase.from("objectives").insert({ user_id: user.id, title: title.trim(), category, target_date: targetDate || null });
    setTitle(""); setCategory("carreira"); setTargetDate(""); setDialogOpen(false);
    fetchObjectives();
    toast.success("Objetivo criado!");
  };

  const updateProgress = async (id: string, progress: number) => {
    const status = progress >= 100 ? "concluido" : "ativo";
    await supabase.from("objectives").update({ progress, status }).eq("id", id);
    fetchObjectives();
  };

  const deleteObjective = async (id: string) => {
    await supabase.from("objectives").delete().eq("id", id);
    fetchObjectives();
  };

  const active = objectives.filter((o) => o.status === "ativo");
  const completed = objectives.filter((o) => o.status === "concluido");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Mapa de Objetivos</h1>
          <p className="text-muted-foreground text-sm mt-1">Defina e acompanhe suas metas de vida</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Novo Objetivo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Objetivo</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <Input placeholder="Título do objetivo" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              <Button onClick={addObjective} className="w-full">Criar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {objectives.length === 0 ? (
        <motion.div variants={item}>
          <Card className="p-12 text-center">
            <Target className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Nenhum objetivo definido.</p>
            <p className="text-muted-foreground text-xs mt-1">Crie metas financeiras, de carreira ou pessoais.</p>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ativos ({active.length})</h3>
              {active.map((obj) => (
                <motion.div key={obj.id} variants={item}>
                  <Card className="group hover:border-primary/20 transition-colors">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">{obj.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {CATEGORIES.find((c) => c.value === obj.category)?.label || obj.category}
                            {obj.target_date && ` · Meta: ${format(new Date(obj.target_date + "T12:00:00"), "dd MMM yyyy", { locale: ptBR })}`}
                          </p>
                        </div>
                        <button onClick={() => deleteObjective(obj.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <Slider value={[obj.progress]} max={100} step={5} onValueChange={([v]) => updateProgress(obj.id, v)} className="flex-1" />
                        <span className="text-xs font-medium text-muted-foreground w-10 text-right">{obj.progress}%</span>
                      </div>
                      <Progress value={obj.progress} className="h-1.5" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {completed.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Concluídos ({completed.length})</h3>
              {completed.map((obj) => (
                <Card key={obj.id} className="opacity-60">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm line-through">{obj.title}</p>
                    <span className="text-xs text-muted-foreground ml-auto">✓ 100%</span>
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
