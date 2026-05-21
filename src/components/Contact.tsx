import { motion } from 'motion/react';
import { ArrowRight, Mail, MapPin } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="relative bg-dark py-32 lg:py-48 overflow-hidden border-t border-white/5">
      <div className="absolute inset-x-0 bottom-0 min-h-screen bg-gradient-to-t from-electric-blue/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div>
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="flex items-center gap-4 mb-8"
             >
               <div className="w-8 h-8 geometric-diamond bg-white/5 flex items-center justify-center border border-white/10">
                 <div className="w-2 h-2 bg-neon-blue geometric-diamond animate-pulse shadow-[0_0_10px_#3b82f6]" />
               </div>
               <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-electric-blue">Initialize Comm-Link</span>
             </motion.div>
             
             <motion.h2 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="font-display text-5xl md:text-7xl lg:text-[84px] font-bold mb-8 leading-[1.05] tracking-tight text-white drop-shadow-md"
             >
               Architect the <br className="hidden lg:block"/>
               <span className="text-gradient-metallic font-display italic font-light opacity-90">Impossible.</span>
             </motion.h2>
             
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2, duration: 1 }}
               className="text-silver-metallic text-lg md:text-xl font-light mb-12 max-w-md leading-relaxed border-l-2 border-electric-blue/30 pl-6"
             >
               Partner with EINORT SOLUTIONS to engineer your enterprise digital future. We transform ambitious visions into dominant market realities.
             </motion.p>
             
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 }}
               className="space-y-8"
             >
               <div className="flex items-center gap-6 group">
                 <div className="w-14 h-14 geometric-clip-right bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-electric-blue/50 transition-colors duration-500 shadow-sm relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <Mail className="w-5 h-5 text-electric-blue relative z-10" />
                 </div>
                 <div>
                   <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic font-bold mb-1">Encrypted Comm</p>
                   <a href="mailto:hello@einort.com" className="text-xl font-display font-medium text-white hover:text-glow-silver transition-colors">hello@einort.com</a>
                 </div>
               </div>
               
               <div className="flex items-center gap-6 group">
                 <div className="w-14 h-14 geometric-clip-right bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-neon-blue/50 transition-colors duration-500 shadow-sm relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <MapPin className="w-5 h-5 text-neon-blue relative z-10" />
                 </div>
                 <div>
                   <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic font-bold mb-1">Global HQ</p>
                   <p className="text-xl font-display font-medium text-white">Silicon Valley, CA</p>
                 </div>
               </div>
             </motion.div>
          </div>

          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
             className="holographic-panel p-8 md:p-12 geometric-clip border border-white/10 relative overflow-hidden group hover:border-electric-blue/30 transition-colors duration-700"
          >
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-electric-blue/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-electric-blue/20 transition-colors duration-700" />
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-neon-blue/10 blur-[50px] rounded-full pointer-events-none" />
             
             <form className="relative z-10 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                   <label htmlFor="firstName" className="text-[10px] uppercase font-mono tracking-[0.2em] text-silver-metallic font-bold">Designation (First)</label>
                   <input id="firstName" type="text" className="bg-dark/50 geometric-clip-right border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-electric-blue transition-colors placeholder:text-white/20 font-light" placeholder="John" />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label htmlFor="lastName" className="text-[10px] uppercase font-mono tracking-[0.2em] text-silver-metallic font-bold">Designation (Last)</label>
                   <input id="lastName" type="text" className="bg-dark/50 geometric-clip-right border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-electric-blue transition-colors placeholder:text-white/20 font-light" placeholder="Doe" />
                 </div>
               </div>
               
               <div className="flex flex-col gap-2">
                 <label htmlFor="email" className="text-[10px] uppercase font-mono tracking-[0.2em] text-silver-metallic font-bold">Origin (Email)</label>
                 <input id="email" type="email" className="bg-dark/50 geometric-clip-right border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-electric-blue transition-colors placeholder:text-white/20 font-light" placeholder="john@enterprise.com" />
               </div>
               
               <div className="flex flex-col gap-2">
                 <label htmlFor="message" className="text-[10px] uppercase font-mono tracking-[0.2em] text-silver-metallic font-bold">Project Parameters</label>
                 <textarea id="message" rows={4} className="bg-dark/50 geometric-clip-right border border-white/10 px-5 py-4 text-white focus:outline-none focus:border-electric-blue transition-colors placeholder:text-white/20 font-light resize-none" placeholder="Outline your architectural vision..." />
               </div>
               
               <button className="group/btn relative w-full flex items-center justify-center gap-4 bg-white text-dark px-8 py-5 geometric-clip font-bold uppercase tracking-[0.2em] font-mono text-sm overflow-hidden mt-6 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all">
                 <span className="relative z-10 transition-colors group-hover/btn:text-white">Transmit Protocol</span>
                 <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover/btn:translate-x-2 group-hover/btn:text-white" />
                 <div className="absolute inset-0 bg-electric-blue transform scale-x-0 origin-left transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover/btn:scale-x-100" />
               </button>
             </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
