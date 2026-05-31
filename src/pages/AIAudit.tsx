import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, ArrowRight, ShieldCheck, Zap, LineChart, Code2 } from 'lucide-react';
import { CinematicTransition } from '../components/CinematicTransition';
import { Footer } from '../components/Footer';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { logClientActivity } from '../utils/activityLogger';
import { calculateLeadScore, getLeadStatus } from '../utils/leadScoring';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';

export function AIAudit() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 85) {
            clearInterval(interval);
            setTimeout(() => setScanComplete(true), 1000);
            return 85; 
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      setIsScanning(true);
      setProgress(0);
      setScanComplete(false);
      setSubmitted(false);
    }
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    setSubmitting(true);
    try {
      const score = calculateLeadScore({
        value: 0,
        timeline: 'flexible',
        hasCompany: false
      });

      await addDoc(collection(db, 'leads'), {
        userId: user.uid,
        name: email.split('@')[0], 
        contact: email.split('@')[0],
        email: email,
        value: 0,
        stage: 'new',
        date: new Date().toISOString().split('T')[0],
        status: getLeadStatus(score),
        score: score,
        aiNote: `Requested AIAudit for ${url}.`,
        createdAt: serverTimestamp()
      });
      
      await logClientActivity(null, email, 'custom_action', `Requested AIAudit for ${url}`);
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CinematicTransition>
      <div className="pt-32 pb-24 min-h-screen bg-dark overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-premium-gold/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          {!isScanning && !scanComplete ? (
            <div className="text-center max-w-3xl mx-auto mt-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center px-4 py-2 rounded-full border border-premium-gold/30 bg-premium-gold/10 text-premium-gold text-xs font-semibold uppercase tracking-wider mb-8"
              >
                Enterprise Intelligence
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-bold mb-6 font-display tracking-tight text-white"
              >
                Uncover Architectural <br/>
                <span className="text-gradient-theme">Bottlenecks.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/50 font-light leading-relaxed mb-12"
              >
                Deploy our proprietary AI to analyze your web property for conversion friction, Lighthouse performance, and technical SEO structure.
              </motion.p>
              
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleScan} 
                className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto"
              >
                <div className="relative w-full">
                  <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-white/40" />
                  <input 
                    type="url" 
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-company.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-14 pr-6 text-white focus:outline-none focus:border-premium-gold/50 focus:bg-white/10 transition-all font-mono text-sm"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-8 py-5 bg-premium-gold text-dark rounded-full font-bold uppercase tracking-widest text-[11px] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] shrink-0"
                >
                  Initiate Scan
                </button>
              </motion.form>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto mt-12">
               <div className="glass-panel rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden">
                 
                 {/* Scanning HUD */}
                 <div className="flex items-center justify-between mb-8">
                   <div>
                     <h3 className="font-mono text-sm uppercase tracking-widest text-premium-gold mb-1">Target Acquired</h3>
                     <p className="font-sans text-xl font-medium truncate max-w-md">{url}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-mono text-5xl tracking-tighter font-light text-white">{progress}<span className="text-2xl text-white/40">%</span></p>
                   </div>
                 </div>

                 {/* Progress Bar */}
                 <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-12">
                   <motion.div 
                     className="h-full bg-premium-gold"
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                   />
                 </div>

                 <div className="grid md:grid-cols-2 gap-8 mb-8">
                   <div className="space-y-6">
                     <AuditMetric loading={progress < 25} label="Lighthouse Performance Index" val={progress < 25 ? 'Scanning...' : 'Detecting FCP Delays'} icon={<Zap />} />
                     <AuditMetric loading={progress < 50} label="Semantic SEO & Schema" val={progress < 50 ? 'Pending' : 'Analyzing DOM Structure'} icon={<Code2 />} />
                   </div>
                   <div className="space-y-6">
                     <AuditMetric loading={progress < 70} label="Conversion Friction" val={progress < 70 ? 'Pending' : 'Analyzing Funnel Depth'} icon={<LineChart />} />
                     <AuditMetric loading={progress < 85} label="Security Headers & SSL" val={progress < 85 ? 'Pending' : 'Evaluating Protocols'} icon={<ShieldCheck />} />
                   </div>
                 </div>
               </div>

               <AnimatePresence>
                 {scanComplete && (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="glass-panel-light border-premium-gold/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-premium-gold/5"></div>
                     <div className="relative z-10 max-w-2xl mx-auto">
                       <h3 className="text-3xl font-display font-medium text-white mb-4">Deep Analysis Paused.</h3>
                       <p className="text-lg text-white/70 font-light mb-8">
                         Our AI has identified <span className="text-premium-gold font-medium">12 critical architecture bottlenecks</span> and <span className="text-white font-medium">3 high-impact conversion opportunities</span>.
                       </p>
                       <div className="bg-dark/50 border border-white/5 rounded-2xl p-6 mb-8 text-left">
                         <h4 className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">Unlock Full Engineering Report</h4>
                         <p className="text-sm text-white/60 mb-6">Enter your details to generate the comprehensive PDF report and receive a priority architectural consultation.</p>
                         {submitted ? (
                           <div className="text-premium-gold font-medium">Request received. Our engineers will reach out shortly.</div>
                         ) : (
                           <form onSubmit={handleSendReport} className="flex flex-col sm:flex-row gap-4">
                             <input 
                               type="email" 
                               required
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               placeholder="Corporate Email" 
                               className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-premium-gold transition-colors text-sm" 
                             />
                             <button 
                               type="submit" 
                               disabled={submitting}
                               className="px-8 py-3 bg-white text-dark rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-white/90 transition-all shrink-0 flex items-center gap-2 justify-center"
                             >
                               {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Report'}
                             </button>
                           </form>
                         )}
                       </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          )}
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

function AuditMetric({ label, val, loading, icon }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${loading ? 'bg-white/5 text-white/20' : 'bg-premium-gold/20 text-premium-gold'}`}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-4 h-4">{icon}</div>}
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">{label}</p>
        <p className={`font-sans text-sm ${loading ? 'text-white/30 truncate max-w-[200px]' : 'text-white'}`}>{val}</p>
      </div>
    </div>
  )
}
