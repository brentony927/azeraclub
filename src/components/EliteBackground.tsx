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

      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className={particleClass}
          style={{
            left: `${5 + (i * 4.1) % 90}%`,
            top: `${5 + ((i * 11) % 88)}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3.5 + (i % 5) * 1.2}s`,
            width: `${3 + (i % 4)}px`,
            height: `${3 + (i % 4)}px`,
          }}
        />
      ))}
    </div>
  );
}
