import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Layout from "@/components/Layout";
import UpgradeCelebration from "@/components/UpgradeCelebration";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
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
import Dashboard from "./pages/Index";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";

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
          <UpgradeCelebration />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/planos" element={<Pricing />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Layout><Index /></Layout></ProtectedRoute>} />
            <Route path="/ia" element={<ProtectedRoute><Layout><AI /></Layout></ProtectedRoute>} />
            <Route path="/agenda" element={<ProtectedRoute><Layout><Agenda /></Layout></ProtectedRoute>} />
            <Route path="/networking" element={<ProtectedRoute><Layout><Networking /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
            <Route path="/diario" element={<ProtectedRoute><Layout><Journal /></Layout></ProtectedRoute>} />
            <Route path="/ideias" element={<ProtectedRoute><Layout><IdeasVault /></Layout></ProtectedRoute>} />
            <Route path="/objetivos" element={<ProtectedRoute><Layout><Objectives /></Layout></ProtectedRoute>} />
            <Route path="/desafios" element={<ProtectedRoute><Layout><Challenges /></Layout></ProtectedRoute>} />
            <Route path="/radar-oportunidades" element={<ProtectedRoute><Layout><OpportunityRadar /></Layout></ProtectedRoute>} />
            <Route path="/radar-tendencias" element={<ProtectedRoute><Layout><TrendsRadar /></Layout></ProtectedRoute>} />
            <Route path="/biblioteca" element={<ProtectedRoute><Layout><KnowledgeLibrary /></Layout></ProtectedRoute>} />
            {/* Legacy routes */}
            <Route path="/experiencias" element={<ProtectedRoute><Layout><Experiences /></Layout></ProtectedRoute>} />
            <Route path="/viagens" element={<ProtectedRoute><Layout><Travel /></Layout></ProtectedRoute>} />
            <Route path="/propriedades" element={<ProtectedRoute><Layout><Properties /></Layout></ProtectedRoute>} />
            <Route path="/social" element={<ProtectedRoute><Layout><Social /></Layout></ProtectedRoute>} />
            <Route path="/saude" element={<ProtectedRoute><Layout><Health /></Layout></ProtectedRoute>} />
            <Route path="/memorias" element={<ProtectedRoute><Layout><Memories /></Layout></ProtectedRoute>} />
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
