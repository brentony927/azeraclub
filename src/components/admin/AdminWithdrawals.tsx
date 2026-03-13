import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  requested_at: string | null;
  processed_at: string | null;
  notes: string | null;
  userName?: string;
}

export default function AdminWithdrawals() {
  const { user } = useAuth();
  const [items, setItems] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await (supabase.from as any)("affiliate_withdrawals").select("*").order("requested_at", { ascending: false });
    if (!data || data.length === 0) { setItems([]); setLoading(false); return; }

    const userIds = [...new Set(data.map((d: any) => d.user_id))];
    const { data: profiles } = await supabase.from("founder_profiles").select("user_id, name").in("user_id", userIds as string[]);
    const nameMap = new Map((profiles || []).map(p => [p.user_id, p.name]));

    setItems(data.map((d: any) => ({ ...d, userName: nameMap.get(d.user_id) || "?" })));
    setLoading(false);
  };

  const handleAction = async (id: string, status: "approved" | "paid" | "rejected") => {
    setActionLoading(id);
    await (supabase.from as any)("affiliate_withdrawals").update({
      status,
      processed_at: new Date().toISOString(),
    }).eq("id", id);

    if (user) {
      await (supabase.from as any)("admin_logs").insert({
        actor_id: user.id,
        action: `withdrawal_${status}`,
        target_type: "withdrawal",
        target_id: id,
      });
    }

    toast.success(`Saque ${status === "approved" ? "aprovado" : status === "paid" ? "marcado como pago" : "rejeitado"}`);
    loadData();
    setActionLoading(null);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "pending": return "outline";
      case "approved": return "secondary";
      case "paid": return "default";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Saques de Afiliados</h1>
        <p className="text-sm text-muted-foreground">{items.filter(i => i.status === "pending").length} pendentes</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : items.length === 0 ? (
        <Card><CardContent className="p-6 text-center text-muted-foreground">Sem pedidos de saque</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Afiliado</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">{w.userName}</TableCell>
                    <TableCell>£{w.amount}</TableCell>
                    <TableCell><Badge variant={statusColor(w.status) as any}>{w.status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {w.requested_at ? new Date(w.requested_at).toLocaleDateString("pt-BR") : "—"}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {w.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleAction(w.id, "approved")} disabled={actionLoading === w.id}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Aprovar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleAction(w.id, "rejected")} disabled={actionLoading === w.id}>
                            <XCircle className="h-3 w-3 mr-1" /> Rejeitar
                          </Button>
                        </>
                      )}
                      {w.status === "approved" && (
                        <Button size="sm" onClick={() => handleAction(w.id, "paid")} disabled={actionLoading === w.id}>
                          Marcar Pago
                        </Button>
                      )}
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
