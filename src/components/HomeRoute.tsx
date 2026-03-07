import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";

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

  // User is authenticated — redirect to the nested "/" inside ProtectedLayout
  return <Navigate to="/inicio" replace />;
}
