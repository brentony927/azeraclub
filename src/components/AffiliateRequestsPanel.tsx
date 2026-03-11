import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Users, Instagram, Youtube, Twitter } from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import { toast } from "sonner";
import { format } from "date-fns";

interface AffiliateRequest {
  id: string;
  user_id: string;
  full_name: string;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  twitter: string | null;
  audience: string | null;
  strategy: string | null;
  status: string;
  created_at: string | null;
}

export default function AffiliateRequestsPanel() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<AffiliateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("affiliate_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRequests(data as AffiliateRequest[]);
    }
    setLoading(false);
  };

  const handleAction = async (requestId: string, action: "approved" | "rejected") => {
    if (!user) return;
    setActionLoading(requestId);
    try {
      const { data: session } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke("approve-affiliate", {
        body: { request_id: requestId, action },
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });
      if (error) throw error;
      toast.success(action === "approved" ? "Afiliado aprovado!" : "Solicitação recusada.");
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err: any) {
      toast.error("Erro: " + (err.message || "Tente novamente"));
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-6">
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/80 backdrop-blur-sm mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon3D icon={Users} color="gold" size="sm" animated />
          Solicitações de Afiliação
          {requests.length > 0 && (
            <Badge className="ml-auto text-[10px]">{requests.length} pendente{requests.length > 1 ? "s" : ""}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma solicitação pendente.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="rounded-lg border border-border/50 p-4 space-y-3 bg-secondary/20">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground text-sm">{req.full_name}</p>
                  {req.created_at && (
                    <p className="text-[10px] text-muted-foreground">
                      Solicitado em {format(new Date(req.created_at), "dd/MM/yyyy")}
                    </p>
                  )}
                </div>
                {req.audience && (
                  <Badge variant="outline" className="text-[10px] shrink-0">{req.audience}</Badge>
                )}
              </div>

              {/* Social links */}
              <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                {req.instagram && (
                  <span className="flex items-center gap-1"><Instagram className="h-3 w-3" />{req.instagram}</span>
                )}
                {req.tiktok && (
                  <span className="flex items-center gap-1">TikTok: {req.tiktok}</span>
                )}
                {req.youtube && (
                  <span className="flex items-center gap-1"><Youtube className="h-3 w-3" />{req.youtube}</span>
                )}
                {req.twitter && (
                  <span className="flex items-center gap-1"><Twitter className="h-3 w-3" />{req.twitter}</span>
                )}
              </div>

              {req.strategy && (
                <p className="text-xs text-muted-foreground bg-secondary/30 rounded p-2">
                  <strong className="text-foreground">Estratégia:</strong> {req.strategy}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={() => handleAction(req.id, "approved")}
                  disabled={actionLoading === req.id}
                  className="flex-1 h-9 text-xs gap-1"
                >
                  {actionLoading === req.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3 w-3" />
                  )}
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleAction(req.id, "rejected")}
                  disabled={actionLoading === req.id}
                  className="flex-1 h-9 text-xs gap-1"
                >
                  <XCircle className="h-3 w-3" /> Recusar
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
