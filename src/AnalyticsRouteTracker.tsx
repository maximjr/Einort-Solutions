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

    let type: any = 'page_visit';
    let details = `Visited page: ${p}`;

    if (p.startsWith('/services')) {
      type = 'opened_services';
      details = `Explored services: ${p}`;
    } else if (p === '/pricing') {
      type = 'viewed_pricing';
      details = 'Explored pricing plans & tier parameters';
    } else if (p === '/book') {
      type = 'page_visit';
      details = 'Opened scheduling manager';
    } else if (p === '/client') {
      type = 'page_visit';
      details = 'Opened Client Portal dashboard';
    } else if (p === '/work') {
      type = 'page_visit';
      details = 'Explored architectural portfolio';
    } else if (p === '/about') {
      type = 'page_visit';
      details = 'Explored agency info and manifesto';
    } else if (p === '/process') {
      type = 'page_visit';
      details = 'Viewed standard engineering process';
    } else if (p === '/audit') {
      type = 'page_visit';
      details = 'Opened interactive automated AI audit scanner';
    } else if (p === '/') {
      type = 'page_visit';
      details = 'Landed on home landing dashboard';
    }

    if (type) {
      logClientActivity(user?.uid || null, user?.email || null, type, details);
    }
  }, [location.pathname, user?.uid]); // Deliberately un-memoize email to avoid extra reruns

  return null;
}
