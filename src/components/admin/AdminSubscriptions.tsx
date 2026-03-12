import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface SubRow {
  user_id: string;
  plan: string;
  updated_at: string;
  name: string;
}

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubs();
  }, []);

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs.map((s) => (
                  <TableRow key={s.user_id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>
                      <Badge variant={s.plan === "business" ? "default" : s.plan === "pro" ? "secondary" : "outline"}>
                        {s.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(s.updated_at).toLocaleDateString("pt-BR")}
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
