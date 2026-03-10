import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { Repeat, Plus, Trash2, CheckCircle2, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Habit { id: string; title: string; frequency: string; streak: number; last_checked: string | null; status: string; }

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function HabitBuilder() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const fetch_ = async () => {
    if (!user) return;
    const { data } = await (supabase.from("habits" as any).select("*") as any).eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setHabits(data);
  };

  useEffect(() => { fetch_(); }, [user]);

  const add = async () => {
    if (!user || !title.trim()) return;
    await (supabase.from("habits" as any).insert as any)({ user_id: user.id, title: title.trim(), frequency });
    setTitle(""); setFrequency("daily"); setDialogOpen(false); fetch_(); toast.success("Hábito criado!");
  };

  const checkIn = async (h: Habit) => {
    const today = new Date().toISOString().split("T")[0];
    if (h.last_checked === today) { toast.info("Já registrado hoje!"); return; }
    const newStreak = h.last_checked === new Date(Date.now() - 86400000).toISOString().split("T")[0] ? h.streak + 1 : 1;
    await (supabase.from("habits" as any).update as any)({ streak: newStreak, last_checked: today }).eq("id", h.id);
    fetch_(); toast.success(`Streak: ${newStreak} dias!`);
  };

  const del = async (id: string) => {
    await (supabase.from("habits" as any).delete() as any).eq("id", id);
    fetch_();
  };

  return (
    <FeatureLock minTier="pro" featureName="Construtor de Hábitos">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Construtor de Hábitos</h1>
            <p className="text-muted-foreground text-sm mt-1">Construa e acompanhe hábitos diários</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Criar Hábito</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo Hábito</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <Input placeholder="Nome do hábito (ex: Rotina matinal de planeamento)" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="3x/week">3x/semana</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={add} className="w-full">Iniciar Hábito</Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {habits.length === 0 ? (
          <motion.div variants={item}>
            <Card className="p-12 text-center">
              <Repeat className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Nenhum hábito ainda.</p>
              <p className="text-muted-foreground text-xs mt-1">Crie o seu primeiro hábito para começar a acompanhar.</p>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {habits.map((h) => (
              <motion.div key={h.id} variants={item}>
                <Card className="group hover:border-primary/20 transition-colors">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Repeat className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{h.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">{h.frequency}</Badge>
                        {h.streak > 0 && <span className="text-[11px] text-orange-500 flex items-center gap-0.5"><Flame className="h-3 w-3" />{h.streak}</span>}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => checkIn(h)} className="gap-1 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Check-in
                    </Button>
                    <button onClick={() => del(h.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </FeatureLock>
  );
}
