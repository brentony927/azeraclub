import { Paperclip, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onSubmit?: (value: string) => void;
  suggestions?: string[];
}

export function HeroSection({ onSubmit, suggestions = [] }: HeroSectionProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border/30 bg-gradient-to-b from-primary/20 via-card/80 to-card p-8 md:p-12">
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="font-serif font-bold text-lg moss-text">AZR AI</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight">
          Central de Inteligência Artificial
        </h2>

        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Utilize agentes especializados para criar copies, estratégias de marketing e automatizar processos.
        </p>

        {/* Prompt area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.currentTarget.elements.namedItem("prompt") as HTMLInputElement);
            if (input?.value.trim() && onSubmit) {
              onSubmit(input.value.trim());
              input.value = "";
            }
          }}
          className="relative flex items-center bg-secondary/60 backdrop-blur border border-border/40 rounded-sm"
        >
          <button type="button" className="p-3 text-muted-foreground hover:text-foreground transition-colors">
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            name="prompt"
            placeholder="Digite seu prompt aqui..."
            className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="submit"
            className="p-3 text-muted-foreground hover:text-accent transition-colors"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </form>

        {/* Suggestion pills */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSubmit?.(s)}
                className="px-3 py-1.5 text-xs rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors bg-secondary/40"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
