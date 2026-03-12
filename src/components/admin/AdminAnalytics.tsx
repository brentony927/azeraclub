import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface FeatureUsage {
  name: string;
  count: number;
}

export default function AdminAnalytics() {
  const [features, setFeatures] = useState<FeatureUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const queries = [
      { name: "Founder Feed", table: "founder_posts" },
      { name: "Oportunidades", table: "founder_opportunities" },
      { name: "Conexões", table: "founder_connections" },
      { name: "Ventures", table: "ventures" },
      { name: "Mensagens", table: "founder_messages" },
      { name: "Diário", table: "journal_entries" },
      { name: "Ideias", table: "ideas" },
      { name: "Objetivos", table: "objectives" },
      { name: "Desafios", table: "challenges" },
      { name: "Hábitos", table: "habits" },
      { name: "Projetos", table: "projects" },
      { name: "IA Conversas", table: "ai_conversations" },
      { name: "Sugestões", table: "suggestions" },
    ] as const;

    const results = await Promise.all(
      queries.map(async (q) => {
        const { count } = await supabase.from(q.table).select("id", { count: "exact", head: true });
        return { name: q.name, count: count || 0 };
      })
    );

    setFeatures(results.sort((a, b) => b.count - a.count));
    setLoading(false);
  };

  const maxCount = Math.max(...features.map(f => f.count), 1);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Uso de features da plataforma</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="space-y-3">
          {features.map((f) => (
            <Card key={f.name}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{f.name}</span>
                  <span className="text-sm text-muted-foreground font-mono">{f.count}</span>
                </div>
                <Progress value={(f.count / maxCount) * 100} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
