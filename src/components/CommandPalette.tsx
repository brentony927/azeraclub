import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Brain, CalendarDays, Radar, Users, Target, Lightbulb,
  BarChart3, Briefcase, Heart, Plane, Building2, BookOpen,
  Flame, Trophy, Search,
} from "lucide-react";

const routes = [
  { label: "AZERA IA", url: "/ia", icon: Brain, group: "Principal" },
  { label: "Agenda", url: "/agenda", icon: CalendarDays, group: "Principal" },
  { label: "Dashboard", url: "/dashboard", icon: Target, group: "Principal" },
  { label: "Perfil", url: "/perfil", icon: Users, group: "Principal" },
  { label: "Radar de Oportunidades", url: "/radar-oportunidades", icon: Radar, group: "Ferramentas" },
  { label: "Radar de Tendências", url: "/radar-tendencias", icon: BarChart3, group: "Ferramentas" },
  { label: "Ideias Vault", url: "/ideias", icon: Lightbulb, group: "Ferramentas" },
  { label: "Objetivos", url: "/objetivos", icon: Target, group: "Ferramentas" },
  { label: "Desafios", url: "/desafios", icon: Flame, group: "Ferramentas" },
  { label: "Diário", url: "/diario", icon: BookOpen, group: "Ferramentas" },
  { label: "Experiências", url: "/experiencias", icon: Heart, group: "Lifestyle" },
  { label: "Viagens", url: "/viagens", icon: Plane, group: "Lifestyle" },
  { label: "Propriedades", url: "/propriedades", icon: Building2, group: "Lifestyle" },
  { label: "Founder Match", url: "/founder-match", icon: Briefcase, group: "Founders" },
  { label: "Venture Builder", url: "/venture-builder", icon: Trophy, group: "Founders" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (url: string) => {
      setOpen(false);
      navigate(url);
    },
    [navigate]
  );

  const groups = [...new Set(routes.map((r) => r.group))];

  return (
    <>
      {/* Subtle trigger hint in header */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 bg-card/50 text-muted-foreground text-xs hover:bg-accent/50 transition-colors"
      >
        <Search className="h-3 w-3" />
        <span>Buscar...</span>
        <kbd className="ml-2 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border border-border/50">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar página, ferramenta ou ação..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group} heading={group}>
              {routes
                .filter((r) => r.group === group)
                .map((r) => (
                  <CommandItem key={r.url} onSelect={() => handleSelect(r.url)} className="gap-3 cursor-pointer">
                    <r.icon className="h-4 w-4 text-primary" />
                    <span>{r.label}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
