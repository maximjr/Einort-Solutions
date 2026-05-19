/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { About } from './components/About';
import { Process } from './components/Process';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Dashboard } from './components/Dashboard';
import { ServiceExperience } from './components/ServiceExperience';
import { CustomizationStudio } from './components/CustomizationStudio';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Overview } from './pages/admin/Overview';
import { AdminUsers } from './pages/admin/Users';
import { AdminProjects } from './pages/admin/Projects';
import { AdminAnalytics } from './pages/admin/Analytics';
import { DevSetupGuard } from './components/DevSetupGuard';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { CinematicTransition } from './components/CinematicTransition';
import { SEO } from './components/SEO';

export default function App() {
  const location = useLocation();

  // Do not wrap CustomizationStudio in CinematicTransition with padding to allow full bleed sidebar
  const isStudioRoute = location.pathname.startsWith('/studio');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideGlobalLayout = isStudioRoute || isAdminRoute;

  return (
    <div className="bg-dark min-h-screen text-white selection:bg-electric-blue selection:text-white font-sans relative overflow-x-hidden">
      <SEO />
      {!hideGlobalLayout && (
        <>
          <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #1A73E8 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
          <div className="fixed -top-[100px] -right-[100px] w-[500px] h-[500px] bg-electric-blue opacity-10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="fixed -bottom-[200px] -left-[100px] w-[600px] h-[600px] bg-dark-blue opacity-30 rounded-full blur-[150px] pointer-events-none"></div>
        </>
      )}
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {!hideGlobalLayout && <Navbar />}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <div key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={
                  <CinematicTransition>
                    <Hero />
                    <Testimonials />
                  </CinematicTransition>
                } />
                <Route path="/services" element={
                  <CinematicTransition>
                    <div className="pt-24 min-h-screen"><Services /></div>
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
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Overview />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="operations" element={<Overview />} /> {/* Fallback for operations link */}
                </Route>

                <Route path="/work" element={
                  <CinematicTransition>
                    <div className="pt-24"><Portfolio /></div>
                  </CinematicTransition>
                } />
                <Route path="/about" element={
                  <CinematicTransition>
                    <div className="pt-24 min-h-screen"><About /></div>
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
                <Route path="/dashboard" element={
                  <CinematicTransition>
                    <Dashboard />
                  </CinematicTransition>
                } />
              </Routes>
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

