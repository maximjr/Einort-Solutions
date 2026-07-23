import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initMetaPixel, trackPageView } from "../../lib/analytics/meta-pixel";

export function MetaPixelTracker() {
  const location = useLocation();

  useEffect(() => {
    // Initialize Pixel once when component mounts
    initMetaPixel();
  }, []);

  useEffect(() => {
    // Track PageView on route change
    // Using setTimeout to ensure it fires after the route is fully rendered and title is updated
    const timeoutId = setTimeout(() => {
      trackPageView();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  return null;
}
