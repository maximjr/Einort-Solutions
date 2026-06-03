import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { isFirebaseConfigured } from "../../lib/firebase";

export function ProtectedRoute({ requireAdmin = false }) {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isFirebaseConfigured) {
    return <Outlet />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin) {
    if (
      !userData ||
      (userData.role !== "admin" &&
        userData.role !== "super_admin" &&
        !userData.isAdmin)
    ) {
      return <Navigate to="/client-portal" replace />;
    }
  }

  return <Outlet />;
}
