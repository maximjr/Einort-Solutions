import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

// Sends each Core Web Vital to Firebase Analytics as a custom event.
// This requires no backend endpoint — events appear in the Firebase console
// under Analytics > Events with names like `web_vital_lcp`.
//
// If a custom handler is provided (e.g. for testing), it receives the raw metric
// instead of the Firebase path.
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void): void {
  const report = (metric: Metric): void => {
    if (onPerfEntry) {
      onPerfEntry(metric);
      return;
    }

    // Dynamic import keeps analytics out of the critical path — if it fails
    // (e.g. ad blocker, no Analytics SDK), vitals collection degrades silently.
    import("firebase/analytics")
      .then(({ logEvent }) =>
        import("../lib/firebase").then(({ analytics }) => {
          if (!analytics) return;
          logEvent(analytics, `web_vital_${metric.name.toLowerCase()}` as never, {
            value:          Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
            rating:         metric.rating,
            delta:          Math.round(metric.delta),
            id:             metric.id,
            navigation_type: metric.navigationType,
          });
        }),
      )
      .catch(() => {/* analytics blocked — degrade silently */});
  };

  onCLS(report);
  onFCP(report);
  onINP(report);
  onLCP(report);
  onTTFB(report);
}
