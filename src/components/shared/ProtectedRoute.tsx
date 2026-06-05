import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ requireAdmin = false }) {
  const { user, userData, loading } = useAuth();
  const [showRefresh, setShowRefresh] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setShowRefresh(true);
      }, 5000);
    } else {
      setShowRefresh(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        {showRefresh && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in duration-500 max-w-sm text-center">
            <p className="text-sm text-slate-400">Authentication is taking longer than expected.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-xs bg-white/5 hover:bg-white/10 text-white px-4 py-2 border border-white/10 rounded tracking-wider uppercase"
            >
              Force Refresh Session
            </button>
          </div>
        )}
      </div>
    );
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
