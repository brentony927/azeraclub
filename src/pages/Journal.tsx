import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus, Send, Loader2, Trash2, Smile, Minus, Brain, Moon, AlertTriangle, Lightbulb } from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;

interface JournalEntry {
  id: string;
  content: string;
  ai_response: string | null;
  mood: string | null;
  created_at: string;
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const MOOD_OPTIONS = [
  { id: "otimo", label: "Ótimo", icon: Smile, color: "green" as const },
  { id: "neutro", label: "Neutro", icon: Minus, color: "silver" as const },
  { id: "reflexivo", label: "Reflexivo", icon: Brain, color: "blue" as const },
  { id: "cansado", label: "Cansado", icon: Moon, color: "silver" as const },
  { id: "ansioso", label: "Ansioso", icon: AlertTriangle, color: "gold" as const },
];

export default function Journal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchEntries = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setEntries(data as JournalEntry[]);
  };

  useEffect(() => { fetchEntries(); }, [user]);

  const analyzeEntry = async (text: string): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Faça login para usar o diário.");
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "Você é um coach de vida. O usuário escreveu uma reflexão no diário. Analise brevemente (3-5 linhas): dê uma perspectiva construtiva, um conselho prático e um aprendizado. Seja empático e direto." },
          { role: "user", content: text },
        ],
      }),
    });
    if (!resp.ok || !resp.body) throw new Error("AI error");
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "", result = "";
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
        try { const p = JSON.parse(json); const c = p.choices?.[0]?.delta?.content; if (c) result += c; } catch {}
      }
    }
    return result;
  };

  const saveEntry = async () => {
    if (!user || !content.trim()) return;
    setIsAnalyzing(true);
    try {
      const aiResponse = await analyzeEntry(content);
      await supabase.from("journal_entries").insert({
        user_id: user.id,
        content: content.trim(),
        ai_response: aiResponse,
        mood,
      });
      setContent("");
      setMood(null);
      setDialogOpen(false);
      fetchEntries();
      toast.success("Reflexão salva com análise da IA!");
    } catch {
      toast.error("Erro ao analisar reflexão");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteEntry = async (id: string) => {
    await supabase.from("journal_entries").delete().eq("id", id);
    fetchEntries();
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Diário Inteligente</h1>
          <p className="text-muted-foreground text-sm mt-1">Escreva reflexões e receba análises da IA</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Nova Reflexão</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Escreva sua reflexão</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <Textarea
                placeholder="Como foi seu dia? O que está pensando?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(mood === m.id ? null : m.id)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${mood === m.id ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                  >
                    <Icon3D icon={m.icon} color={m.color} size="xs" animated /> {m.label}
                  </button>
                ))}
              </div>
              <Button onClick={saveEntry} disabled={!content.trim() || isAnalyzing} className="w-full gap-2">
                {isAnalyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Analisando...</> : <><Send className="h-4 w-4" /> Salvar e Analisar</>}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {entries.length === 0 ? (
        <motion.div variants={item}>
          <Card className="p-12 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Nenhuma reflexão ainda.</p>
            <p className="text-muted-foreground text-xs mt-1">Comece a escrever para receber insights da IA.</p>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <motion.div key={entry.id} variants={item}>
              <Card className="group">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(entry.created_at), "dd MMM yyyy · HH:mm", { locale: ptBR })}
                      </span>
                      {entry.mood && (() => {
                        const moodOpt = MOOD_OPTIONS.find((m) => m.id === entry.mood);
                        return moodOpt ? (
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Icon3D icon={moodOpt.icon} color={moodOpt.color} size="xs" /> {moodOpt.label}
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <button onClick={() => deleteEntry(entry.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{entry.content}</p>
                  {entry.ai_response && (
                    <div className="border-t border-border/40 pt-3 mt-3">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1.5 flex items-center gap-1"><Icon3D icon={Lightbulb} color="gold" size="xs" animated /> Análise AZR AI</p>
                      <div className="text-sm text-foreground/80 prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{entry.ai_response}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
