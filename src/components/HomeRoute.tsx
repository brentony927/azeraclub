import { useAuth } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import Layout from "@/components/Layout";
import Landing from "@/pages/Landing";

const Index = lazy(() => import("@/pages/Index"));

export default function HomeRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-lg gold-gradient animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return (
    <Layout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 rounded-lg gold-gradient animate-pulse" /></div>}>
        <Index />
      </Suspense>
    </Layout>
  );
}
