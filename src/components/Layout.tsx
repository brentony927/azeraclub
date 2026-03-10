import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AzeraChatbot from "@/components/AzeraChatbot";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingNotification from "@/components/FloatingNotification";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import EliteBackground from "@/components/EliteBackground";
import PageTransition from "@/components/PageTransition";
import DevelopmentBanner from "@/components/DevelopmentBanner";
import BackgroundToggle, { useBackgroundMode } from "@/components/BackgroundToggle";
import CommandPalette from "@/components/CommandPalette";

export default function Layout() {
  const { plan } = useSubscription();
  const { user } = useAuth();
  const isPremium = plan === "pro" || plan === "business";
  const [bgMode, setBgMode] = useBackgroundMode();
  const [isOwner, setIsOwner] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== "/dashboard";

  useEffect(() => {
    if (!user) return;
    supabase.from("founder_profiles").select("is_site_owner").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data?.is_site_owner) setIsOwner(true); });
  }, [user]);

  const themeClass = useMemo(() => {
    if (isOwner) return "owner-theme";
    if (plan === "business") return "business-theme";
    if (plan === "pro") return "pro-theme";
    return "";
  }, [plan, isOwner]);

  const backBtnClass = isOwner
    ? "text-destructive hover:text-destructive hover:bg-destructive/10"
    : plan === "business" ? "business-back-btn" : plan === "pro" ? "pro-back-btn" : "text-muted-foreground hover:text-foreground hover:bg-accent";

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full animated-bg ${themeClass}`}>
        {/* Minimalist background animation */}
        {bgMode === "animated" && (
          <>
            <div className="page-bg-animation">
              <div className="page-bg-orb page-bg-orb-1" />
              <div className="page-bg-orb page-bg-orb-2" />
              <div className="page-bg-orb page-bg-orb-3" />
            </div>
            {isPremium && <EliteBackground plan={plan} />}
          </>
        )}
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header
            className={`h-12 flex items-center justify-between px-4 shrink-0 relative ${
              isPremium || isOwner
                ? "elite-header"
                : "backdrop-blur-xl bg-background/60"
            }`}
          >
            <div className="flex items-center gap-2">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-colors ${backBtnClass}`}
                  aria-label="Voltar"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <SidebarTrigger className="text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center" />
            </div>
            <div className="flex items-center gap-1">
              <CommandPalette />
              {isPremium && <BackgroundToggle mode={bgMode} onToggle={setBgMode} />}
              <ThemeToggle />
            </div>
            {/* Gradient line instead of solid border */}
            <div className="absolute bottom-0 left-0 right-0 header-gradient-line" />
          </header>
          <main className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8 relative z-10">
            <DevelopmentBanner />
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </main>
          <div className="hidden md:block">
            <Footer />
          </div>
        </div>
      </div>
      <MobileBottomNav />
      <FloatingNotification />
      <AzeraChatbot />
    </SidebarProvider>
  );
}

