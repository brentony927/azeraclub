import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { Crosshair, Loader2, Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function GoalBreakdown() {
  const { user } = useAuth();
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (!goal.trim()) return;
    setIsLoading(true); setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { toast.error("Faça login."); return; }
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          requireTier: "pro",
          messages: [
            { role: "system", content: `You are a strategic goal planner. Break down the user's goal into: 1) Milestones (major checkpoints), 2) Specific tasks for each milestone, 3) Weekly targets.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título principal
- Use ## para cada marco/milestone
- Use ### para sub-tarefas dentro de cada marco
- Use **negrito** para termos-chave e prazos
- Use > blockquote para dicas estratégicas e insights
- Use tabelas para cronogramas e metas semanais
- Use --- entre seções principais
- Use listas ordenadas para passos sequenciais
- No final, adicione "📚 Fontes e Referências" com metodologias utilizadas
- Escreva em Português (BR) elegante e profissional` },
            { role: "user", content: `Quebre este objetivo em etapas: ${goal}` },
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

  const savePlan = async () => {
    if (!user || !result) return;
    const { error } = await (supabase.from("goal_plans" as any).insert as any)({ user_id: user.id, goal: goal.trim(), breakdown: result });
    if (error) toast.error("Erro ao salvar"); else toast.success("Plano salvo!");
  };

  return (
    <FeatureLock minTier="pro" featureName="Sistema de Decomposição de Metas">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Decomposição de Metas</h1>
          <p className="text-muted-foreground text-sm mt-1">Decomponha os seus objetivos em passos acionáveis</p>
        </motion.div>
        <motion.div variants={item} className="flex gap-3">
          <Input placeholder="Qual é a sua meta? (ex: Alcançar R$50k de receita mensal)" value={goal} onChange={(e) => setGoal(e.target.value)} className="flex-1" />
          <Button onClick={generate} disabled={isLoading || !goal.trim()} className="gap-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Decompondo...</> : <><Sparkles className="h-4 w-4" /> Decompor Meta</>}
          </Button>
        </motion.div>
        {result && (
          <motion.div variants={item}>
            <AIArticleRenderer content={result} />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={savePlan} className="gap-2"><Save className="h-4 w-4" /> Salvar Plano</Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </FeatureLock>
  );
}
