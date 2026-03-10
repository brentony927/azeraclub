import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { Bell, Loader2, Sparkles, Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function OpportunityAlerts() {
  const { user } = useAuth();
  const [industries, setIndustries] = useState<string[]>([]);
  const [newIndustry, setNewIndustry] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await (supabase.from("opportunity_alerts" as any).select("industries") as any).eq("user_id", user.id).maybeSingle();
      if (data?.industries) setIndustries(data.industries);
    })();
  }, [user]);

  const addIndustry = () => {
    if (!newIndustry.trim() || industries.includes(newIndustry.trim())) return;
    const updated = [...industries, newIndustry.trim()];
    setIndustries(updated);
    setNewIndustry("");
    saveIndustries(updated);
  };

  const removeIndustry = (i: string) => {
    const updated = industries.filter(x => x !== i);
    setIndustries(updated);
    saveIndustries(updated);
  };

  const saveIndustries = async (list: string[]) => {
    if (!user) return;
    await (supabase.from("opportunity_alerts" as any).upsert as any)({ user_id: user.id, industries: list, active: true }, { onConflict: "user_id" });
  };

  const scanNow = async () => {
    if (industries.length === 0) { toast.error("Adicione pelo menos uma indústria."); return; }
    setIsLoading(true); setResult(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { toast.error("Faça login."); return; }
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          featureId: "opportunity-alerts",
          newsContext: true, newsQuery: industries.join(", "),
          messages: [
            { role: "system", content: `You are an opportunity scanner. Based on current news and the user's industries of interest, identify 5 strategic opportunities.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título principal
- Use ## para cada oportunidade identificada
- Use ### para sub-seções: Indústria, Tipo, Urgência, Análise
- Use **negrito** para nomes, urgência e métricas
- Use > blockquote para alertas de urgência e recomendações de ação
- Use tabela resumo (Oportunidade | Indústria | Tipo | Urgência | Ação Recomendada)
- Use --- entre cada oportunidade
- No final, adicione "📚 Fontes e Referências" com fontes de notícias consultadas
- Escreva em Português (BR) elegante e profissional` },
            { role: "user", content: `Escaneie oportunidades para: ${industries.join(", ")}` },
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
    } catch { toast.error("Erro ao escanear"); } finally { setIsLoading(false); }
  };

  return (
    <FeatureLock minTier="business" featureName="Alertas de Oportunidades">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Alertas de Oportunidades</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure indústrias e escaneie oportunidades</p>
        </motion.div>
        <motion.div variants={item}>
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">As suas Indústrias</p>
              <div className="flex flex-wrap gap-2">
                {industries.map(i => (
                  <Badge key={i} variant="secondary" className="gap-1">{i} <button onClick={() => removeIndustry(i)}><X className="h-3 w-3" /></button></Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Adicionar indústria..." value={newIndustry} onChange={(e) => setNewIndustry(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addIndustry()} className="flex-1" />
                <Button size="sm" variant="outline" onClick={addIndustry}><Plus className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Button onClick={scanNow} disabled={isLoading || industries.length === 0} className="gap-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Escaneando...</> : <><Sparkles className="h-4 w-4" /> Escanear Agora</>}
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
