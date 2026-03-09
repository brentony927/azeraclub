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
  MessageSquarePlus,
  Briefcase,
  Trophy,
  FileText,
  Star,
  Scan,
  ChevronRight,
  Wrench,
  Activity,
  Zap,
  Building2,
  Layers,
  HelpCircle } from
"lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAzeraLogo } from "@/hooks/useAzeraLogo";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar } from
"@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent } from
"@/components/ui/collapsible";
import { useState, useEffect, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type NavItem = {title: string;url: string;icon: LucideIcon;};

const mainItems: NavItem[] = [
{ title: "Início", url: "/dashboard", icon: LayoutDashboard },
{ title: "IA", url: "/ia", icon: Brain },
{ title: "Agenda", url: "/agenda", icon: CalendarDays },
{ title: "Networking", url: "/networking", icon: Handshake },
{ title: "Perfil", url: "/profile", icon: UserCircle },
{ title: "Planos", url: "/planos", icon: CreditCard },
{ title: "Sugestões", url: "/sugestoes", icon: MessageSquarePlus },
{ title: "Como Usar", url: "/como-usar", icon: HelpCircle }];


const toolItems: NavItem[] = [
{ title: "Diário", url: "/diario", icon: BookOpen },
{ title: "Cofre de Ideias", url: "/ideias", icon: Lightbulb },
{ title: "Objetivos", url: "/objetivos", icon: Target },
{ title: "Desafios", url: "/desafios", icon: Flame }];


const radarItems: NavItem[] = [
{ title: "Oportunidades", url: "/radar-oportunidades", icon: Radar },
{ title: "Tendências", url: "/radar-tendencias", icon: TrendingUp },
{ title: "Biblioteca", url: "/biblioteca", icon: Library }];


const proItems: NavItem[] = [
{ title: "Crescimento", url: "/skill-growth", icon: GraduationCap },
{ title: "Plano de Metas", url: "/goal-planner", icon: Crosshair },
{ title: "Foco Diário", url: "/daily-focus", icon: Focus },
{ title: "Estratégia de Conteúdo", url: "/content-strategy", icon: PenTool },
{ title: "Produtividade", url: "/productivity", icon: BarChart3 },
{ title: "Hábitos", url: "/habits", icon: Repeat },
{ title: "Projetos", url: "/projects", icon: FolderKanban },
{ title: "Revisão Semanal", url: "/weekly-review", icon: CalendarCheck }];


const businessItems: NavItem[] = [
{ title: "Investimentos", url: "/investments", icon: PiggyBank },
{ title: "Simulação de Vida", url: "/life-simulation", icon: Globe },
{ title: "Estratégia Financeira", url: "/wealth-strategy", icon: DollarSign },
{ title: "Eventos Exclusivos", url: "/elite-events", icon: Crown },
{ title: "Parceiros", url: "/strategic-partners", icon: Users },
{ title: "Match de Investidores", url: "/investor-match", icon: Link },
{ title: "Biblioteca Elite", url: "/elite-library", icon: BookMarked },
{ title: "Alertas", url: "/opportunity-alerts", icon: Bell },
{ title: "Consultor IA", url: "/ai-advisor", icon: BrainCircuit },
{ title: "Plano de Vida", url: "/life-master-plan", icon: Map }];


const founderItems: NavItem[] = [
{ title: "Feed de Founders", url: "/founder-feed", icon: Users },
{ title: "Mapa Global", url: "/global-map", icon: Globe },
{ title: "Oportunidades", url: "/founder-opportunities", icon: Briefcase },
{ title: "Mensagens", url: "/founder-messages", icon: MessageSquare },
{ title: "Notificações", url: "/founder-notifications", icon: Bell }];


const platformItems: NavItem[] = [
{ title: "Construtor de Ventures", url: "/venture-builder", icon: Rocket },
{ title: "Ranking de Startups", url: "/startup-rankings", icon: Trophy },
{ title: "Classificação", url: "/leaderboard", icon: Trophy },
{ title: "Scanner de Tendências", url: "/trend-scanner", icon: Scan },
{ title: "Relatório Semanal", url: "/weekly-report", icon: FileText },
{ title: "Salvos", url: "/saved", icon: Star }];


interface CollapsibleGroupProps {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavItem[];
  open: boolean;
  onToggle: () => void;
  collapsed: boolean;
  renderItems: (items: NavItem[]) => ReactNode;
}

function CollapsibleGroup({
  id,
  label,
  icon: Icon,
  items,
  open,
  onToggle,
  collapsed,
  renderItems
}: CollapsibleGroupProps) {
  if (collapsed) {
    // When sidebar is icon-only, just show items without collapsible wrapper
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>{renderItems(items)}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>);

  }

  return (
    <SidebarGroup>
      <Collapsible open={open} onOpenChange={onToggle}>
        <CollapsibleTrigger className={`sidebar-collapsible-trigger ${!open ? "sidebar-group-label-collapsed" : ""}`}>
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 opacity-60" />
            <span className="text-[10px] uppercase tracking-wider font-bold">{label}</span>
          </div>
          <ChevronRight
            className={`h-3.5 w-3.5 opacity-50 transition-transform duration-300 ${open ? "rotate-90" : ""}`} />
          
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(items)}</SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>);

}

