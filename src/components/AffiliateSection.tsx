import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Copy, Check, Users, TrendingUp, Loader2, Gift,
  Lock, Clock, XCircle, BarChart3, DollarSign,
  Activity, Star, ExternalLink, CreditCard, CheckCircle, ChevronDown,
} from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import AnimatedCounter from "@/components/AnimatedCounter";
import { toast } from "sonner";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type AffiliateStatus = "none" | "pending" | "approved" | "rejected";

export default function AffiliateSection() {
  const { user } = useAuth();
  const { canAccess } = useSubscription();
  const [sectionOpen, setSectionOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<AffiliateStatus>("none");
  const [affiliateProfile, setAffiliateProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Application form
  const [formName, setFormName] = useState("");
  const [formInstagram, setFormInstagram] = useState("");
  const [formTiktok, setFormTiktok] = useState("");
  const [formYoutube, setFormYoutube] = useState("");
  const [formTwitter, setFormTwitter] = useState("");
  const [formAudience, setFormAudience] = useState("");
  const [formStrategy, setFormStrategy] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Stats
  const [leads, setLeads] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);

  // Stripe Connect
  const [connectingStripe, setConnectingStripe] = useState(false);

  const isPro = canAccess("pro");

  useEffect(() => {
    if (!user) return;
    loadAll();
  }, [user]);

  // Check for stripe onboarding return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("stripe_onboarding") === "complete") {
      toast.success("Conta Stripe conectada com sucesso!");
      window.history.replaceState({}, "", window.location.pathname);
      if (user) loadAll();
    }
  }, []);

  const loadAll = async () => {
    if (!user) return;
    setLoading(true);

    const { data: req } = await supabase
      .from("affiliate_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (req) {
      const r = req as any;
      setStatus(r.status as AffiliateStatus);
    }

    const { data: prof } = await supabase
      .from("affiliate_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (prof) {
      setAffiliateProfile(prof);
      setStatus("approved");

      const affId = (prof as any).affiliate_id;

      const [leadsRes, commRes] = await Promise.all([
        supabase.from("affiliate_leads").select("*").eq("referrer_id", affId).order("created_at", { ascending: false }),
        supabase.from("affiliate_commissions").select("*").eq("affiliate_id", affId).order("created_at", { ascending: false }),
      ]);

      setLeads((leadsRes as any).data || []);
      setCommissions((commRes as any).data || []);
    }

    setLoading(false);
  };

  const handleApply = async () => {
    if (!user || !formName.trim() || !formStrategy.trim()) {
      toast.error("Preencha nome completo e estratégia de divulgação.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("affiliate_requests").insert({
      user_id: user.id,
      full_name: formName,
      instagram: formInstagram || null,
      tiktok: formTiktok || null,
      youtube: formYoutube || null,
      twitter: formTwitter || null,
      audience: formAudience || null,
      strategy: formStrategy,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Solicitação enviada! Aguarde aprovação.");
      setStatus("pending");

      // Notify site owner
      try {
        const { data: ownerProfile } = await supabase
          .from("founder_profiles")
          .select("user_id")
          .eq("is_site_owner", true)
          .maybeSingle();
        if (ownerProfile && ownerProfile.user_id !== user.id) {
          const { sendNotification } = await import("@/lib/sendNotification");
          await sendNotification({
            user_id: ownerProfile.user_id,
            type: "connection",
            title: `Nova solicitação de afiliação de ${formName}`,
            body: `Estratégia: ${formStrategy.slice(0, 100)}`,
            action_url: "/profile",
          });
        }
      } catch {}
    }
    setSubmitting(false);
  };

  const handleCopy = () => {
    if (!affiliateProfile) return;
    navigator.clipboard.writeText(`${window.location.origin}/join?ref=${affiliateProfile.affiliate_id}`);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectStripe = async () => {
    if (!user) return;
    setConnectingStripe(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-connect-account", {
        headers: { Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` },
      });
      if (error) throw error;
      if (data?.already_complete) {
        toast.success("Sua conta Stripe já está conectada!");
        await loadAll();
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error("Erro ao conectar Stripe: " + (err.message || "Tente novamente."));
    }
    setConnectingStripe(false);
  };

  if (loading) return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  const renderContent = () => {
    if (!isPro) {
      return (
        <div className="p-8 text-center space-y-4">
          <Icon3D icon={Lock} color="silver" size="lg" animated />
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Para participar do Programa de Afiliados é necessário possuir o plano PRO ou BUSINESS.
          </p>
          <Button onClick={() => window.location.href = "/planos"} className="gold-gradient text-primary-foreground font-semibold">
            Fazer upgrade
          </Button>
        </div>
      );
    }

    if (status === "none") {
      return (
        <div className="space-y-4 p-4">
          <p className="text-sm text-muted-foreground">
            Ganhe comissões indicando o Azera Club. Preencha o formulário para solicitar participação.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Nome completo *</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Seu nome" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Instagram</Label>
              <Input value={formInstagram} onChange={e => setFormInstagram(e.target.value)} placeholder="@usuario" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">TikTok</Label>
              <Input value={formTiktok} onChange={e => setFormTiktok(e.target.value)} placeholder="@usuario" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">YouTube</Label>
              <Input value={formYoutube} onChange={e => setFormYoutube(e.target.value)} placeholder="Canal" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Twitter / X</Label>
              <Input value={formTwitter} onChange={e => setFormTwitter(e.target.value)} placeholder="@usuario" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Audiência aproximada</Label>
              <Select value={formAudience} onValueChange={setFormAudience}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1k-5k">1k – 5k</SelectItem>
                  <SelectItem value="5k-20k">5k – 20k</SelectItem>
                  <SelectItem value="20k-100k">20k – 100k</SelectItem>
                  <SelectItem value="100k+">100k+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Como pretende divulgar o Azera Club? *</Label>
            <Textarea value={formStrategy} onChange={e => setFormStrategy(e.target.value)} placeholder="Descreva sua estratégia..." rows={3} />
          </div>
          <Button onClick={handleApply} disabled={submitting} className="gold-gradient text-primary-foreground font-semibold">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Gift className="h-4 w-4 mr-2" />}
            Solicitar participação
          </Button>
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="p-8 text-center space-y-4">
          <Icon3D icon={Clock} color="gold" size="lg" animated />
          <h3 className="text-lg font-semibold text-foreground">Solicitação em análise</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Sua solicitação para o Programa de Afiliados está sendo analisada. Você será notificado assim que for aprovada.
          </p>
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" /> Aguardando aprovação
          </Badge>
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <div className="p-8 text-center space-y-4">
          <Icon3D icon={XCircle} color="silver" size="lg" animated />
          <h3 className="text-lg font-semibold text-foreground">Solicitação não aprovada</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Sua solicitação não foi aprovada desta vez. Você pode tentar novamente.
          </p>
          <Button onClick={() => setStatus("none")} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    // Approved — full dashboard
    const leadsCount = leads.length;
    const salesCount = commissions.length;
    const conversionRate = leadsCount > 0 ? ((salesCount / leadsCount) * 100).toFixed(1) : "0";
    const totalCommission = commissions.reduce((a, c) => a + Number(c.amount), 0);
    const levelLabel = { starter: "Starter", partner: "Partner", ambassador: "Ambassador", legend: "Legend" }[affiliateProfile?.level || "starter"] || "Starter";
    const ratePercent = ((affiliateProfile?.commission_rate || 0.25) * 100).toFixed(0);
    const isStripeConnected = affiliateProfile?.stripe_onboarding_complete === true;

    const chartData = (() => {
      const days: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days[format(d, "dd/MM")] = 0;
      }
      leads.forEach(l => {
        const k = format(new Date(l.created_at), "dd/MM");
        if (days[k] !== undefined) days[k]++;
      });
      return Object.entries(days).map(([date, count]) => ({ date, leads: count }));
    })();

    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            {levelLabel} · {ratePercent}%
          </Badge>
        </div>

        {/* Link */}
        <div className="flex gap-2">
          <Input readOnly value={`${window.location.origin}/join?ref=${affiliateProfile?.affiliate_id}`} className="text-xs font-mono" />
          <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {/* Stripe status hint */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/10 border border-border/30">
          {isStripeConnected ? (
            <>
              <CheckCircle className="h-4 w-4 text-accent-foreground" />
              <span className="text-xs text-muted-foreground">
                Pagamentos automáticos via <strong className="text-foreground">Stripe Connect</strong> — comissões são transferidas diretamente para sua conta bancária.
              </span>
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">
                Conecte sua conta Stripe na aba <strong className="text-foreground">Financeiro</strong> para receber comissões automaticamente.
              </span>
            </>
          )}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-8">
            <TabsTrigger value="overview" className="text-[10px] sm:text-xs">Visão Geral</TabsTrigger>
            <TabsTrigger value="leads" className="text-[10px] sm:text-xs">Leads</TabsTrigger>
            <TabsTrigger value="performance" className="text-[10px] sm:text-xs">Performance</TabsTrigger>
            <TabsTrigger value="finance" className="text-[10px] sm:text-xs">Financeiro</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-4 mt-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "Leads", value: leadsCount, icon: Users, color: "blue" as const },
                { label: "Conversão", value: conversionRate, suffix: "%", icon: TrendingUp, color: "green" as const },
                { label: "Vendas", value: salesCount, icon: BarChart3, color: "gold" as const },
                { label: "Total ganho", value: totalCommission, prefix: "R$", icon: DollarSign, color: "green" as const },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <Icon3D icon={s.icon} color={s.color} size="xs" />
                  <span className="text-lg font-bold text-foreground mt-1">
                    {s.prefix}{typeof s.value === "number" ? s.value.toFixed(s.prefix ? 2 : 0) : s.value}{s.suffix}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Activity timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Activity className="h-3 w-3" /> Atividade recente
              </h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {[...leads.slice(0, 3).map(l => ({
                  text: `Novo lead: ${l.user_name || "Usuário"}`,
                  date: l.created_at,
                  icon: <Users className="h-3 w-3 text-primary" />,
                })), ...commissions.slice(0, 3).map(c => ({
                  text: `Comissão R$${Number(c.amount).toFixed(2)} — ${c.status === "paid" ? "Pago" : "Pendente"}`,
                  date: c.created_at,
                  icon: <DollarSign className="h-3 w-3 text-accent-foreground" />,
                }))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground p-1.5 rounded bg-secondary/20">
                    {item.icon}
                    <span className="flex-1 truncate">{item.text}</span>
                    <span className="text-[10px]">{format(new Date(item.date), "dd/MM")}</span>
                  </div>
                ))}
                {leads.length === 0 && commissions.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">Nenhuma atividade ainda.</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* LEADS TAB */}
          <TabsContent value="leads" className="mt-3">
            <div className="space-y-3">
              <div className="rounded-lg border border-border/30 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Nome</TableHead>
                      <TableHead className="text-xs">Plano</TableHead>
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6">
                          Nenhum lead registrado ainda.
                        </TableCell>
                      </TableRow>
                    ) : (
                      leads.slice(0, 20).map(lead => (
                        <TableRow key={lead.id}>
                          <TableCell className="text-xs font-medium">{lead.user_name || "—"}</TableCell>
                          <TableCell className="text-xs">{lead.user_plan || "Free"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {lead.created_at ? format(new Date(lead.created_at), "dd/MM/yy") : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={lead.purchased_at ? "default" : "secondary"} className="text-[10px]">
                              {lead.purchased_at ? "Convertido" : "Lead"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* PERFORMANCE TAB */}
          <TabsContent value="performance" className="mt-3 space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground">Leads nos últimos 14 dias</h4>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ fontSize: 12, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Line type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* FINANCE TAB */}
          <TabsContent value="finance" className="mt-3 space-y-4">
            <div className="space-y-3">
              {!isStripeConnected && (
                <Button onClick={handleConnectStripe} disabled={connectingStripe} className="w-full gap-2" variant="outline">
                  {connectingStripe ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                  Conectar conta Stripe
                </Button>
              )}
              <Separator />
              <h4 className="text-xs font-semibold text-muted-foreground">Comissões</h4>
              {commissions.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Nenhuma comissão registrada.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {commissions.map(c => (
                    <div key={c.id} className="flex items-center justify-between text-xs p-2 rounded bg-secondary/20">
                      <span className="font-medium text-foreground">R${Number(c.amount).toFixed(2)}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {c.status === "paid" ? "Pago" : c.status === "pending" ? "Pendente" : c.status}
                      </Badge>
                      <span className="text-muted-foreground">{format(new Date(c.created_at), "dd/MM/yy")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <Collapsible open={sectionOpen} onOpenChange={setSectionOpen}>
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-2">
              <Icon3D icon={Star} color="gold" size="sm" animated />
              <span className="font-semibold text-foreground text-sm">Programa de Afiliados</span>
              {status === "pending" && <Badge variant="secondary" className="text-[10px]">Pendente</Badge>}
              {status === "approved" && <Badge className="text-[10px]">Ativo</Badge>}
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${sectionOpen ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {renderContent()}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
