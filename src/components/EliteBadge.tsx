import { Crown } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

export default function EliteBadge({ className = "" }: { className?: string }) {
  const { plan } = useSubscription();
  if (plan === "free" || plan === "basic") return null;

  const label = `AZERA ${plan.toUpperCase()} MEMBRO`;

  const style = plan === "business"
    ? { background: "linear-gradient(135deg, hsl(51,100%,50%), hsl(42,60%,70%))", color: "hsl(0,0%,4%)" }
    : { background: "linear-gradient(135deg, hsl(152,100%,50%), hsl(152,80%,60%))", color: "hsl(0,0%,4%)" };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider ${className}`}
      style={style}
    >
      <Crown className="h-3 w-3" />
      {label}
    </div>
  );
}
