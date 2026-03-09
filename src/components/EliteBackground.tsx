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
      <div className={`elite-orb ${orbClass}-5`} />

      {Array.from({ length: 16 }).map((_, i) => (
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
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
