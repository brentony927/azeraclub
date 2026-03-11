import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Loader2, CheckCircle, XCircle, Users, Instagram, Youtube, Twitter,
  ChevronDown, MessageSquare, Eye, Ban, Power, PowerOff, Trash2,
  TrendingUp, DollarSign, UserCheck, BarChart3,
} from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import OwnerModPanel from "@/components/OwnerModPanel";
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

interface AffiliateProfile {
  user_id: string;
  affiliate_id: string;
  commission_rate: number | null;
  level: string | null;
  enabled: boolean | null;
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean | null;
  created_at: string | null;
}

interface AffiliateStats {
  leads: number;
  conversions: number;
  totalCommission: number;
  pendingCommission: number;
}

export default function AffiliateManagerPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [pendingRequests, setPendingRequests] = useState<AffiliateRequest[]>([]);
  const [activeAffiliates, setActiveAffiliates] = useState<(AffiliateProfile & { name: string; avatar_url: string | null })[]>([]);
  const [historyRequests, setHistoryRequests] = useState<AffiliateRequest[]>([]);
  const [statsMap, setStatsMap] = useState<Record<string, AffiliateStats>>({});
  const [expandedStats, setExpandedStats] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    // Load all requests
    const { data: allRequests } = await supabase
      .from("affiliate_requests")
      .select("*")
      .order("created_at", { ascending: false });

    const requests = (allRequests || []) as AffiliateRequest[];
    setPendingRequests(requests.filter(r => r.status === "pending"));
    setHistoryRequests(requests.filter(r => ["rejected", "deleted"].includes(r.status)));

    // Load active affiliate profiles
    const { data: profiles } = await supabase
      .from("affiliate_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profiles && profiles.length > 0) {
      const userIds = profiles.map(p => p.user_id);
      const { data: founderProfiles } = await supabase
        .from("founder_profiles")
        .select("user_id, name, avatar_url")
        .in("user_id", userIds);

      const fpMap = new Map((founderProfiles || []).map(fp => [fp.user_id, fp]));

      setActiveAffiliates(profiles.map(p => ({
        ...p,
        name: fpMap.get(p.user_id)?.name || "Afiliado",
        avatar_url: fpMap.get(p.user_id)?.avatar_url || null,
      })));

      // Load stats for all affiliates
      const affiliateIds = profiles.map(p => p.affiliate_id);

      const [{ data: leads }, { data: commissions }] = await Promise.all([
        supabase.from("affiliate_leads").select("*").in("referrer_id", affiliateIds),
        supabase.from("affiliate_commissions").select("*").in("affiliate_id", affiliateIds),
      ]);

      const stats: Record<string, AffiliateStats> = {};
      for (const p of profiles) {
        const aLeads = (leads || []).filter(l => l.referrer_id === p.affiliate_id);
        const aComms = (commissions || []).filter(c => c.affiliate_id === p.affiliate_id);
        stats[p.user_id] = {
          leads: aLeads.length,
          conversions: aLeads.filter(l => l.purchased_at).length,
          totalCommission: aComms.reduce((sum, c) => sum + Number(c.amount), 0),
          pendingCommission: aComms.filter(c => c.status === "pending").reduce((sum, c) => sum + Number(c.amount), 0),
        };
      }
      setStatsMap(stats);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (open && !loading && pendingRequests.length === 0 && activeAffiliates.length === 0 && historyRequests.length === 0) {
      loadData();
    }
  }, [open]);

  const handleApproveReject = async (requestId: string, action: "approved" | "rejected") => {
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
      await loadData();
    } catch (err: any) {
      toast.error("Erro: " + (err.message || "Tente novamente"));
    }
    setActionLoading(null);
  };

  const handleManage = async (userId: string, action: "disable" | "enable" | "delete") => {
    if (!user) return;
    setActionLoading(userId);
    try {
      const { data: session } = await supabase.auth.getSession();
      const { error } = await supabase.functions.invoke("manage-affiliate", {
        body: { user_id: userId, action },
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });
      if (error) throw error;
      const msgs = { disable: "Afiliado desativado", enable: "Afiliado reativado", delete: "Afiliado excluído" };
      toast.success(msgs[action]);
      await loadData();
    } catch (err: any) {
      toast.error("Erro: " + (err.message || "Tente novamente"));
    }
    setActionLoading(null);
  };

  const totalPending = pendingRequests.length;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm mb-6">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors rounded-t-lg">
            <div className="flex items-center gap-2">
              <Icon3D icon={Users} color="gold" size="sm" animated />
              <span className="font-semibold text-foreground text-sm">Gerenciar Afiliados</span>
              {totalPending > 0 && (
                <Badge className="text-[10px]">{totalPending} pendente{totalPending > 1 ? "s" : ""}</Badge>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="pending" className="text-xs">
                    Pendentes {totalPending > 0 && `(${totalPending})`}
                  </TabsTrigger>
                  <TabsTrigger value="active" className="text-xs">
                    Ativos ({activeAffiliates.length})
                  </TabsTrigger>
                  <TabsTrigger value="history" className="text-xs">
                    Histórico ({historyRequests.length})
                  </TabsTrigger>
                </TabsList>

                {/* PENDING TAB */}
                <TabsContent value="pending" className="space-y-3">
                  {pendingRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma solicitação pendente.</p>
                  ) : (
                    pendingRequests.map((req) => (
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
                          {req.audience && <Badge variant="outline" className="text-[10px] shrink-0">{req.audience}</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                          {req.instagram && <span className="flex items-center gap-1"><Instagram className="h-3 w-3" />{req.instagram}</span>}
                          {req.tiktok && <span className="flex items-center gap-1">TikTok: {req.tiktok}</span>}
                          {req.youtube && <span className="flex items-center gap-1"><Youtube className="h-3 w-3" />{req.youtube}</span>}
                          {req.twitter && <span className="flex items-center gap-1"><Twitter className="h-3 w-3" />{req.twitter}</span>}
                        </div>
                        {req.strategy && (
                          <p className="text-xs text-muted-foreground bg-secondary/30 rounded p-2">
                            <strong className="text-foreground">Estratégia:</strong> {req.strategy}
                          </p>
                        )}
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" onClick={() => handleApproveReject(req.id, "approved")} disabled={actionLoading === req.id} className="flex-1 h-9 text-xs gap-1">
                            {actionLoading === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                            Aprovar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleApproveReject(req.id, "rejected")} disabled={actionLoading === req.id} className="flex-1 h-9 text-xs gap-1">
                            <XCircle className="h-3 w-3" /> Recusar
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                {/* ACTIVE TAB */}
                <TabsContent value="active" className="space-y-3">
                  {activeAffiliates.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum afiliado ativo.</p>
                  ) : (
                    activeAffiliates.map((aff) => {
                      const stats = statsMap[aff.user_id] || { leads: 0, conversions: 0, totalCommission: 0, pendingCommission: 0 };
                      const isExpanded = expandedStats === aff.user_id;

                      return (
                        <div key={aff.user_id} className="rounded-lg border border-border/50 p-4 space-y-3 bg-secondary/20">
                          <div className="flex items-center gap-3">
                            {aff.avatar_url ? (
                              <img src={aff.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover border border-border/50" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                                {aff.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-foreground text-sm truncate">{aff.name}</p>
                                <Badge variant="outline" className="text-[10px]">{aff.level}</Badge>
                                {!aff.enabled && <Badge variant="destructive" className="text-[10px]">Desativado</Badge>}
                                {aff.stripe_onboarding_complete && <Badge variant="secondary" className="text-[10px]">Stripe ✓</Badge>}
                              </div>
                              <p className="text-[10px] text-muted-foreground">
                                @{aff.affiliate_id} · Taxa: {((aff.commission_rate || 0) * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>

                          {/* Quick stats */}
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { icon: UserCheck, label: "Leads", value: stats.leads },
                              { icon: TrendingUp, label: "Conversões", value: stats.conversions },
                              { icon: DollarSign, label: "Total", value: `R$${stats.totalCommission.toFixed(0)}` },
                              { icon: BarChart3, label: "Pendente", value: `R$${stats.pendingCommission.toFixed(0)}` },
                            ].map(s => (
                              <div key={s.label} className="flex flex-col items-center p-2 rounded bg-secondary/40 text-center">
                                <s.icon className="h-3 w-3 text-primary mb-0.5" />
                                <span className="text-xs font-bold text-foreground">{s.value}</span>
                                <span className="text-[9px] text-muted-foreground">{s.label}</span>
                              </div>
                            ))}
                          </div>

                          {/* Expanded details */}
                          {isExpanded && (
                            <div className="rounded bg-secondary/30 p-3 space-y-2 text-xs text-muted-foreground">
                              <p><strong className="text-foreground">Stripe ID:</strong> {aff.stripe_account_id || "Não conectado"}</p>
                              <p><strong className="text-foreground">Onboarding:</strong> {aff.stripe_onboarding_complete ? "Completo" : "Pendente"}</p>
                              {aff.created_at && <p><strong className="text-foreground">Desde:</strong> {format(new Date(aff.created_at), "dd/MM/yyyy")}</p>}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => setExpandedStats(isExpanded ? null : aff.user_id)}>
                              <Eye className="h-3 w-3" /> {isExpanded ? "Ocultar" : "Detalhes"}
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => navigate(`/founder-messages?user=${aff.user_id}`)}>
                              <MessageSquare className="h-3 w-3" /> Conversar
                            </Button>
                            {aff.enabled ? (
                              <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
                                onClick={() => handleManage(aff.user_id, "disable")} disabled={actionLoading === aff.user_id}>
                                {actionLoading === aff.user_id ? <Loader2 className="h-3 w-3 animate-spin" /> : <PowerOff className="h-3 w-3" />}
                                Desativar
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="h-8 text-xs gap-1 text-green-500 border-green-500/30 hover:bg-green-500/10"
                                onClick={() => handleManage(aff.user_id, "enable")} disabled={actionLoading === aff.user_id}>
                                {actionLoading === aff.user_id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Power className="h-3 w-3" />}
                                Reativar
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" className="h-8 text-xs gap-1"
                              onClick={() => handleManage(aff.user_id, "delete")} disabled={actionLoading === aff.user_id}>
                              {actionLoading === aff.user_id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                              Excluir
                            </Button>
                            <OwnerModPanel targetUserId={aff.user_id} targetName={aff.name} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </TabsContent>

                {/* HISTORY TAB */}
                <TabsContent value="history" className="space-y-3">
                  {historyRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum registro no histórico.</p>
                  ) : (
                    historyRequests.map((req) => (
                      <div key={req.id} className="rounded-lg border border-border/50 p-3 bg-secondary/10 opacity-70">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground text-sm">{req.full_name}</p>
                            {req.created_at && (
                              <p className="text-[10px] text-muted-foreground">
                                {format(new Date(req.created_at), "dd/MM/yyyy")}
                              </p>
                            )}
                          </div>
                          <Badge variant={req.status === "rejected" ? "destructive" : "secondary"} className="text-[10px]">
                            {req.status === "rejected" ? "Recusado" : req.status === "deleted" ? "Excluído" : req.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
