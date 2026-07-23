// src/lib/analytics/meta-pixel.ts

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Meta Pixel ID
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || "1059601826410794";

/**
 * Initialize Meta Pixel asynchronously
 * Can be hooked up to a cookie consent manager in the future.
 */
export const initMetaPixel = () => {
  if (!PIXEL_ID) {
    console.warn("Meta Pixel ID is missing.");
    return;
  }

  // Prevent duplicate initialization
  if (typeof window === "undefined" || window.fbq) return;

  // Official Meta Pixel Code
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    if (s && s.parentNode) {
      s.parentNode.insertBefore(t, s);
    } else {
      b.head.appendChild(t);
    }
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );

  window.fbq("init", PIXEL_ID);
};

/**
 * Track PageView event
 * Call this on every route change.
 */
export const trackPageView = () => {
  if (!window.fbq) return;
  window.fbq("track", "PageView");
};

// Meta Pixel Standard Events
export type MetaStandardEvent =
  | "AddPaymentInfo"
  | "AddToCart"
  | "AddToWishlist"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "InitiateCheckout"
  | "Lead"
  | "Purchase"
  | "Schedule"
  | "Search"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe"
  | "ViewContent";

/**
 * Track a Standard Event
 */
export const trackEvent = (eventName: MetaStandardEvent, options?: Record<string, any>) => {
  if (!window.fbq) return;
  if (options) {
    window.fbq("track", eventName, options);
  } else {
    window.fbq("track", eventName);
  }
};

/**
 * Track a Custom Event
 */
export const trackCustomEvent = (eventName: string, options?: Record<string, any>) => {
  if (!window.fbq) return;
  if (options) {
    window.fbq("trackCustom", eventName, options);
  } else {
    window.fbq("trackCustom", eventName);
  }
};
