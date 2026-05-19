import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

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
    company: "SyncAI Enterprise",
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

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 lg:py-48 relative bg-dark overflow-hidden border-t border-white/5">
      {/* Immersive Environment */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-electric-blue/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
           <div className="max-w-2xl">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="flex items-center gap-3 mb-6"
             >
               <div className="w-8 h-8 geometric-clip bg-white/5 flex items-center justify-center border border-white/10">
                 <div className="w-1.5 h-1.5 bg-electric-blue rounded-none" />
               </div>
               <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-silver-metallic">Enterprise Validation</span>
             </motion.div>
             <motion.h2 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="font-display text-4xl md:text-5xl lg:text-[64px] font-bold leading-[1.1] tracking-tight"
             >
               Endorsed by Global <br />
               <span className="text-gradient-metallic italic font-light font-display">Industry Leaders.</span>
             </motion.h2>
           </div>
           
           <div className="flex gap-4">
             <button onClick={prev} className="w-14 h-14 geometric-clip-button border border-white/20 flex items-center justify-center hover:border-electric-blue hover:bg-electric-blue/10 transition-all text-white group">
               <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             </button>
             <button onClick={next} className="w-14 h-14 geometric-clip-button border border-white/20 flex items-center justify-center hover:border-electric-blue hover:bg-electric-blue text-white transition-all group shadow-[0_0_15px_rgba(59,130,246,0)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
               <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>

        <div className="relative h-[450px] md:h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <div className="glass-panel border-white/10 geometric-clip p-8 md:p-16 h-full flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
                
                {/* Decorative Elements */}
                <Quote className="absolute top-8 right-12 w-32 h-32 text-electric-blue/5 -scale-x-100 rotate-180" />
                <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-electric-blue via-neon-blue to-transparent" />
                
                <div className="relative z-10 max-w-4xl">
                  <p className="font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed text-white font-medium tracking-tight">
                    "{testimonials[currentIndex].quote}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between w-full relative z-10 mt-12 border-t border-white/5 pt-8">
                  <div className="flex items-center gap-6">
                    <div className="relative geometric-clip w-16 h-16 p-1 bg-white/10">
                      <img 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover geometric-clip"
                      />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-lg text-white group-hover:text-glow-silver transition-all">{testimonials[currentIndex].name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-silver-metallic font-mono text-[10px] uppercase tracking-widest">{testimonials[currentIndex].role}</p>
                        <span className="w-1 h-1 bg-electric-blue"></span>
                        <p className="text-electric-blue font-mono text-[10px] uppercase tracking-widest font-bold">{testimonials[currentIndex].company}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="hidden md:flex gap-3">
                    {testimonials.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`transition-all duration-500 h-1 ${idx === currentIndex ? 'w-8 bg-electric-blue shadow-[0_0_8px_#3b82f6]' : 'w-2 bg-white/20'}`}
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
