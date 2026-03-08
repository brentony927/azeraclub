import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;

const CATEGORIES = [
  { id: "negocios", label: "💼 Negócios", prompt: "Escreva um artigo editorial sobre as notícias mais relevantes de hoje no mundo dos negócios, empreendedorismo e economia. Use estilo jornalístico com parágrafos narrativos, subtítulos claros e análise aprofundada. Inclua contexto e insights estratégicos para empreendedores. Escreva entre 600-900 palavras." },
  { id: "networking", label: "🤝 Networking", prompt: "Escreva um artigo editorial sobre as tendências mais relevantes de hoje em networking, eventos corporativos e conexões profissionais. Use estilo jornalístico com parágrafos narrativos e análise aprofundada. Inclua dicas práticas integradas naturalmente no texto. Escreva entre 600-900 palavras." },
  { id: "tecnologia", label: "🖥️ Tecnologia", prompt: "Escreva um artigo editorial sobre as notícias mais relevantes de hoje em tecnologia, startups e inteligência artificial. Use estilo jornalístico com parágrafos narrativos, subtítulos claros e impacto prático. Escreva entre 600-900 palavras." },
  { id: "mentalidade", label: "🧠 Mentalidade", prompt: "Escreva um artigo editorial sobre lições de mentalidade de alta performance, psicologia do sucesso e crescimento pessoal baseado em tendências e notícias atuais. Use estilo jornalístico narrativo. Escreva entre 600-900 palavras." },
  { id: "produtividade", label: "⚡ Produtividade", prompt: "Escreva um artigo editorial sobre as tendências mais relevantes de hoje em produtividade, gestão de tempo e métodos de trabalho. Use estilo jornalístico com parágrafos narrativos e técnicas práticas. Escreva entre 600-900 palavras." },
  { id: "financas", label: "💰 Finanças", prompt: "Escreva um artigo editorial sobre as notícias mais relevantes de hoje em finanças pessoais, investimentos e mercado financeiro. Use estilo jornalístico com parágrafos narrativos, análise e recomendações. Escreva entre 600-900 palavras." },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function KnowledgeLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadContent = async (cat: typeof CATEGORIES[0]) => {
    setSelectedCategory(cat.id);
    setIsLoading(true);
    setContent(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { toast.error("Faça login para usar esta funcionalidade."); setIsLoading(false); return; }
      const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          newsContext: true,
          newsQuery: cat.label.split(" ").slice(1).join(" "),
          messages: [
            { role: "system", content: `Você é um jornalista e curador editorial de alto nível. Hoje é ${today}. Escreva um artigo editorial baseado nas notícias e tendências mais recentes. Use estilo jornalístico profissional: título impactante, subtítulos (##) claros, parágrafos longos e bem escritos, análise aprofundada. Evite listas com bullet points — prefira texto narrativo. Inclua uma seção final "🎯 Insight do Dia" com uma reflexão estratégica. Formate em markdown. Escreva entre 600-900 palavras.` },
            { role: "user", content: cat.prompt },
          ],
        }),
      });
      if (!resp.ok || !resp.body) throw new Error("AI error");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "", result = "";
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
          try { const p = JSON.parse(json); const c = p.choices?.[0]?.delta?.content; if (c) { result += c; setContent(result); } } catch {}
        }
      }
    } catch {
      toast.error("Erro ao carregar conteúdo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-serif font-bold">Biblioteca de Conhecimento</h1>
        <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
          <Newspaper className="h-4 w-4" />
          Artigos editoriais diários sobre cada tema
        </p>
      </motion.div>

      <motion.div variants={item} className="grid sm:grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => (
          <Card
            key={cat.id}
            className={`cursor-pointer transition-all hover:border-primary/20 ${selectedCategory === cat.id ? "border-primary/30 bg-primary/5" : ""}`}
            onClick={() => loadContent(cat)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <span className="text-2xl">{cat.label.split(" ")[0]}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{cat.label.split(" ").slice(1).join(" ")}</p>
                <p className="text-xs text-muted-foreground">Artigo editorial do dia</p>
              </div>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {isLoading && (
        <motion.div variants={item} className="flex flex-col items-center justify-center py-12 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Preparando artigo editorial...</p>
        </motion.div>
      )}

      {content && (
        <motion.div variants={item}>
          <article className="glass-card p-8 sm:p-10">
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-p:text-foreground/80 prose-strong:text-foreground prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </article>
        </motion.div>
      )}
    </motion.div>
  );
}