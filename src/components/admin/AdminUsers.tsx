import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Search, Ban, Eye, UserMinus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import UserDeepProfile from "@/components/admin/UserDeepProfile";

interface UserRow {
  user_id: string;
  name: string;
  country: string | null;
  reputation_score: number | null;
  is_verified: boolean | null;
  is_site_owner: boolean;
  plan: string;
  created_at: string;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deepProfileUserId, setDeepProfileUserId] = useState<string | null>(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    const { data: founders } = await supabase
      .from("founder_profiles")
      .select("user_id, name, country, reputation_score, is_verified, is_site_owner, created_at")
      .order("created_at", { ascending: false });

    if (!founders) { setLoading(false); return; }

    const userIds = founders.map(f => f.user_id);
    const { data: plans } = await supabase
      .from("user_plans")
      .select("user_id, plan")
      .in("user_id", userIds);

    const planMap = new Map((plans || []).map(p => [p.user_id, p.plan]));

    setUsers(founders.map(f => ({
      ...f,
      plan: planMap.get(f.user_id) || "free",
    })));
    setLoading(false);
  };

  const logAction = async (action: string, targetId: string, details?: any) => {
    if (!user) return;
    await (supabase.from as any)("admin_logs").insert({
      actor_id: user.id,
      action,
      target_type: "user",
      target_id: targetId,
      details: details || {},
    });
  };

  const handleBan = async (targetUserId: string) => {
    if (!user) return;
    setActionLoading(targetUserId);
    const { error } = await supabase.from("user_moderation").insert({
      user_id: targetUserId,
      moderator_id: user.id,
      action: "ban",
      reason: "Banido via Azera OS",
    });
    if (error) toast.error("Erro ao banir");
    else {
      toast.success("Utilizador banido");
      await logAction("ban_user", targetUserId);
    }
    setActionLoading(null);
  };

  const handleSuspend = async (targetUserId: string) => {
    if (!user) return;
    setActionLoading(targetUserId);
    const { error } = await supabase.from("user_moderation").insert({
      user_id: targetUserId,
      moderator_id: user.id,
      action: "mute",
      reason: "Suspenso via Azera OS",
    });
    if (error) toast.error("Erro ao suspender");
    else {
      toast.success("Utilizador suspenso");
      await logAction("suspend_user", targetUserId);
    }
    setActionLoading(null);
  };

  const handleResetScore = async (targetUserId: string) => {
    setActionLoading(targetUserId);
    await supabase.from("founder_profiles").update({ reputation_score: 0 }).eq("user_id", targetUserId);
    toast.success("Score resetado");
    await logAction("reset_score", targetUserId);
    loadUsers();
    setActionLoading(null);
  };

  const handleChangePlan = async (targetUserId: string, newPlan: string) => {
    setActionLoading(targetUserId);
    if (newPlan === "free") {
      await supabase.from("user_plans").delete().eq("user_id", targetUserId);
    } else {
      const { data: existing } = await supabase.from("user_plans").select("id").eq("user_id", targetUserId).maybeSingle();
      if (existing) {
        await supabase.from("user_plans").update({ plan: newPlan }).eq("user_id", targetUserId);
      } else {
        await supabase.from("user_plans").insert({ user_id: targetUserId, plan: newPlan });
      }
    }
    toast.success(`Plano alterado para ${newPlan}`);
    await logAction("change_plan", targetUserId, { plan: newPlan });
    loadUsers();
    setActionLoading(null);
  };

  const countries = [...new Set(users.map(u => u.country).filter(Boolean))] as string[];

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || u.plan === planFilter;
    const matchCountry = countryFilter === "all" || u.country === countryFilter;
    return matchSearch && matchPlan && matchCountry;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
        <p className="text-sm text-muted-foreground">{users.length} registrados</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Pesquisar por nome..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="País" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
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
                  <TableHead>País</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 100).map((u) => (
                  <TableRow key={u.user_id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.country || "—"}</TableCell>
                    <TableCell>
                      <Select defaultValue={u.plan} onValueChange={(v) => handleChangePlan(u.user_id, v)} disabled={u.is_site_owner}>
                        <SelectTrigger className="h-7 w-[100px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{u.reputation_score || 0}</TableCell>
                    <TableCell>
                      {u.is_site_owner && <Badge className="bg-red-500/20 text-red-400 text-[10px]">Owner</Badge>}
                      {u.is_verified && <Badge variant="outline" className="text-[10px] ml-1">Verificado</Badge>}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeepProfileUserId(u.user_id)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {!u.is_site_owner && (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleResetScore(u.user_id)} disabled={actionLoading === u.user_id}>
                            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSuspend(u.user_id)} disabled={actionLoading === u.user_id}>
                            <UserMinus className="h-3.5 w-3.5 text-yellow-500" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={actionLoading === u.user_id}>
                                {actionLoading === u.user_id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Ban className="h-3.5 w-3.5 text-destructive" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Banir {u.name}?</AlertDialogTitle>
                                <AlertDialogDescription>Esta ação vai suspender a conta imediatamente.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBan(u.user_id)}>Banir</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {deepProfileUserId && (
        <UserDeepProfile userId={deepProfileUserId} onClose={() => setDeepProfileUserId(null)} />
      )}
    </div>
  );
}
