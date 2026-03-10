import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { Map, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AIArticleRenderer from "@/components/AIArticleRenderer";
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
          featureId: "life-master-plan",
          messages: [
            { role: "system", content: `You are a life strategist. Create a comprehensive long-term life plan connecting 1-year, 5-year, and 10-year goals.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título principal
- Use ## para cada horizonte temporal (1 Ano, 5 Anos, 10 Anos) e seções transversais
- Use ### para marcos e decisões-chave
- Use **negrito** para prazos, marcos e decisões importantes
- Use > blockquote para reflexões estratégicas e alertas
- Use tabela para cronograma de marcos (Marco | Prazo | Prioridade | Status)
- Use --- entre horizontes temporais
- Inclua seção de checkpoints trimestrais
- No final, adicione "📚 Fontes e Referências" com metodologias de planejamento de vida
- Escreva em Português (BR) elegante e profissional` },
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
    <FeatureLock minTier="business" featureName="Plano de Vida de Longo Prazo">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Plano de Vida</h1>
          <p className="text-muted-foreground text-sm mt-1">Construa a sua estratégia de vida a longo prazo</p>
        </motion.div>
        <motion.div variants={item} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Metas de 1 Ano</label>
            <Textarea placeholder="O que deseja alcançar em 1 ano?" value={oneYear} onChange={(e) => setOneYear(e.target.value)} rows={2} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Metas de 5 Anos</label>
            <Textarea placeholder="Onde se vê em 5 anos?" value={fiveYear} onChange={(e) => setFiveYear(e.target.value)} rows={2} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Metas de 10 Anos</label>
            <Textarea placeholder="A sua visão definitiva para 10 anos..." value={tenYear} onChange={(e) => setTenYear(e.target.value)} rows={2} />
          </div>
          <Button onClick={build} disabled={isLoading || (!oneYear.trim() && !fiveYear.trim() && !tenYear.trim())} className="gap-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Construindo...</> : <><Sparkles className="h-4 w-4" /> Construir Plano de Vida</>}
          </Button>
        </motion.div>
        {result && (
          <motion.div variants={item}>
            <AIArticleRenderer content={result} />
          </motion.div>
        )}
      </motion.div>
    </FeatureLock>
  );
}
