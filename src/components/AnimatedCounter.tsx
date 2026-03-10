import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export default function AnimatedCounter({ value, suffix = "", label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (visible) {
      // Small delay for dramatic effect
      const t = setTimeout(() => setDisplayed(value), 200);
      return () => clearTimeout(t);
    }
  }, [visible, value]);

  return (
    <div ref={ref} className="text-center space-y-1">
      <div className="text-4xl sm:text-5xl font-serif font-bold text-foreground flex items-center justify-center gap-0.5">
        <NumberFlow value={displayed} />
        {suffix && <span className="moss-text">{suffix}</span>}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
