import {
  LayoutDashboard,
  Brain,
  CalendarDays,
  Handshake,
  UserCircle,
  LogOut,
  BookOpen,
  Lightbulb,
  Target,
  Flame,
  Radar,
  TrendingUp,
  Library,
  Crown,
  CreditCard,
  GraduationCap,
  Crosshair,
  Focus,
  PenTool,
  BarChart3,
  Repeat,
  FolderKanban,
  CalendarCheck,
  PiggyBank,
  Globe,
  DollarSign,
  Users,
  Link,
  BookMarked,
  Bell,
  BrainCircuit,
  Map,
  Rocket,
  MessageSquare,
  Briefcase,
  Trophy,
  FileText,
  Star,
  Scan,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import azeraLogo from "@/assets/azera-logo.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Início", url: "/dashboard", icon: LayoutDashboard },
  { title: "IA", url: "/ia", icon: Brain },
  { title: "Agenda", url: "/agenda", icon: CalendarDays },
  { title: "Networking", url: "/networking", icon: Handshake },
  { title: "Perfil", url: "/profile", icon: UserCircle },
  { title: "Planos", url: "/planos", icon: CreditCard },
];

const toolItems = [
  { title: "Diário", url: "/diario", icon: BookOpen },
  { title: "Cofre de Ideias", url: "/ideias", icon: Lightbulb },
  { title: "Objetivos", url: "/objetivos", icon: Target },
  { title: "Desafios", url: "/desafios", icon: Flame },
];

const radarItems = [
  { title: "Oportunidades", url: "/radar-oportunidades", icon: Radar },
  { title: "Tendências", url: "/radar-tendencias", icon: TrendingUp },
  { title: "Biblioteca", url: "/biblioteca", icon: Library },
];

const proItems = [
  { title: "Crescimento", url: "/skill-growth", icon: GraduationCap },
  { title: "Plano de Metas", url: "/goal-planner", icon: Crosshair },
  { title: "Foco Diário", url: "/daily-focus", icon: Focus },
  { title: "Estratégia de Conteúdo", url: "/content-strategy", icon: PenTool },
  { title: "Produtividade", url: "/productivity", icon: BarChart3 },
  { title: "Hábitos", url: "/habits", icon: Repeat },
  { title: "Projetos", url: "/projects", icon: FolderKanban },
  { title: "Revisão Semanal", url: "/weekly-review", icon: CalendarCheck },
];

const businessItems = [
  { title: "Investimentos", url: "/investments", icon: PiggyBank },
  { title: "Simulação de Vida", url: "/life-simulation", icon: Globe },
  { title: "Estratégia Financeira", url: "/wealth-strategy", icon: DollarSign },
  { title: "Eventos Exclusivos", url: "/elite-events", icon: Crown },
  { title: "Parceiros", url: "/strategic-partners", icon: Users },
  { title: "Match de Investidores", url: "/investor-match", icon: Link },
  { title: "Biblioteca Elite", url: "/elite-library", icon: BookMarked },
  { title: "Alertas", url: "/opportunity-alerts", icon: Bell },
  { title: "Consultor IA", url: "/ai-advisor", icon: BrainCircuit },
  { title: "Plano de Vida", url: "/life-master-plan", icon: Map },
];

const founderItems = [
  { title: "Founder Feed", url: "/founder-feed", icon: Users },
  { title: "Oportunidades", url: "/founder-opportunities", icon: Briefcase },
  { title: "Mensagens", url: "/founder-messages", icon: MessageSquare },
  { title: "Notificações", url: "/founder-notifications", icon: Bell },
];

const platformItems = [
  { title: "Venture Builder", url: "/venture-builder", icon: Rocket },
  { title: "Ranking Startups", url: "/startup-rankings", icon: Trophy },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Trend Scanner", url: "/trend-scanner", icon: Scan },
  { title: "Weekly Report", url: "/weekly-report", icon: FileText },
  { title: "Salvos", url: "/saved", icon: Star },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { plan } = useSubscription();

  const isPremium = plan === "pro" || plan === "business";

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const renderItems = (items: typeof mainItems) =>
    items.map((navItem) => {
      const isActive =
        navItem.url === "/"
          ? location.pathname === "/"
          : location.pathname.startsWith(navItem.url);

      return (
        <SidebarMenuItem key={navItem.title}>
          <SidebarMenuButton asChild className="h-11 mb-0.5">
            <NavLink
              to={navItem.url}
              end={navItem.url === "/"}
              className={`flex items-center gap-3 px-3 transition-all duration-300 ${
                isActive
                  ? "bg-primary/10 text-accent border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <navItem.icon className={`h-4 w-4 ${isActive ? "text-accent" : ""}`} />
              {!collapsed && <span className="text-sm font-medium">{navItem.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <img src={azeraLogo} alt="AZERA" className="w-8 h-8 rounded object-contain" />
          {!collapsed && (
            <div>
              <h2 className="text-lg font-serif font-bold moss-text tracking-wider">AZERA CLUB</h2>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Inteligência & Networking</p>
                 {plan !== "free" && (
                   <span className="badge-plan text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">
                     {plan.toUpperCase()}
                   </span>
                 )}
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Founder Match — TOP, golden gradient */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="px-3 mb-1 flex items-center gap-1.5">
              <Rocket className="h-3.5 w-3.5 founder-sidebar-icon" />
              <span className="text-[10px] uppercase tracking-wider font-bold founder-sidebar-label">Founder Alignment</span>
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {founderItems.map((navItem) => {
                const isActive = location.pathname.startsWith(navItem.url);
                return (
                  <SidebarMenuItem key={navItem.title}>
                    <SidebarMenuButton asChild className="h-11 mb-0.5">
                      <NavLink
                        to={navItem.url}
                        className={`flex items-center gap-3 px-3 transition-all duration-300 ${
                          isActive
                            ? "founder-sidebar-item-active"
                            : "founder-sidebar-item"
                        }`}
                      >
                        <navItem.icon className={`h-4 w-4 ${isActive ? "founder-sidebar-icon-active" : "founder-sidebar-icon"}`} />
                        {!collapsed && <span className="text-sm font-medium founder-sidebar-text">{navItem.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3 mb-1">Ferramentas</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(toolItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3 mb-1">Radares</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(radarItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3 mb-1">Pro</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(proItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3 mb-1">Business</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(businessItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-3 mb-1">Plataforma</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(platformItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-foreground">{initials}</span>
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleSignOut} className="text-muted-foreground hover:text-destructive transition-colors" title="Sair">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
