import { PlanTier } from "@/contexts/SubscriptionContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface EliteBackgroundProps {
  plan: PlanTier;
  isOwner?: boolean;
}

export default function EliteBackground({ plan, isOwner }: EliteBackgroundProps) {
  const isMobile = useIsMobile();
  const orbClass = isOwner ? "owner-orb" : plan === "pro" ? "pro-orb" : "business-orb";
  const particleClass = isOwner ? "owner-particle" : plan === "pro" ? "pro-particle" : "business-particle";
  const orbCount = isMobile ? 2 : 4;
  const particleCount = isMobile ? 3 : 8;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {Array.from({ length: orbCount }).map((_, i) => (
        <div key={`orb-${i}`} className={`elite-orb ${orbClass}-${i + 1}`} />
      ))}

      {Array.from({ length: particleCount }).map((_, i) => (
        <div
          key={i}
          className={particleClass}
          style={{
            left: `${3 + (i * 5.9) % 94}%`,
            top: `${3 + ((i * 11.3) % 92)}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${3 + (i % 6) * 1.1}s`,
            width: `${2 + (i % 5) * 1.2}px`,
            height: `${2 + (i % 5) * 1.2}px`,
          }}
        />
      ))}
    </div>
  );
}
