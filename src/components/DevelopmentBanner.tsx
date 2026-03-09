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
    <div className="relative rounded-lg border-2 border-destructive bg-destructive/15 p-4 mb-4 dev-banner-pulse">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-md text-destructive hover:bg-destructive/20 transition-colors"
        aria-label="Fechar aviso"
      >
        <X className="w-4 h-4" />
      </button>
      <p className="text-sm font-bold text-destructive text-center pr-6">
        🚧 Este site ainda é apenas um projeto em desenvolvimento. Podem ocorrer erros e instabilidades.
      </p>
      <p className="text-xs text-destructive/80 text-center mt-1">
        Sua opinião é essencial! Deixe seu feedback, ideias e sugestões para nos ajudar a melhorar.
      </p>
      <div className="flex justify-center mt-2">
        <Button size="sm" variant="destructive" onClick={() => navigate("/sugestoes")} className="text-xs">
          💡 Deixar Feedback
        </Button>
      </div>
    </div>
  );
}
