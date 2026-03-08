import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PricingSection, { type PricingPlan } from "@/components/ui/pricing-section";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Copy, QrCode, ShieldCheck, CalendarClock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = {
  basic: { price_id: "price_free", product_id: "prod_free" },
  pro: { price_id: "price_1T7qrGFn0fMTE8T5jvCLKBT8", product_id: "prod_U62xpa0u9xDiJO" },
  business: { price_id: "price_1T7qrVFn0fMTE8T5G08ePJ2r", product_id: "prod_U62xPut1mfd9CG" },
};

const PIX_KEY = "043.869.512-70";

const PLAN_LABELS: Record<string, string> = {
  pro: "Pro",
  business: "Business",
  elite: "Business",
};

const plans: PricingPlan[] = [
  {
    key: "basic",
    name: "Founder",
    description: "Entre no ecossistema. Gratuito para sempre.",
    price: 0,
    yearlyPrice: 0,
    weeklyPrice: 0,
    buttonText: "Começar Grátis",
    buttonVariant: "outline",
    includes: [
      "Inclui:",
      "Perfil completo de Founder",
      "Criar ventures e ideias",
      "Networking básico (10 msgs/semana)",
      "5 sugestões de founders/semana",
      "Filtros de cidade e interesses",
      "AZERA IA (20 msgs/dia)",
      "Agenda inteligente",
      "Diário inteligente",
      "Cofre de ideias",
      "Comunidade e oportunidades",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    description: "Networking sério. Ferramentas que convertem.",
    price: 19,
    yearlyPrice: 190,
    weeklyPrice: 5,
    buttonText: "Assinar Pro",
    buttonVariant: "default",
    popular: true,
    includes: [
      "Tudo do Founder, mais:",
      "Mensagens ilimitadas",
      "Ver quem visitou seu perfil",
      "Radar completo de founders",
      "Filtros avançados (indústria, skills, etc.)",
      "Analytics de perfil",
      "IA ilimitada",
      "Sugestões de networking da IA",
      "Insights semanais",
      "Modo foco (deep work planner)",
      "Weekly Intelligence Report",
    ],
  },
  {
    key: "business",
    name: "Business",
    description: "Status + poder. Destaque e exclusividade.",
    price: 49,
    yearlyPrice: 490,
    weeklyPrice: 12,
    buttonText: "Assinar Business",
    buttonVariant: "outline",
    includes: [
      "Tudo do Pro, mais:",
      "Perfil destacado nas buscas",
      "Badge Business Founder",
      "Prioridade no algoritmo",
      "Tema dourado premium",
      "AZERA Strategic AI (CEO Mode)",
      "Networking prioritário",
      "Eventos exclusivos",
      "Relatórios estratégicos mensais",
      "Life Strategy AI",
      "Oportunidades premium",
    ],
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const { plan: currentPlan, subscriptionEnd, refresh } = useSubscription();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [pixDialogOpen, setPixDialogOpen] = useState(false);
  const [pixPlanName, setPixPlanName] = useState("");
  const [pixPrice, setPixPrice] = useState(0);

  // Manage dialog state
  const [manageOpen, setManageOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [isManualPlan, setIsManualPlan] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.functions.invoke("check-subscription").then(({ data }) => {
        if (data?.subscribed) setCurrentProductId(data.product_id);
        // Detect manual plan
        setIsManualPlan(!!data?.manual_plan);
      });
    }
  }, [user]);

  const handleSubscribe = async (planKey: string, period?: string) => {
    if (!user) { navigate("/signup"); return; }
    if (planKey === "basic") { toast.success("Você já está no plano Founder gratuito!"); return; }

    if (period === "weekly") {
      const plan = plans.find(p => p.key === planKey);
      if (plan) {
        setPixPlanName(plan.name);
        setPixPrice(plan.weeklyPrice || 0);
        setPixDialogOpen(true);
      }
      return;
    }

    const tier = tiers[planKey as keyof typeof tiers];
    if (!tier) return;
    setLoadingPlan(planKey);
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { priceId: tier.price_id },
    });
    setLoadingPlan(null);
    if (error || !data?.url) {
      toast.error(`Erro ao iniciar pagamento: ${data?.error || error?.message || "Erro desconhecido"}`);
      return;
    }
    window.open(data.url, "_blank");
  };

  const handleManage = () => {
    setManageOpen(true);
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      if (isManualPlan) {
        const { error } = await supabase.functions.invoke("cancel-subscription");
        if (error) throw error;
      } else {
        // Stripe: open portal for cancellation
        const { data, error } = await supabase.functions.invoke("customer-portal");
        if (error) throw error;
        if (data?.error === "no_stripe_customer") {
          // Fallback: try manual cancel
          const { error: cancelErr } = await supabase.functions.invoke("cancel-subscription");
          if (cancelErr) throw cancelErr;
        } else if (data?.url) {
          window.open(data.url, "_blank");
          setCancelConfirmOpen(false);
          setManageOpen(false);
          setCancelling(false);
          return;
        }
      }
      // Manual cancel success
      await refresh();
      setCurrentProductId(null);
      toast.success("Assinatura cancelada com sucesso.");
      setCancelConfirmOpen(false);
      setManageOpen(false);
    } catch (err: any) {
      toast.error("Erro ao cancelar assinatura. Tente novamente.");
    } finally {
      setCancelling(false);
    }
  };

  const getCurrentTierName = () => {
    if (!currentProductId) return null;
    for (const [key, val] of Object.entries(tiers)) {
      if (val.product_id === currentProductId) return key;
    }
    return null;
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(PIX_KEY);
    toast.success("Chave PIX copiada!");
  };

  const planLabel = PLAN_LABELS[currentPlan] || currentPlan;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-16">
      <PricingSection
        plans={plans}
        onSubscribe={handleSubscribe}
        loadingPlan={loadingPlan}
        currentTier={getCurrentTierName()}
        onManage={handleManage}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-10"
      >
        <Link to="/terms" className="hover:text-primary transition-colors">Termos de Serviço</Link>
        <Link to="/privacy" className="hover:text-primary transition-colors">Política de Privacidade</Link>
        <Link to="/cookies" className="hover:text-primary transition-colors">Política de Cookies</Link>
      </motion.div>

      {/* PIX Payment Dialog */}
      <Dialog open={pixDialogOpen} onOpenChange={setPixDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Pagamento via PIX</DialogTitle>
            <DialogDescription>
              Plano {pixPlanName} Semanal — R${pixPrice}/semana
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 bg-secondary rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Escaneie o QR Code ou copie a chave PIX abaixo
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm font-mono truncate">
                {PIX_KEY}
              </div>
              <button
                onClick={copyPixKey}
                className="shrink-0 p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="bg-accent/10 border border-border/30 rounded-lg p-3 space-y-1">
              <p className="text-xs font-semibold text-foreground">Instruções:</p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Faça o PIX de R${pixPrice},00</li>
                <li>Envie o comprovante para nosso suporte</li>
                <li>Seu plano será ativado em até 24h</li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Subscription Dialog */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Gerenciar Assinatura</DialogTitle>
            <DialogDescription>
              Veja os detalhes do seu plano atual e gerencie sua assinatura.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            {/* Plan info */}
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Plano {planLabel}</p>
                  <p className="text-xs text-muted-foreground">Status: <span className="text-primary font-medium">Ativo</span></p>
                </div>
              </div>
              {subscriptionEnd && (
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-5 w-5 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Renovação: {new Date(subscriptionEnd).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </div>

            {/* Cancel section */}
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Ao cancelar, você perderá acesso às funcionalidades premium ao final do período atual.
                </p>
              </div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setCancelConfirmOpen(true)}
              >
                Cancelar Minha Assinatura
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation */}
      <AlertDialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao confirmar, sua assinatura do plano {planLabel} será cancelada. Você perderá acesso às funcionalidades premium.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? "Cancelando..." : "Sim, cancelar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
