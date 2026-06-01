import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.95]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-dark">
      {/* Immersive Cinematic Background - Refined and Subtle */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#0a1936]/40 blur-[150px] mix-blend-screen" />
        <motion.div style={{ y: y2 }} className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] bg-[#1d4ed8]/20 blur-[130px] mix-blend-screen" />
        {/* Subtle Geometric Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [transform:perspective(1500px)_rotateX(60deg)_translateY(-100px)_translateZ(-200px)_scale(2)] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full pt-12 lg:pt-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div style={{ opacity, scale }} className="flex flex-col gap-8 order-2 lg:order-1 pt-12 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-4 py-2 glass-panel-light rounded-full border-white/5 w-fit shadow-sm"
            >
              <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse shadow-[0_0_8px_#D4AF37]"></div>
              <span className="text-[11px] font-mono font-medium uppercase tracking-widest text-silver-metallic">Next Generation Architecture</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <h1 className="text-5xl md:text-7xl lg:text-[80px] leading-[1.05] font-bold tracking-tight font-display relative z-10">
                <span className="block text-white drop-shadow-xl">We Engineer</span>
                <span className="block text-gradient-theme mt-1">The Future.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="text-lg text-silver-metallic max-w-lg leading-relaxed font-light"
            >
              EINORT SOLUTIONS architects immersive web experiences, deep tech ecosystems, and scalable infrastructure designed to dominate the modern digital landscape.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-5 mt-2"
            >
              <Link to="/book" className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-dark rounded-full overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                <span className="relative z-10 text-[13px] font-semibold tracking-wide flex items-center gap-2">
                  Initiate Discovery
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
              <Link to="/audit" className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 hover:border-premium-gold/30 transition-all duration-300">
                <span className="text-[13px] font-medium tracking-wide text-silver-metallic group-hover:text-premium-gold transition-colors flex items-center gap-2">
                  Run AI Site Audit
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ opacity, scale: useTransform(scrollY, [0, 800], [1, 1.05]) }}
            className="order-1 lg:order-2 relative h-[450px] sm:h-[500px] lg:h-[700px] w-full flex items-center justify-center"
          >
            {/* Holographic 3D Geometric Cinematic Environment - Refined */}
            <div className="absolute inset-0 flex items-center justify-center perspective-[2000px] [transform-style:preserve-3d]">
              
              {/* Central Dimensional Prism */}
              <motion.div 
                animate={{ rotateY: [0, 360], rotateX: [5, -5, 5] }}
                transition={{ rotateY: { duration: 40, repeat: Infinity, ease: "linear" }, rotateX: { duration: 20, repeat: Infinity, ease: "easeInOut" } }}
                className="relative w-64 h-64 lg:w-[400px] lg:h-[400px] [transform-style:preserve-3d]"
              >
                {/* Layered Glass Rings - Replaced polygons with elegant rings */}
                {[0, 1, 2].map((i) => (
                  <motion.div 
                    key={i}
                    className="absolute inset-0 border border-white/10 rounded-full"
                    style={{ 
                      transform: `translateZ(${i * 40 - 40}px) scale(${1 - i * 0.1}) rotateZ(${i * 30}deg)`,
                      boxShadow: i === 0 ? 'inset 0 0 40px rgba(255, 255, 255, 0.02)' : 'none'
                    }}
                  />
                ))}
                
                {/* Majestic Core Logo */}
                <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: 'translateZ(80px)' }}>
                  <img 
                    src="https://i.imgur.com/6V1ecDU.png" 
                    alt="EINORT Hologram" 
                    className="w-40 h-40 lg:w-48 lg:h-48 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mix-blend-screen"
                  />
                </div>
              </motion.div>

              {/* Refined Orbital Accelerators */}
              <motion.div 
                animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute w-[100%] h-[100%] border border-white/5 rounded-full"
                style={{ transformStyle: 'preserve-3d' }}
              />

              {/* Floating Intelligence Panels - Minimalist */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 -left-2 lg:left-10 p-4 bg-dark/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl z-20"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 bg-premium-gold rounded-full animate-pulse" />
                  <p className="text-[10px] font-mono text-silver-metallic uppercase tracking-widest">Neural Sync</p>
                </div>
                <p className="text-lg font-display font-medium text-white tracking-tight">Active State</p>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-20 -right-2 lg:-right-4 p-4 bg-dark/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl z-20 text-right"
              >
                <p className="text-[10px] font-mono text-silver-metallic uppercase tracking-widest mb-1">Performance</p>
                <p className="text-lg font-display font-medium text-white tracking-tight">Zero Latency</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
        
        {/* Enterprise Metrics Footer - Refined */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 border-t border-white/5 pt-8"
        >
          {[
            { value: "Scalable", label: "Cloud Architectures" },
            { value: "Secure", label: "Enterprise Grade" },
            { value: "Global", label: "Deployment Ready" },
            { value: "Modern", label: "Tech Stack" }
          ].map((metric, idx) => (
            <div 
              key={idx}
              className="flex flex-col gap-1"
            >
              <span className="text-2xl lg:text-3xl font-display font-semibold text-white tracking-tight">{metric.value}</span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-silver-metallic">{metric.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
