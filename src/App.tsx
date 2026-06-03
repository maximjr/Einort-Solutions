import { Suspense, lazy, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";
import Lenis from "lenis";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { SEO } from "./components/seo/SEO";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";

import { isFirebaseConfigured } from "./lib/firebase";

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

export default function App() {
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface border border-border rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 flex items-center justify-center rounded-full mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">System Configuration Missing</h2>
          <p className="text-text-muted mb-6">
            The enterprise application requires Firebase environment variables to securely boot. Please add them to your <code className="text-primary bg-primary/10 px-1 py-0.5 rounded">.env</code> file.
          </p>
          <div className="bg-background text-left p-4 rounded-lg overflow-x-auto text-sm border border-border">
            <pre className="text-text-muted">
{`VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=`}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
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
    </HelmetProvider>
  );
}
