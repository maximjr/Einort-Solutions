import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, ArrowRight, Shield, Zap, Globe, Layers, MapPin } from 'lucide-react';
import { CinematicTransition } from '../components/CinematicTransition';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';

const formatStr = (str: string) => {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export function LocalizedService() {
  const { slug } = useParams();
  
  // Parse slug. E.g "healthcare-web-development-usa" or "web-development-agency-in-new-york"
  let service = "Digital Agency";
  let location = "Global";
  const inIndex = slug?.indexOf('-in-');
  
  if (slug && inIndex !== -1 && inIndex !== undefined) {
    service = formatStr(slug.substring(0, inIndex));
    location = formatStr(slug.substring(inIndex + 4));
  } else if (slug) {
    // If there is no "-in-", then the last word is usually the location if we follow "healthcare-web-development-usa"
    const parts = slug.split('-');
    if(parts.length > 1) {
       location = formatStr(parts.pop() || "Global");
       service = formatStr(parts.join('-'));
    } else {
       service = formatStr(slug);
    }
  }

  const title = `Premium ${service} in ${location}`;
  const description = `Looking for a top-tier ${service.toLowerCase()} in ${location}? EINORT SOLUTIONS builds world-class enterprise web applications and scalable software infrastructures.`;
  const url = `https://einort.com/agency/${slug}`;

  const breadcrumbs = [
    { name: "Home", url: "https://einort.com" },
    { name: "Global Agencies", url: "https://einort.com/services" },
    { name: `${service} in ${location}`, url: url }
  ];

  return (
    <CinematicTransition>
      <SEO 
        title={title}
        description={description}
        keywords={`${service.toLowerCase()} ${location.toLowerCase()}, best ${service.toLowerCase()} ${location.toLowerCase()}, ${location.toLowerCase()} software company, enterprise ${service.toLowerCase()} ${location.toLowerCase()}`}
        url={url}
        canonical={url}
        breadcrumbs={breadcrumbs}
        isService={true}
      />
      
      <div className="pt-32 pb-24 min-h-screen bg-dark overflow-hidden relative">
        {/* Geographic Background Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-premium-gold/10 to-transparent blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32 pt-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center px-4 py-2 rounded-full border border-premium-gold/30 bg-premium-gold/10 text-premium-gold text-xs font-semibold uppercase tracking-wider mb-6"
              >
                <MapPin className="w-3 h-3 mr-2" /> Serving {location} & Global
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold mb-6 font-display tracking-tight text-white leading-tight"
              >
                Premium <span className="text-gradient-theme block">{service}</span> in {location}.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/60 font-light leading-relaxed mb-8 max-w-xl"
              >
                We collaborate with forward-thinking enterprises and ambitious startups in {location} to engineer world-class software platforms, SaaS architectures, and high-conversion digital experiences.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a href="/book" className="group relative inline-flex items-center justify-center px-8 py-4 bg-premium-gold text-dark rounded-full overflow-hidden hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                  <span className="relative z-10 text-[13px] font-bold tracking-wide uppercase flex items-center gap-2">
                    Schedule Discovery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
                <a href="/audit" className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/10 text-white hover:bg-white/5 hover:border-premium-gold/30 transition-all duration-300">
                  <span className="text-[13px] font-medium tracking-wide">Free Architecture Audit</span>
                </a>
              </motion.div>
              
              {/* Trust Signals */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 pt-8 border-t border-white/10 flex items-center gap-8 text-white/40 font-mono text-xs uppercase overflow-hidden"
              >
                <div className="flex items-center gap-2"><Check className="w-3 h-3 text-premium-gold" /> SOC2 Compliant</div>
                <div className="flex items-center gap-2"><Check className="w-3 h-3 text-premium-gold" /> AWS Partners</div>
                <div className="flex items-center gap-2"><Check className="w-3 h-3 text-premium-gold" /> Vercel Experts</div>
              </motion.div>
            </div>
            
            {/* Visual Architecture Representation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <div className="glass-panel border-white/10 p-2 rounded-3xl relative z-10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt={`Global Software Architecture by EINORT in ${location}`} className="rounded-2xl border border-white/5" />
                
                {/* Floating UI Elements */}
                <div className="absolute -bottom-6 -left-6 glass-panel-light p-4 rounded-2xl border-premium-gold/30 flex items-center gap-4 animate-float shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-premium-gold/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-premium-gold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-sans">Global Reach</h4>
                    <p className="text-[10px] font-mono text-white/50 uppercase">Deploying in {location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Engineering Value Proposition */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {[
              { title: "Enterprise Scalability", desc: `Our ${service.toLowerCase()} solutions for ${location} businesses are built to handle millions of requests with zero friction.`, icon: <Layers /> },
              { title: "Performance Obsidian", desc: "We utilize Edge caching and NextJS/Vite architectures to deliver 95+ Lighthouse scores globally.", icon: <Zap /> },
              { title: "World-Class UX", desc: "Design isn't an afterthought. We build platforms that feel expensive, intuitive, and conversion-focused.", icon: <Globe /> }
            ].map((prop, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel rounded-3xl p-8 hover:bg-white/[0.04] transition-colors border border-white/5 hover:border-premium-gold/20"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-premium-gold mb-6 border border-white/10">
                  {prop.icon}
                </div>
                <h3 className="text-xl font-display font-medium text-white mb-3">{prop.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{prop.desc}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Why choose EINORT for Location */}
          <div className="max-w-4xl mx-auto text-center mb-24">
             <h2 className="text-3xl md:text-5xl font-display font-medium mb-6">Elevate your digital presence in {location}.</h2>
             <p className="text-white/60 text-lg font-light leading-relaxed mb-10">
               At EINORT SOLUTIONS, we don't just write code. We architect strategic business assets. 
               Whether you are launching a global SaaS product, restructuring a legacy enterprise system, 
               or seeking top-tier {service.toLowerCase()} in {location}, our engineering team provides the technical execution you need to dominate your sector.
             </p>
             <a href="/work" className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white rounded-full font-sans font-semibold border border-white/10 hover:bg-white/10 hover:border-premium-gold/50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.02)] gap-2 group">
               Explore Enterprise Case Studies <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </a>
          </div>

        </div>
      </div>
      <Footer />
    </CinematicTransition>
  );
}
