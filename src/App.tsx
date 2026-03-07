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
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

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

            {/* Protected routes with shared Layout */}
            <Route element={<ProtectedLayout />}>
              <Route path="/inicio" element={<Landing />} />
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
