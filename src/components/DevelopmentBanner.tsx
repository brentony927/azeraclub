import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "dev-banner-dismissed";

export default function DevelopmentBanner() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(STORAGE_KEY) === "true");
  const navigate = useNavigate();

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  return (
    <div className="relative rounded-lg border border-border/30 bg-card/40 backdrop-blur-sm p-3 mb-4">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground/40 hover:text-foreground transition-colors"
        aria-label="Fechar aviso"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="flex items-center gap-3 pr-6">
        <div className="w-1 h-8 rounded-full bg-amber-500/40 shrink-0" />
        <div>
          <p className="text-xs font-medium text-foreground/70">
            Projeto em desenvolvimento — podem ocorrer erros e instabilidades.
          </p>
          <button
            onClick={() => navigate("/sugestoes")}
            className="text-[11px] text-muted-foreground/40 hover:text-foreground transition-colors mt-0.5 font-medium tracking-wide"
          >
            Deixar feedback →
          </button>
        </div>
      </div>
    </div>
  );
}
