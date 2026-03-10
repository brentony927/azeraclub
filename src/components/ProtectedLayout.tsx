import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { LoadingBreadcrumb } from "@/components/ui/animated-loading-svg-text-shimmer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ban } from "lucide-react";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  const [banned, setBanned] = useState(false);
  const [checkingBan, setCheckingBan] = useState(true);

  useEffect(() => {
    if (!user) { setCheckingBan(false); return; }
    supabase.from("user_moderation" as any)
      .select("id, action, expires_at")
      .eq("user_id", user.id)
      .eq("action", "ban")
      .then(({ data }) => {
        const activeBan = (data || []).some((m: any) =>
          !m.expires_at || new Date(m.expires_at) > new Date()
        );
        setBanned(activeBan);
        setCheckingBan(false);
      });
  }, [user]);

  if (loading || checkingBan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingBreadcrumb />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (banned) {
    return (
      <div className="banned-overlay">
        <div className="text-center space-y-4 p-8 max-w-md">
          <Ban className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Conta Suspensa</h1>
          <p className="text-muted-foreground">
            A sua conta foi suspensa por violação das diretrizes da comunidade. 
            Contacte o suporte se acredita que isto é um erro.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-primary hover:underline"
          >
            Sair da conta
          </button>
        </div>
      </div>
    );
  }

  return <Layout />;
}

