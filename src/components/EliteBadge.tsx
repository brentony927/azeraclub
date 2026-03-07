import { Crown } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

export default function EliteBadge({ className = "" }: { className?: string }) {
  const { plan } = useSubscription();
  if (plan === "free") return null;

  const label = `AZERA ${plan.toUpperCase()} MEMBRO`;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider ${className}`}
      style={{
        background: plan === "elite"
          ? "linear-gradient(135deg, hsl(42,50%,56%), hsl(42,60%,70%))"
          : plan === "pro"
            ? "linear-gradient(135deg, hsl(210,40%,50%), hsl(210,50%,60%))"
            : "hsl(var(--secondary))",
        color: plan === "elite" || plan === "pro" ? "hsl(0,0%,4%)" : "hsl(var(--foreground))",
      }}
    >
      <Crown className="h-3 w-3" />
      {label}
    </div>
  );
}
