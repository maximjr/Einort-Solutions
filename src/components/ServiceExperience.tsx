import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Monitor, Building, Store, CreditCard, Hotel, Stethoscope, PlayCircle, Shield } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from './SEO';
import { useState } from 'react';

const projectCategories = [
  { id: 'business', title: 'Business Websites', icon: Building, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' },
  { id: 'saas', title: 'SaaS Platforms', icon: Monitor, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop' },
  { id: 'ecommerce', title: 'E-Commerce', icon: Store, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop' },
  { id: 'fintech', title: 'Fintech UI', icon: CreditCard, image: 'https://images.unsplash.com/photo-1616803140344-6682afb13cda?q=80&w=2670&auto=format&fit=crop' },
  { id: 'hospitality', title: 'Hotel Websites', icon: Hotel, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop' },
  { id: 'healthcare', title: 'Healthcare', icon: Stethoscope, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop' },
];

export function ServiceExperience() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Format title (e.g. web-development -> Web Development)
  const title = serviceId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Service';

  const handleProjectSelect = async (categoryId: string) => {
    if (user) {
      navigate(`/studio/${categoryId}`);
    } else {
      setIsAuthenticating(true);
      try {
        await signInWithGoogle();
        navigate(`/studio/${categoryId}`);
      } catch (error) {
        console.error("Login failed", error);
      } finally {
        setIsAuthenticating(false);
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-dark text-white overflow-hidden py-32 lg:py-48">
      <SEO title={`${title} - Cinematic Sandbox`} />

      {/* Ambient Lighting Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric-blue/10 blur-[150px] mix-blend-screen pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-blue/10 blur-[150px] mix-blend-screen pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-2 glass-panel border-white/10 geometric-clip mb-8"
          >
            <Shield className="w-4 h-4 text-electric-blue" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-silver-metallic">Immersive Project Ecosystem</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-[84px] font-display font-bold leading-[1.1] tracking-tight mb-8"
          >
            {title} <br className="hidden md:block" />
            <span className="text-gradient-metallic italic font-light">Laboratory.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-lg md:text-xl text-silver-metallic font-light leading-relaxed max-w-2xl"
          >
            Select an architecture prototype below to enter the live AI customization studio. Prototype, configure, and engineer your platform in real-time.
          </motion.p>
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {projectCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleProjectSelect(category.id)}
              className="group relative cursor-pointer glass-panel geometric-clip border border-white/5 hover:border-electric-blue/40 overflow-hidden h-[400px] flex flex-col justify-between"
            >
              {/* Background Image & Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover filter saturate-0 group-hover:saturate-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/60 to-dark/20 z-10 transition-colors duration-500 group-hover:bg-transparent/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/90 to-transparent z-10 h-2/3 bottom-0 group-hover:h-1/2 transition-all duration-700" />
              </div>

              {/* Status Header */}
              <div className="relative z-20 p-6 flex justify-between items-start opacity-0 group-hover:opacity-100 transform -translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                 <div className="flex items-center gap-2 bg-dark/60 backdrop-blur-md px-3 py-1.5 border border-white/10">
                   <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-pulse" />
                   <span className="text-[9px] font-mono uppercase tracking-widest text-silver-metallic">Architecture Ready</span>
                 </div>
              </div>

              {/* Content Footer */}
              <div className="relative z-20 p-6 lg:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 glass-panel geometric-clip-button flex items-center justify-center border-white/10 bg-white/5 group-hover:bg-electric-blue/20 group-hover:border-electric-blue/50 transition-colors duration-500">
                    <category.icon className="w-5 h-5 text-silver-metallic group-hover:text-white transition-colors" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-display font-medium text-white mb-2 group-hover:text-glow-silver transition-colors">{category.title}</h3>
                
                <div className="flex items-center justify-between mt-6 border-t border-white/10 pt-6 group-hover:border-electric-blue/30 transition-colors">
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-silver-metallic group-hover:text-electric-blue transition-colors flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" /> Initialize Sandbox
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Hover Glow Edge */}
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-electric-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-30" />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isAuthenticating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm">
          <div className="glass-panel p-8 geometric-clip border-electric-blue/50 flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-electric-blue border-t-transparent animate-spin" />
            <p className="text-xs font-mono tracking-widest uppercase text-electric-blue font-bold animate-pulse">Authenticating Protocol...</p>
          </div>
        </div>
      )}
    </section>
  );
}
