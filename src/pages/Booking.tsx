import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CinematicTransition } from '../components/CinematicTransition';
import { Footer } from '../components/Footer';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { calculateLeadScore, getLeadStatus } from '../utils/leadScoring';
import { logClientActivity } from '../utils/activityLogger';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { SEO } from '../components/SEO';

export function Booking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', timeline: '', goals: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Remove the bad content I added

  const handleNext = () => setStep(2);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const score = calculateLeadScore({
        value: 0,
        timeline: formData.timeline,
        hasCompany: !!formData.company
      });

      await addDoc(collection(db, 'leads'), {
        userId: null,
        name: formData.company || formData.name,
        contact: formData.name,
        email: formData.email,
        value: 0,
        stage: 'new',
        date: new Date().toISOString().split('T')[0],
        status: getLeadStatus(score),
        score: score,
        aiNote: `Booking requested. Goals: ${formData.goals}. Timeline: ${formData.timeline}.`,
        createdAt: serverTimestamp()
      });
      await logClientActivity(null, formData.email, 'booked_consultation', 'Booked via consultation form');
      setStep(3);
    } catch (err: any) {
      console.error("Failed to submit booking", err);
      setSubmitError(err.message || "Failed to book consultation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CinematicTransition>
      <SEO title="Book Consultation | EINORT SOLUTIONS" description="Schedule a strategic discovery session with our lead architects to discuss your enterprise objectives." />
      <div className="pt-32 pb-24 min-h-screen bg-dark">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-premium-gold/30 bg-premium-gold/10 text-premium-gold text-xs font-semibold uppercase tracking-wider mb-6"
            >
              Consultation
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4 font-display tracking-tight text-white"
            >
              Initiate <span className="text-gradient-theme">Discovery</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/50 font-light max-w-2xl mx-auto"
            >
              Book a strategic consultation with our lead architects to discuss scale, architecture, and engineering timelines.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            {/* Steps Progress */}
            <div className="flex items-center justify-between mb-12 relative">
               <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10 z-0"></div>
               {[1, 2, 3].map((num) => (
                 <div key={num} className={`relative z-10 flex flex-col items-center gap-2 ${step >= num ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-premium-gold text-dark' : 'bg-dark border border-white/20 text-white'}`}>
                      {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono hidden sm:block">
                      {num === 1 ? 'Schedule' : num === 2 ? 'Details' : 'Confirmed'}
                    </span>
                 </div>
               ))}
            </div>

            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="text-2xl font-display font-medium text-white mb-6">Select a Window</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Mock Calendar */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-medium">October 2026</span>
                      <div className="flex gap-2">
                         <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 cursor-not-allowed">&lt;</div>
                         <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors">&gt;</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs text-white/50 mb-4">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                       {[...Array(31)].map((_, i) => (
                         <div key={i} className={`p-2 rounded-lg cursor-pointer transition-colors ${(i+1) === 15 ? 'bg-premium-gold text-dark font-bold' : 'hover:bg-white/10 text-white'}`}>
                           {i + 1}
                         </div>
                       ))}
                    </div>
                  </div>
                  
                  {/* Mock Times */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-white/70 mb-4 flex items-center gap-2"><Clock className="w-4 h-4" /> Available Times (UTC)</h4>
                    {['09:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'].map((time, i) => (
                       <div key={i} onClick={handleNext} className={`p-4 rounded-xl border cursor-pointer transition-all ${i === 1 ? 'bg-premium-gold/10 border-premium-gold text-premium-gold' : 'border-white/10 hover:border-white/30 text-white'}`}>
                         <span className="font-medium">{time}</span>
                       </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                 <h3 className="text-2xl font-display font-medium text-white mb-6">Project Parameters</h3>
                 <div className="space-y-6">
                   <div className="grid md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Full Name</label>
                       <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-premium-gold transition-colors" placeholder="John Doe" />
                     </div>
                     <div>
                       <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Corporate Email</label>
                       <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-premium-gold transition-colors" placeholder="john@company.com" />
                     </div>
                   </div>
                   <div>
                     <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Company / Organization</label>
                     <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-premium-gold transition-colors" placeholder="Company Ltd" />
                   </div>
                   <div>
                     <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Project Brief & Objectives</label>
                     <textarea required name="goals" value={formData.goals} onChange={handleChange} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-premium-gold transition-colors" placeholder="Describe the scale and requirements of your architecture..."></textarea>
                   </div>
                   
                   {submitError && (
                     <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs rounded-lg">
                       ⚠️ {submitError}
                     </div>
                   )}

                   <div className="pt-4 flex justify-between items-center border-t border-white/10">
                     <button type="button" onClick={() => setStep(1)} className="text-white/50 hover:text-white transition-colors text-sm">Back to Calendar</button>
                     <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-premium-gold text-dark rounded-full font-semibold flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50">
                       {isSubmitting ? 'Verifying...' : 'Confirm Protocol'} <ArrowRight className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-20 h-20 bg-premium-gold/10 border border-premium-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-premium-gold" />
                </div>
                <h3 className="text-3xl font-display font-medium text-white mb-4">Protocol Initialized</h3>
                <p className="text-white/50 max-w-md mx-auto mb-8">
                  Your strategy session has been confirmed for <span className="text-white font-medium">October 15, 2026 at 11:30 AM UTC</span>. A calendar invitation and video link have been dispatched to your email.
                </p>
                <a href="/" className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-sans transition-colors border border-white/10">
                  Return to Base
                </a>
              </motion.div>
            )}

          </motion.div>
        </div>
      </div>
      <Footer />
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </CinematicTransition>
  );
}
