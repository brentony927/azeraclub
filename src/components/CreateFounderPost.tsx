import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagePlus, X, Loader2, Send, BookOpen, Lightbulb, Target, Trophy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  onPostCreated: () => void;
}

type ToolType = "journal" | "ideas" | "objectives" | "challenges";

interface ToolItem {
  id: string;
  title: string;
  description?: string | null;
  extra?: string;
}

const toolConfig: Record<ToolType, { icon: typeof BookOpen; label: string; tag: string; table: string }> = {
  journal: { icon: BookOpen, label: "Diário", tag: "[Diário]", table: "journal_entries" },
  ideas: { icon: Lightbulb, label: "Ideias", tag: "[Ideia]", table: "ideas" },
  objectives: { icon: Target, label: "Objetivos", tag: "[Objetivo]", table: "objectives" },
  challenges: { icon: Trophy, label: "Desafios", tag: "[Desafio]", table: "challenges" },
};

export default function CreateFounderPost({ onPostCreated }: Props) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [toolDialog, setToolDialog] = useState<ToolType | null>(null);
  const [toolItems, setToolItems] = useState<ToolItem[]>([]);
  const [loadingTool, setLoadingTool] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length + files.length > 4) {
      toast({ title: "Máximo 4 fotos", variant: "destructive" });
      return;
    }
    setFiles(prev => [...prev, ...selected]);
    setPreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
  };

  const removeFile = (i: number) => {
    URL.revokeObjectURL(previews[i]);
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  useEffect(() => {
    return () => { previews.forEach(p => URL.revokeObjectURL(p)); };
  }, []);

  const openToolDialog = async (type: ToolType) => {
    if (!user) return;
    setToolDialog(type);
    setLoadingTool(true);
    setToolItems([]);

    try {
      if (type === "journal") {
        const { data } = await supabase.from("journal_entries").select("id, content, mood, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
        setToolItems((data || []).map(d => ({
          id: d.id,
          title: d.content.slice(0, 80) + (d.content.length > 80 ? "…" : ""),
          description: d.mood ? `Humor: ${d.mood}` : null,
          extra: d.content,
        })));
      } else if (type === "ideas") {
        const { data } = await supabase.from("ideas").select("id, title, description, category, status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
        setToolItems((data || []).map(d => ({
          id: d.id,
          title: d.title,
          description: d.description,
          extra: d.category || undefined,
        })));
      } else if (type === "objectives") {
        const { data } = await supabase.from("objectives").select("id, title, progress, status, category").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
        setToolItems((data || []).map(d => ({
          id: d.id,
          title: d.title,
          description: `${d.progress || 0}% concluído — ${d.status || "ativo"}`,
          extra: d.category || undefined,
        })));
      } else if (type === "challenges") {
        const { data } = await supabase.from("challenges").select("id, title, description, current_day, duration_days, status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
        setToolItems((data || []).map(d => ({
          id: d.id,
          title: d.title,
          description: `Dia ${d.current_day || 0}/${d.duration_days || 7} — ${d.status || "ativo"}`,
        })));
      }
    } catch {
      toast({ title: "Erro ao carregar dados", variant: "destructive" });
    }
    setLoadingTool(false);
  };

  const selectToolItem = (item: ToolItem) => {
    if (!toolDialog) return;
    const cfg = toolConfig[toolDialog];
    let formatted = "";

    if (toolDialog === "journal") {
      formatted = `${cfg.tag} **Do meu Diário:**\n\n${item.extra || item.title}${item.description ? `\n\n${item.description}` : ""}`;
    } else if (toolDialog === "ideas") {
      formatted = `${cfg.tag} **Ideia: ${item.title}**${item.description ? `\n\n${item.description}` : ""}${item.extra ? `\n\nCategoria: ${item.extra}` : ""}`;
    } else if (toolDialog === "objectives") {
      formatted = `${cfg.tag} **Objetivo: ${item.title}**\n\n${item.description || ""}${item.extra ? `\n${item.extra}` : ""}`;
    } else if (toolDialog === "challenges") {
      formatted = `${cfg.tag} **Desafio: ${item.title}**\n\n${item.description || ""}`;
    }

    setContent(prev => prev ? `${prev}\n\n${formatted}` : formatted);
    setToolDialog(null);
    toast({ title: `${cfg.label} adicionado ao post! ✨` });
  };

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;
    setSaving(true);

    let media_urls: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("post-media").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("post-media").getPublicUrl(path);
        media_urls.push(data.publicUrl);
      }
    }

    const { error } = await supabase.from("founder_posts" as any).insert({
      user_id: user.id,
      content: content.trim(),
      media_urls,
    });

    setSaving(false);
    if (error) {
      toast({ title: "Erro ao publicar", description: error.message, variant: "destructive" });
    } else {
      setContent("");
      setFiles([]);
      setPreviews([]);
      onPostCreated();
      toast({ title: "Publicado! ✨" });
    }
  };

  return (
    <>
      <div className="bg-card/80 border border-border/50 rounded-xl p-4 backdrop-blur-sm space-y-3">
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Compartilhe uma experiência, insight ou conquista..."
          className="min-h-[80px] resize-none bg-transparent border-0 focus-visible:ring-0 p-0 text-sm"
          maxLength={1000}
        />
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previews.map((p, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                <img src={p} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeFile(i)}
                  className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-wrap">
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
            <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} disabled={files.length >= 4}>
              <ImagePlus className="h-4 w-4 mr-1" /> Foto
            </Button>
            {(Object.entries(toolConfig) as [ToolType, typeof toolConfig[ToolType]][]).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <Button key={key} variant="ghost" size="sm" onClick={() => openToolDialog(key)} className="text-xs">
                  <Icon className="h-4 w-4 mr-1" /> {cfg.label}
                </Button>
              );
            })}
            <span className="text-[10px] text-muted-foreground ml-1">{content.length}/1000</span>
          </div>
          <Button size="sm" onClick={handleSubmit} disabled={saving || !content.trim()}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1" /> Publicar</>}
          </Button>
        </div>
      </div>

      {/* Tool selection dialog */}
      <Dialog open={toolDialog !== null} onOpenChange={(open) => !open && setToolDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {toolDialog && (() => { const Icon = toolConfig[toolDialog].icon; return <Icon className="h-5 w-5" />; })()}
              Selecionar {toolDialog ? toolConfig[toolDialog].label : ""}
            </DialogTitle>
          </DialogHeader>
          {loadingTool ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : toolItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum item encontrado.</p>
          ) : (
            <ScrollArea className="max-h-[350px]">
              <div className="space-y-2">
                {toolItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => selectToolItem(item)}
                    className="w-full text-left p-3 rounded-lg border border-border/50 hover:bg-accent/50 hover:border-primary/30 transition-all"
                  >
                    <p className="text-sm font-medium text-foreground line-clamp-2">{item.title}</p>
                    {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
