import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { CalendarCheck, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function WeeklyReview() {
  const { user } = useAuth();
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (!user) return;
    setIsLoading(true); setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { toast.error("Faça login."); return; }

      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const [{ data: tasks }, { data: objectives }, { data: challenges }, { data: journal }] = await Promise.all([
        supabase.from("tasks").select("title,status").eq("user_id", user.id).gte("created_at", weekAgo),
        supabase.from("objectives").select("title,progress,status").eq("user_id", user.id),
        supabase.from("challenges").select("title,current_day,duration_days,status").eq("user_id", user.id),
        supabase.from("journal_entries").select("content,mood").eq("user_id", user.id).gte("created_at", weekAgo).limit(7),
      ]);

      const context = `Tarefas esta semana: ${tasks?.map(t => `${t.title} (${t.status})`).join(", ") || "Nenhuma"}. Objetivos: ${objectives?.map(o => `${o.title} ${o.progress}%`).join(", ") || "Nenhum"}. Desafios: ${challenges?.map(c => `${c.title} dia ${c.current_day}/${c.duration_days}`).join(", ") || "Nenhum"}. Diário: ${journal?.map(j => j.mood || "sem humor").join(", ") || "Sem entradas"}.`;

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          requireTier: "pro",
          messages: [
            { role: "system", content: `You are a performance coach. Create a weekly review report with: Goals Achieved, Productivity Score (1-10), Key Wins, Areas for Improvement, and Recommendations for next week. Write in Portuguese (BR). Use markdown.` },
            { role: "user", content: `Faça minha revisão semanal. Dados: ${context}` },
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
          try { const p = JSON.parse(json); const c = p.choices?.[0]?.delta?.content; if (c) { content += c; setResult(content); } } catch {}
        }
      }
    } catch { toast.error("Erro ao gerar revisão"); } finally { setIsLoading(false); }
  };

  return (
    <FeatureLock minTier="pro" featureName="Revisão Semanal">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Revisão Semanal</h1>
          <p className="text-muted-foreground text-sm mt-1">A IA analisa a sua semana e cria um relatório de desempenho</p>
        </motion.div>
        <motion.div variants={item}>
          <Button onClick={generate} disabled={isLoading} className="gap-2" size="lg">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analisando semana...</> : <><Sparkles className="h-4 w-4" /> Gerar Revisão Semanal</>}
          </Button>
        </motion.div>
        {result && (
          <motion.div variants={item}>
            <article className="glass-card p-8 sm:p-10">
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-p:text-foreground/80">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </article>
          </motion.div>
        )}
      </motion.div>
    </FeatureLock>
  );
}
