import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="about" ref={containerRef} className="py-32 lg:py-48 relative bg-dark overflow-hidden border-t border-white/5">
      {/* Dynamic Background Elements */}
      <motion.div style={{ y }} className="absolute left-0 top-1/4 w-[400px] h-[600px] bg-electric-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-8 geometric-clip bg-white/5 flex items-center justify-center border border-white/10">
                <div className="w-1.5 h-1.5 bg-electric-blue" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-silver-metallic">The EINORT Identity</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight"
            >
              We engineer <br/>
              <span className="text-gradient-metallic italic font-light font-display">tomorrow's</span> <br/>
              digital reality.
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-lg md:text-xl text-silver-metallic font-light leading-relaxed"
            >
              <p>
                EINORT SOLUTIONS is a global collective of elite strategists, visionary designers, and world-class engineers. We don't just build software; we architect living digital ecosystems that propel industry leaders into the future.
              </p>
              <p>
                Our philosophy is simple: uncompromising excellence. By fusing Apple-level minimalist design principles with high-performance, infinitely scalable architectures, we create unparalleled digital products that dominate global markets.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-16 grid grid-cols-2 gap-12 border-t border-white/10 pt-12"
            >
              <div className="relative">
                <div className="absolute -left-4 top-0 w-[2px] h-full bg-gradient-to-b from-electric-blue to-transparent" />
                <p className="font-display text-5xl font-medium text-white mb-3">10<span className="text-electric-blue">+</span></p>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic font-bold">Years of Mastery</p>
              </div>
              <div className="relative">
                <div className="absolute -left-4 top-0 w-[2px] h-full bg-gradient-to-b from-electric-blue to-transparent" />
                <p className="font-display text-5xl font-medium text-white mb-3">250<span className="text-electric-blue">+</span></p>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic font-bold">Enterprise Deployments</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative h-[600px] lg:h-[800px] w-full geometric-clip overflow-hidden glass-panel border border-white/5 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent z-10" />
            
            {/* Cinematic Glare Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-15 mix-blend-screen pointer-events-none" />

            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop" 
              alt="Global Network"
              className="w-full h-full object-cover filter saturate-0 group-hover:saturate-100 transition-all duration-1000 group-hover:scale-105"
            />
            
            <div className="absolute inset-x-8 bottom-8 z-20">
               <div className="p-8 glass-panel geometric-clip border border-white/10 backdrop-blur-xl relative overflow-hidden group-hover:border-neon-blue transition-colors duration-500">
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-electric-blue to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 
                 <div className="flex items-center gap-2 mb-4">
                   <div className="w-1.5 h-1.5 bg-neon-blue animate-pulse" />
                   <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-silver-metallic font-bold">Core Directive</h3>
                 </div>
                 <p className="text-white font-display text-lg lg:text-xl font-medium tracking-wide">To accelerate human progress by engineering intelligent, breathtaking digital infrastructure that empowers enterprises to scale infinitely without friction.</p>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
