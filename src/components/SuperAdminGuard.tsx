import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SuperAdminGuardProps {
  children: ReactNode;
}

/**
 * SuperAdminGuard validates that a user is logged in and has the 'super_admin' user role.
 * If the validation fails (the role is missing or does not match 'super_admin'),
 * it performs a secure redirect to the home page.
 */
export function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const [forceLoad, setForceLoad] = useState(false);

  useEffect(() => {
    // Timeout buffer for Firebase auth resolution
    const timer = setTimeout(() => {
      if (loading) {
        setForceLoad(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!loading || forceLoad) {
      if (!user || !userRole || userRole !== 'super_admin') {
        console.warn(`[Security Alert] Unauthorized dashboard access attempt. Underprivileged role: "${userRole}". Redirecting to Home.`);
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, userRole, navigate, forceLoad]);

  if (loading && !forceLoad) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only render children if user is successfully validated as super_admin
  if (user && userRole === 'super_admin') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin"></div>
    </div>
  );
}
