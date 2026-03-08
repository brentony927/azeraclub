import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { Globe, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function LifeSimulation() {
  const [scenario, setScenario] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const simulate = async () => {
    if (!scenario.trim()) return;
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
            { role: "system", content: `You are a strategic life simulator. Analyze the scenario and generate 3 possible future outcomes: Best Case, Most Likely, Worst Case.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título principal
- Use ## para cada cenário (🟢 Melhor Caso, 🟡 Caso Mais Provável, 🔴 Pior Caso)
- Use ### para sub-seções: Linha do Tempo, Impacto Financeiro, Mudanças de Estilo de Vida, Riscos, Oportunidades
- Use **negrito** para dados e métricas
- Use > blockquote para alertas importantes e insights decisivos
- Use tabela comparativa dos 3 cenários (Aspecto | Melhor | Provável | Pior)
- Use --- entre cada cenário
- No final, adicione "📚 Fontes e Referências" com bases de análise
- Escreva em Português (BR) elegante e profissional` },
            { role: "user", content: `Simule o futuro para este cenário: ${scenario}` },
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
    } catch { toast.error("Erro na simulação"); } finally { setIsLoading(false); }
  };

  return (
    <FeatureLock minTier="business" featureName="Simulação de Vida Estratégica">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Simulação de Vida</h1>
          <p className="text-muted-foreground text-sm mt-1">Simule cenários futuros com IA</p>
        </motion.div>
        <motion.div variants={item} className="space-y-3">
          <Textarea placeholder='Descreva um cenário (ex: "E se eu me mudar para outro país?")' value={scenario} onChange={(e) => setScenario(e.target.value)} rows={3} />
          <Button onClick={simulate} disabled={isLoading || !scenario.trim()} className="gap-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Simulando...</> : <><Sparkles className="h-4 w-4" /> Simular Futuro</>}
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
