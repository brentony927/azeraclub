import { Lock } from "lucide-react";
import { useSubscription, type PlanTier } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";

const TIER_LABELS: Record<PlanTier, string> = {
  free: "Free",
  basic: "Basic",
  pro: "Pro",
  elite: "Elite",
};

interface FeatureLockProps {
  minTier: PlanTier;
  children: React.ReactNode;
  featureName?: string;
}

export default function FeatureLock({ minTier, children, featureName }: FeatureLockProps) {
  const { canAccess } = useSubscription();
  const navigate = useNavigate();

  if (canAccess(minTier)) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-30 blur-[2px] select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-card">
        <div className="glass-card p-6 text-center max-w-xs">
          <div className="w-12 h-12 rounded-full bg-[hsl(42,50%,56%)]/20 flex items-center justify-center mx-auto mb-3">
            <Lock className="h-5 w-5 text-[hsl(42,50%,56%)]" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">
            {featureName || "Funcionalidade"} 🔒
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Disponível no plano {TIER_LABELS[minTier]} ou superior.
          </p>
          <button
            onClick={() => navigate("/planos")}
            className="text-xs font-medium px-4 py-2 rounded-full bg-[hsl(42,50%,56%)] text-[hsl(0,0%,4%)] hover:opacity-90 transition-opacity"
          >
            Fazer Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
