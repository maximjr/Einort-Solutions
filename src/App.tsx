import { Suspense, lazy, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Lenis from "lenis";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { SEO } from "./components/seo/SEO";

import { ProtectedRoute } from "./components/shared/ProtectedRoute";

// Immediately load Hero to optimize LCP
import { Hero } from "./features/home/Hero";

// Lazy loaded features
const Services = lazy(() =>
  import("./features/home/Services").then((module) => ({
    default: module.Services,
  })),
);
const ERP = lazy(() =>
  import("./features/home/ERP").then((module) => ({ default: module.ERP })),
);
const WhyChooseUs = lazy(() =>
  import("./features/home/WhyChooseUs").then((module) => ({
    default: module.WhyChooseUs,
  })),
);
const Testimonials = lazy(() =>
  import("./features/home/Testimonials").then((module) => ({
    default: module.Testimonials,
  })),
);
const ContactForm = lazy(() =>
  import("./features/home/ContactForm").then((module) => ({
    default: module.ContactForm,
  })),
);
const AdminDashboard = lazy(() =>
  import("./features/admin/AdminDashboard").then((module) => ({
    default: module.AdminDashboard,
  })),
);
const ClientPortal = lazy(() =>
  import("./features/client-portal/ClientPortal").then((module) => ({
    default: module.ClientPortal,
  })),
);
const ServicesPage = lazy(() =>
  import("./features/services/ServicesPage").then((module) => ({
    default: module.ServicesPage,
  })),
);

// SEO Pages
const LocationPage = lazy(() =>
  import("./features/seo/LocationPage").then((module) => ({
    default: module.LocationPage,
  })),
);
const IndustryPage = lazy(() =>
  import("./features/seo/IndustryPage").then((module) => ({
    default: module.IndustryPage,
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

function Layout() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-background min-h-screen text-text-main font-sans selection:bg-primary selection:text-white flex flex-col">
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
    </div>
  );
}

import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <SEO />
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
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
