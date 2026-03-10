import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { Users, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const STAGES = ["Ideia", "MVP", "Tração", "Escala", "Expansão"];
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function StrategicPartners() {
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("MVP");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const find = async () => {
    if (!industry.trim()) return;
    setIsLoading(true); setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { toast.error("Faça login."); return; }
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          featureId: "strategic-partners",
          messages: [
            { role: "system", content: `You are a strategic business advisor. Based on the industry and business stage, suggest potential strategic partner profiles.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título principal
- Use ## para cada perfil de parceiro estratégico
- Use ### para sub-seções: O Que Trazem, Modelo de Parceria, Como Abordar
- Use **negrito** para tipos de parceiros e termos-chave
- Use > blockquote para dicas de abordagem e insights estratégicos
- Use tabela resumo (Tipo de Parceiro | Valor Agregado | Modelo | Prioridade)
- Use --- entre cada perfil de parceiro
- No final, adicione "📚 Fontes e Referências" com metodologias de parcerias estratégicas
- Escreva em Português (BR) elegante e profissional` },
            { role: "user", content: `Indústria: ${industry}. Estágio: ${stage}. Encontre parceiros estratégicos.` },
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
    } catch { toast.error("Erro ao buscar parceiros"); } finally { setIsLoading(false); }
  };

  return (
    <FeatureLock minTier="business" featureName="Descoberta de Parceiros Estratégicos">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Parceiros Estratégicos</h1>
          <p className="text-muted-foreground text-sm mt-1">Encontre parceiros estratégicos ideais para o seu negócio</p>
        </motion.div>
        <motion.div variants={item} className="flex gap-3">
          <Input placeholder="A sua indústria" value={industry} onChange={(e) => setIndustry(e.target.value)} className="flex-1" />
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
          <Button onClick={find} disabled={isLoading || !industry.trim()} className="gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Encontrar Parceiros
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
