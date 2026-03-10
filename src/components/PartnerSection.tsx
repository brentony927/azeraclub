import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, Users, TrendingUp, Wallet, Loader2, Gift, Save } from "lucide-react";
import Icon3D from "@/components/ui/icon-3d";
import { toast } from "sonner";

export default function PartnerSection() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<any>(null);
  const [activating, setActivating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Stats
  const [leadsCount, setLeadsCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  // Payout form
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  useEffect(() => {
    if (!user) return;
    loadPartner();
  }, [user]);

  const loadPartner = async () => {
    if (!user) return;
    const { data } = await supabase.from("partner_profiles" as any).select("*").eq("user_id", user.id).maybeSingle();
    if (data) {
      const p = data as any;
      setPartner(p);
      setFullName(p.full_name || "");
      setCpf(p.cpf || "");
      setPixKey(p.pix_key || "");
      setPaypalEmail(p.paypal_email || "");

      // Load stats
      const [refRes, commRes] = await Promise.all([
        supabase.from("referrals" as any).select("id", { count: "exact", head: true }).eq("referrer_id", p.partner_id),
        supabase.from("commissions" as any).select("amount, status").eq("affiliate_id", p.partner_id),
      ]);
      setLeadsCount((refRes as any).count || 0);
      const comms = ((commRes as any).data || []) as any[];
      setPaidCount(comms.length);
      setPendingBalance(comms.filter((c: any) => c.status === "pending").reduce((a: number, c: any) => a + Number(c.amount), 0));
      setAvailableBalance(comms.filter((c: any) => c.status === "approved").reduce((a: number, c: any) => a + Number(c.amount), 0));
      setTotalPaid(comms.filter((c: any) => c.status === "paid").reduce((a: number, c: any) => a + Number(c.amount), 0));
    }
    setLoading(false);
  };

  const activatePartner = async () => {
    if (!user) return;
    setActivating(true);
    // Generate partner_id from username or random
    const { data: fp } = await supabase.from("founder_profiles").select("username").eq("user_id", user.id).maybeSingle();
    const partnerId = (fp as any)?.username || user.id.slice(0, 8);

    const { error } = await supabase.from("partner_profiles" as any).insert({
      user_id: user.id,
      partner_id: partnerId,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Programa de parceiros ativado!");
      await loadPartner();
    }
    setActivating(false);
  };

  const handleCopy = () => {
    if (!partner) return;
    navigator.clipboard.writeText(`${window.location.origin}/?ref=${partner.partner_id}`);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePayout = async () => {
    if (!user || !partner) return;
    setSaving(true);
    const { error } = await supabase.from("partner_profiles" as any).update({
      full_name: fullName || null,
      cpf: cpf || null,
      pix_key: pixKey || null,
      paypal_email: paypalEmail || null,
    }).eq("user_id", user.id);
    if (error) toast.error(error.message);
    else toast.success("Dados de pagamento salvos!");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  if (!partner) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center space-y-4">
          <Icon3D icon={Gift} color="gold" size="lg" animated />
          <h3 className="text-lg font-semibold text-foreground">Programa de Parceiros</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Ganhe 25% de comissão em cada assinatura gerada pelo seu link exclusivo. Sem limite de ganhos.
          </p>
          <Button onClick={activatePartner} disabled={activating} className="gold-gradient text-primary-foreground font-semibold">
            {activating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Gift className="h-4 w-4 mr-2" />}
            Ativar Programa de Parceiros
          </Button>
        </CardContent>
      </Card>
    );
  }

  const conversionRate = leadsCount > 0 ? ((paidCount / leadsCount) * 100).toFixed(1) : "0";

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon3D icon={Gift} color="gold" size="sm" animated /> Programa de Parceiros
          <Badge variant="secondary" className="text-[10px]">
            Comissão: {((partner.commission_rate || 0.25) * 100).toFixed(0)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Link */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Seu link de convite</Label>
          <div className="flex gap-2">
            <Input readOnly value={`${window.location.origin}/?ref=${partner.partner_id}`} className="text-xs font-mono" />
            <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: "Leads", value: leadsCount, color: "blue" as const },
            { icon: TrendingUp, label: "Conversão", value: `${conversionRate}%`, color: "green" as const },
            { icon: Wallet, label: "Vendas", value: paidCount, color: "gold" as const },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
              <Icon3D icon={s.icon} color={s.color} size="xs" />
              <span className="text-lg font-bold text-foreground mt-1">{s.value}</span>
              <span className="text-[10px] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Balance */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Pendente</p>
            <p className="text-sm font-bold text-foreground">R${pendingBalance.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Disponível</p>
            <p className="text-sm font-bold text-foreground">R${availableBalance.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total pago</p>
            <p className="text-sm font-bold text-foreground">R${totalPaid.toFixed(2)}</p>
          </div>
        </div>

        <Separator />

        {/* Payout info */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Dados de pagamento</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Nome completo</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Seu nome" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">CPF</Label>
              <Input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Chave PIX</Label>
              <Input value={pixKey} onChange={e => setPixKey(e.target.value)} placeholder="Chave PIX" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">PayPal (alternativo)</Label>
              <Input value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} placeholder="email@paypal.com" />
            </div>
          </div>
          <Button onClick={handleSavePayout} disabled={saving} size="sm" variant="outline">
            {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
            Salvar dados
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
