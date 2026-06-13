import { lazy, memo, Suspense, useEffect, useMemo } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { SEO } from "./components/seo/SEO";
import { SkipNav } from "./components/shared/SkipNav";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { Loadable } from "./components/shared/Loadable";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthModalProvider, useAuthModal } from "./contexts/AuthModalContext";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { PullToRefresh } from "./components/layout/PullToRefresh";
import { useAuth } from "./hooks/useAuth";

// Eagerly loaded: above-the-fold, must render immediately
import { Hero } from "./features/home/Hero";

// Lazily loaded: all page-level and below-fold components
const Services         = Loadable(lazy(() => import("./features/home/Services").then((m)         => ({ default: m.Services }))));
const ERP              = Loadable(lazy(() => import("./features/home/ERP").then((m)              => ({ default: m.ERP }))));
const WhyChooseUs      = Loadable(lazy(() => import("./features/home/WhyChooseUs").then((m)      => ({ default: m.WhyChooseUs }))));
const Testimonials     = Loadable(lazy(() => import("./features/home/Testimonials").then((m)     => ({ default: m.Testimonials }))));
const ContactUs        = Loadable(lazy(() => import("./features/home/ContactUs").then((m)        => ({ default: m.ContactUs }))));
const FAQ              = Loadable(lazy(() => import("./features/home/FAQ").then((m)              => ({ default: m.FAQ }))));
const CaseStudies      = Loadable(lazy(() => import("./features/home/CaseStudies").then((m)      => ({ default: m.CaseStudies }))));
const ContactForm      = Loadable(lazy(() => import("./features/home/ContactForm").then((m)      => ({ default: m.ContactForm }))));
const AdminDashboard   = Loadable(lazy(() => import("./features/admin/AdminDashboard").then((m)  => ({ default: m.AdminDashboard }))));
const ClientPortal     = Loadable(lazy(() => import("./features/client-portal/ClientPortal").then((m) => ({ default: m.ClientPortal }))));
const ServicesPage     = Loadable(lazy(() => import("./features/services/ServicesPage").then((m) => ({ default: m.ServicesPage }))));
const LocationPage     = Loadable(lazy(() => import("./features/seo/LocationPage").then((m)      => ({ default: m.LocationPage }))));
const IndustryPage     = Loadable(lazy(() => import("./features/seo/IndustryPage").then((m)      => ({ default: m.IndustryPage }))));
const CaseStudyPage    = Loadable(lazy(() => import("./features/case-studies/CaseStudyPage").then((m) => ({ default: m.CaseStudyPage }))));
const GlobalFloatingMessenger = Loadable(
  lazy(() => import("./components/layout/GlobalFloatingMessenger").then((m) => ({ default: m.GlobalFloatingMessenger }))),
);
const AuthModal = Loadable(
  lazy(() => import("./features/auth/AuthModal").then((m) => ({ default: m.AuthModal }))),
  () => null,
);

// ─── Sub-components ────────────────────────────────────────────────────────────

function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="h-32" />}>
        <Services />
      </Suspense>
      <Suspense fallback={<div className="h-32" />}>
        <ERP />
      </Suspense>
      <Suspense fallback={<div className="h-32" />}>
        <WhyChooseUs />
        <CaseStudies />
      </Suspense>
      <Suspense fallback={<div className="h-32" />}>
        <Testimonials />
        <ContactForm />
      </Suspense>
      <Suspense fallback={<div className="h-32" />}>
        <ContactUs />
        <FAQ />
      </Suspense>
    </>
  );
}

// Memoised: only re-renders when the user's admin status actually changes,
// not on every auth state tick (which would mount/unmount the messenger and
// open extra Firestore subscriptions unnecessarily).
const MessengerWrapper = memo(function MessengerWrapper() {
  const { user, userData } = useAuth();
  const isClient = useMemo(
    () => Boolean(user) && Boolean(userData) && !userData?.isAdmin,
    [user, userData?.isAdmin],
  );

  if (!isClient) return null;

  return (
    <Suspense fallback={null}>
      <GlobalFloatingMessenger />
    </Suspense>
  );
});

// Auth modal is now driven by AuthModalContext instead of a global window event.
// This keeps modal state inside React and prevents third-party scripts from
// triggering auth flows via CustomEvent dispatch.
function AuthModalRoot() {
  const { isOpen, mode, close } = useAuthModal();
  if (!isOpen) return null;
  return <AuthModal isOpen={isOpen} onClose={close} initialMode={mode} />;
}

function Layout() {
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const isLowMemory      = (navigator as { deviceMemory?: number }).deviceMemory !== undefined &&
                             (navigator as { deviceMemory?: number }).deviceMemory! < 4;
    const isLowProcessing  = navigator.hardwareConcurrency !== undefined &&
                             navigator.hardwareConcurrency <= 4;
    const isReducedMotion  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobileUA       = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isTouchDevice || isLowMemory || isLowProcessing || isReducedMotion || isMobileUA) {
      document.documentElement.classList.add("touch-device");
      return;
    }

    let animationFrameId: number | null = null;
    let lenisInstance: { raf: (t: number) => void; destroy: () => void } | null = null;
    let isMounted = true;

    import("lenis")
      .then(({ default: Lenis }) => {
        if (!isMounted) return;
        try {
          lenisInstance = new Lenis({
            duration:           1.2,
            easing:             (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation:        "vertical",
            gestureOrientation: "vertical",
            smoothWheel:        true,
            syncTouch:          false,
            wheelMultiplier:    1,
            touchMultiplier:    2,
          });

          const raf = (time: number) => {
            if (!isMounted) { if (animationFrameId) cancelAnimationFrame(animationFrameId); return; }
            try { lenisInstance?.raf(time); } catch { /* prevent RAF crash */ }
            if (isMounted) animationFrameId = requestAnimationFrame(raf);
          };
          animationFrameId = requestAnimationFrame(raf);
        } catch { /* Lenis init failed — fall back to native scroll */ }
      })
      .catch(() => { /* Lenis module load failed — fall back to native scroll */ });

    return () => {
      isMounted = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      try { lenisInstance?.destroy(); } catch { /* ignore */ }
      lenisInstance = null;
    };
  }, []);

  return (
    <PullToRefresh>
      <div className="bg-background min-h-[100dvh] text-text-main font-sans selection:bg-primary selection:text-white flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-grow" tabIndex={-1}>
          <Outlet />
        </main>
        <Footer />
        <MessengerWrapper />
      </div>
    </PullToRefresh>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AuthModalProvider>
          <BrowserRouter>
            <SEO />
            <SkipNav />
            {/* Auth modal lives at root so it's not recreated on route changes */}
            <AuthModalRoot />
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index                      element={<HomePage />} />
                  <Route path="services/:serviceId" element={<ServicesPage />} />
                  <Route path="locations/:region"   element={<LocationPage />} />
                  <Route path="industries/:industry" element={<IndustryPage />} />
                  <Route path="case-studies/:caseId" element={<CaseStudyPage />} />

                  <Route element={<ProtectedRoute requireAdmin={true} />}>
                    <Route path="admin"         element={<AdminDashboard />} />
                  </Route>

                  <Route element={<ProtectedRoute />}>
                    <Route path="client-portal" element={<ClientPortal />} />
                  </Route>
                </Route>
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </AuthModalProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
