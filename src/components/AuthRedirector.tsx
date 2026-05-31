import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

export function AuthRedirector() {
  const { user, loading, userRole } = useAuth();
  const [forceLoad, setForceLoad] = useState(false);

  useEffect(() => {
    // If auth state is hanging for more than 4s, force the layout to resolve
    const timer = setTimeout(() => {
      if (loading) {
        setForceLoad(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && !forceLoad) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center pt-24 text-white">
        <div className="w-12 h-12 border-2 border-premium-gold border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role-based redirects
  if (userRole === 'super_admin' || userRole === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (userRole === 'manager') {
    return <Navigate to="/admin/operations" replace />;
  } else if (userRole === 'developer') {
    return <Navigate to="/admin/projects" replace />;
  } else if (userRole === 'designer') {
    return <Navigate to="/admin/projects" replace />;
  } else {
    // defaults to client portal for clients, pending, or unknown roles
    return <Navigate to="/client" replace />;
  }
}
