import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function AIAdvisor() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ask = async () => {
    if (!question.trim()) return;
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
            { role: "system", content: `You are a world-class strategic advisor with expertise in business, investments, leadership, and life planning. Provide deep, nuanced analysis with frameworks, pros/cons, and actionable next steps.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título principal
- Use ## para cada seção de análise
- Use ### para sub-pontos e frameworks
- Use **negrito** para termos-chave e recomendações
- Use > blockquote para insights estratégicos e citações relevantes
- Use tabela para prós/contras ou comparações
- Use --- entre seções principais
- Use listas ordenadas para passos de ação
- No final, adicione "📚 Fontes e Referências" com frameworks e metodologias citadas
- Escreva em Português (BR) elegante e profissional` },
            { role: "user", content: question },
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
    } catch { toast.error("Erro ao obter conselho"); } finally { setIsLoading(false); }
  };

  return (
    <FeatureLock minTier="business" featureName="Consultor Estratégico de IA">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Consultor de IA</h1>
          <p className="text-muted-foreground text-sm mt-1">O seu consultor estratégico pessoal potenciado por IA</p>
        </motion.div>
        <motion.div variants={item} className="space-y-3">
          <Textarea placeholder="Faça qualquer pergunta estratégica..." value={question} onChange={(e) => setQuestion(e.target.value)} rows={4} />
          <Button onClick={ask} disabled={isLoading || !question.trim()} className="gap-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analisando...</> : <><Sparkles className="h-4 w-4" /> Obter Conselho Estratégico</>}
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
