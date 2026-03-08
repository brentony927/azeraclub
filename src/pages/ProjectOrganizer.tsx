import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { FolderKanban, Plus, Trash2, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
interface Project { id: string; name: string; description: string | null; ai_structure: string | null; status: string; }
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ProjectOrganizer() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [organizing, setOrganizing] = useState<string | null>(null);

  const fetch_ = async () => {
    if (!user) return;
    const { data } = await (supabase.from("projects" as any).select("*") as any).eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  useEffect(() => { fetch_(); }, [user]);

  const add = async () => {
    if (!user || !name.trim()) return;
    await (supabase.from("projects" as any).insert as any)({ user_id: user.id, name: name.trim(), description: desc.trim() || null });
    setName(""); setDesc(""); setDialogOpen(false); fetch_(); toast.success("Projeto criado!");
  };

  const del = async (id: string) => {
    await (supabase.from("projects" as any).delete() as any).eq("id", id);
    fetch_();
  };

  const organizeWithAI = async (p: Project) => {
    setOrganizing(p.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          requireTier: "pro",
          messages: [
            { role: "system", content: `You are a project management expert. Organize this project into phases, tasks, and timeline.

FORMATTING RULES (OBRIGATÓRIO):
- Use ## para cada fase do projeto
- Use ### para tarefas dentro de cada fase
- Use **negrito** para prazos e entregas
- Use > blockquote para dicas de gestão
- Use tabela para cronograma (Fase | Duração | Entregas | Status)
- Use --- entre fases
- No final, adicione "📚 Metodologia" com frameworks utilizados
- Escreva em Português (BR) elegante` },
            { role: "user", content: `Organize o projeto: "${p.name}". Descrição: ${p.description || "Sem descrição"}` },
          ],
        }),
      });
      if (!resp.ok || !resp.body) throw new Error("AI error");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "", content = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx); buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try { const pa = JSON.parse(json); const c = pa.choices?.[0]?.delta?.content; if (c) { content += c; setProjects(prev => prev.map(pr => pr.id === p.id ? { ...pr, ai_structure: content } : pr)); } } catch {}
        }
      }
      await (supabase.from("projects" as any).update as any)({ ai_structure: content }).eq("id", p.id);
      toast.success("Projeto organizado!");
    } catch { toast.error("Erro ao organizar"); } finally { setOrganizing(null); }
  };

  return (
    <FeatureLock minTier="pro" featureName="Organizador de Projetos">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Organizador de Projetos</h1>
            <p className="text-muted-foreground text-sm mt-1">Crie e organize projetos com IA</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Criar Projeto</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo Projeto</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <Input placeholder="Nome do projeto" value={name} onChange={(e) => setName(e.target.value)} />
                <Textarea placeholder="Descrição (opcional)" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
                <Button onClick={add} className="w-full">Criar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div variants={item}>
            <Card className="p-12 text-center">
              <FolderKanban className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Nenhum projeto ainda.</p>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {projects.map((p) => (
              <motion.div key={p.id} variants={item}>
                <Card className="group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => organizeWithAI(p)} disabled={organizing === p.id} className="gap-1 text-xs">
                          {organizing === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} Organizar com IA
                        </Button>
                        <button onClick={() => del(p.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {p.ai_structure && (
                      <div className="mt-3 pt-3">
                        <AIArticleRenderer content={p.ai_structure} />
                      </div>
                    )}
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
