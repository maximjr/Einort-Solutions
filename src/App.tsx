import { lazy, Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { SEO } from "./components/seo/SEO";
import { AnalyticsProvider } from "./lib/analytics";

import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import { Loadable } from "./components/shared/Loadable";

// Eagerly loaded features (Above the fold)
import { Hero } from "./features/home/Hero";

// Lazy loaded features
const Services = Loadable(
  lazy(() => import("./features/home/Services").then((m) => ({ default: m.Services }))),
);
const ERP = Loadable(
  lazy(() => import("./features/home/ERP").then((m) => ({ default: m.ERP }))),
);
const WhyChooseUs = Loadable(
  lazy(() => import("./features/home/WhyChooseUs").then((m) => ({ default: m.WhyChooseUs }))),
);
const Testimonials = Loadable(
  lazy(() => import("./features/home/Testimonials").then((m) => ({ default: m.Testimonials }))),
);
const ContactUs = Loadable(
  lazy(() => import("./features/home/ContactUs").then((m) => ({ default: m.ContactUs }))),
);
const FAQ = Loadable(
  lazy(() => import("./features/home/FAQ").then((m) => ({ default: m.FAQ }))),
);
const CaseStudies = Loadable(
  lazy(() => import("./features/home/CaseStudies").then((m) => ({ default: m.CaseStudies }))),
);
const ContactForm = Loadable(
  lazy(() => import("./features/home/ContactForm").then((m) => ({ default: m.ContactForm }))),
);
const ContactPage = Loadable(
  lazy(() => import("./features/contact/ContactPage").then((m) => ({ default: m.ContactPage }))),
);
const AboutPage = Loadable(
  lazy(() => import("./features/about/AboutPage").then((m) => ({ default: m.AboutPage }))),
);
const AdminDashboard = Loadable(
  lazy(() => import("./features/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard }))),
);
const ClientPortal = Loadable(
  lazy(() => import("./features/client-portal/ClientPortal").then((m) => ({ default: m.ClientPortal }))),
);
const ServicesPage = Loadable(
  lazy(() => import("./features/services/ServicesPage").then((m) => ({ default: m.ServicesPage }))),
);
const LocationPage = Loadable(
  lazy(() => import("./features/seo/LocationPage").then((m) => ({ default: m.LocationPage }))),
);
const IndustryPage = Loadable(
  lazy(() => import("./features/seo/IndustryPage").then((m) => ({ default: m.IndustryPage }))),
);
const CaseStudyPage = Loadable(
  lazy(() => import("./features/case-studies/CaseStudyPage").then((m) => ({ default: m.CaseStudyPage }))),
);

function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="h-32"></div>}>
        <Services />
      </Suspense>
      <Suspense fallback={<div className="h-32"></div>}>
        <ERP />
      </Suspense>
      <Suspense fallback={<div className="h-32"></div>}>
        <WhyChooseUs />
        <CaseStudies />
      </Suspense>
      <Suspense fallback={<div className="h-32"></div>}>
        <Testimonials />
        <ContactForm />
      </Suspense>
      <Suspense fallback={<div className="h-32"></div>}>
        <ContactUs />
        <FAQ />
      </Suspense>
    </>
  );
}

import { PullToRefresh } from "./components/ui/PullToRefresh";

import { WhatsAppMessenger } from "./components/layout/WhatsAppMessenger";

function MessengerWrapper() {
  return <WhatsAppMessenger />;
}

