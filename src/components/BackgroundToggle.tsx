import { useState } from "react";
import { Sparkles, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "azera-bg-mode";

export type BgMode = "animated" | "solid";

interface BackgroundToggleProps {
  mode: BgMode;
  onToggle: (mode: BgMode) => void;
}

export function useBackgroundMode(): [BgMode, (m: BgMode) => void] {
  const [mode, setMode] = useState<BgMode>(
    () => (localStorage.getItem(STORAGE_KEY) as BgMode) || "animated"
  );

  const toggle = (m: BgMode) => {
    localStorage.setItem(STORAGE_KEY, m);
    setMode(m);
  };

  return [mode, toggle];
}

export default function BackgroundToggle({ mode, onToggle }: BackgroundToggleProps) {
  const isAnimated = mode === "animated";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onToggle(isAnimated ? "solid" : "animated")}
      className="relative overflow-hidden rounded-full h-10 w-10"
      title={isAnimated ? "Fundo sólido" : "Fundo animado"}
    >
      {isAnimated ? (
        <Sparkles className="h-4 w-4" />
      ) : (
        <Square className="h-4 w-4" />
      )}
      <span className="sr-only">Alternar fundo</span>
    </Button>
  );
}
