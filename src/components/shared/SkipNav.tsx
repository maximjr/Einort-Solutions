/**
 * WCAG 2.1 SC 2.4.1 — Bypass Blocks (Level A).
 * Renders a visually hidden link that becomes visible on keyboard focus,
 * allowing keyboard users to jump directly to the main content region
 * without tabbing through the entire navigation on every page.
 */
export function SkipNav() {
  return (
    <a
      href="#main-content"
      className={[
        "sr-only focus:not-sr-only",
        "fixed top-4 left-4 z-[200]",
        "px-4 py-2 rounded-lg",
        "bg-primary text-white text-sm font-bold",
        "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-background",
      ].join(" ")}
    >
      Skip to main content
    </a>
  );
}
