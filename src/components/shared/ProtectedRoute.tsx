import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({
  requireAdmin = false,
}: {
  requireAdmin?: boolean;
}) {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // We could pass state to trigger the login modal upon redirection if we wanted,
    // but for now redirecting to home is simple.
    return <Navigate to="/" replace />;
  }

  const isUserAdmin =
    userData?.role === "admin" ||
    userData?.role === "super_admin" ||
    userData?.isAdmin === true;

  if (requireAdmin && !isUserAdmin) {
    return <Navigate to="/client-portal" replace />;
  }

  return <Outlet />;
}
