import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface SubRow {
  user_id: string;
  plan: string;
  updated_at: string;
  name: string;
}

export default function AdminSubscriptions() {
  const { user } = useAuth();
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadSubs(); }, []);

  const loadSubs = async () => {
    const { data: plans } = await supabase
      .from("user_plans")
      .select("user_id, plan, updated_at")
      .order("updated_at", { ascending: false });

    if (!plans) { setLoading(false); return; }

    const userIds = plans.map(p => p.user_id);
    const { data: profiles } = await supabase
      .from("founder_profiles")
      .select("user_id, name")
      .in("user_id", userIds);

    const nameMap = new Map((profiles || []).map(p => [p.user_id, p.name]));

    setSubs(plans.map(p => ({
      ...p,
      name: nameMap.get(p.user_id) || "Sem perfil",
    })));
    setLoading(false);
  };

  const logAction = async (action: string, targetId: string, details?: any) => {
    if (!user) return;
    await (supabase.from as any)("admin_logs").insert({
      actor_id: user.id,
      action,
      target_type: "subscription",
      target_id: targetId,
      details: details || {},
    });
  };

  const handleRemovePlan = async (userId: string) => {
    setActionLoading(userId);
    await supabase.from("user_plans").delete().eq("user_id", userId);
    toast.success("Plano removido");
    await logAction("remove_plan", userId);
    loadSubs();
    setActionLoading(null);
  };

  const handleChangePlan = async (userId: string, newPlan: string) => {
    setActionLoading(userId);
    await supabase.from("user_plans").update({ plan: newPlan }).eq("user_id", userId);
    toast.success(`Plano alterado para ${newPlan}`);
    await logAction("change_plan", userId, { plan: newPlan });
    loadSubs();
    setActionLoading(null);
  };

  const proCount = subs.filter(s => s.plan === "pro").length;
  const businessCount = subs.filter(s => s.plan === "business").length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assinaturas</h1>
        <p className="text-sm text-muted-foreground">{subs.length} planos atribuídos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pro</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{proCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Business</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{businessCount}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Pagantes</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{proCount + businessCount}</div></CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs.map((s) => (
                  <TableRow key={s.user_id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <Select defaultValue={s.plan} onValueChange={(v) => handleChangePlan(s.user_id, v)}>
                        <SelectTrigger className="h-7 w-[100px] text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(s.updated_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={actionLoading === s.user_id}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover plano de {s.name}?</AlertDialogTitle>
                            <AlertDialogDescription>O utilizador voltará ao plano Free.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemovePlan(s.user_id)}>Remover</AlertDialogAction>
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
