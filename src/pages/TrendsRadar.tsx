import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;

const TOPICS = ["Negócios & Startups", "Tecnologia & IA", "Investimentos", "Marketing Digital", "Produtividade"];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function TrendsRadar() {
  const [topic, setTopic] = useState("Negócios & Startups");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrends = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { toast.error("Faça login para usar esta funcionalidade."); return; }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          requireTier: "pro",
          newsContext: true,
          newsQuery: topic,
          messages: [
            { role: "system", content: `Você é um analista de tendências. Liste 5-7 tendências atuais e relevantes sobre "${topic}". Para cada tendência: nome, por que importa, como aproveitar. Seja específico e acionável. Use markdown.` },
            { role: "user", content: `Quais são as tendências mais quentes em ${topic}?` },
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
    } catch {
      toast.error("Erro ao buscar tendências");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FeatureLock minTier="pro" featureName="Radar de Tendências">
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-serif font-bold">Radar de Tendências</h1>
        <p className="text-muted-foreground text-sm mt-1">Fique atualizado com tendências de negócios e tecnologia</p>
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`text-xs px-3.5 py-2 rounded-full transition-all ${topic === t ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Button onClick={fetchTrends} disabled={isLoading} className="gap-2">
          {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analisando...</> : <><RefreshCw className="h-4 w-4" /> Gerar Tendências</>}
        </Button>
      </motion.div>

      {result && (
        <motion.div variants={item}>
          <Card>
            <CardContent className="p-5">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
    </FeatureLock>
  );
}
