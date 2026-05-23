import { Link } from 'react-router-dom';
import { GitMerge, LayoutDashboard, Fingerprint, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const summaries = [
  {
    id: 'process',
    title: 'Methodology',
    description: 'Explore our meticulous process. We operate on a foundation of precision, transparency, and elite execution.',
    link: '/process',
    icon: GitMerge,
  },
  {
    id: 'work',
    title: 'Enterprise Portfolio',
    description: 'View our catalog of transformative software, showcasing complex innovation and execution at global scale.',
    link: '/work',
    icon: LayoutDashboard,
  },
  {
    id: 'about',
    title: 'The Ecosystem',
    description: 'Learn about our philosophy, our uncompromising standards of craftsmanship, and the architects behind the code.',
    link: '/about',
    icon: Fingerprint,
  },
];

export function HomeSummary() {
  return (
    <section className="py-32 relative z-10 border-t border-white/5 bg-dark overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-dark-blue/20 blur-[150px] mix-blend-screen pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="mb-20 text-center max-w-2xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-premium-gold/30 bg-premium-gold/10 text-premium-gold text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-premium-gold animate-pulse shadow-[0_0_8px_#D4AF37]" />
            <span>Digital Infrastructure</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-6 tracking-tight text-white leading-tight"
          >
            Explore our <span className="text-gradient-theme italic">ecosystem.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg font-light leading-relaxed max-w-xl"
          >
            Delve deeper into our core competencies, our standardized methodologies, and the enterprise-grade protocols driving the innovation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {summaries.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link 
                to={item.link}
                className="group relative flex flex-col justify-between p-10 h-full rounded-3xl glass-panel border border-white/5 hover:border-premium-gold/50 transition-all duration-500 overflow-hidden"
              >
                {/* Hover gradient sweep */}
                <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="mb-12 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-premium-gold mb-8 group-hover:scale-110 group-hover:bg-premium-gold/10 transition-all duration-500 shadow-inner">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-display font-medium mb-4 text-white tracking-tight">{item.title}</h3>
                  <p className="text-sm font-light text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center text-[11px] font-mono font-bold uppercase tracking-widest text-white/40 group-hover:text-premium-gold transition-colors relative z-10 w-fit">
                   Access Protocol <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                   <div className="absolute -bottom-2 left-0 w-0 h-[1px] bg-premium-gold transition-all duration-300 group-hover:w-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
