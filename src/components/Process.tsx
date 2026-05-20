import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const steps = [
  { id: '01', title: 'Discovery Architecture', desc: 'Deep-dive analysis of your business infrastructure and market positioning.' },
  { id: '02', title: 'Strategic Blueprint', desc: 'Crafting the computational blueprint for digital dominance and scalable growth.' },
  { id: '03', title: 'Interface Engineering', desc: 'Prototyping award-winning, human-centric interfaces with micro-interactions.' },
  { id: '04', title: 'Core Development', desc: 'Engineering robust, performant code using cutting-edge enterprise stacks.' },
  { id: '05', title: 'Security Audit', desc: 'Rigorous QA and penetration testing to ensure zero vulnerabilities.' },
  { id: '06', title: 'Global Deployment', desc: 'Seamless launch into production environments with absolute zero downtime.' },
  { id: '07', title: 'System Scaling', desc: 'Continuous optimization and intelligent performance scaling.' }
];

export function Process() {
  return (
    <section id="process" className="py-32 lg:py-48 relative bg-dark border-t border-white/5 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-blue/5 blur-[150px] mix-blend-screen pointer-events-none" />

      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-32 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center mb-8"
          >
             <div className="flex items-center gap-4">
               <div className="w-8 h-8 geometric-diamond bg-white/5 flex items-center justify-center border border-white/10">
                 <div className="w-2 h-2 geometric-diamond bg-electric-blue animate-pulse shadow-[0_0_10px_#3b82f6]" />
               </div>
               <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-silver-metallic">Evolution Framework</span>
             </div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-6xl lg:text-[84px] font-bold mb-6 tracking-tight leading-[1.05] drop-shadow-md text-white"
          >
            The Physics of <br />
            <span className="text-gradient-metallic italic font-light font-display opacity-90 relative inline-block">
              Digital Creation.
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-electric-blue to-transparent" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-silver-metallic text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm mt-8"
          >
            A systematic, engineering-first approach to building flawless digital infrastructure from absolute zero to global scale.
          </motion.p>
        </div>

        <div className="relative">
          {/* Central Neural Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 md:-translate-x-1/2">
             <div className="absolute top-0 w-full h-[30%] bg-gradient-to-b from-electric-blue via-neon-blue/50 to-transparent animate-pulse shadow-[0_0_15px_#3b82f6]" />
          </div>
          
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-24 ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 w-full md:w-1/2 ${isEven ? 'md:text-left' : 'md:text-right'} pl-20 md:pl-0`}>
                    <div className={cn(
                      "holographic-panel p-8 md:p-10 border border-white/5 hover:border-electric-blue/50 transition-colors duration-500 relative group overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent",
                      isEven ? "geometric-clip-right" : "geometric-clip"
                    )}>
                      <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen pointer-events-none" />
                      
                      <div className={cn(
                        "absolute top-0 w-full h-[2px] transform transition-transform duration-1000",
                        isEven ? "left-0 bg-gradient-to-r from-transparent via-electric-blue to-transparent -translate-x-full group-hover:translate-x-full" : "right-0 bg-gradient-to-l from-transparent via-electric-blue to-transparent translate-x-full group-hover:-translate-x-full"
                      )} />
                      
                      <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 relative z-10 text-white tracking-tight group-hover:text-glow-silver transition-colors duration-500">{step.title}</h3>
                      <p className="text-silver-metallic font-light leading-relaxed relative z-10 text-sm md:text-base">{step.desc}</p>
                    </div>
                  </div>
                  
                  {/* Central Node */}
                  <div className="absolute left-[12px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 md:w-16 h-10 md:h-16 geometric-diamond bg-dark border border-white/20 z-10 group transition-all duration-500 hover:border-electric-blue hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <span className="font-mono font-bold text-xs md:text-sm text-silver-metallic group-hover:text-white transition-colors">{step.id}</span>
                  </div>

                  <div className="hidden md:block flex-1 w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
