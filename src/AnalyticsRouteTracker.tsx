import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { logClientActivity } from './utils/activityLogger';

export function AnalyticsRouteTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // We only log top-level client pages for now to avoid noise
    const p = location.pathname;
    
    // Admin routes are not relevant for client activity
    if (p.startsWith('/admin')) return;
    
    // Ignore studio since it already logs
    if (p.startsWith('/studio')) return;

    let type: any = 'custom_action';
    let details = `Opened page: ${p}`;

    if (p.startsWith('/services')) {
      type = 'opened_services';
      details = `Explored services: ${p}`;
    } else if (p === '/pricing') {
      type = 'custom_action';
      details = 'Explored pricing';
    } else if (p === '/book') {
      type = 'custom_action';
      details = 'Opened booking page';
    } else if (p === '/client') {
      type = 'custom_action';
      details = 'Opened client portal';
    } else if (p === '/work') {
      type = 'custom_action';
      details = 'Explored portfolio';
    } else if (p === '/') {
      return; // Handled by standard impressions optionally
    }

    if (type) {
      logClientActivity(user?.uid || null, user?.email || null, type, details);
    }
  }, [location.pathname, user?.uid]); // Deliberately un-memoize email to avoid extra reruns

  return null;
}
