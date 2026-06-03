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
      // Use `navigator.sendBeacon()` if available, otherwise fallback to `fetch()`
      if (navigator.sendBeacon) {
        navigator.sendBeacon(VITALS_ENDPOINT, body);
      } else {
        fetch(VITALS_ENDPOINT, { body, method: "POST", keepalive: true });
      }
    } catch (error) {
      console.error("Failed to send web vitals", error);
    }

    if (import.meta.env.DEV) {
      console.log(
        `[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`,
      );
    }
  };

  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
