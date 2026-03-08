import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { PiggyBank, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const SECTORS = ["Tecnologia", "Imóveis", "Startups", "Criptomoedas", "Ações", "Renda Fixa"];
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function InvestmentRadar() {
  const [sector, setSector] = useState("Tecnologia");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scan = async () => {
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
          newsContext: true, newsQuery: `investment opportunities ${sector}`,
          messages: [
            { role: "system", content: `You are an elite investment analyst. Scan current opportunities in the ${sector} sector. For each opportunity provide: name, risk level (low/medium/high), potential return, time horizon, and brief analysis. Write in Portuguese (BR). Use markdown.` },
            { role: "user", content: `Analise oportunidades de investimento em ${sector}.` },
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
    } catch { toast.error("Erro ao buscar investimentos"); } finally { setIsLoading(false); }
  };

  return (
    <FeatureLock minTier="business" featureName="Investment Opportunities">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Investment Radar</h1>
          <p className="text-muted-foreground text-sm mt-1">Scan investment opportunities with AI analysis</p>
        </motion.div>
        <motion.div variants={item} className="flex gap-3">
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={scan} disabled={isLoading} className="gap-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning...</> : <><Sparkles className="h-4 w-4" /> Scan Opportunities</>}
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
