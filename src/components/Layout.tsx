import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AzeraChatbot from "@/components/AzeraChatbot";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import EliteBackground from "@/components/EliteBackground";
import PageTransition from "@/components/PageTransition";

export default function Layout() {
  const { plan } = useSubscription();
  const isPremium = plan === "pro" || plan === "business";
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== "/dashboard";

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full animated-bg ${isPremium ? "elite-theme" : ""}`}>
        {isPremium && <EliteBackground />}
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header
            className={`h-14 flex items-center justify-between border-b border-border/30 px-4 shrink-0 ${
              isPremium
                ? "elite-header"
                : "backdrop-blur-xl bg-background/50"
            }`}
          >
            <div className="flex items-center gap-2">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md transition-colors ${
                    isPremium
                      ? "elite-back-btn"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  aria-label="Voltar"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <SidebarTrigger className="text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center" />
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8 relative z-10">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </div>
      <AzeraChatbot />
    </SidebarProvider>
  );
}
