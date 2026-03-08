import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { Radar, Loader2, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const AREAS = ["Tecnologia", "Marketing", "Finanças", "Saúde", "Educação", "E-commerce", "Startups", "Investimentos"];
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function OpportunityRadar() {
  const [city, setCity] = useState("");
  const [area, setArea] = useState("Tecnologia");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const search = async () => {
    if (!city.trim()) { toast.error("Informe sua cidade"); return; }
    setIsLoading(true); setResult(null);
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
          newsQuery: `${area} ${city}`,
          messages: [
            { role: "system", content: `Você é um jornalista de negócios e analista de oportunidades. Escreva um artigo editorial sobre oportunidades na área de ${area} na cidade de ${city}.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título impactante
- Use ## para cada oportunidade ou seção temática
- Use **negrito** para nomes, dados e métricas
- Use > blockquote para insights estratégicos e recomendações
- Use tabela resumo (Oportunidade | Setor | Potencial | Urgência)
- Use --- entre seções
- Prefira parágrafos narrativos longos com análise aprofundada
- No final, adicione "📚 Fontes e Referências" com fontes consultadas
- Escreva entre 500-800 palavras em Português (BR) elegante e profissional` },
            { role: "user", content: `Escreva um artigo sobre oportunidades em ${area} para ${city}.` },
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
    } catch { toast.error("Erro ao buscar oportunidades"); } finally { setIsLoading(false); }
  };

  return (
    <FeatureLock minTier="pro" featureName="Radar de Oportunidades">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Radar de Oportunidades</h1>
          <p className="text-muted-foreground text-sm mt-1">Descubra eventos, investimentos e conexões na sua região</p>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block"><MapPin className="h-3 w-3 inline mr-1" />Cidade</label>
                  <Input placeholder="São Paulo, Rio de Janeiro..." value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="w-48">
                  <label className="text-xs text-muted-foreground mb-1 block"><Briefcase className="h-3 w-3 inline mr-1" />Área</label>
                  <Select value={area} onValueChange={setArea}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={search} disabled={isLoading} className="w-full gap-2">
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Buscando...</> : <><Radar className="h-4 w-4" /> Buscar Oportunidades</>}
              </Button>
            </CardContent>
          </Card>
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
