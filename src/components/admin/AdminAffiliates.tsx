import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, CheckCircle, XCircle, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface AffReq {
  id: string;
  user_id: string;
  full_name: string;
  instagram: string | null;
  status: string;
  created_at: string | null;
}

interface AffProfile {
  user_id: string;
  affiliate_id: string;
  commission_rate: number | null;
  level: string | null;
  enabled: boolean | null;
  name?: string;
}

export default function AdminAffiliates() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pending, setPending] = useState<AffReq[]>([]);
  const [active, setActive] = useState<AffProfile[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [reqRes, profRes] = await Promise.all([
      supabase.from("affiliate_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("affiliate_profiles").select("*").eq("enabled", true),
    ]);

    const reqs = (reqRes.data || []) as AffReq[];
    setPending(reqs.filter(r => r.status === "pending"));

    const profiles = (profRes.data || []) as AffProfile[];
    if (profiles.length > 0) {
      const ids = profiles.map(p => p.user_id);
      const { data: names } = await supabase.from("founder_profiles").select("user_id, name").in("user_id", ids);
      const nameMap = new Map((names || []).map(n => [n.user_id, n.name]));
      setActive(profiles.map(p => ({ ...p, name: nameMap.get(p.user_id) || "—" })));
    }
    setLoading(false);
  };

  const handleApprove = async (req: AffReq) => {
    setActionLoading(req.id);
    const { error } = await supabase.functions.invoke("approve-affiliate", {
      body: { requestId: req.id, userId: req.user_id },
    });
    if (error) toast.error("Erro ao aprovar");
    else { toast.success("Afiliado aprovado"); loadData(); }
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    await supabase.from("affiliate_requests").update({ status: "rejected" }).eq("id", id);
    toast.success("Rejeitado");
    loadData();
    setActionLoading(null);
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Afiliados</h1>
        <p className="text-sm text-muted-foreground">{active.length} ativos · {pending.length} pendentes</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pendentes ({pending.length})</TabsTrigger>
          <TabsTrigger value="active">Ativos ({active.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pending.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">Sem pedidos pendentes</CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Instagram</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.full_name}</TableCell>
                        <TableCell>{r.instagram || "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString("pt-BR") : "—"}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" onClick={() => handleApprove(r)} disabled={actionLoading === r.id}>
                            {actionLoading === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                            Aprovar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleReject(r.id)} disabled={actionLoading === r.id}>
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

        <TabsContent value="active">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>Comissão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {active.map((a) => (
                    <TableRow key={a.affiliate_id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs font-mono">{a.affiliate_id}</TableCell>
                      <TableCell><Badge variant="outline">{a.level || "starter"}</Badge></TableCell>
                      <TableCell>{((a.commission_rate || 0.25) * 100).toFixed(0)}%</TableCell>
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
