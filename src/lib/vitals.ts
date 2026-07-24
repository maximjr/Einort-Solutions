import { AnalyticsService } from "./analytics";
import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from "web-vitals";

const VITALS_ENDPOINT =
  import.meta.env.VITE_ANALYTICS_ENDPOINT || "/api/vitals";

export function reportWebVitals(onPerfEntry?: (metric: Metric) => void) {
  const sendToAnalytics = (metric: Metric) => {
    // If a custom handler is provided, use it
    if (onPerfEntry && onPerfEntry instanceof Function) {
      onPerfEntry(metric);
      return;
    }

    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      entries: metric.entries,
      id: metric.id,
      navigationType: metric.navigationType,
      href: location.href,
    });

    try {
      // Send metric to our unified analytics service
      AnalyticsService.trackPerformance({ metric: metric.name, value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value) });
    } catch (error) {
      // Failed to send web vitals silently
    }
  };

  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
