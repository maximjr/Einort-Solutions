import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Monitor, Building, Store, CreditCard, Hotel, Stethoscope, PlayCircle, Shield, Box, Smartphone, Fingerprint, Network, Layers, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { SEO } from './SEO';
import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

const CURATED_PROJECTS: Record<string, any[]> = {
  'web-development': [
    { id: 'saas-engine', title: 'SaaS Platform Core', icon: Monitor, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', stack: ['React', 'Next.js', 'Node'], stats: '99.9% Uptime' },
    { id: 'ecommerce-hub', title: 'E-Commerce Hub', icon: Store, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', stack: ['Shopify', 'Remix', 'Stripe'], stats: 'High Conv.' },
    { id: 'fintech-dashboard', title: 'Fintech Dashboard', icon: CreditCard, image: 'https://images.unsplash.com/photo-1616803140344-6682afb13cda?q=80&w=2670&auto=format&fit=crop', stack: ['React', 'D3.js', 'WebSockets'], stats: 'Real-time' },
  ],
  'ui-ux-design': [
    { id: 'fintech-ui', title: 'Fintech Identity', icon: CreditCard, image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop', stack: ['Figma', 'Framer', 'WebGL'], stats: 'High Conv.' },
    { id: 'healthcare-ux', title: 'Health Portal UX', icon: Stethoscope, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop', stack: ['User Flow', 'Accessibility', 'Prototyping'], stats: 'AAA Grade' },
  ],
  'mobile-app-development': [
    { id: 'delivery-app', title: 'On-Demand Delivery', icon: Smartphone, image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop', stack: ['React Native', 'Firebase', 'Maps API'], stats: '<1s Latency' },
    { id: 'fitness-tracker', title: 'Fitness Tracker', icon: Monitor, image: 'https://images.unsplash.com/photo-1510006851064-e6056cd0e3a8?q=80&w=2070&auto=format&fit=crop', stack: ['Flutter', 'TensorFlow', 'HealthKit'], stats: 'Data Driven' },
  ],
  'enterprise-erp-solutions': [
    { id: 'supply-chain', title: 'Supply Chain Tracker', icon: Network, image: 'https://images.unsplash.com/photo-1586528116311-ad8ed716d408?q=80&w=2070&auto=format&fit=crop', stack: ['Node.js', 'PostgreSQL', 'GraphQL'], stats: 'Enterprise' },
    { id: 'hr-portal', title: 'Global HR Portal', icon: Building, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', stack: ['React', 'Spring Boot', 'AWS'], stats: 'Scalable' },
  ],
  'brand-identity': [
    { id: 'startup-brand', title: 'Disruptive Startup', icon: Fingerprint, image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop', stack: ['Typography', 'Logo', 'Strategy'], stats: 'Modern' },
  ]
};

const defaultProjects = [
  { id: 'business', title: 'Business Websites', icon: Building, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', stack: ['React', 'Tailwind'], stats: 'Fast' },
  { id: 'saas', title: 'SaaS Platforms', icon: Monitor, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', stack: ['Next.js', 'Postgres'], stats: 'Secure' },
  { id: 'ecommerce', title: 'E-Commerce', icon: Store, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', stack: ['Shopify', 'Remix'], stats: 'High ROI' },
];

export function ServiceExperience() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Format title (e.g. web-development -> Web Development)
  const title = serviceId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Architecture';

  const projects = serviceId && CURATED_PROJECTS[serviceId] ? CURATED_PROJECTS[serviceId] : defaultProjects;

  const handleProjectSelect = (categoryId: string) => {
    setSelectedProject(categoryId);
    if (!user) {
      setAuthModalOpen(true);
    } else {
      navigate(`/studio/${categoryId}`);
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    if (selectedProject) {
      navigate(`/studio/${selectedProject}`);
    }
  };

  return (
    <section className="relative min-h-[100dvh] bg-dark text-white overflow-hidden py-32 lg:py-48 flex items-center">
      <SEO title={`${title} - Cinematic Sandbox`} />

      {/* Ambient Lighting Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-electric-blue/10 blur-[150px] mix-blend-screen pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-blue/5 blur-[150px] mix-blend-screen pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full mt-10 lg:mt-0">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-2 glass-panel border-white/10 geometric-clip mb-8 shadow-lg shadow-electric-blue/10"
          >
            <Sparkles className="w-4 h-4 text-electric-blue" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-silver-metallic">Curated Showcase</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[84px] font-display font-bold leading-[1.05] tracking-tight mb-8"
          >
            {title} <br className="hidden md:block" />
            <span className="text-gradient-metallic italic font-light opacity-90 relative">
              Case Studies.
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-electric-blue to-transparent" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-lg md:text-xl text-silver-metallic font-light leading-relaxed max-w-2xl border-l-2 border-electric-blue/30 pl-6 text-left"
          >
            Select an architecture prototype below to review its technical breakdown and case study. Authenticate to enter the live Customization Studio to prototype and engineer your platform in real-time.
          </motion.p>
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {projects.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleProjectSelect(category.id)}
              className="group relative cursor-pointer holographic-panel geometric-clip border border-white/10 hover:border-electric-blue/40 overflow-hidden h-[450px] flex flex-col justify-between shadow-[0_0_20px_rgba(37,99,235,0.05)] hover:shadow-[0_0_40px_rgba(37,99,235,0.15)] transition-all duration-700"
            >
              {/* Background Image & Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover filter saturate-0 group-hover:saturate-100 transition-all duration-1000 scale-110 group-hover:scale-100 mix-blend-luminosity group-hover:mix-blend-normal"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/70 to-dark/40 z-10 transition-colors duration-700 group-hover:bg-dark/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/90 to-transparent z-10 h-[80%] bottom-0 group-hover:h-1/2 transition-all duration-700 pointer-events-none" />
              </div>

              {/* Status Header */}
              <div className="relative z-20 p-6 lg:p-8 flex justify-between items-start opacity-0 group-hover:opacity-100 transform -translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                 <div className="flex items-center gap-3 bg-dark/80 backdrop-blur-md px-4 py-2 border border-white/10 geometric-clip-right">
                   <div className="w-2 h-2 bg-neon-blue geometric-diamond animate-pulse shadow-[0_0_10px_#3b82f6]" />
                   <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic font-bold">Architecture Ready</span>
                 </div>
              </div>

              {/* Content Footer */}
              <div className="relative z-20 p-6 lg:p-8 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                
                <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                   {category.stack.map((tech: string, i: number) => (
                     <span key={i} className="text-[9px] font-mono font-bold uppercase tracking-widest text-silver-metallic bg-white/5 border border-white/10 px-2 py-1 geometric-clip">
                       {tech}
                     </span>
                   ))}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 holographic-panel geometric-clip flex items-center justify-center border-white/10 bg-white/5 group-hover:bg-electric-blue/20 group-hover:border-electric-blue/50 transition-colors duration-700">
                    <category.icon className="w-5 h-5 text-silver-metallic group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-medium text-white group-hover:text-glow-silver transition-colors leading-tight">{category.title}</h3>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-electric-blue mt-1">{category.stats}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 border-t border-white/10 pt-6 group-hover:border-electric-blue/30 transition-colors opacity-80 group-hover:opacity-100">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-silver-metallic group-hover:text-white transition-colors flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-electric-blue" /> Initialize Studio
                  </span>
                  <div className="w-8 h-8 geometric-clip flex items-center justify-center bg-electric-blue/10 border border-electric-blue/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowUpRight className="w-4 h-4 text-electric-blue" />
                  </div>
                </div>
              </div>

              {/* Hover Glow Edge */}
              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-electric-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-[0.16,1,0.3,1] origin-left z-30" />
            </motion.div>
          ))}
        </div>
      </div>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
        title="Initialize Sandbox Connection"
        subtitle="Authenticate securely to access the Customization Studio and deploy your configuration."
      />
    </section>
  );
}
