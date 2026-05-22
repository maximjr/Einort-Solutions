import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Layers, Cpu, Code, Send, Check, TerminalSquare, UploadCloud, Monitor, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { SEO } from '../components/SEO';

const INDUSTRIES = [
  'Technology & SaaS',
  'Healthcare & Medicine',
  'Finance & Banking',
  'Retail & E-Commerce',
  'Education & EdTech',
  'Real Estate & PropTech',
  'Media & Entertainment',
  'Manufacturing & Logistics',
  'Other'
];

const CATEGORIES = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design',
  'Enterprise/ERP Solution',
  'Cloud Infrastructure',
  'AI/Machine Learning Integration',
  'Other'
];

const INDUSTRY_INSIGHTS: Record<string, { considerations: string[], features: string[] }> = {
  'Technology & SaaS': {
    considerations: ['Multi-tenant Architecture', 'High Availability', 'API Rate Limiting'],
    features: ['Subscription Billing', 'Developer API', 'SSO/SAML']
  },
  'Healthcare & Medicine': {
    considerations: ['HIPAA/GDPR Compliance', 'Data Encryption at Rest', 'Audit Logging'],
    features: ['EHR/HL7 Integrations', 'Telemedicine Capabilities', 'Role-based Access']
  },
  'Finance & Banking': {
    considerations: ['PCI-DSS Compliance', 'End-to-End Encryption', 'Penetration Testing'],
    features: ['OpenBanking Interfaces', 'Fraud Detection', 'Ledger Integrity']
  },
  'Retail & E-Commerce': {
    considerations: ['High Traffic Handling', 'Global CDN Delivery', 'Zero-downtime Deployments'],
    features: ['Omnichannel Sync', 'Inventory Tracking', 'Dynamic Pricing']
  },
  'Education & EdTech': {
    considerations: ['FERPA/COPPA Compliance', 'WCAG Accessibility', 'Low-bandwidth Optimization'],
    features: ['LMS Moodle/Canvas Integrations', 'Gamification Engine', 'Video DRM']
  },
  'Real Estate & PropTech': {
    considerations: ['Geospatial indexing', 'High-res Asset Management', 'Scraping Defense'],
    features: ['MLS Data Feeds', 'Mapbox/Google Maps Clustering', '3D Walkthrough']
  },
  'Media & Entertainment': {
    considerations: ['Adaptive Bitrate Streaming', 'DRM Protection', 'Edge Caching'],
    features: ['Cross-platform Sync', 'Analytics Dashboards', 'Push Notifications']
  },
  'Manufacturing & Logistics': {
    considerations: ['IoT Protocol (MQTT) Support', 'Offline First Resilience', 'Real-time Sockets'],
    features: ['Predictive Maintenance', 'Route Optimization', 'Barcode/RFID Reader']
  }
};

