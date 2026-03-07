export default function EliteBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="elite-orb elite-orb-1" />
      <div className="elite-orb elite-orb-2" />
      <div className="elite-orb elite-orb-3" />
      <div className="elite-orb elite-orb-4" />

      {/* Floating gold particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="elite-particle"
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
