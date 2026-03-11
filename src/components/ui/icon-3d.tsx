import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Icon3DColor = "gold" | "red" | "blue" | "green" | "silver";
type Icon3DSize = "xs" | "sm" | "md" | "lg";

interface Icon3DProps {
  icon: LucideIcon;
  color?: Icon3DColor;
  size?: Icon3DSize;
  animated?: boolean;
  className?: string;
}

const COLOR_MAP: Record<Icon3DColor, { bg: string; icon: string }> = {
  gold: {
    bg: "bg-gradient-to-br from-amber-500 via-yellow-700 to-amber-900 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.4),inset_2px_2px_4px_rgba(255,220,150,0.35),0_1px_4px_rgba(0,0,0,0.3)] ring-1 ring-yellow-400/15",
    icon: "text-yellow-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]",
  },
  red: {
    bg: "bg-gradient-to-br from-red-500 via-red-700 to-red-950 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.45),inset_2px_2px_4px_rgba(255,120,120,0.3),0_1px_4px_rgba(0,0,0,0.3)] ring-1 ring-red-400/15",
    icon: "text-red-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.4),inset_2px_2px_4px_rgba(140,180,255,0.3),0_1px_4px_rgba(0,0,0,0.3)] ring-1 ring-blue-400/15",
    icon: "text-blue-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]",
  },
  green: {
    bg: "bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-900 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.4),inset_2px_2px_4px_rgba(140,255,180,0.3),0_1px_4px_rgba(0,0,0,0.3)] ring-1 ring-emerald-400/15",
    icon: "text-emerald-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]",
  },
  silver: {
    bg: "bg-gradient-to-br from-zinc-300 via-zinc-500 to-zinc-700 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.35),0_1px_4px_rgba(0,0,0,0.25)] ring-1 ring-white/10",
    icon: "text-zinc-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]",
  },
};

const SIZE_MAP: Record<Icon3DSize, { container: string; icon: number }> = {
  xs: { container: "w-4 h-4", icon: 10 },
  sm: { container: "w-5 h-5", icon: 12 },
  md: { container: "w-7 h-7", icon: 16 },
  lg: { container: "w-10 h-10", icon: 22 },
};

export default function Icon3D({ icon: IconComponent, color = "gold", size = "sm", animated = false, className }: Icon3DProps) {
  const c = COLOR_MAP[color];
  const s = SIZE_MAP[size];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full shrink-0",
        c.bg,
        s.container,
        animated && "animate-icon3d-float",
        className
      )}
      style={!animated ? { transform: "perspective(100px) rotateX(-5deg) translateZ(0)" } : undefined}
    >
      <IconComponent size={s.icon} className={c.icon} strokeWidth={2.5} />
    </span>
  );
}
