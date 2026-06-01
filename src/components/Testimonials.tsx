import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const testimonials = [
  {
    quote: "EINORT didn't just build us a platform; they architected an entire digital ecosystem that increased our enterprise conversions by 400%. Their engineering and design teams operate at elite tiers.",
    name: "Sarah Jenkins",
    role: "Chief Marketing Officer",
    company: "Nexus Global",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
  },
  {
    quote: "The level of performance, precision, and attention to detail is staggering. It feels like we commissioned an elite Silicon Valley product team. Our new global infrastructure is lightyears ahead of the competition.",
    name: "David Chen",
    role: "Founder & CEO",
    company: "Sync Enterprise",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    quote: "Breathtaking, highly persuasive, and brutally effective. Working with EINORT redefined our expectations of what a digital partner can deliver. They are true architectural visionaries.",
    name: "Elena Rostova",
    role: "Director of Platform",
    company: "Vanguard Systems",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((current) => (current + 1) % testimonials.length);
  const prev = () => setCurrentIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 lg:py-40 relative bg-dark overflow-hidden border-t border-white/5">
      {/* Subtle Immersive Environment */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-premium-gold/5 rounded-full blur-[200px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.01] mix-blend-overlay pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 mt-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
           <div className="max-w-2xl">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="flex items-center gap-3 mb-6"
             >
               <div className="w-1.5 h-1.5 bg-premium-gold rounded-full" />
               <span className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-silver-metallic">Enterprise Validation</span>
             </motion.div>
             <motion.h2 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
               className="font-display text-4xl md:text-5xl lg:text-[64px] font-semibold leading-[1.1] tracking-tight text-white mb-2"
             >
               Endorsed by Global <br className="hidden lg:block"/>
               <span className="text-silver-metallic font-light">Industry Leaders.</span>
             </motion.h2>
           </div>
           
           <div className="flex gap-3">
             <button onClick={prev} aria-label="Previous Testimonial" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white group">
               <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
             </button>
             <button onClick={next} aria-label="Next Testimonial" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white group">
               <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform text-white" />
             </button>
           </div>
        </div>

        <div className="relative h-[450px] md:h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <div className="glass-panel rounded-3xl p-10 md:p-14 h-full flex flex-col justify-between relative overflow-hidden bg-white/[0.02] border-white/5 shadow-2xl">
                
                {/* Decorative Elements */}
                <Quote className="absolute top-10 right-10 w-24 h-24 text-white/5 -scale-x-100 rotate-180" />
                
                <div className="relative z-10 max-w-4xl pt-6">
                  <p className="font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed text-white/90 font-medium tracking-tight">
                    "{testimonials[currentIndex].quote}"
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full relative z-10 mt-12 gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-white/5">
                      <img 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-[15px] text-white tracking-wide">{testimonials[currentIndex].name}</h4>
                      <p className="text-silver-metallic font-sans text-[13px] mt-0.5 tracking-wide">{testimonials[currentIndex].role}, <span className="text-white/80">{testimonials[currentIndex].company}</span></p>
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="flex gap-2">
                    {testimonials.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                          "transition-all duration-500 h-[3px] rounded-full",
                          idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
