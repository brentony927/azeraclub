import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Suggestion {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  created_at: string;
}

const categories = [
  { value: "ui_ux", label: "UI/UX" },
  { value: "funcionalidade", label: "Funcionalidade" },
  { value: "performance", label: "Performance" },
  { value: "outro", label: "Outro" },
];

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  analisando: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  implementado: "bg-green-500/20 text-green-400 border-green-500/30",
  recusado: "bg-red-500/20 text-red-400 border-red-500/30",
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Suggestions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("funcionalidade");
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("suggestions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setSuggestions(data as Suggestion[]);
  };

  useEffect(() => {
    fetchSuggestions();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("suggestions").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      category,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao enviar sugestão", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sugestão enviada!", description: "Obrigado pelo seu feedback." });
      setTitle("");
      setDescription("");
      setCategory("funcionalidade");
      fetchSuggestions();
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl mx-auto space-y-8">
      <motion.div variants={item} className="space-y-1">
        <div className="flex items-center gap-3">
          <MessageSquarePlus className="h-7 w-7 text-accent" />
          <h1 className="text-3xl font-serif font-bold">Caixa de Sugestões</h1>
        </div>
        <p className="text-muted-foreground text-sm">Ajude-nos a melhorar o Azera Club. Cada ideia conta!</p>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Nova Sugestão</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Título da sugestão *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                required
              />
              <Textarea
                placeholder="Descreva sua ideia em detalhes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={4}
              />
              <div className="flex items-center gap-3">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={loading || !title.trim()} className="ml-auto">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Enviar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {suggestions.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h2 className="text-lg font-semibold">Suas Sugestões</h2>
          {suggestions.map((s) => (
            <Card key={s.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{s.title}</p>
                    {s.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">
                        {categories.find((c) => c.value === s.category)?.label || s.category}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${statusColors[s.status] || ""}`}>
                    {s.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
