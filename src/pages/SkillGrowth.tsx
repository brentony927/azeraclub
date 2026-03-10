import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { GraduationCap, Loader2, Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function SkillGrowth() {
  const { user } = useAuth();
  const [skill, setSkill] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (!skill.trim()) return;
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
          featureId: "skill-growth",
          messages: [
            { role: "system", content: `You are a skill development coach. Create a detailed weekly learning plan for the skill the user wants to develop. Structure it in weeks (Week 1, Week 2, etc.) with specific daily activities, resources, and milestones. Plan should cover 4-8 weeks.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título principal
- Use ## para cada seção/semana com subtítulos claros
- Use ### para sub-seções
- Use **negrito** para termos-chave e conceitos importantes
- Use *itálico* para nomes de ferramentas, livros ou recursos
- Use > blockquote para dicas importantes ou insights estratégicos
- Use tabelas para comparações, cronogramas ou métricas
- Use --- entre seções principais
- Use listas ordenadas (1. 2. 3.) para passos sequenciais
- Use listas com bullet points para itens não-sequenciais
- No final, adicione uma seção "📚 Fontes e Referências" com as fontes de onde as informações foram baseadas
- Escreva em Português (BR) elegante e profissional` },
            { role: "user", content: `Crie um plano de desenvolvimento para a habilidade: ${skill}` },
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
    const { error } = await (supabase.from("skill_plans" as any).insert as any)({ user_id: user.id, skill: skill.trim(), plan_content: result });
    if (error) toast.error("Erro ao salvar"); else toast.success("Plano salvo!");
  };

  return (
    <FeatureLock minTier="pro" featureName="Plano de Crescimento">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Plano de Crescimento</h1>
          <p className="text-muted-foreground text-sm mt-1">Desenvolva as suas competências de forma estratégica</p>
        </motion.div>
        <motion.div variants={item} className="flex gap-3">
          <Input placeholder="Qual competência deseja desenvolver?" value={skill} onChange={(e) => setSkill(e.target.value)} className="flex-1" />
          <Button onClick={generate} disabled={isLoading || !skill.trim()} className="gap-2">
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando...</> : <><Sparkles className="h-4 w-4" /> Gerar Plano de Aprendizado</>}
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
