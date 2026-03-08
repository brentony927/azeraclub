import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Loader2, ExternalLink, Lightbulb, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeatureLock from "@/components/FeatureLock";
import BookmarkButton from "@/components/BookmarkButton";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;
const CATEGORIES = ["AI", "Fintech", "SaaS", "E-commerce", "Web3", "HealthTech"];

type TrendResult = { title: string; summary: string; source: string; link: string; insight: string };
type SavedTrend = { id: string; title: string; summary: string | null; source: string | null; link: string | null; ai_insight: string | null; category: string | null; created_at: string };

export default function TrendScanner() {
  const { user } = useAuth();
  const [category, setCategory] = useState("AI");
  const [results, setResults] = useState<TrendResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<SavedTrend[]>([]);
  const [tab, setTab] = useState("scan");

  const fetchHistory = async () => {
    if (!user) return;
    const { data } = await supabase.from("trend_scans").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
    setHistory((data as SavedTrend[]) || []);
  };

  useEffect(() => { fetchHistory(); }, [user]);

  const scan = async () => {
    if (!user) return;
    setLoading(true);
    setResults([]);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          newsContext: true, newsQuery: `${category} startups trends 2026`,
          messages: [
            { role: "system", content: "Você é um analista de tendências. Analise as notícias fornecidas e retorne EXATAMENTE um JSON array com objetos {title, summary, source, link, insight}. O insight deve ser uma oportunidade de negócio concreta. Retorne APENAS o JSON, sem markdown." },
            { role: "user", content: `Analise as tendências mais recentes em ${category}. Para cada notícia relevante, gere um insight de oportunidade de negócio. Retorne JSON array.` }
          ],
        }),
      });
      let raw = "";
      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value).split("\n")) {
            if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
            try { raw += JSON.parse(line.slice(6)).choices?.[0]?.delta?.content || ""; } catch {}
          }
        }
      }
      // Extract JSON from response
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed: TrendResult[] = JSON.parse(jsonMatch[0]);
        setResults(parsed);
        // Save to DB
        for (const t of parsed) {
          await supabase.from("trend_scans").insert({
            user_id: user.id, title: t.title, summary: t.summary,
            source: t.source, link: t.link, ai_insight: t.insight, category,
          });
        }
        fetchHistory();
        toast.success(`${parsed.length} tendências encontradas!`);
      } else {
        toast.error("Formato inesperado da IA");
      }
    } catch { toast.error("Erro ao analisar tendências"); }
    setLoading(false);
  };

  return (
    <FeatureLock minTier="pro" featureName="AI Trend Scanner">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-primary" /> AI Trend Scanner
        </h1>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="scan"><TrendingUp className="h-3.5 w-3.5 mr-1" /> Scanner</TabsTrigger>
            <TabsTrigger value="history"><History className="h-3.5 w-3.5 mr-1" /> Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-4 mt-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <Button key={c} variant={category === c ? "default" : "outline"} size="sm" onClick={() => setCategory(c)}>{c}</Button>
              ))}
            </div>
            <Button onClick={scan} disabled={loading} className="w-full sm:w-auto">
              {loading ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Analisando...</> : <><TrendingUp className="h-4 w-4 mr-2" /> Scan Trends</>}
            </Button>

            <div className="grid gap-4 md:grid-cols-2">
              {results.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{r.title}</CardTitle>
                        <BookmarkButton itemType="trend" itemId={`${category}-${i}`} />
                      </div>
                      <p className="text-xs text-muted-foreground">{r.source}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-foreground">{r.summary}</p>
                      {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Ver fonte</a>}
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-1.5 mb-1"><Lightbulb className="h-3.5 w-3.5 text-yellow-500" /><span className="text-xs font-semibold text-foreground">Opportunity Insight</span></div>
                        <p className="text-sm text-foreground">{r.insight}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              {history.map(h => (
                <Card key={h.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{h.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {h.category && <Badge variant="secondary" className="text-xs">{h.category}</Badge>}
                          <span className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                      <BookmarkButton itemType="trend" itemId={h.id} size={14} />
                    </div>
                    {h.summary && <p className="text-xs text-muted-foreground mt-2">{h.summary}</p>}
                    {h.ai_insight && <p className="text-xs text-foreground mt-2 p-2 bg-primary/5 rounded">{h.ai_insight}</p>}
                  </CardContent>
                </Card>
              ))}
              {history.length === 0 && <p className="text-muted-foreground text-sm col-span-2 text-center py-8">Nenhuma tendência escaneada ainda.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FeatureLock>
  );
}
