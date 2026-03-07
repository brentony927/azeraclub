import React, { useState } from "react";
import { Home, Compass, Plane, Building2, Users, Heart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const dockItems: DockItem[] = [
  { id: "home", icon: <Home className="h-5 w-5" />, label: "Home", path: "/" },
  { id: "experiences", icon: <Compass className="h-5 w-5" />, label: "Experiences", path: "/experiences" },
  { id: "travel", icon: <Plane className="h-5 w-5" />, label: "Travel", path: "/travel" },
  { id: "properties", icon: <Building2 className="h-5 w-5" />, label: "Properties", path: "/properties" },
  { id: "social", icon: <Users className="h-5 w-5" />, label: "Social", path: "/social" },
  { id: "health", icon: <Heart className="h-5 w-5" />, label: "Health", path: "/health" },
  { id: "profile", icon: <User className="h-5 w-5" />, label: "Profile", path: "/profile" },
];

export default function MinimalDock() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end gap-1 px-3 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl">
        {dockItems.map((item) => {
          const isHovered = hoveredItem === item.id;
          const isActive = location.pathname === item.path;

          return (
            <div key={item.id} className="relative flex flex-col items-center">
              <button
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "flex items-center justify-center rounded-xl p-2.5 transition-all duration-300",
                  isHovered && "scale-125 -translate-y-2 bg-primary/20",
                  isActive && "text-accent",
                  !isActive && !isHovered && "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.icon}
              </button>

              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-9 px-2 py-1 text-[10px] font-medium text-primary-foreground bg-primary rounded whitespace-nowrap">
                  {item.label}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
