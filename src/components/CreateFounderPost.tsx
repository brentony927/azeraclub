import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, Loader2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  onPostCreated: () => void;
}

export default function CreateFounderPost({ onPostCreated }: Props) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
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
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} disabled={files.length >= 4}>
            <ImagePlus className="h-4 w-4 mr-1" /> Foto
          </Button>
          <span className="text-[10px] text-muted-foreground">{content.length}/1000</span>
        </div>
        <Button size="sm" onClick={handleSubmit} disabled={saving || !content.trim()}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1" /> Publicar</>}
        </Button>
      </div>
    </div>
  );
}
