import AIArticleRenderer from "@/components/AIArticleRenderer";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket } from "lucide-react";

interface Props {
  roadmap: string | null;
  onBuildWithAI: () => void;
  aiLoading: boolean;
}

export default function VentureRoadmapTab({ roadmap, onBuildWithAI, aiLoading }: Props) {
  if (!roadmap) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground">Nenhum roadmap gerado. Clique para gerar com IA.</p>
        <Button onClick={onBuildWithAI} disabled={aiLoading}>
          {aiLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
          Construir com IA
        </Button>
      </div>
    );
  }

  // Parse roadmap into phases for timeline visualization
  const phases = roadmap.split(/(?=#{1,3}\s)/).filter(s => s.trim());

  return (
    <div className="space-y-6">
      {/* Timeline visualization */}
      <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-primary/20">
        {phases.slice(0, 12).map((phase, i) => {
          const titleMatch = phase.match(/^#{1,3}\s*(.+)/);
          const title = titleMatch ? titleMatch[1].trim() : `Fase ${i + 1}`;
          const body = titleMatch ? phase.slice(titleMatch[0].length).trim() : phase.trim();
          return (
            <div key={i} className="relative">
              <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">{i + 1}</span>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-4">
                <h4 className="text-sm font-semibold text-foreground mb-1">{title}</h4>
                {body && <p className="text-xs text-muted-foreground line-clamp-4">{body.slice(0, 300)}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full AI content */}
      <details className="group">
        <summary className="cursor-pointer text-sm text-primary hover:underline">Ver roadmap completo</summary>
        <div className="mt-4">
          <AIArticleRenderer content={roadmap} />
        </div>
      </details>
    </div>
  );
}
