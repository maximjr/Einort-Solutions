import { motion, useScroll, useTransform } from 'motion/react';
import { Layers, Lightbulb, ShieldCheck, Box, Workflow, Network, Fingerprint, Lock, Smartphone } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const services = [
  { icon: Layers, title: 'UI/UX Design', description: 'Award-winning digital experiences crafted with pixel-perfect precision, psychological flow, and elite human-centric design protocols.', tag: 'Design' },
  { icon: Workflow, title: 'Web Development', description: 'High-performance, futuristic software infrastructure built with cutting-edge frameworks and infinitely scalable global architectures.', tag: 'Engineering' },
  { icon: Smartphone, title: 'Mobile Apps Development', description: 'Native and cross-platform mobile experiences that feel premium, fast, and remarkably intuitive.', tag: 'Mobile' },
  { icon: Network, title: 'Enterprise Solutions', description: 'Interconnected, high-availability digital platforms connecting millions of users seamlessly across the globe in real-time.', tag: 'Infrastructure' },
  { icon: Fingerprint, title: 'Brand Identity', description: 'Bold, memorable visual identities and digital aesthetics that position your organization as the undisputed industry leader.', tag: 'Brand' }
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number; key?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const serviceSlug = service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-8 lg:p-10 bg-dark-blue/40 glass-panel border-white/5 hover:border-electric-blue/40 transition-all duration-500 overflow-hidden h-full flex flex-col geometric-clip"
    >
      {/* Holographic Hover Background */}
      <div 
        className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-electric-blue/20 via-neon-blue/5 to-transparent opacity-0 transition-opacity duration-700 pointer-events-none",
          isHovered && "opacity-100"
        )}
      />

      <div className="absolute top-0 right-0 p-4 opacity-30 text-[10px] font-mono tracking-widest text-silver-metallic group-hover:opacity-100 transition-opacity">
        {index < 9 ? `0${index + 1}` : index + 1}
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-white/5 geometric-clip-button flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-neon-blue group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <service.icon className={cn(
              "w-6 h-6 text-silver-metallic transition-colors duration-500 relative z-10",
              isHovered && "text-white"
            )} />
          </div>
          <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold text-electric-blue bg-electric-blue/10 px-2 py-1 border border-electric-blue/20">
            {service.tag}
          </span>
        </div>
        
        <h3 className="text-2xl font-display font-medium mb-4 text-white group-hover:text-glow-silver transition-all duration-300">
          {service.title}
        </h3>
        <p className="text-silver-metallic font-light leading-relaxed mb-10 flex-grow text-sm md:text-base">
          {service.description}
        </p>
        
        <div className="mt-auto pt-6 border-t border-white/5 relative">
          <div className="absolute top-0 left-0 w-0 h-[1px] bg-electric-blue group-hover:w-full transition-all duration-700 ease-out" />
          <Link to={`/services/${serviceSlug}`} className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors cursor-pointer w-full font-mono">
            <span>Explore Capability</span>
            <motion.div 
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-electric-blue"
            >
              →
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
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="services" ref={containerRef} className="py-32 lg:py-48 relative text-white bg-dark overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <motion.div style={{ y }} className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-electric-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-8 geometric-clip bg-electric-blue/20 flex items-center justify-center border border-electric-blue/50">
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-electric-blue">Core Capabilities</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-4xl md:text-5xl lg:text-[64px] font-bold leading-[1.1] tracking-tight"
            >
               Architecting The <br className="hidden md:block" />
              <span className="text-gradient-metallic italic font-light font-display">Unprecedented.</span>
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-silver-metallic max-w-sm lg:text-right font-light leading-relaxed"
          >
            We don't just build software. We engineer elite digital ecosystems designed to scale, dominate, and inspire.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, idx) => (
            <ServiceCard key={service.title} service={service} index={idx} />
          ))}

          {/* Special CTA Card to complete the grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: services.length * 0.1 }}
            className="group relative p-8 lg:p-10 bg-electric-blue flex flex-col justify-between geometric-clip border border-neon-blue/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full" />
            
            <div>
              <h3 className="text-3xl font-display font-medium mb-4 text-white">Ready for<br/>Transformation?</h3>
            </div>
            
            <a href="#contact" className="inline-flex items-center justify-between pb-4 border-b border-white/30 text-xs font-bold uppercase tracking-[0.2em] text-white hover:border-white transition-colors relative z-10 font-mono w-full">
              <span>Initiate Deployment</span>
              <span>→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
