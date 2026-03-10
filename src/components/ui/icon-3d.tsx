import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Icon3DColor = "gold" | "red" | "blue" | "green" | "silver";
type Icon3DSize = "xs" | "sm" | "md" | "lg";

interface Icon3DProps {
  icon: LucideIcon;
  color?: Icon3DColor;
  size?: Icon3DSize;
  className?: string;
}

const COLOR_MAP: Record<Icon3DColor, { bg: string; icon: string }> = {
  gold: {
    bg: "bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.35),inset_2px_2px_6px_rgba(255,255,200,0.6),0_2px_8px_rgba(200,150,0,0.4)]",
    icon: "text-yellow-900 drop-shadow-[0_1px_1px_rgba(255,255,200,0.5)]",
  },
  red: {
    bg: "bg-gradient-to-br from-red-400 via-red-600 to-red-900 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.4),inset_2px_2px_6px_rgba(255,100,100,0.5),0_2px_8px_rgba(200,0,0,0.4)]",
    icon: "text-red-100 drop-shadow-[0_1px_1px_rgba(100,0,0,0.5)]",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-300 via-blue-500 to-blue-800 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.35),inset_2px_2px_6px_rgba(150,200,255,0.5),0_2px_8px_rgba(0,50,200,0.3)]",
    icon: "text-blue-100 drop-shadow-[0_1px_1px_rgba(0,0,100,0.4)]",
  },
  green: {
    bg: "bg-gradient-to-br from-emerald-300 via-emerald-500 to-emerald-800 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.35),inset_2px_2px_6px_rgba(150,255,200,0.5),0_2px_8px_rgba(0,150,50,0.3)]",
    icon: "text-emerald-100 drop-shadow-[0_1px_1px_rgba(0,80,0,0.4)]",
  },
  silver: {
    bg: "bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,255,255,0.6),0_2px_8px_rgba(100,100,100,0.3)]",
    icon: "text-gray-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]",
  },
};

const SIZE_MAP: Record<Icon3DSize, { container: string; icon: number }> = {
  xs: { container: "w-4 h-4", icon: 10 },
  sm: { container: "w-5 h-5", icon: 12 },
  md: { container: "w-7 h-7", icon: 16 },
  lg: { container: "w-10 h-10", icon: 22 },
};

export default function Icon3D({ icon: IconComponent, color = "gold", size = "sm", className }: Icon3DProps) {
  const c = COLOR_MAP[color];
  const s = SIZE_MAP[size];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full shrink-0",
        c.bg,
        s.container,
        className
      )}
      style={{ transform: "perspective(80px) rotateX(-4deg) translateZ(0)" }}
    >
      <IconComponent size={s.icon} className={c.icon} strokeWidth={2.5} />
    </span>
  );
}
