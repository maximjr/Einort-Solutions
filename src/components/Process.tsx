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
    <section id="process" className="py-24 lg:py-40 relative bg-dark border-t border-white/5 overflow-hidden">
      {/* Background Subtlety */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-electric-blue/5 blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center mb-6"
          >
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-electric-blue rounded-full" />
               <span className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-silver-metallic">Evolution Framework</span>
             </div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-5xl lg:text-[72px] font-semibold mb-6 tracking-tight leading-[1.05] text-white"
          >
            The Physics of <br />
            <span className="text-silver-metallic font-light">
              Digital Creation.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-silver-metallic text-[15px] lg:text-lg font-sans font-light max-w-2xl mx-auto leading-relaxed mt-6"
          >
            A systematic, engineering-first approach to building flawless digital infrastructure from absolute zero to global scale.
          </motion.p>
        </div>

        <div className="relative">
          {/* Central Neural Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 md:-translate-x-1/2">
             <div className="absolute top-0 w-full h-[30%] bg-gradient-to-b from-transparent via-electric-blue to-transparent animate-pulse opacity-50" />
          </div>
          
          <div className="space-y-12 md:space-y-20">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-20 ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 w-full md:w-1/2 ${isEven ? 'md:text-left' : 'md:text-right'} pl-16 md:pl-0`}>
                    <div className="p-8 md:p-10 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 relative group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      
                      <h3 className="font-display text-2xl md:text-3xl font-semibold mb-3 relative z-10 text-white tracking-tight transition-colors duration-500">{step.title}</h3>
                      <p className="text-silver-metallic font-sans font-light leading-relaxed relative z-10 text-sm md:text-[15px]">{step.desc}</p>
                    </div>
                  </div>
                  
                  {/* Central Node */}
                  <div className="absolute left-[8px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-8 md:w-12 h-8 md:h-12 rounded-full bg-dark border border-white/20 z-10 group transition-all duration-500 hover:border-electric-blue shadow-lg">
                    <span className="font-mono font-medium text-[10px] md:text-xs text-silver-metallic group-hover:text-white transition-colors">{step.id}</span>
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
