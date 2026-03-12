import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

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

export default function AdminSuggestions() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pending, setPending] = useState<Suggestion[]>([]);
  const [reviewed, setReviewed] = useState<Suggestion[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
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
      const enriched = suggestions.map(s => ({ ...s, authorName: nameMap.get(s.user_id) || "Usuário" }));
      setPending(enriched.filter(s => s.status === "pendente"));
      setReviewed(enriched.filter(s => ["implementado", "recusado"].includes(s.status)));
    }
    setLoading(false);
  };

  const handleAction = async (id: string, userId: string, newStatus: "implementado" | "recusado") => {
    setActionLoading(id);
    const { error } = await supabase.from("suggestions").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Erro"); setActionLoading(null); return; }

    if (newStatus === "implementado") {
      // Award score via badge
      await supabase.from("user_badges").upsert(
        { user_id: userId, badge_key: "fertile_mind" },
        { onConflict: "user_id,badge_key" }
      );
    }
    toast.success(newStatus === "implementado" ? "Aprovada!" : "Rejeitada");
    loadData();
    setActionLoading(null);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sugestões</h1>
        <p className="text-sm text-muted-foreground">{pending.length} pendentes</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pendentes ({pending.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Revisadas ({reviewed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pending.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">Sem sugestões pendentes</CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Autor</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.authorName}</TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">{s.title}</TableCell>
                        <TableCell><Badge variant="outline">{s.category}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" onClick={() => handleAction(s.id, s.user_id, "implementado")} disabled={actionLoading === s.id}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Aprovar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleAction(s.id, s.user_id, "recusado")} disabled={actionLoading === s.id}>
                            <XCircle className="h-3 w-3 mr-1" /> Rejeitar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviewed">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Autor</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewed.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.authorName}</TableCell>
                      <TableCell className="font-medium">{s.title}</TableCell>
                      <TableCell>
                        <Badge variant={s.status === "implementado" ? "default" : "destructive"}>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
