import { motion } from 'motion/react';
import { ArrowRight, Mail, MapPin } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="relative bg-dark pt-16 overflow-hidden border-t border-white/5">
      <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-electric-blue/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          <div>
             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="font-display text-5xl md:text-7xl font-bold mb-8"
             >
               Ready to build the <span className="text-gray-500 font-serif italic">impossible?</span>
             </motion.h2>
             
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="text-gray-400 text-lg md:text-xl font-light mb-12 max-w-md"
             >
               Partner with EINORT Solutions to architect your digital future. Let's create something extraordinary together.
             </motion.p>
             
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="space-y-6"
             >
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full glass-panel border-white/10 flex items-center justify-center">
                   <Mail className="w-5 h-5 text-electric-blue" />
                 </div>
                 <div>
                   <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Email Us</p>
                   <a href="mailto:hello@einort.com" className="text-lg font-medium hover:text-electric-blue transition-colors">hello@einort.com</a>
                 </div>
               </div>
               
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full glass-panel border-white/10 flex items-center justify-center">
                   <MapPin className="w-5 h-5 text-electric-blue" />
                 </div>
                 <div>
                   <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Global HQ</p>
                   <p className="text-lg font-medium">Silicon Valley, CA</p>
                 </div>
               </div>
             </motion.div>
          </div>

          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="glass-panel p-8 md:p-12 rounded-3xl border-white/10 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/20 blur-[80px] rounded-full pointer-events-none" />
             
             <form className="relative z-10 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                   <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">First Name</label>
                   <input type="text" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors placeholder:text-gray-600" placeholder="John" />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Last Name</label>
                   <input type="text" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors placeholder:text-gray-600" placeholder="Doe" />
                 </div>
               </div>
               
               <div className="flex flex-col gap-2">
                 <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Email</label>
                 <input type="email" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors placeholder:text-gray-600" placeholder="john@company.com" />
               </div>
               
               <div className="flex flex-col gap-2">
                 <label className="text-xs uppercase tracking-widest text-gray-400 font-bold">Project Details</label>
                 <textarea rows={4} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-blue transition-colors placeholder:text-gray-600 resize-none" placeholder="Tell us about your vision..." />
               </div>
               
               <button className="group relative w-full flex items-center justify-center gap-3 bg-white text-dark px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm overflow-hidden mt-4">
                 <span className="relative z-10 transition-colors group-hover:text-white">Submit Request</span>
                 <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-2 group-hover:text-white" />
                 <div className="absolute inset-0 bg-electric-blue transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
               </button>
             </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
