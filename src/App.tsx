/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DevSetupGuard } from './components/DevSetupGuard';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { CinematicTransition } from './components/CinematicTransition';
import { SEO } from './components/SEO';
import { AnalyticsRouteTracker } from './AnalyticsRouteTracker';

import { AuthRedirector } from './components/AuthRedirector';

// Lazy loading components for performance
const Hero = lazy(() => import('./components/Hero').then(m => ({ default: m.Hero })));
const HomeSummary = lazy(() => import('./components/HomeSummary').then(m => ({ default: m.HomeSummary })));
const Services = lazy(() => import('./components/Services').then(m => ({ default: m.Services })));
const Portfolio = lazy(() => import('./components/Portfolio').then(m => ({ default: m.Portfolio })));
const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));
const Process = lazy(() => import('./components/Process').then(m => ({ default: m.Process })));
const Testimonials = lazy(() => import('./components/Testimonials').then(m => ({ default: m.Testimonials })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const Booking = lazy(() => import('./pages/Booking').then(m => ({ default: m.Booking })));
const AIAudit = lazy(() => import('./pages/AIAudit').then(m => ({ default: m.AIAudit })));
const ClientPortal = lazy(() => import('./pages/client/ClientPortal').then(m => ({ default: m.ClientPortal })));
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })));
const LocalizedService = lazy(() => import('./pages/LocalizedService').then(m => ({ default: m.LocalizedService })));
const InsightHub = lazy(() => import('./pages/InsightHub').then(m => ({ default: m.InsightHub })));
const InsightArticle = lazy(() => import('./pages/InsightArticle').then(m => ({ default: m.InsightArticle })));
const ServiceExperience = lazy(() => import('./components/ServiceExperience').then(m => ({ default: m.ServiceExperience })));
const CustomizationStudio = lazy(() => import('./components/CustomizationStudio').then(m => ({ default: m.CustomizationStudio })));
const CustomProjectRequest = lazy(() => import('./pages/CustomProjectRequest').then(m => ({ default: m.CustomProjectRequest })));

// Admin Layout and Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const Overview = lazy(() => import('./pages/admin/Overview').then(m => ({ default: m.Overview })));
const AdminUsers = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.AdminUsers })));
const AdminProjects = lazy(() => import('./pages/admin/Projects').then(m => ({ default: m.AdminProjects })));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics').then(m => ({ default: m.AdminAnalytics })));
const AdminCRM = lazy(() => import('./pages/admin/CRM').then(m => ({ default: m.AdminCRM })));

const LoadingFallback = () => (
  <div className="min-h-[100dvh] flex items-center justify-center bg-dark">
    <div className="w-12 h-12 border-2 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const location = useLocation();

  // Do not wrap CustomizationStudio in CinematicTransition with padding to allow full bleed sidebar
  const isStudioRoute = location.pathname.startsWith('/studio');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isCustomProjectRoute = location.pathname.startsWith('/custom-project');
  const hideGlobalLayout = isStudioRoute || isAdminRoute || isCustomProjectRoute;

  return (
    <div className="bg-dark min-h-screen text-white selection:bg-premium-gold selection:text-white font-sans relative overflow-x-hidden">
      <SEO />
      <AnalyticsRouteTracker />
      {!hideGlobalLayout && (
        <>
          <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #1A73E8 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
          <div className="fixed -top-[100px] -right-[100px] w-[500px] h-[500px] bg-premium-gold opacity-10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="fixed -bottom-[200px] -left-[100px] w-[600px] h-[600px] bg-dark-blue opacity-30 rounded-full blur-[150px] pointer-events-none"></div>
        </>
      )}
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {!hideGlobalLayout && <Navbar />}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <div key={location.pathname}>
              <Suspense fallback={<LoadingFallback />}>
                <Routes location={location}>
                  <Route path="/" element={
                    <CinematicTransition>
                      <Hero />
                      <Testimonials />
                      <HomeSummary />
                      <Contact />
                    </CinematicTransition>
                  } />
                  <Route path="/services" element={
                    <CinematicTransition>
                      <div className="pt-24 min-h-screen">
                        <Services />
                        <Contact />
                      </div>
                    </CinematicTransition>
                  } />
                  <Route path="/services/:serviceId" element={
                    <CinematicTransition>
                       <ServiceExperience />
                    </CinematicTransition>
                  } />
                  <Route path="/studio/:projectId" element={
                    <CustomizationStudio />
                  } />
                  <Route path="/custom-project" element={
                    <CustomProjectRequest />
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="crm" element={<AdminCRM />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="operations" element={<Overview />} /> {/* Fallback for operations link */}
                  </Route>

                  <Route path="/work" element={
                    <CinematicTransition>
                      <div className="pt-24">
                        <Portfolio />
                        <Contact />
                      </div>
                    </CinematicTransition>
                  } />
                  <Route path="/about" element={
                    <CinematicTransition>
                      <div className="pt-24 min-h-screen">
                        <About />
                        <Contact />
                      </div>
                    </CinematicTransition>
                  } />
                  <Route path="/process" element={
                    <CinematicTransition>
                      <div className="pt-24 min-h-screen"><Process /></div>
                    </CinematicTransition>
                  } />
                  <Route path="/contact" element={
                    <CinematicTransition>
                      <div className="pt-24 min-h-screen"><Contact /></div>
                    </CinematicTransition>
                  } />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/book" element={<Booking />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/client" element={<ClientPortal />} />
                  <Route path="/agency/:slug" element={<LocalizedService />} />
                  <Route path="/dashboard" element={
                    <AuthRedirector />
                  } />
                </Routes>
              </Suspense>
            </div>
          </AnimatePresence>
        </main>
        {/* Hide footer on studio or admin routes for seamless experience */}
        {!hideGlobalLayout && <Footer />}
        <DevSetupGuard />
      </div>
    </div>
  );
}