export function CustomProjectRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    company: '',
    title: '',
    industry: '',
    category: '',
    goals: '',
    audience: '',
    features: '',
    style: '',
    budget: '',
    timeline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // AI Suggestions State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [suggestedStack, setSuggestedStack] = useState<string[]>(['React', 'Node.js', 'PostgreSQL']);
  const [complexity, setComplexity] = useState('Low');
  const [estimatedTime, setEstimatedTime] = useState('2-4 Weeks');

  // Handle typing to trigger 'AI analysis'
  useEffect(() => {
    if (formData.title.length > 5 || formData.features.length > 10) {
      setAiAnalyzing(true);
      const timer = setTimeout(() => {
        analyzeProject();
        setAiAnalyzing(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formData.title, formData.features, formData.category, formData.industry]);

  const analyzeProject = () => {
    // Simple heuristic to mock AI analysis for the live summary
    let newStack = [...suggestedStack];
    let newComplexity = 'Low';
    let newTime = '2-4 Weeks';
    
    const text = `${formData.title} ${formData.features} ${formData.category}`.toLowerCase();
    
    if (text.includes('app') || text.includes('mobile') || formData.category === 'Mobile App Development') {
      newStack = ['React Native', 'Firebase', 'GraphQL'];
    }
    
    if (text.includes('ai') || text.includes('machine learning') || text.includes('data')) {
      newStack = ['Python', 'TensorFlow', 'FastAPI', ...newStack].slice(0, 4);
      newComplexity = 'High';
      newTime = '3-6 Months';
    }
    
    if (text.includes('ecommerce') || text.includes('store') || text.includes('shop')) {
      newStack = ['Next.js', 'Stripe', 'Shopify Plus'];
      newComplexity = 'Medium';
      newTime = '1-2 Months';
    }
    
    if (text.includes('erp') || text.includes('enterprise') || text.includes('management')) {
      newStack = ['Spring Boot', 'Angular', 'Kubernetes'];
      newComplexity = 'Enterprise';
      newTime = '6+ Months';
    }

    if(formData.features.length > 100) {
       newComplexity = newComplexity === 'Low' ? 'Medium' : newComplexity;
    }

    setSuggestedStack(newStack);
    setComplexity(newComplexity);
    setEstimatedTime(newTime);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'customProjects'), {
        ...formData,
        userId: user?.uid || null,
        status: 'pending',
        suggestedStack,
        complexity,
        estimatedTime,
        createdAt: serverTimestamp()
      });
      
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting custom project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-[100dvh] bg-dark flex flex-col items-center justify-center p-6 text-center">
        <SEO title="Project Requested" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full glass-panel border border-premium-gold/30 p-12 relative overflow-hidden geometric-clip"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-premium-gold/10 blur-[100px] pointer-events-none" />
          
          <div className="w-20 h-20 bg-premium-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-premium-gold">
             <Check className="w-10 h-10 text-premium-gold" />
          </div>
          
          <h2 className="font-display text-4xl mb-4 font-bold text-white tracking-tight">Project Architected</h2>
          <p className="text-silver-metallic text-lg mb-8 font-light">
            Your intelligence dossier for <span className="text-white font-bold">{formData.title || "Custom Project"}</span> has been transmitted. Our engineering unit is reviewing the AI-assisted parameters.
          </p>
          
          <div className="bg-dark/50 border border-white/5 p-6 text-left mb-10 geometric-clip-right">
             <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-silver-metallic mb-4">Transmission Payload</h4>
             <ul className="space-y-2 font-mono text-xs uppercase tracking-widest text-white">
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-premium-gold" /> Sector: {formData.industry || 'Unspecified'}</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-premium-gold" /> System Type: {formData.category || 'Custom Architecture'}</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-premium-gold" /> Suggested Stack: {suggestedStack.join(', ')}</li>
             </ul>
          </div>
          
          <button 
             onClick={() => navigate('/')}
             className="px-8 py-4 geometric-clip-button font-mono text-xs font-bold uppercase tracking-widest bg-premium-gold text-white hover:bg-oxblood transition-colors"
          >
             Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-dark flex flex-col md:flex-row text-white font-sans selection:bg-premium-gold overflow-hidden">
      <SEO title="Intelligent Project Submission" />

      {/* Main Form Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-premium-gold/5 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 py-20 pb-32">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-12"
           >
              <div className="flex items-center gap-2 text-premium-gold mb-4">
                 <TerminalSquare className="w-4 h-4" />
                 <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]">Live Intelligence Layer</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight mb-4 leading-tight">
                 Architect Your <span className="text-gradient-metallic italic">Ecosystem.</span>
              </h1>
              <p className="text-silver-metallic font-light text-lg max-w-2xl">
                 Initialize a tailored architectural blueprint. As you input parameters, our intelligence layer evaluates and proposes real-time technological stacks.
              </p>
           </motion.div>

           <form onSubmit={handleSubmit} className="space-y-12">
              {/* Section 1: Entity Identification */}
              <div className="glass-panel geometric-clip border border-white/5 p-8 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-premium-gold/30" />
                 <h3 className="font-mono text-xs tracking-widest uppercase text-white mb-6 border-b border-white/10 pb-4">01. Entity Classification</h3>
                 
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label htmlFor="reqFullName" className="font-mono text-[10px] text-silver-metallic tracking-widest uppercase ml-1">Commander Name</label>
                       <input id="reqFullName" required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-dark/50 border border-white/10 rounded-none p-4 text-sm font-light text-white focus:outline-none focus:border-premium-gold transition-colors" placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                       <label htmlFor="reqEmail" className="font-mono text-[10px] text-silver-metallic tracking-widest uppercase ml-1">Transmission Email</label>
                       <input id="reqEmail" required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-dark/50 border border-white/10 rounded-none p-4 text-sm font-light text-white focus:outline-none focus:border-premium-gold transition-colors" placeholder="jane@example.com" />
                    </div>
                    <div className="space-y-2">
                       <label htmlFor="reqPhone" className="font-mono text-[10px] text-silver-metallic tracking-widest uppercase ml-1">Comm Channel (Phone)</label>
                       <input id="reqPhone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-dark/50 border border-white/10 rounded-none p-4 text-sm font-light text-white focus:outline-none focus:border-premium-gold transition-colors" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-2">
                       <label htmlFor="reqCompany" className="font-mono text-[10px] text-silver-metallic tracking-widest uppercase ml-1">Organization</label>
                       <input id="reqCompany" type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-dark/50 border border-white/10 rounded-none p-4 text-sm font-light text-white focus:outline-none focus:border-premium-gold transition-colors" placeholder="Acme Corp" />
                    </div>
                 </div>
              </div>

              {/* Section 2: Architecture Parameters */}
              <div className="glass-panel geometric-clip border border-white/5 p-8 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-premium-gold/30" />
                 <h3 className="font-mono text-xs tracking-widest uppercase text-white mb-6 border-b border-white/10 pb-4">02. Architecture Parameters</h3>
                 
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label htmlFor="reqTitle" className="font-mono text-[10px] text-silver-metallic tracking-widest uppercase ml-1">Project Codename</label>
                       <input id="reqTitle" required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-dark/50 border border-white/10 rounded-none p-4 text-sm font-light text-white focus:outline-none focus:border-premium-gold transition-colors" placeholder="e.g. Nexus Dashboard Revamp" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label htmlFor="reqIndustry" className="font-mono text-[10px] text-silver-metallic tracking-widest uppercase ml-1">Industry Sector</label>
                          <select id="reqIndustry" required name="industry" value={formData.industry} onChange={handleInputChange} className="w-full bg-dark/50 border border-white/10 rounded-none p-4 text-sm font-light text-white focus:outline-none focus:border-premium-gold transition-colors appearance-none">
                             <option value="" disabled>Select Sector</option>
                             {INDUSTRIES.map(i => <option key={i} value={i} className="bg-dark text-white">{i}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label htmlFor="reqCategory" className="font-mono text-[10px] text-silver-metallic tracking-widest uppercase ml-1">Core Classification</label>
                          <select id="reqCategory" required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-dark/50 border border-white/10 rounded-none p-4 text-sm font-light text-white focus:outline-none focus:border-premium-gold transition-colors appearance-none">
                             <option value="" disabled>Select Category</option>
                             {CATEGORIES.map(c => <option key={c} value={c} className="bg-dark text-white">{c}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label htmlFor="reqFeatures" className="font-mono text-[10px] text-silver-metallic tracking-widest uppercase ml-1">Core Capabilities (Features)</label>
                       <textarea id="reqFeatures" required name="features" value={formData.features} onChange={handleInputChange} rows={4} className="w-full bg-dark/50 border border-white/10 rounded-none p-4 text-sm font-light text-white focus:outline-none focus:border-premium-gold transition-colors custom-scrollbar" placeholder="Describe the critical functions and capabilities required..." />
                    </div>
                 </div>
              </div>

              {/* Section 3: Execution Context */}
              <div className="glass-panel geometric-clip border border-white/5 p-8 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-premium-gold/30" />
                 <h3 className="font-mono text-xs tracking-widest uppercase text-white mb-6 border-b border-white/10 pb-4">03. Execution Context</h3>
                 
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label htmlFor="reqBudget" className="font-mono text-[10px] text-silver-metallic tracking-widest uppercase ml-1">Investment Tier</label>
                       <select id="reqBudget" name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-dark/50 border border-white/10 rounded-none p-4 text-sm font-light text-white focus:outline-none focus:border-premium-gold transition-colors appearance-none">
                          <option value="">Undisclosed</option>
                          <option value="<$5k">&lt; $5,000</option>
                          <option value="$5k-$15k">$5,000 - $15,000</option>
                          <option value="$15k-$50k">$15,000 - $50,000</option>
                          <option value="$50k+">$50,000+</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label htmlFor="reqTimeline" className="font-mono text-[10px] text-silver-metallic tracking-widest uppercase ml-1">Target Trajectory</label>
                       <select id="reqTimeline" name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full bg-dark/50 border border-white/10 rounded-none p-4 text-sm font-light text-white focus:outline-none focus:border-premium-gold transition-colors appearance-none">
                          <option value="">Flexible</option>
                          <option value="<1 Month">Accelerated (&lt; 1 Month)</option>
                          <option value="1-3 Months">Standard (1-3 Months)</option>
                          <option value="3-6 Months">Extended (3-6 Months)</option>
                          <option value="6+ Months">Long-term (6+ Months)</option>
                       </select>
                    </div>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full group relative px-8 py-5 bg-premium-gold border-transparent geometric-clip-button overflow-hidden disabled:opacity-50"
              >
                 <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 slant-clip" />
                 <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                    <span className="font-mono text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      {isSubmitting ? 'Transmitting Data...' : 'Initialize Build Sequence'} <Send className="w-4 h-4" />
                    </span>
                 </div>
              </button>
           </form>
        </div>
      </div>

      {/* Live AI Summary Sidebar */}
      <div className="w-full md:w-[400px] border-t md:border-t-0 md:border-l border-white/5 bg-dark/95 backdrop-blur-xl shrink-0 flex flex-col p-6 overflow-y-auto custom-scrollbar relative z-20">
         <div className="sticky top-0">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-premium-gold/10 flex items-center justify-center border border-premium-gold/30">
                 <Cpu className={`w-4 h-4 text-premium-gold ${aiAnalyzing ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                 <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">Live Diagnostics</h3>
                 <p className="font-mono text-[9px] text-premium-gold uppercase tracking-widest">System Architecture Engine</p>
              </div>
           </div>

           <AnimatePresence mode="popLayout">
             <motion.div layout className="space-y-6">
                
                <motion.div layout className="p-4 border border-white/5 bg-white/[0.02] geometric-clip">
                   <h4 className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-3 flex items-center gap-2">
                     <Monitor className="w-3 h-3 text-white" /> Identified Scope
                   </h4>
                   <p className="font-display font-medium text-lg text-white break-words">
                      {formData.title || "Awaiting Codename..."}
                   </p>
                   <p className="text-sm text-gray-500 font-light mt-1">{formData.category || "Classification Pending"}</p>
                </motion.div>

                <motion.div layout className="p-4 border border-white/5 bg-white/[0.02] geometric-clip">
                   <h4 className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-3 flex items-center gap-2">
                     <Code className="w-3 h-3 text-white" /> Synthesized Tech Stack
                   </h4>
                   <div className="flex flex-wrap gap-2">
                     {suggestedStack.map(tech => (
                       <span key={tech} className="px-2 py-1 border border-premium-gold/30 bg-premium-gold/10 text-premium-gold font-mono text-[9px] uppercase tracking-widest geometric-clip-right">
                         {tech}
                       </span>
                     ))}
                   </div>
                </motion.div>

                <motion.div layout className="grid grid-cols-2 gap-4">
                   <div className="p-4 border border-white/5 bg-white/[0.02] geometric-clip">
                      <h4 className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1 flex items-center gap-1">
                         <Layers className="w-3 h-3 text-white" /> Complexity
                      </h4>
                      <p className={`font-mono text-sm uppercase tracking-widest font-bold ${complexity === 'High' || complexity === 'Enterprise' ? 'text-yellow-400' : 'text-oxblood'}`}>
                         {complexity}
                      </p>
                   </div>
                   <div className="p-4 border border-white/5 bg-white/[0.02] geometric-clip">
                      <h4 className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1 flex items-center gap-1">
                         <Rocket className="w-3 h-3 text-white" /> Est. Trajectory
                      </h4>
                      <p className="font-mono text-sm uppercase tracking-widest font-bold text-white">
                         {estimatedTime}
                      </p>
                   </div>
                </motion.div>
                
                {formData.industry && INDUSTRY_INSIGHTS[formData.industry] && (
                  <motion.div layout className="p-4 border border-white/5 bg-white/[0.02] geometric-clip">
                     <h4 className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-3 flex items-center gap-2">
                       <Sparkles className="w-3 h-3 text-white" /> Industry Insights: {formData.industry.split(' ')[0]}
                     </h4>
                     
                     <div className="mb-4">
                       <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">Compliance & Architecture</p>
                       <ul className="space-y-1">
                         {INDUSTRY_INSIGHTS[formData.industry].considerations.map((item, i) => (
                           <li key={i} className="flex items-start gap-2 text-xs font-light text-white/80">
                             <Check className="w-3 h-3 text-premium-gold shrink-0 mt-0.5" />
                             <span>{item}</span>
                           </li>
                         ))}
                       </ul>
                     </div>

                     <div>
                       <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">Standard Features</p>
                       <ul className="space-y-1">
                         {INDUSTRY_INSIGHTS[formData.industry].features.map((item, i) => (
                           <li key={i} className="flex items-start gap-2 text-xs font-light text-white/80">
                             <Check className="w-3 h-3 text-premium-gold shrink-0 mt-0.5" />
                             <span>{item}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                  </motion.div>
                )}

                {aiAnalyzing && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex justify-center p-4 border border-premium-gold/30 bg-premium-gold/5 geometric-clip"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-premium-gold animate-pulse">
                      Recalibrating parameters...
                    </span>
                  </motion.div>
                )}

             </motion.div>
           </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
