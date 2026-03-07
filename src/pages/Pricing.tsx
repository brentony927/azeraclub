import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PricingSection, { type PricingPlan } from "@/components/ui/pricing-section";

const tiers = {
  basic: { price_id: "price_free", product_id: "prod_free" },
  pro: { price_id: "price_1T7qrGFn0fMTE8T5jvCLKBT8", product_id: "prod_U62xpa0u9xDiJO" },
  elite: { price_id: "price_1T7qrVFn0fMTE8T5G08ePJ2r", product_id: "prod_U62xPut1mfd9CG" },
};

const plans: PricingPlan[] = [
  {
    key: "basic",
    name: "Basic",
    description: "Perfeito para começar. Gratuito para sempre.",
    price: 0,
    yearlyPrice: 0,
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
    key: "elite",
    name: "Elite",
    description: "Status + poder. Sinta-se em outro nível.",
    price: 39,
    yearlyPrice: 390,
    buttonText: "Assinar Elite",
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

  useEffect(() => {
    if (user) {
      supabase.functions.invoke("check-subscription").then(({ data }) => {
        if (data?.subscribed) setCurrentProductId(data.product_id);
      });
    }
  }, [user]);

  const handleSubscribe = async (planKey: string) => {
    if (!user) { navigate("/signup"); return; }
    if (planKey === "basic") { toast.success("Você já está no plano Basic gratuito!"); return; }
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
    </div>
  );
}
