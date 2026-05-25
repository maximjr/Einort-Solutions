import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building, Code, Layout, ShieldCheck } from 'lucide-react';
import { CinematicTransition } from '../components/CinematicTransition';

export function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    role: '',
    goals: [] as string[]
  });

  const handleNext = () => setStep(prev => prev + 1);
  
  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        onboardingStatus: 'completed',
        company: formData.companyName,
        industry: formData.industry,
        companyRole: formData.role,
        businessGoals: formData.goals
      });
      navigate('/client');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const goalsOptions = [
    'Digital Transformation',
    'Custom SaaS Platform',
    'Enterprise Architecture',
    'AI Implementation',
    'Process Automation'
  ];

  return (
    <CinematicTransition>
      <div className="min-h-screen bg-dark pt-32 pb-24 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-2xl glass-panel p-8 md:p-12 geometric-clip">
          <div className="flex justify-between items-center mb-12">
            <h1 className="font-display text-2xl">Initialization Sequence</h1>
            <div className="font-mono text-xs text-premium-gold tracking-widest">{step} / 3</div>
          </div>

          <div className="w-full h-1 bg-white/10 mb-12 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-premium-gold"
              initial={{ width: `${((step - 1) / 3) * 100}%` }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-display mb-6">Corporate Identity</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Company/Organization Name</label>
                    <input 
                      type="text" 
                      value={formData.companyName}
                      onChange={e => setFormData(pr => ({ ...pr, companyName: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-premium-gold transition-colors outline-none" 
                      placeholder="Stark Industries"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Industry Sector</label>
                    <select 
                      value={formData.industry}
                      onChange={e => setFormData(pr => ({ ...pr, industry: e.target.value }))}
                      className="w-full bg-dark border border-white/10 px-4 py-3 text-white focus:border-premium-gold transition-colors outline-none"
                    >
                      <option value="">Select Industry</option>
                      <option value="Finance">Finance & Fintech</option>
                      <option value="Healthcare">Healthcare & Medtech</option>
                      <option value="Enterprise SaaS">Enterprise SaaS</option>
                      <option value="E-Commerce">E-Commerce</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mt-12 flex justify-end">
                  <button onClick={handleNext} disabled={!formData.companyName} className="flex items-center gap-2 geometric-clip-button px-6 py-3 bg-premium-gold text-dark hover:brightness-110 font-bold uppercase text-[10px] tracking-widest disabled:opacity-50">
                    Next Protocol <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-display mb-6">Primary Objectives</h2>
                <div className="grid gap-4">
                  {goalsOptions.map(goal => (
                    <button 
                      key={goal}
                      onClick={() => setFormData(pr => ({
                        ...pr, 
                        goals: pr.goals.includes(goal) ? pr.goals.filter(g => g !== goal) : [...pr.goals, goal]
                      }))}
                      className={`p-4 border ${formData.goals.includes(goal) ? 'border-premium-gold bg-premium-gold/10' : 'border-white/10 bg-white/5'} flex justify-between items-center text-left hover:border-white/30 transition-all`}
                    >
                      <span className="font-mono text-sm uppercase tracking-wider">{goal}</span>
                      {formData.goals.includes(goal) && <ShieldCheck className="w-4 h-4 text-premium-gold" />}
                    </button>
                  ))}
                </div>
                <div className="mt-12 flex justify-between">
                  <button onClick={() => setStep(1)} className="text-white/50 hover:text-white text-xs uppercase tracking-widest">Back</button>
                  <button onClick={handleNext} disabled={formData.goals.length === 0} className="flex items-center gap-2 geometric-clip-button px-6 py-3 bg-premium-gold text-dark hover:brightness-110 font-bold uppercase text-[10px] tracking-widest disabled:opacity-50">
                    Next Protocol <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center">
                  <div className="w-20 h-20 bg-premium-gold/10 border-2 border-premium-gold flex items-center justify-center rounded-full mx-auto mb-8 relative">
                    <div className="absolute inset-0 border border-premium-gold/50 rounded-full animate-ping" />
                    <ShieldCheck className="w-8 h-8 text-premium-gold" />
                  </div>
                  <h2 className="text-2xl font-display mb-4">Verification Complete</h2>
                  <p className="text-white/50 text-sm mb-8">Your enterprise profile has been synchronized with our core network. You may now access the Client Portal.</p>
                  
                  <button onClick={handleComplete} disabled={loading} className="w-full flex justify-center items-center gap-2 geometric-clip-button px-6 py-4 bg-white text-dark hover:brightness-90 font-bold uppercase text-[10px] tracking-widest disabled:opacity-50">
                    {loading ? 'Initializing...' : 'Enter System'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </CinematicTransition>
  );
}
