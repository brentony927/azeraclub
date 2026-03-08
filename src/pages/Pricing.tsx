import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PricingSection, { type PricingPlan } from "@/components/ui/pricing-section";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Copy, QrCode } from "lucide-react";

const tiers = {
  basic: { price_id: "price_free", product_id: "prod_free" },
  pro: { price_id: "price_1T7qrGFn0fMTE8T5jvCLKBT8", product_id: "prod_U62xpa0u9xDiJO" },
  business: { price_id: "price_1T7qrVFn0fMTE8T5G08ePJ2r", product_id: "prod_U62xPut1mfd9CG" },
};

const PIX_KEY = "SUA_CHAVE_PIX_AQUI";

const plans: PricingPlan[] = [
  {
    key: "basic",
    name: "Basic",
    description: "Perfeito para começar. Gratuito para sempre.",
    price: 0,
    yearlyPrice: 0,
    weeklyPrice: 0,
    buttonText: "Começar Grátis",
    buttonVariant: "outline",
    includes: [
      "Inclui:",
      "AZERA IA (20 mensagens/dia)",
      "Agenda inteligente",
      "Planejamento semanal simples",
      "Diário inteligente",
      "Networking AZR (comunidade)",
      "Radar de eventos públicos",
      "Biblioteca básica de conhecimento",
      "Perfil personalizado",
      "AZERA Score (produtividade)",
      "Cofre de ideias",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    description: "Para quem quer resultados reais. Ferramentas que convertem.",
    price: 12,
    yearlyPrice: 120,
    weeklyPrice: 5,
    buttonText: "Assinar Pro",
    buttonVariant: "default",
    popular: true,
    includes: [
      "Tudo do Basic, mais:",
      "IA ilimitada",
      "Planejamento semanal automático",
      "Análise de produtividade",
      "Radar de oportunidades",
      "Sugestões de networking",
      "Análise de metas",
      "Insights semanais da IA",
      "Modo foco (deep work planner)",
      "Sugestão de eventos relevantes",
      "Weekly Intelligence Report",
    ],
  },
  {
    key: "business",
    name: "Business",
    description: "Status + poder. Sinta-se em outro nível.",
    price: 39,
    yearlyPrice: 390,
    weeklyPrice: 12,
    buttonText: "Assinar Business",
    buttonVariant: "outline",
    includes: [
      "Tudo do Pro, mais:",
      "Tema dourado premium",
      "AZERA Strategic AI (CEO Mode)",
      "Análise de carreira",
      "Gerador de ideias avançado",
      "Radar de networking privado",
      "Eventos exclusivos",
      "IA para decisões importantes",
      "Planejamento anual de metas",
      "Insights de tendências",
      "Relatórios estratégicos mensais",
      "Life Strategy AI",
    ],
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [pixDialogOpen, setPixDialogOpen] = useState(false);
  const [pixPlanName, setPixPlanName] = useState("");
  const [pixPrice, setPixPrice] = useState(0);

  useEffect(() => {
    if (user) {
      supabase.functions.invoke("check-subscription").then(({ data }) => {
        if (data?.subscribed) setCurrentProductId(data.product_id);
      });
    }
  }, [user]);

  const handleSubscribe = async (planKey: string, period?: string) => {
    if (!user) { navigate("/signup"); return; }
    if (planKey === "basic") { toast.success("Você já está no plano Basic gratuito!"); return; }

    // Weekly plans → PIX dialog
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

  const handleManage = async () => {
    const { data, error } = await supabase.functions.invoke("customer-portal");
    if (error || !data?.url) { toast.error("Erro ao abrir portal de assinatura."); return; }
    window.open(data.url, "_blank");
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
    </div>
  );
}