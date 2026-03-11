import { useState, useRef } from "react";
import { Lock, Check, ChevronDown, Palette, Upload, ImageIcon, Film } from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
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
  isOwner?: boolean;
  earnedBadgesCount?: number;
}

export default function ProfileBackgroundPicker({ currentBackground, founderScore, onSelect, isOwner, earnedBadgesCount = 0 }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(currentBackground);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUploadCustom = isOwner || earnedBadgesCount >= 25;

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

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande (máx 10MB)");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido. Use JPG, PNG, WebP, MP4 ou WebM.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/bg-custom.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-bg-media")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("profile-bg-media")
        .getPublicUrl(path);

      const customKey = `custom:${urlData.publicUrl}?t=${Date.now()}`;
      setSelected(customKey);

      // Auto-save
      const { data: existing } = await supabase
        .from("profile_backgrounds" as any)
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("profile_backgrounds" as any)
          .update({ active_background: customKey, updated_at: new Date().toISOString() } as any)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("profile_backgrounds" as any)
          .insert({ user_id: user.id, active_background: customKey } as any);
      }
      onSelect(customKey);
      toast.success("Fundo personalizado aplicado!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar arquivo");
    }
    setUploading(false);
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
                <Icon3D icon={Palette} color="blue" size="xs" animated />
                Fundos de Perfil
                <Badge variant="secondary" className="text-[10px]">{PROFILE_BACKGROUNDS.filter(b => isOwner || founderScore >= b.minScore).length}/{PROFILE_BACKGROUNDS.length}</Badge>
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
                      const unlocked = isOwner || founderScore >= bg.minScore;
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

            {/* Custom media upload section */}
            {canUploadCustom ? (
              <div className="border-t border-border/30 pt-4">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                  <Icon3D icon={ImageIcon} color="gold" size="xs" animated /> Fundo Personalizado
                </p>
                <p className="text-[10px] text-muted-foreground mb-3">Envie uma imagem ou vídeo (loop) como fundo do seu perfil.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                  className="hidden"
                  onChange={handleCustomUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      Enviar Imagem ou Vídeo
                    </>
                  )}
                </Button>
                {selected.startsWith("custom:") && (
                  <p className="text-[10px] text-primary mt-2 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Fundo personalizado ativo
                  </p>
                )}
              </div>
            ) : (
              <div className="border-t border-border/30 pt-4">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Desbloqueie 25+ insígnias para usar foto/vídeo como fundo
                </p>
              </div>
            )}

            {selected !== currentBackground && !selected.startsWith("custom:") && (
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
