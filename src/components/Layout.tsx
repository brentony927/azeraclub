import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AzeraChatbot from "@/components/AzeraChatbot";
import { ThemeToggle } from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { useSubscription } from "@/contexts/SubscriptionContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { plan } = useSubscription();
  const isElite = plan === "elite";

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full animated-bg ${isElite ? "elite-theme" : ""}`}>
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border/30 px-4 shrink-0 backdrop-blur-xl bg-background/50">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8 relative z-10">
            {children}
          </main>
          <Footer />
        </div>
      </div>
      <AzeraChatbot />
    </SidebarProvider>
  );
}
