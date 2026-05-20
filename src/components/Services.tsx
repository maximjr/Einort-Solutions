import { motion, useScroll, useTransform } from 'motion/react';
import { Layers, Lightbulb, ShieldCheck, Box, Workflow, Network, Fingerprint, Lock, Smartphone, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const services = [
  { icon: Layers, title: 'UI/UX Design', description: 'Award-winning digital experiences crafted with pixel-perfect precision, psychological flow, and elite human-centric design protocols.', tag: 'Design' },
  { icon: Workflow, title: 'Web Development', description: 'High-performance, futuristic software infrastructure built with cutting-edge frameworks and infinitely scalable global architectures.', tag: 'Engineering' },
  { icon: Smartphone, title: 'Mobile App Development', description: 'Native and fluid cross-platform mobile environments that feel premium, instantaneous, and remarkably intuitive.', tag: 'Mobile' },
  { icon: Network, title: 'Enterprise/ERP Solutions', description: 'Interconnected, high-availability digital platforms connecting millions of users seamlessly across the globe in real-time.', tag: 'Cloud' },
  { icon: Fingerprint, title: 'Brand Identity', description: 'Bold, memorable visual identities and digital aesthetics that position your organization as the undisputed industry luminary.', tag: 'Brand' }
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number; key?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const serviceSlug = service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-8 lg:p-10 bg-dark-blue/20 glass-panel border-white/5 hover:border-electric-blue/30 transition-all duration-700 overflow-hidden h-full flex flex-col geometric-clip hover:shadow-[0_10px_40px_rgba(37,99,235,0.15)]"
    >
      {/* Holographic Glowing Overlay on Hover */}
      <div 
        className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-electric-blue/15 via-neon-blue/5 to-transparent opacity-0 transition-opacity duration-700 pointer-events-none",
          isHovered && "opacity-100"
        )}
      />
      
      {/* Animated Geometry Line */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-l from-electric-blue to-transparent transform origin-right transition-transform duration-700",
        isHovered ? "scale-x-100" : "scale-x-0"
      )} />

      <div className="absolute top-6 right-6 opacity-30 text-[10px] font-mono tracking-widest text-silver-metallic group-hover:opacity-100 group-hover:text-electric-blue transition-all duration-500">
        {index < 9 ? `0${index + 1}` : index + 1}
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-white/5 geometric-clip-right flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-electric-blue transition-all duration-700 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <service.icon className={cn(
              "w-6 h-6 text-silver-metallic transition-colors duration-500 relative z-10",
              isHovered && "text-white"
            )} />
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold text-electric-blue bg-electric-blue/10 px-3 py-1 border border-electric-blue/20">
            {service.tag}
          </span>
        </div>
        
        <h3 className="text-2xl font-display font-medium mb-4 text-white group-hover:text-glow-silver tracking-tight transition-all duration-300 relative inline-block">
          {service.title}
        </h3>
        
        <p className="text-silver-metallic font-light leading-relaxed mb-10 flex-grow text-sm md:text-base">
          {service.description}
        </p>
        
        <div className="mt-auto pt-6 border-t border-white/5 relative">
          <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-electric-blue to-neon-blue group-hover:w-full transition-all duration-700 ease-out" />
          <Link to={`/services/${serviceSlug}`} className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors cursor-pointer w-full font-mono">
            <span>Explore Capability</span>
            <motion.div 
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={cn("transition-colors duration-300", isHovered ? "text-electric-blue" : "text-white/40")}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="services" ref={containerRef} className="py-32 lg:py-48 relative text-white bg-dark overflow-hidden">
      {/* Dynamic Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <motion.div style={{ y, opacity }} className="absolute right-[5%] top-1/4 w-[800px] h-[800px] bg-electric-blue/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute left-0 bottom-0 w-1/2 h-1/2 bg-neon-blue/5 blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12 lg:gap-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-8 h-8 geometric-diamond bg-electric-blue/20 flex items-center justify-center border border-electric-blue/50">
                <div className="w-2 h-2 bg-neon-blue geometric-diamond animate-pulse shadow-[0_0_10px_#3b82f6]" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-electric-blue">Core Capabilities</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-5xl lg:text-[72px] font-bold leading-[1.05] tracking-tight drop-shadow-xl"
            >
               Architecting The <br className="hidden md:block" />
              <span className="text-gradient-metallic italic font-light font-display opacity-90">Unprecedented.</span>
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-silver-metallic max-w-[400px] lg:text-right font-light leading-relaxed text-sm md:text-base border-l-2 lg:border-l-0 lg:border-r-2 border-electric-blue/30 pl-4 lg:pl-0 lg:pr-6 py-2"
          >
            We deploy elite digital ecosystems designed to dominate markets, process billions in transactions, and inspire generations.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, idx) => (
            <ServiceCard key={service.title} service={service} index={idx} />
          ))}

          {/* Premium CTA Integration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: services.length * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative p-8 lg:p-10 bg-gradient-to-br from-electric-blue to-neon-blue flex flex-col justify-between geometric-clip border border-neon-blue/50 overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.2)]"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative z-10">
              <div className="w-10 h-10 mb-6 bg-white flex items-center justify-center geometric-clip-right shadow-lg">
                <ArrowRight className="w-5 h-5 text-electric-blue" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-display font-bold mb-4 text-white tracking-tight drop-shadow-md">Engage<br/>Transformation.</h3>
              <p className="text-white/80 font-mono text-[10px] uppercase tracking-widest leading-relaxed max-w-[200px]">Strategic consultation for enterprise entities.</p>
            </div>
            
            <Link to="/contact" className="inline-flex items-center justify-between pb-4 border-b border-white/30 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:border-white transition-colors relative z-10 font-mono w-full group/btn mt-12">
              <span>Initiate Deployment</span>
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="group-hover/btn:translate-x-2 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
