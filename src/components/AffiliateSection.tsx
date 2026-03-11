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
import {
  Copy, Check, Users, TrendingUp, Wallet, Loader2, Gift,
  Lock, Clock, XCircle, BarChart3, DollarSign,
  Activity, Star, ExternalLink, CreditCard, CheckCircle,
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
  const [wallet, setWallet] = useState<any>(null);

  // Stripe Connect
  const [connectingStripe, setConnectingStripe] = useState(false);

  // Payout method
  const [payoutMethod, setPayoutMethod] = useState<"pix" | "stripe">("pix");
  const [pixName, setPixName] = useState("");
  const [pixCpf, setPixCpf] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [savingPayout, setSavingPayout] = useState(false);
  const [requestingWithdraw, setRequestingWithdraw] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

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
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
      // Reload to get updated status
      if (user) loadAll();
    }
  }, []);

  const loadAll = async () => {
    if (!user) return;
    setLoading(true);

    const { data: req } = await supabase
      .from("affiliate_requests" as any)
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
      .from("affiliate_profiles" as any)
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (prof) {
      setAffiliateProfile(prof);
      setStatus("approved");

      const affId = (prof as any).affiliate_id;

      const [leadsRes, commRes, walletRes, payoutRes, withdrawRes] = await Promise.all([
        supabase.from("affiliate_leads" as any).select("*").eq("referrer_id", affId).order("created_at", { ascending: false }),
        supabase.from("affiliate_commissions" as any).select("*").eq("affiliate_id", affId).order("created_at", { ascending: false }),
        supabase.from("affiliate_wallet" as any).select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("affiliate_payout_info" as any).select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("affiliate_withdrawals" as any).select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      setLeads((leadsRes as any).data || []);
      setCommissions((commRes as any).data || []);
      setWallet((walletRes as any).data);
      setWithdrawals((withdrawRes as any).data || []);

      const payout = (payoutRes as any).data;
      if (payout) {
        setPayoutMethod(payout.payout_method || "pix");
        setPixName(payout.full_name || "");
        setPixCpf(payout.cpf || "");
        setPixKey(payout.pix_key || "");
      }
    }

    setLoading(false);
  };

  const handleApply = async () => {
    if (!user || !formName.trim() || !formStrategy.trim()) {
      toast.error("Preencha nome completo e estratégia de divulgação.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("affiliate_requests" as any).insert({
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

  // Gate: must be PRO or BUSINESS
  if (!isPro) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-4">
          <Icon3D icon={Lock} color="silver" size="lg" animated />
          <h3 className="text-lg font-semibold text-foreground">Programa de Afiliados</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Para participar do Programa de Afiliados é necessário possuir o plano PRO ou BUSINESS.
          </p>
          <Button onClick={() => window.location.href = "/planos"} className="gold-gradient text-primary-foreground font-semibold">
            Fazer upgrade
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Application form
  if (status === "none") {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Icon3D icon={Star} color="gold" size="sm" animated /> Programa de Afiliados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    );
  }

  // Pending
  if (status === "pending") {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-4">
          <Icon3D icon={Clock} color="gold" size="lg" animated />
          <h3 className="text-lg font-semibold text-foreground">Solicitação em análise</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Sua solicitação para o Programa de Afiliados está sendo analisada. Você será notificado assim que for aprovada.
          </p>
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" /> Aguardando aprovação
          </Badge>
        </CardContent>
      </Card>
    );
  }

  // Rejected
  if (status === "rejected") {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-4">
          <Icon3D icon={XCircle} color="silver" size="lg" animated />
          <h3 className="text-lg font-semibold text-foreground">Solicitação não aprovada</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Sua solicitação não foi aprovada desta vez. Você pode tentar novamente.
          </p>
          <Button onClick={() => setStatus("none")} variant="outline">
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
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

  // Chart data — leads per day (last 14 days)
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
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon3D icon={Star} color="gold" size="sm" animated /> Programa de Afiliados
          <Badge variant="secondary" className="text-[10px] ml-auto">
            {levelLabel} · {ratePercent}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Link */}
        <div className="flex gap-2">
          <Input readOnly value={`${window.location.origin}/join?ref=${affiliateProfile?.affiliate_id}`} className="text-xs font-mono" />
          <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        {/* Stripe Connect Status */}
        {!isStripeConnected && (
          <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Conecte sua conta Stripe</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Para receber suas comissões automaticamente via PIX/transferência bancária, conecte sua conta Stripe.
            </p>
            <Button onClick={handleConnectStripe} disabled={connectingStripe} size="sm" className="gold-gradient text-primary-foreground font-semibold">
              {connectingStripe ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <ExternalLink className="h-3 w-3 mr-1" />}
              Conectar Stripe
            </Button>
          </div>
        )}

        {isStripeConnected && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/10 border border-accent/20">
            <CheckCircle className="h-4 w-4 text-accent-foreground" />
            <span className="text-xs text-foreground">Conta Stripe conectada — pagamentos automáticos ativos</span>
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-8">
            <TabsTrigger value="overview" className="text-[10px] sm:text-xs">Visão Geral</TabsTrigger>
            <TabsTrigger value="leads" className="text-[10px] sm:text-xs">Leads</TabsTrigger>
            <TabsTrigger value="performance" className="text-[10px] sm:text-xs">Performance</TabsTrigger>
            <TabsTrigger value="finance" className="text-[10px] sm:text-xs">Financeiro</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-4 mt-3">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: "Leads", value: leadsCount, icon: Users, color: "blue" as const },
                { label: "Conversão", value: conversionRate, suffix: "%", icon: TrendingUp, color: "green" as const },
                { label: "Vendas", value: salesCount, icon: BarChart3, color: "gold" as const },
                { label: "Comissão", value: totalCommission, prefix: "R$", icon: DollarSign, color: "green" as const },
                { label: "Disponível", value: Number(wallet?.balance_available || 0), prefix: "R$", icon: Wallet, color: "gold" as const },
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
                  text: `Comissão R$${Number(c.amount).toFixed(2)} — ${c.status}`,
                  date: c.created_at,
                  icon: <DollarSign className="h-3 w-3 text-accent-foreground" />,
                }))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground p-1.5 rounded bg-secondary/20">
                    {item.icon}
                    <span className="flex-1 truncate">{item.text}</span>
                    <span className="text-[10px] shrink-0">{format(new Date(item.date), "dd/MM")}</span>
                  </div>
                ))}
                {leads.length === 0 && commissions.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-3">Nenhuma atividade ainda</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* LEADS TAB */}
          <TabsContent value="leads" className="mt-3">
            {leads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhum lead registrado ainda.</p>
            ) : (
              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Nome</TableHead>
                      <TableHead className="text-xs">Plano</TableHead>
                      <TableHead className="text-xs">Cadastro</TableHead>
                      <TableHead className="text-xs">Compra</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map(l => (
                      <TableRow key={l.id}>
                        <TableCell className="text-xs">{l.user_name || "—"}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px]">{l.user_plan || "free"}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{format(new Date(l.signed_up_at), "dd/MM/yy")}</TableCell>
                        <TableCell className="text-xs">{l.purchased_at ? format(new Date(l.purchased_at), "dd/MM/yy") : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* PERFORMANCE TAB */}
          <TabsContent value="performance" className="mt-3">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">Leads nos últimos 14 dias</h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* FINANCE TAB */}
          <TabsContent value="finance" className="space-y-4 mt-3">
            {/* Wallet */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-[10px] text-muted-foreground">Pendente</p>
                <p className="text-sm font-bold text-foreground">R${Number(wallet?.balance_pending || 0).toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-[10px] text-muted-foreground">Disponível</p>
                <p className="text-sm font-bold text-foreground">R${Number(wallet?.balance_available || 0).toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                <p className="text-[10px] text-muted-foreground">Total pago</p>
                <p className="text-sm font-bold text-foreground">R${Number(wallet?.total_paid || 0).toFixed(2)}</p>
              </div>
            </div>

            {/* Payout method selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Método de pagamento</Label>
              <Select value={payoutMethod} onValueChange={(v) => setPayoutMethod(v as "pix" | "stripe")}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX (manual)</SelectItem>
                  <SelectItem value="stripe">Stripe (automático)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* PIX payout section */}
            {payoutMethod === "pix" && (
              <div className="space-y-3 p-3 rounded-lg border border-border/50 bg-secondary/10">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Dados PIX</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Preencha seus dados para receber saques via PIX. Saques são processados manualmente em até 24h.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Nome completo</Label>
                    <Input value={pixName} onChange={e => setPixName(e.target.value)} placeholder="Seu nome" className="text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">CPF</Label>
                    <Input value={pixCpf} onChange={e => setPixCpf(e.target.value)} placeholder="000.000.000-00" className="text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Chave PIX</Label>
                    <Input value={pixKey} onChange={e => setPixKey(e.target.value)} placeholder="CPF, email, telefone..." className="text-xs" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={savingPayout || !pixName.trim() || !pixKey.trim()}
                    onClick={async () => {
                      if (!user) return;
                      setSavingPayout(true);
                      const { error } = await supabase.from("affiliate_payout_info" as any).upsert({
                        user_id: user.id,
                        full_name: pixName.trim(),
                        cpf: pixCpf.trim() || null,
                        pix_key: pixKey.trim(),
                        payout_method: "pix",
                        updated_at: new Date().toISOString(),
                      } as any, { onConflict: "user_id" });
                      if (error) toast.error("Erro ao salvar: " + error.message);
                      else toast.success("Dados PIX salvos!");
                      setSavingPayout(false);
                    }}
                  >
                    {savingPayout ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Check className="h-3 w-3 mr-1" />}
                    Salvar dados
                  </Button>
                  <Button
                    size="sm"
                    className="gold-gradient text-primary-foreground font-semibold"
                    disabled={requestingWithdraw || Number(wallet?.balance_available || 0) < 100 || !pixKey.trim()}
                    onClick={async () => {
                      if (!user) return;
                      const available = Number(wallet?.balance_available || 0);
                      if (available < 100) {
                        toast.error("Saldo mínimo para saque: R$100,00");
                        return;
                      }
                      setRequestingWithdraw(true);
                      const { error } = await supabase.from("affiliate_withdrawals" as any).insert({
                        user_id: user.id,
                        amount: available,
                      } as any);
                      if (error) toast.error("Erro ao solicitar: " + error.message);
                      else {
                        toast.success(`Saque de R$${available.toFixed(2)} solicitado! Será processado em até 24h.`);
                        await loadAll();
                      }
                      setRequestingWithdraw(false);
                    }}
                  >
                    {requestingWithdraw ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <DollarSign className="h-3 w-3 mr-1" />}
                    Solicitar saque (mín. R$100)
                  </Button>
                </div>

                {/* Withdrawal history */}
                {withdrawals.length > 0 && (
                  <div className="space-y-1 mt-2">
                    <h4 className="text-[10px] font-semibold text-muted-foreground">Histórico de saques</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {withdrawals.map((w: any) => (
                        <div key={w.id} className="flex items-center justify-between text-xs p-2 rounded bg-secondary/20">
                          <span className="font-medium text-foreground">R${Number(w.amount).toFixed(2)}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {w.status === "paid" ? "Pago" : w.status === "pending" ? "Pendente" : w.status}
                          </Badge>
                          <span className="text-muted-foreground">{format(new Date(w.created_at), "dd/MM/yy")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stripe payout section */}
            {payoutMethod === "stripe" && (
              <div className="space-y-2">
                {isStripeConnected ? (
                  <div className="space-y-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent-foreground" />
                      <span className="text-sm font-medium text-foreground">Pagamentos automáticos</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Suas comissões são transferidas automaticamente para sua conta bancária via Stripe após o período de 7 dias de carência.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={savingPayout}
                      onClick={async () => {
                        if (!user) return;
                        setSavingPayout(true);
                        await supabase.from("affiliate_payout_info" as any).upsert({
                          user_id: user.id,
                          payout_method: "stripe",
                          updated_at: new Date().toISOString(),
                        } as any, { onConflict: "user_id" });
                        toast.success("Método de pagamento atualizado para Stripe!");
                        setSavingPayout(false);
                      }}
                    >
                      <Check className="h-3 w-3 mr-1" /> Confirmar Stripe como método
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 p-3 rounded-lg border border-primary/30 bg-primary/5">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Configure seus pagamentos</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Conecte sua conta Stripe para receber comissões automaticamente via PIX ou transferência bancária.
                    </p>
                    <Button onClick={handleConnectStripe} disabled={connectingStripe} size="sm" className="gold-gradient text-primary-foreground font-semibold">
                      {connectingStripe ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <ExternalLink className="h-3 w-3 mr-1" />}
                      Conectar conta Stripe
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Commission history */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground">Histórico de comissões</h4>
              {commissions.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-3">Nenhuma comissão registrada ainda.</p>
              ) : (
                <div className="space-y-1 max-h-40 overflow-y-auto">
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
      </CardContent>
    </Card>
  );
}