function Layout() {
  useEffect(() => {
    // 1. Detect touch devices strictly
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    // 2. Detect Safari strictly (often has rubber-banding issues with custom scroll)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // 3. Detect low-end devices
    const isLowMemory =
      (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4;
    const isLowProcessing =
      navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4;
    
    // 4. Detect reduced motion and specific mobile strings
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobileString = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Disable completely and fallback to native scrolling
    if (isTouchDevice || isSafari || isLowMemory || isLowProcessing || isReducedMotion || isMobileString) {
      document.documentElement.classList.add("native-scroll");
      // Add native scroll styles dynamically just to be sure
      document.documentElement.style.scrollBehavior = "auto";
      return;
    }

    let animationFrameId: number | null = null;
    let lenisInstance: any = null;
    let isMounted = true;

    import("lenis")
      .then(({ default: Lenis }) => {
        if (!isMounted) return;

        try {
          lenisInstance = new Lenis({
            duration: 1.0,               // slightly faster for crispness
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            // Strictly disable all touch/mobile interventions
            syncTouch: false,
            touchMultiplier: 1,
            wheelMultiplier: 1,
          });

          const raf = (time: number) => {
            if (!isMounted) {
              if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
              }
              return;
            }
            try {
              if (lenisInstance) {
                lenisInstance.raf(time);
              }
            } catch (e) {
              console.error("[Lenis] RAF crash prevented:", e);
            }
            if (isMounted) {
              animationFrameId = requestAnimationFrame(raf);
            }
          };

          animationFrameId = requestAnimationFrame(raf);
        } catch (e) {
          console.error("[Lenis] Initialization crash prevented:", e);
        }
      })
      .catch((e) => {
        console.warn("[Lenis] Failed to load module:", e);
      });

    return () => {
      isMounted = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (lenisInstance) {
        try {
          lenisInstance.destroy();
        } catch (e) {
          console.error("[Lenis] Destroy crash prevented:", e);
        }
        lenisInstance = null;
      }
    };
  }, []);

  return (
    <PullToRefresh>
      <div className="bg-background min-h-[100dvh] text-text-main font-sans selection:bg-primary selection:text-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense
            fallback={
              <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <MessengerWrapper />
      </div>
    </PullToRefresh>
  );
}

import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { useParams, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LangWrapper() {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && ['en', 'fr'].includes(lang)) {
      if (i18n.resolvedLanguage !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  if (lang && !['en', 'fr'].includes(lang)) {
    return <Navigate to="/" replace />;
  }

  return <Layout />;
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnalyticsProvider>
          <SEO />
          <ErrorBoundary>
            <Routes>
              <Route path="/:lang" element={<LangWrapper />}>
                <Route
                  index
                  element={
                    <Suspense
                      fallback={
                        <div className="min-h-screen bg-background flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      }
                    >
                      <HomePage />
                    </Suspense>
                  }
                />
                <Route
                  path="about"
                  element={
                    <Suspense
                      fallback={
                        <div className="min-h-screen bg-background flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      }
                    >
                      <AboutPage />
                    </Suspense>
                  }
                />
                <Route
                  path="contact"
                  element={
                    <Suspense
                      fallback={
                        <div className="min-h-screen bg-background flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      }
                    >
                      <ContactPage />
                    </Suspense>
                  }
                />
                <Route
                  path="services/:serviceId"
                  element={
                    <Suspense
                      fallback={
                        <div className="min-h-screen bg-background flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      }
                    >
                      <ServicesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="locations/:region"
                  element={
                    <Suspense
                      fallback={
                        <div className="min-h-screen bg-background flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      }
                    >
                      <LocationPage />
                    </Suspense>
                  }
                />
                <Route
                  path="industries/:industry"
                  element={
                    <Suspense
                      fallback={
                        <div className="min-h-screen bg-background flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      }
                    >
                      <IndustryPage />
                    </Suspense>
                  }
                />
                <Route
                  path="case-studies/:caseId"
                  element={
                    <Suspense
                      fallback={
                        <div className="min-h-screen bg-background flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      }
                    >
                      <CaseStudyPage />
                    </Suspense>
                  }
                />
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route
                    path="admin"
                    element={
                      <Suspense
                        fallback={
                          <div className="min-h-screen bg-background flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        }
                      >
                        <AdminDashboard />
                      </Suspense>
                    }
                  />
                </Route>
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="client-portal"
                    element={
                      <Suspense
                        fallback={
                          <div className="min-h-screen bg-background flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        }
                      >
                        <ClientPortal />
                      </Suspense>
                    }
                  />
                </Route>
              </Route>

              {/* Redirect any routes without lang prefix to preferred language */}
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </ErrorBoundary>
        </AnalyticsProvider>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

function RootRedirect() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'en';
  const location = useLocation();
  const { pathname, search, hash } = location;
  
  // Prevent infinite loops if pathname already has a valid lang prefix but wasn't matched
  if (pathname.startsWith('/en/') || pathname === '/en' || pathname.startsWith('/fr/') || pathname === '/fr') {
     return <Navigate to={`/${lang}`} replace />;
  }

  const newPath = pathname === '/' ? `/${lang}` : `/${lang}${pathname}`;
  return <Navigate to={`${newPath}${search}${hash}`} replace />;
}
