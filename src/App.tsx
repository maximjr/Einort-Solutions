import { lazy, Suspense, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Lenis from "lenis";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { SEO } from "./components/seo/SEO";

import { ProtectedRoute } from "./components/shared/ProtectedRoute";

// Eagerly loaded features (Above the fold)
import { Hero } from "./features/home/Hero";
import { useAuth } from "./hooks/useAuth";

// Lazy loaded features
const Services = lazy(() =>
  import("./features/home/Services").then((m) => ({ default: m.Services })),
);
const ERP = lazy(() =>
  import("./features/home/ERP").then((m) => ({ default: m.ERP })),
);
const WhyChooseUs = lazy(() =>
  import("./features/home/WhyChooseUs").then((m) => ({
    default: m.WhyChooseUs,
  })),
);
const Testimonials = lazy(() =>
  import("./features/home/Testimonials").then((m) => ({
    default: m.Testimonials,
  })),
);
const ContactForm = lazy(() =>
  import("./features/home/ContactForm").then((m) => ({
    default: m.ContactForm,
  })),
);
const AdminDashboard = lazy(() =>
  import("./features/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);
const ClientPortal = lazy(() =>
  import("./features/client-portal/ClientPortal").then((m) => ({
    default: m.ClientPortal,
  })),
);
const ServicesPage = lazy(() =>
  import("./features/services/ServicesPage").then((m) => ({
    default: m.ServicesPage,
  })),
);
const LocationPage = lazy(() =>
  import("./features/seo/LocationPage").then((m) => ({
    default: m.LocationPage,
  })),
);
const IndustryPage = lazy(() =>
  import("./features/seo/IndustryPage").then((m) => ({
    default: m.IndustryPage,
  })),
);
const GlobalFloatingMessenger = lazy(() =>
  import("./components/layout/GlobalFloatingMessenger").then((m) => ({
    default: m.GlobalFloatingMessenger,
  })),
);

function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="h-40"></div>}>
        <Services />
        <ERP />
        <WhyChooseUs />
        <Testimonials />
        <ContactForm />
      </Suspense>
    </>
  );
}

import { PullToRefresh } from "./components/layout/PullToRefresh";

function MessengerWrapper() {
  const { user, userData } = useAuth();
  const isClient =
    user &&
    userData &&
    userData.role !== "admin" &&
    userData.role !== "super_admin" &&
    !userData.isAdmin;

  if (!isClient) return null;

  return (
    <Suspense fallback={null}>
      <GlobalFloatingMessenger />
    </Suspense>
  );
}

function Layout() {
  useEffect(() => {
    // Disable Lenis on touch devices for native iOS/Android scrolling performance
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (isTouchDevice) {
      document.documentElement.classList.add("touch-device");
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
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

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <SEO />
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Layout />}>
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
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