const collapsibleGroups = [
{ id: "tools", label: "Ferramentas", icon: Wrench, items: toolItems },
{ id: "radars", label: "Radares", icon: Activity, items: radarItems },
{ id: "pro", label: "Pro", icon: Zap, items: proItems },
{ id: "business", label: "Business", icon: Building2, items: businessItems },
{ id: "platform", label: "Plataforma", icon: Layers, items: platformItems }];


export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { plan } = useSubscription();

  const isPremium = plan === "pro" || plan === "business";

  // Determine which groups should be open based on active route
  const getInitialOpen = () => {
    const result: Record<string, boolean> = {};
    for (const group of collapsibleGroups) {
      result[group.id] = group.items.some((item) =>
      location.pathname.startsWith(item.url)
      );
    }
    return result;
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(getInitialOpen);

  // Auto-open group when route changes
  useEffect(() => {
    for (const group of collapsibleGroups) {
      if (group.items.some((item) => location.pathname.startsWith(item.url))) {
        setOpenGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    }
  }, [location.pathname]);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const displayName =
  user?.user_metadata?.full_name ||
  user?.user_metadata?.name ||
  user?.email?.split("@")[0] ||
  "Usuário";

  const initials = displayName.
  split(" ").
  map((n: string) => n[0]).
  join("").
  slice(0, 2).
  toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  const azeraLogo = useAzeraLogo();

  const { setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    setOpenMobile(false);
  };

  const renderItems = (items: NavItem[]) =>
  items.map((navItem) => {
    const isActive =
    navItem.url === "/" ?
    location.pathname === "/" :
    location.pathname.startsWith(navItem.url);

    return (
      <SidebarMenuItem key={navItem.title}>
          <SidebarMenuButton asChild className="h-11 mb-0.5">
            <NavLink
            to={navItem.url}
            end={navItem.url === "/"}
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-3 sidebar-nav-item ${
            isActive ? "sidebar-nav-item-active" : ""} ${navItem.url === "/planos" ? "sidebar-plans-glow" : ""}`
            }>
            
              <navItem.icon className="h-4 w-4 sidebar-nav-icon" />
              {!collapsed && <span className="text-sm font-medium">{navItem.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>);

  });

  // Sidebar-specific theme state
  const { theme: globalTheme } = useTheme();
  const [sidebarTheme, setSidebarTheme] = useState<"system" | "light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("azera-sidebar-theme") as "system" | "light" | "dark") || "system";
    }
    return "system";
  });

  // Calculate effective sidebar theme
  const effectiveTheme = sidebarTheme === "system" ? globalTheme : sidebarTheme;
  const isSidebarDark = effectiveTheme === "dark";

  // Save sidebar theme preference
  useEffect(() => {
    localStorage.setItem("azera-sidebar-theme", sidebarTheme);
  }, [sidebarTheme]);

  // Toggle sidebar theme
  const toggleSidebarTheme = () => {
    setSidebarTheme(current => {
      if (current === "system") return "light";
      if (current === "light") return "dark";
      return "system";
    });
  };

  const themeToggleButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebarTheme}
      className="sidebar-theme-toggle relative overflow-hidden rounded-full h-7 w-7"
      title={`Sidebar: ${sidebarTheme === "system" ? "Auto" : sidebarTheme === "light" ? "Claro" : "Escuro"}`}
    >
      <Sun className={`h-3.5 w-3.5 transition-all ${isSidebarDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
      <Moon className={`absolute h-3.5 w-3.5 transition-all ${isSidebarDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
    </Button>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50" data-sidebar-theme={effectiveTheme}>
      <SidebarHeader className="p-4 border-b border-border/30">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src={azeraLogo} alt="AZERA" className="w-8 h-8 rounded object-contain" />
              <div>
                <h2 className="text-lg font-serif font-bold azera-brand-text tracking-wider">AZERA CLUB</h2>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Inteligência & Networking</p>
                  <span className="badge-plan text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wider">
                    {plan === "free" || plan === "basic" ? "FOUNDER" : plan.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            {themeToggleButton}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img src={azeraLogo} alt="AZERA" className="w-8 h-8 rounded object-contain" />
            {themeToggleButton}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {/* Main — always visible */}
        <SidebarGroup className="border-[#0f1512]">
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Founder Match — always visible, golden gradient */}
        <SidebarGroup>
          {!collapsed &&
          <div className="px-3 mb-1 flex items-center gap-1.5">
              <Rocket className="h-3.5 w-3.5 founder-sidebar-icon" />
              <span className="text-[10px] uppercase tracking-wider font-bold founder-sidebar-label">Alinhamento de Founders</span>
            </div>
          }
          <SidebarGroupContent>
            <SidebarMenu>
              {founderItems.map((navItem) => {
                const isActive = location.pathname.startsWith(navItem.url);
                return (
                  <SidebarMenuItem key={navItem.title}>
                    <SidebarMenuButton asChild className="h-11 mb-0.5">
                      <NavLink
                        to={navItem.url}
                        onClick={handleNavClick}
                        className={`flex items-center gap-3 px-3 transition-all duration-300 ${
                        isActive ?
                        "founder-sidebar-item-active" :
                        "founder-sidebar-item"}`
                        }>
                        
                        <navItem.icon className={`h-4 w-4 ${isActive ? "founder-sidebar-icon-active" : "founder-sidebar-icon"}`} />
                        {!collapsed && <span className="text-sm font-medium founder-sidebar-text">{navItem.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>);

              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collapsible groups */}
        {collapsibleGroups.map((group) =>
        <CollapsibleGroup
          key={group.id}
          id={group.id}
          label={group.label}
          icon={group.icon}
          items={group.items}
          open={!!openGroups[group.id]}
          onToggle={() => toggleGroup(group.id)}
          collapsed={collapsed}
          renderItems={renderItems} />

        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/30">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 ${isPremium ? "avatar-ring" : ""}`}>
            {user?.user_metadata?.avatar_url ?
            <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> :

            <span className="text-xs font-medium text-foreground">{initials}</span>
            }
          </div>
          {!collapsed &&
          <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          }
          {!collapsed &&
          <button onClick={handleSignOut} className="text-muted-foreground hover:text-destructive transition-colors" title="Sair">
              <LogOut className="h-4 w-4" />
            </button>
          }
        </div>
      </SidebarFooter>
    </Sidebar>);

}