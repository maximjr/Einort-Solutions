import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Authority } from './Authority';

import { SEO } from './SEO';

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <>
    <SEO title="About Us | EINORT SOLUTIONS" description="EINORT SOLUTIONS is a global collective of elite strategists, visionary designers, and world-class engineers." />
    <section id="about" ref={containerRef} className="py-32 lg:py-48 relative bg-dark overflow-hidden border-t border-white/5">
      {/* Dynamic Background Elements */}
      <motion.div style={{ y, opacity }} className="absolute left-[-10%] top-1/4 w-[600px] h-[600px] bg-premium-gold/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-8 h-8 geometric-diamond bg-white/5 flex items-center justify-center border border-white/10">
                <div className="w-2 h-2 geometric-diamond bg-premium-gold shadow-[0_0_10px_#3b82f6]" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-silver-metallic">The EINORT Identity</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-6xl lg:text-[84px] font-bold leading-[1.05] mb-8 tracking-tight drop-shadow-md"
            >
              We engineer <br/>
              <span className="text-gradient-metallic italic font-light font-display opacity-90 relative">
                tomorrow's
                <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-premium-gold to-transparent" />
              </span> <br/>
              digital reality.
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1 }}
              className="space-y-6 text-lg md:text-xl text-silver-metallic font-light leading-relaxed border-l-2 border-premium-gold/30 pl-6"
            >
              <p>
                EINORT SOLUTIONS is a global collective of elite strategists, visionary designers, and world-class engineers. We don't just build software; we architect living digital ecosystems that propel industry leaders into the future.
              </p>
              <p>
                Our philosophy is simple: uncompromising excellence. By fusing breakthrough design protocols with high-performance, infinitely scalable architectures, we create unparalleled digital entities that dominate global markets.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mt-16 grid grid-cols-2 gap-12 border-t border-white/10 pt-12"
            >
              <div className="relative group cursor-default">
                <div className="absolute -left-4 top-0 w-[2px] h-full bg-gradient-to-b from-premium-gold to-transparent group-hover:h-full group-hover:bg-premium-gold transition-all duration-500" />
                <p className="font-display text-5xl font-bold text-white mb-3 group-hover:text-glow-silver transition-colors">10<span className="text-premium-gold">+</span></p>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic font-bold group-hover:text-premium-gold transition-colors">Years of Mastery</p>
              </div>
              <div className="relative group cursor-default">
                <div className="absolute -left-4 top-0 w-[2px] h-full bg-gradient-to-b from-oxblood to-transparent group-hover:h-full group-hover:bg-oxblood transition-all duration-500" />
                <p className="font-display text-5xl font-bold text-white mb-3 group-hover:text-glow-silver transition-colors">250<span className="text-oxblood">+</span></p>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic font-bold group-hover:text-oxblood transition-colors">Enterprise Deployments</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative h-[600px] lg:h-[800px] w-full geometric-clip overflow-hidden border border-white/5 group shadow-[0_0_50px_rgba(37,99,235,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent z-10" />
            
            {/* Cinematic Glare Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-premium-gold/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-15 mix-blend-screen pointer-events-none" />

            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop" 
              alt="Global Network"
              loading="lazy"
              className="w-full h-full object-cover filter saturate-0 group-hover:saturate-100 transition-all duration-1000 group-hover:scale-110 mix-blend-luminosity group-hover:mix-blend-normal"
            />
            
            <div className="absolute inset-x-6 lg:inset-x-8 bottom-6 lg:bottom-10 z-20">
               <div className="p-8 lg:p-10 holographic-panel geometric-clip-right border border-white/10 backdrop-blur-2xl relative overflow-hidden group-hover:border-premium-gold/50 transition-colors duration-700">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/20 blur-[50px] pointer-events-none" />
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-premium-gold to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 
                 <div className="flex items-center gap-3 mb-6 relative z-10">
                   <div className="w-2 h-2 geometric-diamond bg-oxblood animate-pulse shadow-[0_0_10px_#3b82f6]" />
                   <h3 className="font-mono text-[10px] tracking-[0.2em] uppercase text-silver-metallic font-bold">Core Directive</h3>
                 </div>
                 <p className="text-white font-display text-xl lg:text-2xl font-bold tracking-tight leading-relaxed relative z-10">
                   To accelerate human progress by engineering intelligent, futuristic digital infrastructure that empowers enterprises to scale infinitely without friction.
                 </p>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
    <Authority />
    </>
  );
}
