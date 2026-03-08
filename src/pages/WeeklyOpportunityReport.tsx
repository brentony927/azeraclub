import { useState } from "react";
import { FileText, Download, Share2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import FeatureLock from "@/components/FeatureLock";
import AIArticleRenderer from "@/components/AIArticleRenderer";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azera-ai`;

export default function WeeklyOpportunityReport() {
  const { user } = useAuth();
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!user) return;
    setLoading(true);
    setReport(null);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          includeContext: true, newsContext: true, newsQuery: "startup opportunities trends business 2026",
          messages: [
            { role: "system", content: "Você é um consultor estratégico do AZERA CLUB. Gere um relatório semanal de oportunidades." },
            { role: "user", content: `Gere o AZERA CLUB Weekly Opportunities Report com as seguintes seções em markdown:\n\n# AZERA CLUB — Weekly Opportunities Report\n\n## 🆕 Novos Founders na Comunidade\n(com base no contexto do app)\n\n## 📈 Indústrias em Alta\n(baseado em tendências reais)\n\n## 💡 Ideias de Startup da Semana\n(sugestões criativas)\n\n## 🎯 Radar de Oportunidades\n(oportunidades concretas)\n\n## 🤝 Conexões Recomendadas\n(baseado no perfil do usuário)\n\nSeja específico e use dados reais quando possível.` }
          ],
        }),
      });
      let text = "";
      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder.decode(value).split("\n")) {
            if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
            try { text += JSON.parse(line.slice(6)).choices?.[0]?.delta?.content || ""; } catch {}
          }
        }
      }
      setReport(text);
      toast.success("Relatório gerado!");
    } catch { toast.error("Erro ao gerar relatório"); }
    setLoading(false);
  };

  const download = () => window.print();
  const share = () => {
    if (report) { navigator.clipboard.writeText(report); toast.success("Relatório copiado!"); }
  };

  return (
    <FeatureLock minTier="pro" featureName="Relatório Semanal">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2"><FileText className="h-7 w-7 text-primary" /> Relatório Semanal</h1>
            <p className="text-muted-foreground text-sm mt-1">Relatório semanal de oportunidades gerado por IA</p>
          </div>
          <div className="flex gap-2">
            {report && (
              <>
                <Button variant="outline" onClick={download}><Download className="h-4 w-4 mr-2" /> Baixar PDF</Button>
                <Button variant="outline" onClick={share}><Share2 className="h-4 w-4 mr-2" /> Compartilhar</Button>
              </>
            )}
            <Button onClick={generate} disabled={loading}>
              {loading ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Gerando...</> : "Gerar Relatório"}
            </Button>
          </div>
        </div>

        {report ? (
          <div className="print:p-8"><AIArticleRenderer content={report} /></div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Clique em "Gerar Relatório" para gerar seu relatório semanal personalizado</p>
          </div>
        )}
      </div>
    </FeatureLock>
  );
}
