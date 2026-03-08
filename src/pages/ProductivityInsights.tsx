import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { BarChart3, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function ProductivityInsights() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ completedTasks: 0, pendingTasks: 0, activeGoals: 0, completedGoals: 0, activeChallenges: 0 });
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ count: ct }, { count: pt }, { count: ag }, { count: cg }, { count: ac }] = await Promise.all([
        supabase.from("tasks").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "completed"),
        supabase.from("tasks").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending"),
        supabase.from("objectives").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "ativo"),
        supabase.from("objectives").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "concluido"),
        supabase.from("challenges").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "ativo"),
      ]);
      setStats({ completedTasks: ct || 0, pendingTasks: pt || 0, activeGoals: ag || 0, completedGoals: cg || 0, activeChallenges: ac || 0 });
    })();
  }, [user]);

  const getAdvice = async () => {
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
            { role: "system", content: `You are a productivity coach. Analyze the user's stats and give actionable advice to improve.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título principal
- Use ## para cada área de análise (Tarefas, Objetivos, Desafios, Recomendações)
- Use **negrito** para métricas e dados importantes
- Use > blockquote para insights estratégicos e observações-chave
- Use tabela para resumo das métricas (Métrica | Atual | Meta Sugerida)
- Use --- entre seções principais
- No final, adicione "📚 Metodologias Aplicadas" com frameworks de produtividade citados
- Escreva em Português (BR) elegante e profissional` },
            { role: "user", content: `Minhas métricas: ${stats.completedTasks} tarefas concluídas, ${stats.pendingTasks} pendentes, ${stats.activeGoals} objetivos ativos, ${stats.completedGoals} concluídos, ${stats.activeChallenges} desafios ativos. Me dê conselhos para melhorar.` },
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
    } catch { toast.error("Erro ao obter conselhos"); } finally { setIsLoading(false); }
  };

  const statCards = [
    { label: "Tarefas Concluídas", value: stats.completedTasks },
    { label: "Tarefas Pendentes", value: stats.pendingTasks },
    { label: "Objetivos Ativos", value: stats.activeGoals },
    { label: "Objetivos Concluídos", value: stats.completedGoals },
    { label: "Desafios Ativos", value: stats.activeChallenges },
  ];

  return (
    <FeatureLock minTier="pro" featureName="Insights de Produtividade">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Insights de Produtividade</h1>
          <p className="text-muted-foreground text-sm mt-1">Acompanhe a sua produtividade e receba conselhos da IA</p>
        </motion.div>
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
        <motion.div variants={item}>
          <Button onClick={getAdvice} disabled={isLoading} className="gap-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analisando...</> : <><Sparkles className="h-4 w-4" /> Obter Conselhos da IA</>}
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
