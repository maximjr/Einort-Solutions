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
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-8 lg:p-10 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden h-full flex flex-col rounded-3xl"
    >
      {/* Subtle Glow Overlay on Hover */}
      <div 
        className={cn(
          "absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-electric-blue/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 pointer-events-none",
          isHovered && "opacity-100"
        )}
      />
      
      {/* Animated Top Line */}
      <div className={cn(
        "absolute top-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700",
        isHovered ? "w-2/3 opacity-100" : "w-0 opacity-0"
      )} />

      <div className="absolute top-8 right-8 opacity-40 text-[10px] font-mono tracking-widest text-silver-metallic group-hover:opacity-100 group-hover:text-white transition-all duration-500">
        {index < 9 ? `0${index + 1}` : index + 1}
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-105 group-hover:bg-white/10 transition-all duration-500 relative overflow-hidden">
            <service.icon className={cn(
              "w-5 h-5 text-silver-metallic transition-colors duration-500 relative z-10",
              isHovered && "text-white"
            )} />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-mono font-medium text-silver-metallic group-hover:text-white transition-colors">
            {service.tag}
          </span>
        </div>
        
        <h3 className="text-2xl font-display font-semibold mb-3 text-white tracking-tight transition-all duration-300 relative inline-block">
          {service.title}
        </h3>
        
        <p className="text-silver-metallic font-sans font-light leading-relaxed mb-10 flex-grow text-sm">
          {service.description}
        </p>
        
        <div className="mt-auto pt-6 border-t border-white/5 relative flex">
          <Link to={`/services/${serviceSlug}`} className="flex items-center gap-2 text-[12px] font-sans font-medium text-white/50 group-hover:text-white transition-colors cursor-pointer w-fit group/btn">
            <span>Explore Capability</span>
            <motion.div 
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={cn("transition-colors duration-300", isHovered ? "text-white" : "text-white/50")}
            >
              <ArrowRight className="w-3.5 h-3.5" />
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
    <section id="services" ref={containerRef} className="py-24 lg:py-40 relative text-white bg-dark overflow-hidden">
      {/* Background Subtleties */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <motion.div style={{ y, opacity }} className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-electric-blue/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-1.5 h-1.5 bg-electric-blue rounded-full" />
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-silver-metallic">Core Capabilities</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-5xl lg:text-[64px] font-semibold leading-[1.1] tracking-tight"
            >
               Architecting The <br className="hidden md:block" />
              <span className="text-silver-metallic font-light">Unprecedented.</span>
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-silver-metallic max-w-[360px] font-sans font-light leading-relaxed text-sm lg:text-[15px]"
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
            transition={{ duration: 0.6, delay: services.length * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative p-8 lg:p-10 bg-white text-dark flex flex-col justify-between rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform duration-500"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 mb-6 rounded-full bg-dark/5 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-dark" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-display font-semibold mb-3 tracking-tight">Engage<br/>Transformation.</h3>
              <p className="text-dark/60 font-sans text-sm leading-relaxed max-w-[200px] font-medium">Strategic consultation for enterprise entities.</p>
            </div>
            
            <Link to="/contact" className="inline-flex items-center gap-2 text-[13px] font-semibold text-dark hover:gap-3 transition-all relative z-10 w-fit mt-12 bg-dark text-white px-5 py-2.5 rounded-full hover:bg-dark/90">
              <span>Initiate Deployment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
