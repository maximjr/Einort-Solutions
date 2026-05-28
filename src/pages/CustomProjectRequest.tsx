import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers, Cpu, Code, Send, Check, TerminalSquare, UploadCloud, Monitor, Rocket, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { calculateLeadScore, getLeadStatus } from '../utils/leadScoring';
import { logClientActivity } from '../utils/activityLogger';
import { SEO } from '../components/SEO';
import { AuthModal } from '../components/AuthModal';

const INDUSTRIES = [
  'Healthcare & Medical', 'Hotel & Hospitality', 'Restaurant & Dining',
  'Education & EdTech', 'Corporate & Enterprise', 'NGO & Non-Profit',
  'High-Growth Startup', 'Real Estate & PropTech', 'Retail & Ecommerce'
];

const CATEGORIES = [
  'Web Development', 'Mobile App Development', 'UI/UX Design',
  'Enterprise/ERP Solution', 'Cloud Infrastructure', 'AI/Machine Learning Integration', 'Other'
];

const BUDGETS = ['<$5k', '$5k-$15k', '$15k-$50k', '$50k+'];
const TIMELINES = ['<1 Month', '1-3 Months', '3-6 Months', '6+ Months'];

export function CustomProjectRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 10;

  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    company: '',
    title: '',
    industry: '',
    category: '',
    features: [] as string[],
    goals: [] as string[],
    competitors: '',
    timeline: '',
    budget: '',
    complexity: 'Low',
    customFeature: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [suggestedStack, setSuggestedStack] = useState<string[]>(['React', 'Node.js', 'PostgreSQL']);
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    // Recalculate intelligence behind the scenes
    let newStack = ['React', 'Node.js', 'PostgreSQL'];
    let complexityLevel = 'Medium';
    let baseCost = 15000;

    switch(formData.industry) {
      case 'Healthcare & Medical':
        newStack = ['Next.js', 'Node.js', 'PostgreSQL', 'HL7 Engines', 'HIPAA AWS'];
        baseCost = 85000;
        complexityLevel = 'Enterprise';
        break;
      case 'Hotel & Hospitality':
        newStack = ['React', 'Node.js', 'Redis', 'Stripe Connect'];
        baseCost = 65000;
        complexityLevel = 'High';
        break;
      case 'Restaurant & Dining':
        newStack = ['React Native', 'Firebase', 'Node.js', 'Square API'];
        baseCost = 45000;
        complexityLevel = 'Medium';
        break;
      case 'Education & EdTech':
        newStack = ['React', 'Django', 'PostgreSQL', 'WebRTC'];
        baseCost = 75000;
        complexityLevel = 'High';
        break;
      case 'Corporate & Enterprise':
        newStack = ['Next.js', 'Java Spring', 'Kubernetes', 'OAuth2'];
        baseCost = 150000;
        complexityLevel = 'Enterprise';
        break;
      case 'NGO & Non-Profit':
        newStack = ['React', 'Node.js', 'Firebase', 'Stripe'];
        baseCost = 40000;
        complexityLevel = 'Medium';
        break;
      case 'Real Estate & PropTech':
        newStack = ['Next.js', 'Node.js', 'PostGIS', 'ElasticSearch'];
        baseCost = 70000;
        complexityLevel = 'High';
        break;
      case 'Retail & Ecommerce':
        newStack = ['Next.js', 'Shopify Plus', 'Redis', 'ElasticSearch'];
        baseCost = 65000;
        complexityLevel = 'High';
        break;
      case 'High-Growth Startup':
      default:
        newStack = ['React', 'Node.js', 'PostgreSQL', 'AWS Serverless'];
        baseCost = 45000;
        break;
    }

    if (formData.features.includes('AI Processing') || formData.features.includes('Machine Learning')) {
      newStack.push('Python', 'TensorFlow');
      complexityLevel = complexityLevel === 'Enterprise' ? 'Enterprise' : 'High';
      baseCost += 15000;
    }

    if (formData.budget === '$15k-$50k') baseCost = Math.max(baseCost, 25000);
    else if (formData.budget === '$50k+') baseCost = Math.max(baseCost, 60000);

    setSuggestedStack(newStack.slice(0, 5));
    setFormData(prev => ({ ...prev, complexity: complexityLevel }));
    setEstimatedCost(baseCost);
  }, [formData.industry, formData.category, formData.features, formData.budget]);

  const handleNext = () => setStep(p => Math.min(p + 1, totalSteps));
  const handleBack = () => setStep(p => Math.max(p - 1, 1));

  const toggleArrayItem = (field: 'features' | 'goals', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item]
    }));
  };

  const handleIntentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    executeSubmit();
  };

  const executeSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'customProjects'), {
        ...formData,
        userId: user?.uid || null,
        status: 'pending',
        suggestedStack,
        estimatedCost,
        createdAt: serverTimestamp()
      });

      const leadValue = estimatedCost;
      const forecastProb = formData.complexity === 'Enterprise' ? 20 : formData.complexity === 'High' ? 40 : 70;
      
      const score = calculateLeadScore({
        budget: formData.budget,
        value: leadValue,
        timeline: formData.timeline,
        complexity: formData.complexity,
        featuresCount: formData.features.length,
        hasCompany: !!formData.company,
        industry: formData.industry,
      });

      await addDoc(collection(db, 'leads'), {
        name: formData.company || formData.fullName || 'Anonymous Prospect',
        contact: formData.fullName,
        email: formData.email,
        value: leadValue,
        stage: 'new', 
        date: new Date().toISOString().split('T')[0],
        status: getLeadStatus(score),
        score: score,
        aiNote: `Auto-generated Lead from Project Blueprint. Industry: ${formData.industry}. Stack: ${suggestedStack.join(', ')}.`,
        lastContact: new Date().toISOString().split('T')[0],
        forecast: forecastProb,
        createdAt: serverTimestamp()
      });
      
      await logClientActivity(user?.uid || null, formData.email, 'submitted_project', `Submitted prototype for ${formData.industry}`);
      
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 text-center">
        <SEO title="Project Requested" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full glass-panel border border-premium-gold/30 p-12 geometric-clip relative">
          <div className="w-20 h-20 bg-premium-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-premium-gold"><Check className="w-10 h-10 text-premium-gold" /></div>
          <h2 className="font-display text-4xl mb-4 font-bold text-white tracking-tight">Architecture Transmitted</h2>
          <button onClick={() => navigate('/client')} className="px-8 py-4 geometric-clip-button font-mono text-xs font-bold uppercase tracking-widest bg-premium-gold text-dark hover:bg-white transition-colors">Enter Portal</button>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display mb-4">Select Industry</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {INDUSTRIES.map(i => (
                <button key={i} type="button" onClick={() => { setFormData(p => ({...p, industry: i})); handleNext(); }} className={`p-4 border text-left font-mono text-sm tracking-widest uppercase transition-colors ${formData.industry === i ? 'border-premium-gold bg-premium-gold/10 text-premium-gold' : 'border-white/10 text-white/70 hover:border-white/30'}`}>{i}</button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display mb-4">Project Type</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {CATEGORIES.map(c => (
                <button key={c} type="button" onClick={() => { setFormData(p => ({...p, category: c})); handleNext(); }} className={`p-4 border text-left font-mono text-sm tracking-widest uppercase transition-colors ${formData.category === c ? 'border-premium-gold bg-premium-gold/10 text-premium-gold' : 'border-white/10 text-white/70 hover:border-white/30'}`}>{c}</button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display mb-4">Required Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {['User Authentication', 'Payment Processing', 'Real-time Chat', 'AI Processing', 'Admin Dashboard', 'Analytics', 'File Storage', 'Third-party Integrations'].map(f => (
                <button key={f} type="button" onClick={() => toggleArrayItem('features', f)} className={`p-4 border text-left font-mono text-xs tracking-widest uppercase flex justify-between ${formData.features.includes(f) ? 'border-premium-gold bg-premium-gold/10 text-premium-gold' : 'border-white/10 text-white/70 hover:border-white/30'}`}>
                  {f} {formData.features.includes(f) && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Other specific feature..." value={formData.customFeature} onChange={e => setFormData(p => ({...p, customFeature: e.target.value}))} className="w-full bg-dark border border-white/10 p-4 text-white font-mono text-sm uppercase outline-none focus:border-premium-gold" />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display mb-4">Primary Business Goals</h2>
            <div className="grid gap-4">
              {['Increase Revenue', 'Automate Operations', 'Improve User Experience', 'Scale Infrastructure', 'Launch MVP'].map(g => (
                <button key={g} type="button" onClick={() => toggleArrayItem('goals', g)} className={`p-4 border text-left font-mono text-xs tracking-widest uppercase flex justify-between ${formData.goals.includes(g) ? 'border-premium-gold bg-premium-gold/10 text-premium-gold' : 'border-white/10 text-white/70 hover:border-white/30'}`}>
                  {g} {formData.goals.includes(g) && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display mb-4">Competitive Landscape</h2>
            <textarea placeholder="List your main competitors or inspiration (URLs)..." rows={5} value={formData.competitors} onChange={e => setFormData(p => ({...p, competitors: e.target.value}))} className="w-full bg-dark border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-premium-gold custom-scrollbar" />
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display mb-4">Target Timeline</h2>
            <div className="grid gap-4">
              {TIMELINES.map(t => (
                <button key={t} type="button" onClick={() => { setFormData(p => ({...p, timeline: t})); handleNext(); }} className={`p-4 border text-left font-mono text-sm tracking-widest uppercase transition-colors ${formData.timeline === t ? 'border-premium-gold bg-premium-gold/10 text-premium-gold' : 'border-white/10 text-white/70 hover:border-white/30'}`}>{t}</button>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display mb-4">Investment Strategy</h2>
            <div className="grid gap-4">
              {BUDGETS.map(b => (
                <button key={b} type="button" onClick={() => { setFormData(p => ({...p, budget: b})); handleNext(); }} className={`p-4 border text-left font-mono text-sm tracking-widest uppercase transition-colors ${formData.budget === b ? 'border-premium-gold bg-premium-gold/10 text-premium-gold' : 'border-white/10 text-white/70 hover:border-white/30'}`}>{b}</button>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
           <div className="space-y-6">
            <h2 className="text-2xl font-display mb-4">Project Entity (Name)</h2>
            <input required type="text" placeholder="Project Name / Codename" value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="w-full bg-dark border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-premium-gold mb-4" />
            <input required type="text" placeholder="Your Full Name" value={formData.fullName} onChange={e => setFormData(p => ({...p, fullName: e.target.value}))} className="w-full bg-dark border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-premium-gold mb-4" />
            <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="w-full bg-dark border border-white/10 p-4 text-white font-mono text-sm outline-none focus:border-premium-gold" />
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display mb-4">AI Diagnostic Intelligence</h2>
            <div className="glass-panel p-6 border border-premium-gold/30 bg-premium-gold/5">
               <div className="flex items-center gap-3 mb-6">
                 <Cpu className="w-6 h-6 text-premium-gold animate-pulse" />
                 <h3 className="font-mono text-sm font-bold uppercase tracking-widest">Calculated Trajectory</h3>
               </div>
               <div className="space-y-4 font-mono text-xs text-white/80">
                 <div className="flex justify-between border-b border-white/10 pb-2"><span>Complexity:</span> <span className="text-premium-gold">{formData.complexity}</span></div>
                 <div className="flex justify-between border-b border-white/10 pb-2"><span>Recommended Stack:</span> <span className="text-right">{suggestedStack.join(', ')}</span></div>
                 <div className="flex justify-between pb-2"><span>Estimated Base Investment:</span> <span className="text-white">${estimatedCost.toLocaleString()}</span></div>
               </div>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display mb-4">Final Submission Verification</h2>
            <div className="glass-panel p-6 border border-white/10 space-y-4 font-mono text-xs text-white">
               <p><span className="text-white/50 tracking-widest uppercase">Project:</span> {formData.title}</p>
               <p><span className="text-white/50 tracking-widest uppercase">Target:</span> {formData.category}</p>
               <p><span className="text-white/50 tracking-widest uppercase">Capabilities:</span> {formData.features.join(', ')}</p>
               <p><span className="text-white/50 tracking-widest uppercase">Client:</span> {formData.fullName} ({formData.email})</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-24 pb-20 text-white font-sans overflow-x-hidden selection:bg-premium-gold">
      <SEO title="Intelligent Blueprint Core" />
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Progress Bar */}
        <div className="mb-12">
           <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase text-white/50 mb-3">
             <span>Phase {step}</span>
             <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
           </div>
           <div className="w-full h-1 bg-white/10 overflow-hidden geometric-clip">
             <motion.div className="h-full bg-premium-gold" initial={{ width: 0 }} animate={{ width: `${(step / totalSteps) * 100}%` }} />
           </div>
        </div>

        <form onSubmit={step === totalSteps ? handleIntentSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-[400px]">
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-between border-t border-white/10 pt-6">
            <button type="button" onClick={handleBack} disabled={step === 1} className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white disabled:opacity-0 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <button type="submit" disabled={isSubmitting || (step === 8 && !formData.email)} className="flex items-center gap-2 px-8 py-4 geometric-clip-button font-mono text-xs font-bold uppercase tracking-widest bg-premium-gold text-dark hover:brightness-110 disabled:opacity-50">
              {step === totalSteps ? (isSubmitting ? 'Transmitting...' : 'Submit Blueprint') : 'Proceed'} {step !== totalSteps && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
          onSuccess={() => { setAuthModalOpen(false); executeSubmit(); }}
          title="Account Required"
          subtitle="Please sign in or create an account to submit your project blueprint."
        />
      </div>
    </div>
  );
}
