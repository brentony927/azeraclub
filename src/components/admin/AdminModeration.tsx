import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Ban, CheckCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  details: string | null;
  created_at: string;
  reporterName?: string;
  reportedName?: string;
}

export default function AdminModeration() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from("user_reports").select("*").order("created_at", { ascending: false }).limit(100);
    if (!data) { setLoading(false); return; }

    const allIds = [...new Set([...data.map(d => d.reporter_id), ...data.map(d => d.reported_user_id)])];
    const { data: profiles } = await supabase.from("founder_profiles").select("user_id, name").in("user_id", allIds);
    const nameMap = new Map((profiles || []).map(p => [p.user_id, p.name]));

    setReports(data.map(d => ({
      ...d,
      reporterName: nameMap.get(d.reporter_id) || "?",
      reportedName: nameMap.get(d.reported_user_id) || "?",
    })));
    setLoading(false);
  };

  const handleBan = async (userId: string) => {
    if (!user) return;
    setActionLoading(userId);
    await supabase.from("user_moderation").insert({
      user_id: userId,
      moderator_id: user.id,
      action: "ban",
      reason: "Banido via moderação Azera OS",
    });
    toast.success("Utilizador banido");
    setActionLoading(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Moderação</h1>
        <p className="text-sm text-muted-foreground">{reports.length} denúncias</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : reports.length === 0 ? (
        <Card><CardContent className="p-6 text-center text-muted-foreground">Sem denúncias</CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Denunciante</TableHead>
                  <TableHead>Denunciado</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.reporterName}</TableCell>
                    <TableCell className="font-medium">{r.reportedName}</TableCell>
                    <TableCell><Badge variant="outline">{r.reason}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBan(r.reported_user_id)}
                        disabled={actionLoading === r.reported_user_id}
                      >
                        {actionLoading === r.reported_user_id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Ban className="h-3 w-3 mr-1" />}
                        Banir
                      </Button>
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
