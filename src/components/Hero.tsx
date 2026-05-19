import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-dark">
      {/* Immersive Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-electric-blue/20 blur-[150px] rounded-full mix-blend-screen" />
        <motion.div style={{ y: y2 }} className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-neon-blue/15 blur-[120px] rounded-full mix-blend-screen" />
        {/* Geometric Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [transform:perspective(1000px)_rotateX(60deg)_translateY(-200px)_scale(2.5)] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full pt-16 lg:pt-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-4 py-2 glass-panel-light border-neon rounded-none geometric-clip w-fit"
            >
              <div className="w-2 h-2 bg-electric-blue rounded-none animate-pulse shadow-[0_0_10px_#2563eb]"></div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-soft-silver">Enterprise Digital Architecture</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <h1 className="text-5xl md:text-7xl lg:text-[84px] leading-[0.9] font-bold tracking-tighter uppercase font-display relative z-10">
                <span className="block text-white text-glow-silver">We Engineer</span>
                <span className="block text-gradient-metallic mt-2">The Future</span>
              </h1>
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-[80%] bg-gradient-to-b from-electric-blue via-neon-blue to-transparent" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-lg md:text-xl text-silver-metallic max-w-xl leading-relaxed font-light"
            >
              EINORT SOLUTIONS builds high-performance ecosystems, immersive web experiences, and scalable infrastructure for the world's most ambitious enterprise brands.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 mt-6"
            >
              <a href="#contact" className="group relative inline-flex items-center justify-center px-10 py-5 bg-electric-blue overflow-hidden geometric-clip-button font-mono transition-transform hover:scale-105 duration-300">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:transition-transform group-hover:translate-x-[150%] duration-1000" />
                <span className="relative z-10 tracking-[0.2em] text-xs font-bold uppercase text-white shadow-sm flex items-center gap-3">
                  Initiate Project
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </a>
              <a href="#work" className="group relative inline-flex items-center justify-center px-10 py-5 glass-panel-light geometric-clip-button font-mono border-l-2 border-transparent hover:border-neon-blue transition-all duration-300">
                <span className="tracking-[0.2em] text-xs font-bold uppercase text-silver-metallic group-hover:text-white transition-colors flex items-center gap-2">
                  Explore Architecture
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative h-[500px] lg:h-[700px] w-full flex items-center justify-center"
          >
            {/* Holographic 3D Geometric Logo Environment */}
            <div className="absolute inset-0 flex items-center justify-center perspective-[2000px] [transform-style:preserve-3d]">
              
              {/* Central Prism Structure */}
              <motion.div 
                animate={{ rotateY: 360, rotateZ: [0, 5, 0, -5, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative w-64 h-64 lg:w-96 lg:h-96 [transform-style:preserve-3d]"
              >
                {/* 3D Layers */}
                {[0, 1, 2].map((i) => (
                  <motion.div 
                    key={i}
                    className="absolute inset-0 border border-electric-blue/30 bg-electric-blue/5 geometric-clip mix-blend-screen backdrop-blur-sm"
                    style={{ 
                      transform: `translateZ(${i * 40 - 40}px) scale(${1 - i * 0.1})`,
                      boxShadow: i === 0 ? '0 0 50px rgba(59, 130, 246, 0.3)' : 'none'
                    }}
                  />
                ))}
                
                {/* Core Glowing Logo */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(80px)' }}>
                  <img 
                    src="https://i.imgur.com/6V1ecDU.png" 
                    alt="EINORT Hologram" 
                    className="w-32 h-32 lg:w-48 lg:h-48 object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.8)] mix-blend-screen"
                  />
                </div>
              </motion.div>

              {/* Orbital Rings */}
              <motion.div 
                animate={{ rotateX: 360, rotateY: 180 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                className="absolute w-[120%] h-[120%] border border-white/5 rounded-full"
                style={{ transformStyle: 'preserve-3d' }}
              />
              <motion.div 
                animate={{ rotateZ: 360, rotateX: 180 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[140%] h-[140%] border border-electric-blue/20 rounded-full border-t-transparent border-b-transparent"
                style={{ transformStyle: 'preserve-3d' }}
              />

              {/* Floating Data Panels */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 -left-4 lg:left-0 p-4 glass-panel border-neon z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-electric-blue animate-pulse" />
                  <p className="text-[10px] font-mono text-soft-silver uppercase tracking-widest">System Status</p>
                </div>
                <p className="text-2xl font-display font-bold text-white text-glow">OPTIMAL</p>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-20 -right-4 lg:-right-10 p-4 glass-panel border-white/10 z-20 text-right"
              >
                <p className="text-[10px] font-mono text-silver-metallic uppercase tracking-widest mb-1">Compute Core</p>
                <p className="text-xl font-display font-bold text-gradient-metallic">99.99%</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
        
        {/* Enterprise Metrics Footer */}
        <motion.div 
          style={{ opacity }}
          className="mt-16 lg:mt-32 grid grid-cols-2 lg:grid-cols-4 gap-1 border-t border-white/10 pt-10"
        >
          {[
            { value: "142+", label: "Global Deployments" },
            { value: "$4B+", label: "Client Revenue Processed" },
            { value: "<50ms", label: "Average Latency" },
            { value: "50+", label: "Elite Partners" }
          ].map((metric, idx) => (
            <div key={idx} className="flex flex-col gap-2 p-4 border-l border-white/5 pl-6">
              <span className="text-3xl font-display font-bold text-white">{metric.value}</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-silver-metallic">{metric.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
