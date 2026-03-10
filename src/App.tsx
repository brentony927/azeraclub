import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

import ProtectedLayout from "@/components/ProtectedLayout";
import HomeRoute from "@/components/HomeRoute";

// Lazy-loaded pages for code splitting
const Landing = lazy(() => import("./pages/Landing"));
const AI = lazy(() => import("./pages/AI"));
const Experiences = lazy(() => import("./pages/Experiences"));
const Travel = lazy(() => import("./pages/Travel"));
const Properties = lazy(() => import("./pages/Properties"));
const Social = lazy(() => import("./pages/Social"));
const Health = lazy(() => import("./pages/Health"));
const Networking = lazy(() => import("./pages/Networking"));
const Memories = lazy(() => import("./pages/Memories"));
const Profile = lazy(() => import("./pages/Profile"));
const Agenda = lazy(() => import("./pages/Agenda"));
const Journal = lazy(() => import("./pages/Journal"));
const IdeasVault = lazy(() => import("./pages/IdeasVault"));
const Objectives = lazy(() => import("./pages/Objectives"));
const Challenges = lazy(() => import("./pages/Challenges"));
const OpportunityRadar = lazy(() => import("./pages/OpportunityRadar"));
const TrendsRadar = lazy(() => import("./pages/TrendsRadar"));
const KnowledgeLibrary = lazy(() => import("./pages/KnowledgeLibrary"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Pricing = lazy(() => import("./pages/Pricing"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const CommunityGuidelines = lazy(() => import("./pages/CommunityGuidelines"));
const PaymentsPolicy = lazy(() => import("./pages/PaymentsPolicy"));
const SecurityPolicy = lazy(() => import("./pages/SecurityPolicy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Index = lazy(() => import("./pages/Index"));

// PRO pages
const SkillGrowth = lazy(() => import("./pages/SkillGrowth"));
const GoalBreakdown = lazy(() => import("./pages/GoalBreakdown"));
const DailyFocus = lazy(() => import("./pages/DailyFocus"));
const ContentStrategy = lazy(() => import("./pages/ContentStrategy"));
const ProductivityInsights = lazy(() => import("./pages/ProductivityInsights"));
const HabitBuilder = lazy(() => import("./pages/HabitBuilder"));
const ProjectOrganizer = lazy(() => import("./pages/ProjectOrganizer"));
const WeeklyReview = lazy(() => import("./pages/WeeklyReview"));

// BUSINESS pages
const InvestmentRadar = lazy(() => import("./pages/InvestmentRadar"));
const LifeSimulation = lazy(() => import("./pages/LifeSimulation"));
const WealthPlanner = lazy(() => import("./pages/WealthPlanner"));
const EliteEvents = lazy(() => import("./pages/EliteEvents"));
const StrategicPartners = lazy(() => import("./pages/StrategicPartners"));
const InvestorMatch = lazy(() => import("./pages/InvestorMatch"));
const EliteLibrary = lazy(() => import("./pages/EliteLibrary"));
const OpportunityAlerts = lazy(() => import("./pages/OpportunityAlerts"));
const AIAdvisor = lazy(() => import("./pages/AIAdvisor"));
const LifeMasterPlan = lazy(() => import("./pages/LifeMasterPlan"));

// Platform pages
const VentureBuilder = lazy(() => import("./pages/VentureBuilder"));
const FounderLeaderboard = lazy(() => import("./pages/FounderLeaderboard"));
const TrendScanner = lazy(() => import("./pages/TrendScanner"));
const WeeklyOpportunityReport = lazy(() => import("./pages/WeeklyOpportunityReport"));
const SavedItems = lazy(() => import("./pages/SavedItems"));
const StartupRankings = lazy(() => import("./pages/StartupRankings"));
const Suggestions = lazy(() => import("./pages/Suggestions"));

// Founder Alignment pages
const FounderMatch = lazy(() => import("./pages/FounderMatch"));
const FounderFeed = lazy(() => import("./pages/FounderFeed"));
const FounderProfile = lazy(() => import("./pages/FounderProfile"));
const FounderMessages = lazy(() => import("./pages/FounderMessages"));
const FounderOpportunities = lazy(() => import("./pages/FounderOpportunities"));
const FounderNotificationsPage = lazy(() => import("./pages/FounderNotificationsPage"));
const GlobalFounderMap = lazy(() => import("./pages/GlobalFounderMap"));
const Earn = lazy(() => import("./pages/Earn"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Capture referral param on mount
function ReferralCapture() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) {
    const existing = localStorage.getItem("azera_ref");
    if (!existing) {
      localStorage.setItem("azera_ref", ref);
      localStorage.setItem("azera_ref_ts", Date.now().toString());
    }
  }
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <SubscriptionProvider>
          <Suspense fallback={null}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomeRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/planos" element={<Pricing />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/payments-policy" element={<PaymentsPolicy />} />
            <Route path="/security-policy" element={<SecurityPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected routes with shared Layout */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Index />} />
              <Route path="/ia" element={<AI />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/networking" element={<Networking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/diario" element={<Journal />} />
              <Route path="/ideias" element={<IdeasVault />} />
              <Route path="/objetivos" element={<Objectives />} />
              <Route path="/desafios" element={<Challenges />} />
              <Route path="/radar-oportunidades" element={<OpportunityRadar />} />
              <Route path="/radar-tendencias" element={<TrendsRadar />} />
              <Route path="/biblioteca" element={<KnowledgeLibrary />} />

              {/* PRO routes */}
              <Route path="/skill-growth" element={<SkillGrowth />} />
              <Route path="/goal-planner" element={<GoalBreakdown />} />
              <Route path="/daily-focus" element={<DailyFocus />} />
              <Route path="/content-strategy" element={<ContentStrategy />} />
              <Route path="/productivity" element={<ProductivityInsights />} />
              <Route path="/habits" element={<HabitBuilder />} />
              <Route path="/projects" element={<ProjectOrganizer />} />
              <Route path="/weekly-review" element={<WeeklyReview />} />

              {/* BUSINESS routes */}
              <Route path="/investments" element={<InvestmentRadar />} />
              <Route path="/life-simulation" element={<LifeSimulation />} />
              <Route path="/wealth-strategy" element={<WealthPlanner />} />
              <Route path="/elite-events" element={<EliteEvents />} />
              <Route path="/strategic-partners" element={<StrategicPartners />} />
              <Route path="/investor-match" element={<InvestorMatch />} />
              <Route path="/elite-library" element={<EliteLibrary />} />
              <Route path="/opportunity-alerts" element={<OpportunityAlerts />} />
              <Route path="/ai-advisor" element={<AIAdvisor />} />
              <Route path="/life-master-plan" element={<LifeMasterPlan />} />

              {/* Platform routes */}
              <Route path="/venture-builder" element={<VentureBuilder />} />
              <Route path="/leaderboard" element={<FounderLeaderboard />} />
              <Route path="/trend-scanner" element={<TrendScanner />} />
              <Route path="/weekly-report" element={<WeeklyOpportunityReport />} />
              <Route path="/saved" element={<SavedItems />} />
              <Route path="/startup-rankings" element={<StartupRankings />} />
              <Route path="/sugestoes" element={<Suggestions />} />

              {/* Founder Alignment routes */}
              <Route path="/founder-match" element={<FounderMatch />} />
              <Route path="/founder-feed" element={<FounderFeed />} />
              <Route path="/founder-profile/:id" element={<FounderProfile />} />
              <Route path="/founder-messages" element={<FounderMessages />} />
              <Route path="/founder-opportunities" element={<FounderOpportunities />} />
              <Route path="/founder-notifications" element={<FounderNotificationsPage />} />
              <Route path="/global-map" element={<GlobalFounderMap />} />
              <Route path="/como-usar" element={<HowToUse />} />

              {/* Legacy routes */}
              <Route path="/experiencias" element={<Experiences />} />
              <Route path="/viagens" element={<Travel />} />
              <Route path="/propriedades" element={<Properties />} />
              <Route path="/social" element={<Social />} />
              <Route path="/saude" element={<Health />} />
              <Route path="/memorias" element={<Memories />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
