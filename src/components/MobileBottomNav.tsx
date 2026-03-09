import { useLocation, useNavigate } from "react-router-dom";
import { Home, Brain, CalendarDays, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Início", path: "/dashboard" },
  { icon: Brain, label: "IA", path: "/ia" },
  { icon: CalendarDays, label: "Agenda", path: "/agenda" },
  { icon: Users, label: "Rede", path: "/founder-match" },
  { icon: User, label: "Perfil", path: "/profile" },
];

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/30 backdrop-blur-xl bg-background/80" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-16 min-h-[64px]">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-full h-full min-w-[48px] min-h-[48px] transition-colors",
                isActive ? "text-accent" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
