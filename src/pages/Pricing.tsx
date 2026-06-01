import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { CinematicTransition } from '../components/CinematicTransition';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';

const plans = [
  {
    name: "Foundation",
    price: "$5,000",
    description: "Perfect for startups and boutique brands needing a world-class digital presence.",
    features: [
      "Premium Web Design & Development",
      "Responsive Architecture",
      "Basic SEO Optimization",
      "Standard Analytics Integration",
      "CMS Setup (Sanity / WordPress)",
      "1 Month Post-Launch Support"
    ]
  },
  {
    name: "Growth Engine",
    price: "$12,500",
    description: "For rapid-scaling companies requiring intelligent automation and high-conversion funnels.",
    features: [
      "Everything in Foundation",
      "Custom Web Applications",
      "Advanced Conversion Rate Optimization",
      "Automated Booking & CRM Flow",
      "Advanced Technical SEO",
      "Performance Optimization (90+ Vitals)",
      "3 Months Strategic Support"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full-scale corporate ecosystems, security architectures, and scalable software platforms.",
    features: [
      "Everything in Growth Engine",
      "SaaS Architecture & Development",
      "Custom AI / ML Solutions Integration",
      "Enterprise Database Design",
      "Multi-Tenant / Admin Dashboards",
      "Advanced Security Architecture",
      "Dedicated Engineering Team Base"
    ]
  }
];

export function Pricing() {
  return (
    <CinematicTransition>
      <SEO title="Plans & Pricing | EINORT SOLUTIONS" description="Choose the architecture that aligns with your scale. Transparent pricing for premium enterprise custom software solutions." />
      <div className="pt-32 pb-24 min-h-screen bg-dark">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-20 text-center max-w-3xl mx-auto">
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center px-4 py-2 rounded-full border border-premium-gold/30 bg-premium-gold/10 text-premium-gold text-xs font-semibold uppercase tracking-wider mb-8"
              >
                Investment
              </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold mb-6 font-display tracking-tight text-white"
            >
              Transparent Pricing.<br/>
              <span className="text-gradient-theme">Exceptional Value.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/50 font-light leading-relaxed"
            >
              We engineer multi-million dollar platforms. Choose the architecture that aligns with your scale.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {plans.map((plan, idx) => (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
                className={`relative p-10 rounded-3xl backdrop-blur-md flex flex-col h-full ${plan.popular ? 'bg-premium-gold/5 border-2 border-premium-gold/50 shadow-[0_0_40px_rgba(212,175,55,0.1)]' : 'bg-white/[0.02] border border-white/10 hover:border-white/30 transition-colors'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-premium-gold text-dark text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Recommended Architecture
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold font-display tracking-tight text-white mb-4">{plan.name}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-6 h-12">{plan.description}</p>
                  <div className="text-4xl font-bold font-display text-white">{plan.price}</div>
                  {plan.price !== "Custom" && <div className="text-xs text-white/40 uppercase tracking-widest font-mono mt-2">Starts At</div>}
                </div>
                
                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-premium-gold/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-premium-gold" />
                      </div>
                      <span className="text-sm text-white/70 font-light">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 group ${plan.popular ? 'bg-premium-gold text-dark hover:brightness-110 shadow-lg shadow-premium-gold/20' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                  Initiate Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </CinematicTransition>
  );
}
