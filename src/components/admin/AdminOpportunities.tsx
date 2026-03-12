import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface OppRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
  authorName?: string;
}

export default function AdminOpportunities() {
  const [opps, setOpps] = useState<OppRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from("founder_opportunities").select("*").order("created_at", { ascending: false }).limit(100);
    if (!data) { setLoading(false); return; }

    const ids = [...new Set(data.map(d => d.user_id))];
    const { data: profiles } = await supabase.from("founder_profiles").select("user_id, name").in("user_id", ids);
    const nameMap = new Map((profiles || []).map(p => [p.user_id, p.name]));

    setOpps(data.map(d => ({ ...d, authorName: nameMap.get(d.user_id) || "?" })));
    setLoading(false);
  };

  const handleRemove = async (id: string) => {
    await supabase.from("founder_opportunities").delete().eq("id", id);
    toast.success("Oportunidade removida");
    loadData();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Oportunidades</h1>
        <p className="text-sm text-muted-foreground">{opps.length} posts</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Autor</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opps.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>{o.authorName}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{o.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover oportunidade?</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação é irreversível.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemove(o.id)}>Remover</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
