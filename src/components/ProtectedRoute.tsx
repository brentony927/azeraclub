import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { LoadingBreadcrumb } from "@/components/ui/animated-loading-svg-text-shimmer";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingBreadcrumb />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
