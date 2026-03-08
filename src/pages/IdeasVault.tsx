import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;

interface Idea {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  created_at: string;
}

const CATEGORIES = ["geral", "negócio", "projeto", "produto", "conteúdo"];
const STATUS_LABELS: Record<string, string> = { rascunho: "Rascunho", desenvolvimento: "Em Desenvolvimento", concluido: "Concluído" };

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function IdeasVault() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("geral");

  const fetchIdeas = async () => {
    if (!user) return;
    const { data } = await supabase.from("ideas").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setIdeas(data as Idea[]);
  };

  useEffect(() => { fetchIdeas(); }, [user]);

  const addIdea = async () => {
    if (!user || !title.trim()) return;
    await supabase.from("ideas").insert({ user_id: user.id, title: title.trim(), description: description.trim() || null, category });
    setTitle(""); setDescription(""); setCategory("geral"); setDialogOpen(false);
    fetchIdeas();
    toast.success("Ideia salva!");
  };

  const deleteIdea = async (id: string) => {
    await supabase.from("ideas").delete().eq("id", id);
    fetchIdeas();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("ideas").update({ status }).eq("id", id);
    fetchIdeas();
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Cofre de Ideias</h1>
          <p className="text-muted-foreground text-sm mt-1">Salve e desenvolva suas melhores ideias</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Nova Ideia</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Ideia</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <Input placeholder="Título da ideia" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea placeholder="Descreva sua ideia..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={addIdea} className="w-full">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {ideas.length === 0 ? (
        <motion.div variants={item}>
          <Card className="p-12 text-center">
            <Lightbulb className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Seu cofre está vazio.</p>
            <p className="text-muted-foreground text-xs mt-1">Salve ideias de negócios, projetos e insights.</p>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-3">
          {ideas.map((idea) => (
            <motion.div key={idea.id} variants={item}>
              <Card className="group hover:border-primary/20 transition-colors">
                <CardContent className="p-4 flex items-start gap-3">
                  <Lightbulb className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{idea.title}</p>
                      <Badge variant="secondary" className="text-[10px]">{idea.category}</Badge>
                    </div>
                    {idea.description && <p className="text-xs text-muted-foreground line-clamp-2">{idea.description}</p>}
                  </div>
                  <Select value={idea.status} onValueChange={(v) => updateStatus(idea.id, v)}>
                    <SelectTrigger className="w-32 h-7 text-[11px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <button onClick={() => deleteIdea(idea.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
