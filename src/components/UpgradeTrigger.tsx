import { Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PlanTier } from "@/contexts/SubscriptionContext";

const TIER_LABELS: Record<PlanTier, string> = {
  free: "Founder",
  basic: "Founder",
  pro: "PRO",
  business: "BUSINESS",
};

interface UpgradeTriggerProps {
  message: string;
  stat?: string | number;
  targetPlan?: PlanTier;
  className?: string;
}

export default function UpgradeTrigger({ message, stat, targetPlan = "pro", className = "" }: UpgradeTriggerProps) {
  const navigate = useNavigate();

  return (
    <div className={`rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-5 text-center space-y-3 ${className}`}>
      {stat && (
        <p className="text-2xl font-bold text-foreground">{stat}</p>
      )}
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Lock className="h-4 w-4 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
      <button
        onClick={() => navigate("/planos")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Upgrade para {TIER_LABELS[targetPlan]} <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
