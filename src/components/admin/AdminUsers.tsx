import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Search, Ban, Eye, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UserRow {
  user_id: string;
  name: string;
  country: string | null;
  reputation_score: number | null;
  is_verified: boolean | null;
  is_site_owner: boolean;
  plan: string;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    const { data: founders } = await supabase
      .from("founder_profiles")
      .select("user_id, name, country, reputation_score, is_verified, is_site_owner")
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

  const handleBan = async (targetUserId: string) => {
    if (!user) return;
    setActionLoading(targetUserId);
    const { error } = await supabase.from("user_moderation").insert({
      user_id: targetUserId,
      moderator_id: user.id,
      action: "ban",
      reason: "Banido via Azera OS",
    });
    if (error) toast.error("Erro ao banir utilizador");
    else toast.success("Utilizador banido");
    setActionLoading(null);
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || u.plan === planFilter;
    return matchSearch && matchPlan;
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
          <Input
            placeholder="Pesquisar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
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
                      <Badge variant={u.plan === "business" ? "default" : u.plan === "pro" ? "secondary" : "outline"}>
                        {u.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>{u.reputation_score || 0}</TableCell>
                    <TableCell>
                      {u.is_site_owner && <Badge className="bg-primary/20 text-primary">Owner</Badge>}
                      {u.is_verified && <Badge variant="outline">Verificado</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      {!u.is_site_owner && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={actionLoading === u.user_id}>
                              {actionLoading === u.user_id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4 text-destructive" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Banir {u.name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação vai suspender a conta do utilizador imediatamente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleBan(u.user_id)}>Banir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
