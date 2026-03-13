import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, TrendingUp, CreditCard } from "lucide-react";

interface PaymentStats {
  proCount: number;
  businessCount: number;
  totalPaying: number;
  commissionsPending: number;
  commissionsPaid: number;
}

export default function AdminPayments() {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [proRes, businessRes, pendingComm, paidComm, commissionsRes] = await Promise.all([
      supabase.from("user_plans").select("id", { count: "exact", head: true }).eq("plan", "pro"),
      supabase.from("user_plans").select("id", { count: "exact", head: true }).eq("plan", "business"),
      supabase.from("affiliate_commissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("affiliate_commissions").select("id", { count: "exact", head: true }).eq("status", "paid"),
      supabase.from("affiliate_commissions").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

    const pro = proRes.count || 0;
    const biz = businessRes.count || 0;

    setStats({
      proCount: pro,
      businessCount: biz,
      totalPaying: pro + biz,
      commissionsPending: pendingComm.count || 0,
      commissionsPaid: paidComm.count || 0,
    });
    setCommissions(commissionsRes.data || []);
    setLoading(false);
  };

  if (loading || !stats) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  // Estimated revenue based on plans
  const estimatedMonthly = (stats.proCount * 19) + (stats.businessCount * 49);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pagamentos</h1>
        <p className="text-sm text-muted-foreground">Visão geral financeira</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Receita Estimada/Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">£{estimatedMonthly}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Assinantes</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.totalPaying}</div><p className="text-xs text-muted-foreground">{stats.proCount} Pro · {stats.businessCount} Business</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Comissões Pendentes</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.commissionsPending}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Comissões Pagas</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.commissionsPaid}</div></CardContent>
        </Card>
      </div>

      {commissions.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Últimas Comissões</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Afiliado ID</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.affiliate_id}</TableCell>
                    <TableCell>£{c.amount}</TableCell>
                    <TableCell><Badge variant={c.status === "paid" ? "default" : "outline"}>{c.status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "—"}</TableCell>
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
