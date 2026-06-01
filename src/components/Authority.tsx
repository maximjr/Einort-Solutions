import { motion } from 'motion/react';
import { Award, ShieldCheck, Zap, Globe2, Building2, Terminal } from 'lucide-react';

const STATS = [
  { label: 'Global Partners', value: '1,200+' },
  { label: 'Uptime SLA', value: '99.999%' },
  { label: 'Enterprise Systems', value: '250+' },
  { label: 'Lines of Code Shipped', value: '4M+' }
];

const EXPERTS = [
  { name: 'Dr. Sarah Chen', role: 'Head of AI & Architecture', exp: 'Ex-Google Brain' },
  { name: 'James Orland', role: 'Chief Engineering Officer', exp: '15 YOE Distributed Systems' },
  { name: 'Priya Patel', role: 'VP of Product Strategy', exp: 'Ex-Stripe Product Lead' },
];

export function Authority() {
  return (
    <section className="py-24 bg-dark relative border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-premium-gold" />
              <span className="font-mono text-xs uppercase tracking-widest text-silver-metallic font-bold">Uncompromising Standards</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-medium mb-6 tracking-tight text-white leading-tight">
              Backed by <span className="text-gradient-metallic italic">world-class</span> engineering pedigree.
            </h2>
            <p className="text-lg text-white/50 font-light leading-relaxed mb-8">
              We do not outsource. We do not compromise. EINORT operates at the intersection of elite software engineering, high-level automation, and world-class product design. Our architects build systems that define industry standards.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {STATS.map(stat => (
                <div key={stat.label} className="border-l-2 border-premium-gold/30 pl-4 py-1">
                  <div className="text-2xl font-display font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest font-mono text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid gap-4"
          >
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
               <div className="w-12 h-12 rounded-full bg-oxblood-light flex items-center justify-center shrink-0 border border-white/10">
                  <Terminal className="w-5 h-5 text-premium-gold" />
               </div>
               <div>
                  <h4 className="font-display font-medium text-white text-lg mb-1">True Technical Depth</h4>
                  <p className="text-sm text-white/50 font-sans leading-relaxed">Our systems are written by senior engineers utilizing cutting-edge paradigms. We deploy zero-trust security and high-availability clustered architectures.</p>
               </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4 ml-0 md:ml-8 lg:ml-12 border-premium-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <Globe2 className="w-5 h-5 text-premium-gold" />
               </div>
               <div>
                  <h4 className="font-display font-medium text-white text-lg mb-1">Global Delivery</h4>
                  <p className="text-sm text-white/50 font-sans leading-relaxed">Our infrastructure relies on global edge-network integrations, reliably serving requests worldwide with optimized low-latency configurations.</p>
               </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
               <div className="w-12 h-12 rounded-full bg-dark-surface flex items-center justify-center shrink-0 border border-white/10">
                  <Building2 className="w-5 h-5 text-premium-gold" />
               </div>
               <div>
                  <h4 className="font-display font-medium text-white text-lg mb-1">Enterprise Scalability</h4>
                  <p className="text-sm text-white/50 font-sans leading-relaxed">Built from day one to scale. Whether handling 1,000 or 1,000,000 concurrent connections, our microservices autoscale responsively.</p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Leadership Module */}
        <div className="mt-20 pt-16 border-t border-white/5">
           <div className="text-center mb-12">
             <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-premium-gold font-bold mb-3">Architects of Change</h3>
             <h2 className="font-display text-2xl text-white">Elite Engineering Leadership</h2>
           </div>
           <div className="grid md:grid-cols-3 gap-6">
              {EXPERTS.map(expert => (
                <motion.div 
                  key={expert.name}
                  whileHover={{ y: -5 }}
                  className="glass-panel border-white/5 rounded-2xl p-6 hover:border-premium-gold/30 transition-colors group text-center"
                >
                   <div className="w-20 h-20 rounded-full mx-auto bg-dark-surface border flex items-center justify-center border-white/10 group-hover:border-premium-gold/50 transition-colors mb-4 shadow-inner">
                     <Award className="w-8 h-8 text-white/20 group-hover:text-premium-gold transition-colors" />
                   </div>
                   <h4 className="font-display font-medium text-white text-lg">{expert.name}</h4>
                   <p className="font-mono text-[10px] uppercase tracking-widest text-premium-gold mt-1 mb-3">{expert.role}</p>
                   <p className="font-sans text-xs text-white/40">{expert.exp}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
