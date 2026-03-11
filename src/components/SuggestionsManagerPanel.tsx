import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, CheckCircle, XCircle, ChevronDown, Lightbulb } from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import { toast } from "sonner";
import { format } from "date-fns";

interface Suggestion {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  created_at: string;
  authorName?: string;
}

export default function SuggestionsManagerPanel() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pending, setPending] = useState<Suggestion[]>([]);
  const [reviewed, setReviewed] = useState<Suggestion[]>([]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    const { data: suggestions } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    if (suggestions && suggestions.length > 0) {
      const userIds = [...new Set(suggestions.map(s => s.user_id))];
      const { data: profiles } = await supabase
        .from("founder_profiles")
        .select("user_id, name")
        .in("user_id", userIds);

      const nameMap = new Map((profiles || []).map(p => [p.user_id, p.name]));

      const enriched = suggestions.map(s => ({
        ...s,
        authorName: nameMap.get(s.user_id) || "Usuário",
      }));

      setPending(enriched.filter(s => s.status === "pendente"));
      setReviewed(enriched.filter(s => ["implementado", "recusado"].includes(s.status)));
    } else {
      setPending([]);
      setReviewed([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (open && !loading && pending.length === 0 && reviewed.length === 0) {
      loadData();
    }
  }, [open]);

  const handleAction = async (id: string, userId: string, newStatus: "implementado" | "recusado") => {
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from("suggestions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // If approved, recalculate badges for the suggestion author
      if (newStatus === "implementado") {
        const { data: session } = await supabase.auth.getSession();
        await supabase.functions.invoke("calculate-badges", {
          headers: { Authorization: `Bearer ${session.session?.access_token}` },
        });
      }

      toast.success(newStatus === "implementado" ? "Sugestão aprovada!" : "Sugestão recusada.");
      await loadData();
    } catch (err: any) {
      toast.error("Erro: " + (err.message || "Tente novamente"));
    }
    setActionLoading(null);
  };

  const categoryColors: Record<string, string> = {
    "UI/UX": "bg-blue-500/20 text-blue-400",
    "Funcionalidade": "bg-green-500/20 text-green-400",
    "Performance": "bg-orange-500/20 text-orange-400",
    "Segurança": "bg-red-500/20 text-red-400",
    "Outro": "bg-secondary text-muted-foreground",
  };

  const totalPending = pending.length;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors rounded-t-lg">
            <div className="flex items-center gap-2">
              <Icon3D icon={Lightbulb} color="green" size="sm" animated />
              <span className="font-semibold text-foreground text-sm">Caixa de Sugestões</span>
              {totalPending > 0 && (
                <Badge className="text-[10px]">{totalPending} pendente{totalPending > 1 ? "s" : ""}</Badge>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="pending" className="text-xs">
                    Pendentes {totalPending > 0 && `(${totalPending})`}
                  </TabsTrigger>
                  <TabsTrigger value="reviewed" className="text-xs">
                    Analisadas ({reviewed.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-3">
                  {pending.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma sugestão pendente.</p>
                  ) : (
                    pending.map((sug) => (
                      <div key={sug.id} className="rounded-lg border border-border/50 p-4 space-y-3 bg-secondary/20">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-foreground text-sm">{sug.title}</p>
                            <p className="text-[10px] text-muted-foreground">
                              por {sug.authorName} · {format(new Date(sug.created_at), "dd/MM/yyyy")}
                            </p>
                          </div>
                          <Badge className={`text-[10px] ${categoryColors[sug.category] || categoryColors["Outro"]}`}>
                            {sug.category}
                          </Badge>
                        </div>
                        {sug.description && (
                          <p className="text-xs text-muted-foreground bg-secondary/30 rounded p-2">{sug.description}</p>
                        )}
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" onClick={() => handleAction(sug.id, sug.user_id, "implementado")}
                            disabled={actionLoading === sug.id} className="flex-1 h-9 text-xs gap-1">
                            {actionLoading === sug.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                            Aprovar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleAction(sug.id, sug.user_id, "recusado")}
                            disabled={actionLoading === sug.id} className="flex-1 h-9 text-xs gap-1">
                            <XCircle className="h-3 w-3" /> Recusar
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="reviewed" className="space-y-3">
                  {reviewed.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma sugestão analisada.</p>
                  ) : (
                    reviewed.map((sug) => (
                      <div key={sug.id} className="rounded-lg border border-border/50 p-3 bg-secondary/10 opacity-70">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground text-sm">{sug.title}</p>
                            <p className="text-[10px] text-muted-foreground">por {sug.authorName}</p>
                          </div>
                          <Badge variant={sug.status === "implementado" ? "default" : "destructive"} className="text-[10px]">
                            {sug.status === "implementado" ? "Aprovada" : "Recusada"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
