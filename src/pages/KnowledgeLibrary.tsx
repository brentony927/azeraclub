import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Play, Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;

const CATEGORIES = [
  { id: "negocios", label: "💼 Negócios", prompt: "Pesquise e resuma as 5 notícias mais relevantes de hoje sobre negócios, empreendedorismo e economia no Brasil e no mundo. Use como referência o tipo de conteúdo publicado pelo G1 Economia. Para cada notícia: título, resumo de 2-3 linhas, e um insight acionável para empreendedores." },
  { id: "networking", label: "🤝 Networking", prompt: "Pesquise e resuma as 5 notícias e tendências mais relevantes de hoje sobre networking, eventos corporativos, conferências e conexões profissionais. Inclua dicas práticas de como usar cada tendência para construir relacionamentos valiosos." },
  { id: "tecnologia", label: "🖥️ Tecnologia", prompt: "Pesquise e resuma as 5 notícias mais relevantes de hoje sobre tecnologia, startups, inteligência artificial e inovação. Use como referência o tipo de conteúdo do G1 Tecnologia. Para cada notícia: título, resumo e impacto prático." },
  { id: "mentalidade", label: "🧠 Mentalidade", prompt: "Pesquise e crie um conteúdo com as 5 lições mais relevantes de hoje sobre mentalidade de alta performance, psicologia do sucesso e crescimento pessoal. Baseie-se em notícias recentes, estudos e tendências atuais." },
  { id: "produtividade", label: "⚡ Produtividade", prompt: "Pesquise e resuma as 5 tendências e notícias mais relevantes de hoje sobre produtividade, gestão de tempo, trabalho remoto e métodos de trabalho. Inclua técnicas práticas que o leitor pode aplicar imediatamente." },
  { id: "financas", label: "💰 Finanças", prompt: "Pesquise e resuma as 5 notícias mais relevantes de hoje sobre finanças pessoais, investimentos, mercado financeiro e criptomoedas no Brasil e no mundo. Use como referência o tipo de conteúdo do G1 Economia. Para cada: título, resumo e recomendação prática." },
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
      const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `Você é um curador de notícias de alto nível e analista estratégico. Hoje é ${today}. Crie conteúdo baseado nas notícias e tendências MAIS RECENTES e RELEVANTES do dia. Formate com markdown: headers, bullets, bold. Use emojis para destacar. Mantenha em 600-900 palavras. Inclua uma seção "🎯 Insight do Dia" no final com uma reflexão estratégica.` },
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
          Notícias diárias mais relevantes sobre cada tema
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
                <p className="text-xs text-muted-foreground">Notícias do dia + insights</p>
              </div>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {isLoading && (
        <motion.div variants={item} className="flex flex-col items-center justify-center py-12 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Buscando notícias mais recentes...</p>
        </motion.div>
      )}

      {content && (
        <motion.div variants={item}>
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
