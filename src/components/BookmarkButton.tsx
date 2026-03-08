import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  itemType: "founder" | "venture" | "opportunity" | "trend";
  itemId: string;
  className?: string;
  size?: number;
}

export default function BookmarkButton({ itemType, itemId, className, size = 16 }: BookmarkButtonProps) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_type", itemType)
      .eq("item_id", itemId)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, itemType, itemId]);

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || loading) return;
    setLoading(true);
    try {
      if (saved) {
        await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("item_type", itemType).eq("item_id", itemId);
        setSaved(false);
        toast.success("Removido dos salvos");
      } else {
        await supabase.from("bookmarks").insert({ user_id: user.id, item_type: itemType, item_id: itemId });
        setSaved(true);
        toast.success("Salvo com sucesso");
      }
    } catch { toast.error("Erro ao salvar"); }
    setLoading(false);
  };

  return (
    <button onClick={toggle} className={cn("transition-colors", className)} title={saved ? "Remover dos salvos" : "Salvar"}>
      <Star className={cn("transition-all", saved ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400")} style={{ width: size, height: size }} />
    </button>
  );
}
