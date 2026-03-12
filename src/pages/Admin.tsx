import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LoadingBreadcrumb } from "@/components/ui/animated-loading-svg-text-shimmer";
import {
  LayoutDashboard, Users, CreditCard, Handshake, Lightbulb,
  Award, Globe, Briefcase, Shield, BarChart3, Settings, Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminSubscriptions from "@/components/admin/AdminSubscriptions";
import AdminAffiliates from "@/components/admin/AdminAffiliates";
import AdminSuggestions from "@/components/admin/AdminSuggestions";
import AdminBadges from "@/components/admin/AdminBadges";
import AdminMap from "@/components/admin/AdminMap";
import AdminOpportunities from "@/components/admin/AdminOpportunities";
import AdminModeration from "@/components/admin/AdminModeration";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminSettings from "@/components/admin/AdminSettings";

const sections = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Usuários", icon: Users },
  { id: "subscriptions", label: "Assinaturas", icon: CreditCard },
  { id: "affiliates", label: "Afiliados", icon: Handshake },
  { id: "suggestions", label: "Sugestões", icon: Lightbulb },
  { id: "badges", label: "Insígnias", icon: Award },
  { id: "map", label: "Mapa Global", icon: Globe },
  { id: "opportunities", label: "Oportunidades", icon: Briefcase },
  { id: "moderation", label: "Moderação", icon: Shield },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Configurações", icon: Settings },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<SectionId>("dashboard");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("founder_profiles")
      .select("is_site_owner")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.is_site_owner) {
          setAuthorized(true);
        } else {
          navigate("/dashboard", { replace: true });
        }
        setLoading(false);
      });
  }, [user]);

  if (loading || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingBreadcrumb />
      </div>
    );
  }

  const renderSection = () => {
    switch (active) {
      case "dashboard": return <AdminDashboard />;
      case "users": return <AdminUsers />;
      case "subscriptions": return <AdminSubscriptions />;
      case "affiliates": return <AdminAffiliates />;
      case "suggestions": return <AdminSuggestions />;
      case "badges": return <AdminBadges />;
      case "map": return <AdminMap />;
      case "opportunities": return <AdminOpportunities />;
      case "moderation": return <AdminModeration />;
      case "analytics": return <AdminAnalytics />;
      case "settings": return <AdminSettings />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border/50 bg-card/50 backdrop-blur-sm hidden md:flex flex-col">
        <div className="p-4 border-b border-border/30 flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          <h2 className="font-bold text-foreground tracking-wide">Azera OS</h2>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                active === s.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border/50 overflow-x-auto">
        <div className="flex p-1 gap-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded text-[10px] min-w-[56px] shrink-0 transition-colors",
                active === s.id ? "text-primary bg-primary/10" : "text-muted-foreground"
              )}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-32 md:pb-6">
        {renderSection()}
      </main>
    </div>
  );
}
