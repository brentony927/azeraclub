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
import Landing from "./pages/Landing";
import AI from "./pages/AI";
import Experiences from "./pages/Experiences";
import Travel from "./pages/Travel";
import Properties from "./pages/Properties";
import Social from "./pages/Social";
import Health from "./pages/Health";
import Networking from "./pages/Networking";
import Memories from "./pages/Memories";
import Profile from "./pages/Profile";
import Agenda from "./pages/Agenda";
import Journal from "./pages/Journal";
import IdeasVault from "./pages/IdeasVault";
import Objectives from "./pages/Objectives";
import Challenges from "./pages/Challenges";
import OpportunityRadar from "./pages/OpportunityRadar";
import TrendsRadar from "./pages/TrendsRadar";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Pricing from "./pages/Pricing";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// PRO pages
import SkillGrowth from "./pages/SkillGrowth";
import GoalBreakdown from "./pages/GoalBreakdown";
import DailyFocus from "./pages/DailyFocus";
import ContentStrategy from "./pages/ContentStrategy";
import ProductivityInsights from "./pages/ProductivityInsights";
import HabitBuilder from "./pages/HabitBuilder";
import ProjectOrganizer from "./pages/ProjectOrganizer";
import WeeklyReview from "./pages/WeeklyReview";

// BUSINESS pages
import InvestmentRadar from "./pages/InvestmentRadar";
import LifeSimulation from "./pages/LifeSimulation";
import WealthPlanner from "./pages/WealthPlanner";
import EliteEvents from "./pages/EliteEvents";
import StrategicPartners from "./pages/StrategicPartners";
import InvestorMatch from "./pages/InvestorMatch";
import EliteLibrary from "./pages/EliteLibrary";
import OpportunityAlerts from "./pages/OpportunityAlerts";
import AIAdvisor from "./pages/AIAdvisor";
import LifeMasterPlan from "./pages/LifeMasterPlan";

// Platform pages
import VentureBuilder from "./pages/VentureBuilder";
import FounderLeaderboard from "./pages/FounderLeaderboard";
import TrendScanner from "./pages/TrendScanner";
import WeeklyOpportunityReport from "./pages/WeeklyOpportunityReport";
import SavedItems from "./pages/SavedItems";
import StartupRankings from "./pages/StartupRankings";

// Founder Alignment pages
import FounderMatch from "./pages/FounderMatch";
import FounderFeed from "./pages/FounderFeed";
import FounderProfile from "./pages/FounderProfile";
import FounderMessages from "./pages/FounderMessages";
import FounderOpportunities from "./pages/FounderOpportunities";
import FounderNotificationsPage from "./pages/FounderNotificationsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
          
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

              {/* Founder Alignment routes */}
              <Route path="/founder-match" element={<FounderMatch />} />
              <Route path="/founder-feed" element={<FounderFeed />} />
              <Route path="/founder-profile/:id" element={<FounderProfile />} />
              <Route path="/founder-messages" element={<FounderMessages />} />
              <Route path="/founder-opportunities" element={<FounderOpportunities />} />
              <Route path="/founder-notifications" element={<FounderNotificationsPage />} />

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
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
