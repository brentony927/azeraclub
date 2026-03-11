import { useState } from "react";
import { Lock, Check, ChevronDown, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { PROFILE_BACKGROUNDS, ProfileBackground } from "@/lib/profileBackgrounds";

interface Props {
  currentBackground: string;
  founderScore: number;
  onSelect: (key: string) => void;
}

export default function ProfileBackgroundPicker({ currentBackground, founderScore, onSelect }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(currentBackground);
  const [saving, setSaving] = useState(false);

  const handleApply = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from("profile_backgrounds" as any)
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("profile_backgrounds" as any)
          .update({ active_background: selected, updated_at: new Date().toISOString() } as any)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("profile_backgrounds" as any)
          .insert({ user_id: user.id, active_background: selected } as any);
      }
      onSelect(selected);
      toast.success("Fundo aplicado!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    }
    setSaving(false);
  };

  const tiers = [
    { label: "Básico", range: [0, 10] },
    { label: "Avançado", range: [11, 25] },
    { label: "Animados", range: [26, 40] },
    { label: "Metálicos", range: [41, 60] },
    { label: "Premium", range: [61, 80] },
    { label: "Ultra", range: [81, 100] },
  ];

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-secondary/30 transition-colors pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Fundos de Perfil
                <Badge variant="secondary" className="text-[10px]">{PROFILE_BACKGROUNDS.filter(b => founderScore >= b.minScore).length}/{PROFILE_BACKGROUNDS.length}</Badge>
              </span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* None option */}
            <button
              onClick={() => setSelected("none")}
              className={`w-full h-10 rounded-lg border-2 transition-all flex items-center justify-center text-xs text-muted-foreground ${
                selected === "none" ? "border-primary bg-secondary/50" : "border-border/50 hover:border-border"
              }`}
            >
              {selected === "none" && <Check className="h-3 w-3 mr-1 text-primary" />}
              Sem fundo
            </button>

            {tiers.map(tier => {
              const backgrounds = PROFILE_BACKGROUNDS.filter(
                b => b.minScore >= tier.range[0] && b.minScore <= tier.range[1]
              );
              if (backgrounds.length === 0) return null;

              return (
                <div key={tier.label}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{tier.label}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {backgrounds.map(bg => {
                      const unlocked = founderScore >= bg.minScore;
                      const isSelected = selected === bg.key;

                      return (
                        <button
                          key={bg.key}
                          onClick={() => unlocked && setSelected(bg.key)}
                          disabled={!unlocked}
                          className={`relative h-12 rounded-lg border-2 transition-all overflow-hidden group ${
                            isSelected
                              ? "border-primary ring-1 ring-primary/30"
                              : unlocked
                              ? "border-border/50 hover:border-border"
                              : "border-border/20 opacity-50 cursor-not-allowed"
                          }`}
                          title={unlocked ? bg.name : `Score ${bg.minScore} necessário`}
                        >
                          <div
                            className={`absolute inset-0 ${bg.animation || ""}`}
                            style={{
                              background: bg.css,
                              backgroundSize: bg.animation ? "400% 400%" : undefined,
                            }}
                          />
                          {!unlocked && (
                            <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center">
                              <Lock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-[8px] text-muted-foreground">{bg.minScore}</span>
                            </div>
                          )}
                          {isSelected && unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="h-4 w-4 text-white drop-shadow-lg" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {selected !== currentBackground && (
              <Button
                onClick={handleApply}
                disabled={saving}
                className="w-full h-10 text-xs font-semibold"
                size="sm"
              >
                {saving ? "Salvando..." : "Aplicar Fundo"}
              </Button>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
