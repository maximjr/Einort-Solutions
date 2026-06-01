import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Mail } from 'lucide-react';
import { CinematicTransition } from '../components/CinematicTransition';
import { SEO } from '../components/SEO';

export function NotFound() {
  return (
    <CinematicTransition>
      <SEO title="Page Not Found | EINORT SOLUTIONS" description="The page you are looking for has been moved or might never have existed." />
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4 relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        
        <div className="w-24 h-24 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/30 mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-premium-gold opacity-20 blur-xl animate-pulse"></div>
          <span className="text-4xl font-mono text-premium-gold">404</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xl text-white/60 mb-10 max-w-md font-light leading-relaxed">
          The page you are looking for has been moved, removed, renamed or might never have existed.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            to="/"
            className="flex items-center gap-2 bg-white text-dark px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all active:scale-95 group"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
          </Link>
          
          <Link 
            to="/contact"
            className="flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/5 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </CinematicTransition>
  );
}
