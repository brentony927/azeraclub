import { useState } from "react";
import { motion } from "framer-motion";
import FeatureLock from "@/components/FeatureLock";
import { BookMarked, Loader2, Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AIArticleRenderer from "@/components/AIArticleRenderer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const CATEGORIES = [
  { id: "business", label: "Estratégia de Negócios", prompt: "estratégia de negócios avançada" },
  { id: "investing", label: "Investimentos", prompt: "estratégias avançadas de investimento" },
  { id: "leadership", label: "Liderança", prompt: "liderança e gestão de alto nível" },
  { id: "innovation", label: "Inovação", prompt: "inovação e disrupção de mercado" },
  { id: "wealth", label: "Construção de Riqueza", prompt: "construção de riqueza e patrimônio" },
];
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function EliteLibrary() {
  const { user } = useAuth();
  const [content, setContent] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const load = async (cat: typeof CATEGORIES[0]) => {
    setIsLoading(true); setContent(null); setSelectedCat(cat.id);
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
            { role: "system", content: `You are an elite business educator. Write a deep, insightful article about ${cat.prompt}. Include frameworks, case studies, and actionable takeaways. 600-1000 words.

FORMATTING RULES (OBRIGATÓRIO):
- Use # para título principal
- Use ## para cada seção temática
- Use ### para frameworks e estudos de caso
- Use **negrito** para conceitos-chave e nomes
- Use > blockquote para lições-chave e takeaways
- Use tabela quando aplicável (Framework | Aplicação | Impacto)
- Use --- entre seções
- No final, adicione "📚 Fontes e Referências" com livros, artigos e autores citados
- Escreva em Português (BR) elegante e profissional` },
            { role: "user", content: `Escreva um artigo aprofundado sobre ${cat.prompt}.` },
          ],
        }),
      });
      if (!resp.ok || !resp.body) throw new Error("AI error");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "", c = "";
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
          try { const p = JSON.parse(json); const ch = p.choices?.[0]?.delta?.content; if (ch) { c += ch; setContent(c); } } catch {}
        }
      }
    } catch { toast.error("Erro ao carregar conteúdo"); } finally { setIsLoading(false); }
  };

  const saveInsight = async () => {
    if (!user || !content || !selectedCat) return;
    const title = content.split("\n").find(l => l.startsWith("#"))?.replace(/^#+\s*/, "") || "Insight";
    const { error } = await (supabase.from("saved_insights" as any).insert as any)({ user_id: user.id, title, content, category: selectedCat });
    if (error) toast.error("Erro ao salvar"); else toast.success("Insight salvo!");
  };

  return (
    <FeatureLock minTier="business" featureName="Biblioteca de Conhecimento Elite">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={item}>
          <h1 className="text-3xl font-serif font-bold">Biblioteca Elite</h1>
          <p className="text-muted-foreground text-sm mt-1">Conhecimento aprofundado para mentes de elite</p>
        </motion.div>
        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map(cat => (
            <Card key={cat.id} className={`cursor-pointer hover:border-primary/30 transition-colors ${selectedCat === cat.id ? "border-primary/50" : ""}`} onClick={() => load(cat)}>
              <CardContent className="p-4 text-center">
                <BookMarked className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs font-medium">{cat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
        {isLoading && <motion.div variants={item} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></motion.div>}
        {content && (
          <motion.div variants={item}>
            <AIArticleRenderer content={content} />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={saveInsight} className="gap-2"><Save className="h-4 w-4" /> Salvar Insight</Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </FeatureLock>
  );
}
