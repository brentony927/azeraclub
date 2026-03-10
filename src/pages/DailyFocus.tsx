import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { Focus, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function DailyFocus() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    setIsLoading(true); setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { toast.error("Faça login."); return; }

      const [{ data: tasks }, { data: objectives }] = await Promise.all([
        supabase.from("tasks").select("title,status,date").eq("status", "pending").limit(20),
        supabase.from("objectives").select("title,progress,status").eq("status", "ativo").limit(10),
      ]);

      const context = `Tarefas pendentes: ${tasks?.map(t => t.title).join(", ") || "Nenhuma"}. Objetivos ativos: ${objectives?.map(o => `${o.title} (${o.progress}%)`).join(", ") || "Nenhum"}.`;

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          featureId: "daily-focus",
          messages: [
            { role: "system", content: `You are a productivity coach. Based on the user's current tasks and goals, identify the TOP 3 priorities for today. Explain why each is important and suggest a time-blocked schedule.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título principal
- Use ## para cada prioridade
- Use **negrito** para horários e termos-chave
- Use > blockquote para insights sobre por que cada prioridade é importante
- Use tabela para o cronograma de time-blocking
- Use --- entre seções
- No final, adicione "💡 Insight do Dia" com uma reflexão motivacional
- Escreva em Português (BR) elegante e profissional` },
            { role: "user", content: `Aqui está meu contexto atual: ${context}\n\nQuais devem ser minhas 3 prioridades de hoje?` },
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
    } catch { toast.error("Erro ao gerar foco diário"); } finally { setIsLoading(false); }
  };

  return (
    <FeatureLock minTier="pro" featureName="Gerador de Foco Diário">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Foco Diário</h1>
          <p className="text-muted-foreground text-sm mt-1">A IA analisa as suas tarefas e metas para definir as prioridades de hoje</p>
        </motion.div>
        <motion.div variants={item}>
          <Button onClick={generate} disabled={isLoading} className="gap-2" size="lg">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analisando...</> : <><Sparkles className="h-4 w-4" /> Gerar Foco</>}
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
