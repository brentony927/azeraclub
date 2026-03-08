import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface PricingPlan {
  key: string;
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  weeklyPrice?: number;
  buttonText: string;
  buttonVariant: "outline" | "default";
  popular?: boolean;
  includes: string[];
}

interface PricingSectionProps {
  plans: PricingPlan[];
  onSubscribe: (planKey: string, period?: string) => void;
  loadingPlan: string | null;
  currentTier: string | null;
  onManage: () => void;
}

type Period = "weekly" | "monthly" | "yearly";

const PricingSwitch = ({ onSwitch, selected }: { onSwitch: (value: Period) => void; selected: Period }) => {
  const periods: { key: Period; label: string }[] = [
    { key: "weekly", label: "Semanal" },
    { key: "monthly", label: "Mensal" },
    { key: "yearly", label: "Anual" },
  ];

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center rounded-full bg-secondary/60 backdrop-blur p-1">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => onSwitch(p.key)}
            className={cn(
              "relative z-10 w-fit h-10 rounded-full px-5 py-2 font-medium transition-colors text-sm",
              selected === p.key ? "text-primary-foreground" : "text-muted-foreground"
            )}
          >
            {selected === p.key && (
              <motion.div
                layoutId="pricing-switch"
                className="absolute inset-0 rounded-full moss-gradient"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default function PricingSection({
  plans,
  onSubscribe,
  loadingPlan,
  currentTier,
  onManage,
}: PricingSectionProps) {
  const [period, setPeriod] = useState<Period>("monthly");
  const pricingRef = useRef<HTMLDivElement>(null);

  const isWeekly = period === "weekly";
  const isYearly = period === "yearly";

  const getPrice = (plan: PricingPlan) => {
    if (plan.price === 0) return 0;
    if (isWeekly) return plan.weeklyPrice || 0;
    if (isYearly) return plan.yearlyPrice;
    return plan.price;
  };

  const getPeriodLabel = () => {
    if (isWeekly) return "/semana";
    if (isYearly) return "/ano";
    return "/mês";
  };

  return (
    <div ref={pricingRef} className="w-full max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <TimelineContent animationNum={0} timelineRef={pricingRef}>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold">
            <VerticalCutReveal splitBy="words" staggerDuration={0.08}>
              Escolha o plano ideal para você
            </VerticalCutReveal>
          </h2>
        </TimelineContent>

        <TimelineContent animationNum={1} timelineRef={pricingRef}>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Gerencie seu estilo de vida com as ferramentas certas. Faça upgrade ou downgrade a qualquer momento.
          </p>
        </TimelineContent>

        <TimelineContent animationNum={2} timelineRef={pricingRef}>
          <PricingSwitch onSwitch={setPeriod} selected={period} />
          {isWeekly && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mt-3"
            >
              <Badge variant="outline" className="gap-1.5 text-xs border-accent/30 text-accent">
                <Banknote className="h-3 w-3" />
                Pagamento via PIX
              </Badge>
            </motion.div>
          )}
        </TimelineContent>
      </div>

      {currentTier && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Plano atual:</span>
          <span className="text-sm font-semibold moss-text capitalize">{currentTier}</span>
          <Button variant="ghost" size="sm" onClick={onManage} className="text-accent text-xs">
            Gerenciar
          </Button>
        </div>
      )}

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const isCurrentPlan = currentTier === plan.key;
          const isFree = plan.price === 0;
          const price = getPrice(plan);
          return (
            <TimelineContent key={plan.key} animationNum={index + 3} timelineRef={pricingRef}>
              <Card
                className={cn(
                  "relative glass-card-hover flex flex-col h-full border-border/50",
                  plan.popular && "border-primary/40 ring-1 ring-primary/20",
                  isCurrentPlan && "ring-2 ring-primary/50"
                )}
              >
                {plan.popular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 moss-gradient rounded-full text-xs font-bold text-primary-foreground z-10">
                    Mais Popular
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 moss-gradient rounded-full text-xs font-bold text-primary-foreground z-10">
                    Seu Plano
                  </div>
                )}

                {plan.popular && (
                  <div className="absolute inset-0 overflow-hidden rounded-[var(--radius)]">
                    <SparklesComp
                      className="absolute inset-0"
                      color="hsl(152, 28%, 56%)"
                      size={1.2}
                      density={100}
                      speed={0.4}
                      opacity={0.5}
                    />
                  </div>
                )}

                <CardHeader className="relative z-[1] pb-2">
                  <h3 className="font-serif font-bold text-lg">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    {isFree ? (
                      <span className="text-3xl font-serif font-bold">Grátis</span>
                    ) : (
                      <>
                        <span className="text-sm text-muted-foreground">R$</span>
                        <NumberFlow
                          value={price}
                          className="text-3xl font-serif font-bold"
                        />
                        <span className="text-sm text-muted-foreground">
                          {getPeriodLabel()}
                        </span>
                      </>
                    )}
                  </div>
                  {isWeekly && !isFree && (
                    <Badge variant="outline" className="w-fit mt-2 text-[10px] gap-1 border-accent/30 text-accent">
                      <Banknote className="h-3 w-3" /> PIX
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="relative z-[1] flex-1 flex flex-col">
                  <Button
                    className={cn(
                      "w-full h-11 font-semibold mb-6",
                      plan.popular || isCurrentPlan
                        ? "moss-gradient text-primary-foreground hover:opacity-90"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    )}
                    disabled={isCurrentPlan || loadingPlan === plan.key}
                    onClick={() =>
                      isCurrentPlan ? onManage() : onSubscribe(plan.key, period)
                    }
                  >
                    {isCurrentPlan
                      ? "Plano Atual"
                      : loadingPlan === plan.key
                        ? "Processando..."
                        : isWeekly && !isFree
                          ? `Pagar via PIX`
                          : plan.buttonText}
                  </Button>

                  <div className="space-y-3 flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {plan.includes[0]}
                    </p>
                    <ul className="space-y-2">
                      {plan.includes.slice(1).map((feature, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>
          );
        })}
      </div>
    </div>
  );
}