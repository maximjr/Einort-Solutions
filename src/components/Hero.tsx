import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 250]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.85]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-dark">
      {/* Immersive Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-electric-blue/10 blur-[150px] mix-blend-screen" />
        <motion.div style={{ y: y2 }} className="absolute bottom-[10%] -right-[15%] w-[60%] h-[60%] bg-neon-blue/10 blur-[150px] mix-blend-screen" />
        {/* Geometric Grid Overlay - Holographic Depth */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [transform:perspective(2000px)_rotateX(75deg)_translateY(-100px)_translateZ(200px)_scale(3)] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full pt-12 lg:pt-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div style={{ opacity, scale }} className="flex flex-col gap-8 order-2 lg:order-1 pt-12 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-4 px-5 py-2.5 glass-panel-light geometric-clip-right w-fit border-l-2 border-l-electric-blue"
            >
              <div className="w-2.5 h-2.5 bg-electric-blue geometric-diamond animate-pulse shadow-[0_0_12px_#2563eb]"></div>
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.3em] text-white">Next Generation Architecture</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <h1 className="text-5xl md:text-7xl lg:text-[84px] leading-[0.95] font-bold tracking-tight uppercase font-display relative z-10">
                <span className="block text-white text-glow-silver drop-shadow-2xl">We Engineer</span>
                <span className="block text-gradient-metallic mt-2 drop-shadow-2xl">The Future.</span>
              </h1>
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-[2px] h-[75%] bg-gradient-to-b from-electric-blue via-neon-blue to-transparent opacity-80" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="text-lg md:text-xl text-silver-metallic max-w-xl leading-relaxed font-light drop-shadow-sm"
            >
              EINORT SOLUTIONS architects immersive web experiences, deep tech ecosystems, and scalable infrastructure designed to dominate the modern digital landscape.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-6 mt-4"
            >
              <a href="#contact" className="group relative inline-flex items-center justify-center px-10 py-5 bg-electric-blue overflow-hidden geometric-clip hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] font-mono transition-all hover:scale-[1.02] duration-500">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:transition-transform group-hover:translate-x-[150%] duration-1000" />
                <span className="relative z-10 tracking-[0.2em] text-xs font-bold uppercase text-white shadow-sm flex items-center gap-3">
                  Initiate Protocol
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </a>
              <a href="#work" className="group relative inline-flex items-center justify-center px-10 py-5 glass-panel geometric-clip font-mono border-l-2 border-transparent hover:border-neon-blue hover:bg-white/5 hover:shadow-2xl transition-all duration-500">
                <span className="tracking-[0.2em] text-xs font-bold uppercase text-silver-metallic group-hover:text-white transition-colors flex items-center gap-2">
                  View Architecture
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" />
                </span>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ opacity, scale: useTransform(scrollY, [0, 800], [1, 1.1]) }}
            className="order-1 lg:order-2 relative h-[450px] sm:h-[500px] lg:h-[750px] w-full flex items-center justify-center"
          >
            {/* Holographic 3D Geometric Cinematic Environment */}
            <div className="absolute inset-0 flex items-center justify-center perspective-[2500px] [transform-style:preserve-3d]">
              
              {/* Central Dimensional Prism */}
              <motion.div 
                animate={{ rotateY: [0, 360], rotateX: [10, -10, 10] }}
                transition={{ rotateY: { duration: 30, repeat: Infinity, ease: "linear" }, rotateX: { duration: 15, repeat: Infinity, ease: "easeInOut" } }}
                className="relative w-72 h-72 lg:w-[450px] lg:h-[450px] [transform-style:preserve-3d]"
              >
                {/* Layered Glass Polygons */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    className="absolute inset-0 border border-electric-blue/40 bg-electric-blue/5 geometric-clip mix-blend-screen backdrop-blur-md"
                    style={{ 
                      transform: `translateZ(${i * 60 - 90}px) scale(${1 - i * 0.15}) rotateZ(${i * 45}deg)`,
                      boxShadow: i === 0 ? '0 0 80px rgba(59, 130, 246, 0.2)' : 'none'
                    }}
                  />
                ))}
                
                {/* Majestic Glowing Core Logo */}
                <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]" style={{ transform: 'translateZ(120px)' }}>
                  <img 
                    src="https://i.imgur.com/6V1ecDU.png" 
                    alt="EINORT Hologram" 
                    className="w-40 h-40 lg:w-56 lg:h-56 object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.9)] mix-blend-screen"
                  />
                </div>
              </motion.div>

              {/* Advanced Orbital Accelerators */}
              <motion.div 
                animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[110%] h-[110%] border-2 border-white/5 rounded-full"
                style={{ transformStyle: 'preserve-3d' }}
              />
              <motion.div 
                animate={{ rotateZ: [360, 0], rotateX: [0, 180, 360] }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute w-[130%] h-[130%] border border-electric-blue/20 rounded-[40%] border-t-transparent border-b-transparent mix-blend-screen drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                style={{ transformStyle: 'preserve-3d' }}
              />

              {/* Floating Intelligence Panels */}
              <motion.div 
                animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 -left-4 lg:left-4 p-5 holographic-panel geometric-clip-right z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2.5 h-2.5 bg-electric-blue geometric-diamond animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                  <p className="text-[10px] font-mono text-soft-silver uppercase tracking-[0.2em]">Neural Sync</p>
                </div>
                <p className="text-2xl font-display font-bold text-white text-glow tracking-tight uppercase">Active</p>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute top-16 -right-4 lg:-right-8 p-5 glass-panel border-white/10 geometric-clip z-20 text-right backdrop-blur-2xl"
              >
                <p className="text-[10px] font-mono text-silver-metallic uppercase tracking-[0.2em] mb-1">Architecture</p>
                <p className="text-xl font-display font-bold text-gradient-metallic tracking-tight">Zero Latency</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
        
        {/* Enterprise Metrics Footer - Cinematic Reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 lg:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-1 border-t border-white/10 pt-10 relative"
        >
          <div className="absolute top-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-electric-blue to-transparent" />
          {[
            { value: "150+", label: "Ecosystems Deployed" },
            { value: "$4.2B+", label: "Value Engineered" },
            { value: "<20ms", label: "Global Latency" },
            { value: "99.99%", label: "Uptime Fidelity" }
          ].map((metric, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ scale: 1.05, x: 5 }}
              className="flex flex-col gap-2 p-4 border-l border-white/5 pl-6 lg:pl-10 cursor-default hover:border-l-electric-blue/50 transition-colors duration-300"
            >
              <span className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">{metric.value}</span>
              <span className="text-[9px] lg:text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic leading-relaxed">{metric.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
