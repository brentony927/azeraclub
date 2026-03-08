import { PlanTier } from "@/contexts/SubscriptionContext";

interface EliteBackgroundProps {
  plan: PlanTier;
}

export default function EliteBackground({ plan }: EliteBackgroundProps) {
  const orbClass = plan === "pro" ? "pro-orb" : "business-orb";
  const particleClass = plan === "pro" ? "pro-particle" : "business-particle";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className={`elite-orb ${orbClass}-1`} />
      <div className={`elite-orb ${orbClass}-2`} />
      <div className={`elite-orb ${orbClass}-3`} />
      <div className={`elite-orb ${orbClass}-4`} />

      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={particleClass}
          style={{
            left: `${8 + (i * 7.5) % 85}%`,
            top: `${10 + ((i * 13) % 80)}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${4 + (i % 4) * 1.5}s`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}
