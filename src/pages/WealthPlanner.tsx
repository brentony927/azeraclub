import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { DollarSign, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function WealthPlanner() {
  const [income, setIncome] = useState("");
  const [goals, setGoals] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (!goals.trim()) return;
    setIsLoading(true); setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { toast.error("Faça login."); return; }
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          requireTier: "business",
          messages: [
            { role: "system", content: `You are a wealth management advisor. Create a comprehensive wealth growth plan with: savings strategy, investment allocation, income diversification, risk management, and milestone timeline. Write in Portuguese (BR). Use markdown.` },
            { role: "user", content: `Renda atual: ${income || "não informada"}. Metas financeiras: ${goals}. Crie um plano de crescimento financeiro.` },
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
    } catch { toast.error("Erro ao gerar plano"); } finally { setIsLoading(false); }
  };

  return (
    <FeatureLock minTier="business" featureName="Planeador de Riqueza Pessoal">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Estratégia Financeira</h1>
          <p className="text-muted-foreground text-sm mt-1">Crie o seu plano pessoal de crescimento financeiro</p>
        </motion.div>
        <motion.div variants={item} className="space-y-3">
          <Input placeholder="Rendimento mensal atual (opcional)" value={income} onChange={(e) => setIncome(e.target.value)} />
          <Textarea placeholder="Descreva os seus objetivos financeiros..." value={goals} onChange={(e) => setGoals(e.target.value)} rows={3} />
          <Button onClick={generate} disabled={isLoading || !goals.trim()} className="gap-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando...</> : <><Sparkles className="h-4 w-4" /> Gerar Plano Financeiro</>}
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
