import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { CinematicTransition } from '../components/CinematicTransition';
import { Footer } from '../components/Footer';

const faqs = [
  {
    question: "How long does a typical enterprise project take?",
    answer: "Our timelines are highly tailored. Foundational websites typically execute within 4-6 weeks. Complex enterprise web applications or SaaS architectures demand 3-6 months. We operate with strict timeline fidelity and transparent milestone reporting."
  },
  {
    question: "What is your core technology stack?",
    answer: "We favor performance and scalability. Our primary stack includes React (Next.js / Vite), TypeScript, Tailwind CSS, and Node.js. For backend infrastructure, we leverage Firebase, PostgreSQL, scale-out cloud computing (AWS/GCP), and modern Headless CMS solutions like Sanity."
  },
  {
    question: "Do you provide post-launch maintenance?",
    answer: "Absolutely. Engineering the product is only the first phase. We offer competitive retainer packages covering server management, security patching, SEO optimization, database scaling, and ongoing feature development."
  },
  {
    question: "Are your platforms optimized for SEO and Conversions?",
    answer: "Every digital asset we construct is built with Growth in mind. We implement semantic HTML, SSR/SSG architectures, sub-second load times, structured schema data, and high-conversion UX flows. We don't just build websites; we build sales engines."
  },
  {
    question: "Can you integrate with our existing CRM / ATS?",
    answer: "Yes. Our engineers specialize in secure API integrations, connecting your new frontend portal with Hubspot, Salesforce, Greenhouse, Stripe, or custom legacy systems."
  }
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <CinematicTransition>
      <div className="pt-32 pb-24 min-h-screen bg-dark">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-premium-gold/30 bg-premium-gold/10 text-premium-gold text-xs font-semibold uppercase tracking-wider mb-8"
            >
              Intelligence Base
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6 font-display tracking-tight text-white"
            >
              Frequently Asked <span className="text-gradient-theme">Questions</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/50 font-light"
            >
              Clarity is the ultimate sophisticated design.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-panel-light rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-display font-medium text-lg text-white pr-8">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIdx === idx ? 'bg-premium-gold text-dark' : 'bg-white/5 text-white/50'}`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${openIdx === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-6 pt-0 text-white/60 font-light leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center border-t border-white/5 pt-12"
          >
            <p className="text-white/50 mb-6">Require further intelligence mapping?</p>
            <a href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.02)]">
               <MessageSquare className="w-4 h-4 mr-2" /> Contact Engineering
            </a>
          </motion.div>
        </div>
      </div>
      <Footer />
    </CinematicTransition>
  );
}
