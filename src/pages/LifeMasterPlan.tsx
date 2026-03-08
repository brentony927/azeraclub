import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { Map, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function LifeMasterPlan() {
  const [oneYear, setOneYear] = useState("");
  const [fiveYear, setFiveYear] = useState("");
  const [tenYear, setTenYear] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const build = async () => {
    if (!oneYear.trim() && !fiveYear.trim() && !tenYear.trim()) return;
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
            { role: "system", content: `You are a life strategist. Create a comprehensive long-term life plan connecting 1-year, 5-year, and 10-year goals. Include: phased strategy, milestones, key decisions, risk mitigation, and quarterly checkpoints. Write in Portuguese (BR). Use markdown. Be thorough.` },
            { role: "user", content: `Metas 1 ano: ${oneYear || "Não definida"}. Metas 5 anos: ${fiveYear || "Não definida"}. Metas 10 anos: ${tenYear || "Não definida"}. Crie meu Master Plan.` },
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
    } catch { toast.error("Erro ao criar plano"); } finally { setIsLoading(false); }
  };

  return (
    <FeatureLock minTier="business" featureName="Long Term Life Planning">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Life Master Plan</h1>
          <p className="text-muted-foreground text-sm mt-1">Build your long-term life strategy</p>
        </motion.div>
        <motion.div variants={item} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">1 Year Goals</label>
            <Textarea placeholder="What do you want to achieve in 1 year?" value={oneYear} onChange={(e) => setOneYear(e.target.value)} rows={2} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">5 Year Goals</label>
            <Textarea placeholder="Where do you see yourself in 5 years?" value={fiveYear} onChange={(e) => setFiveYear(e.target.value)} rows={2} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">10 Year Goals</label>
            <Textarea placeholder="Your ultimate 10-year vision..." value={tenYear} onChange={(e) => setTenYear(e.target.value)} rows={2} />
          </div>
          <Button onClick={build} disabled={isLoading || (!oneYear.trim() && !fiveYear.trim() && !tenYear.trim())} className="gap-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Building...</> : <><Sparkles className="h-4 w-4" /> Build Master Plan</>}
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
