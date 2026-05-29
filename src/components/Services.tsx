import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Globe, Database, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { SEO } from './SEO';

const INDUSTRIES = [
  { id: 'healthcare', name: 'Healthcare & Medical', desc: 'Secure patient portals, telemedicine, and HIPAA-compliant data systems.' },
  { id: 'hotel', name: 'Hotel & Hospitality', desc: 'Booking engines, PMS integrations, and premium guest experiences.' },
  { id: 'restaurant', name: 'Restaurant & Dining', desc: 'Order tracking, POS integrations, and loyalty systems.' },
  { id: 'education', name: 'Education & EdTech', desc: 'Learning management systems, student portals, and virtual classrooms.' },
  { id: 'corporate', name: 'Corporate & Enterprise', desc: 'Complex ERPs, operational automation, and global team collaboration.' },
  { id: 'ngo', name: 'NGO & Non-Profit', desc: 'Donation tracking, volunteer routing, and transparency ledgers.' },
  { id: 'startup', name: 'High-Growth Startup', desc: 'Scalable MVPs, cloud-native architectures, and investor-ready systems.' },
  { id: 'realestate', name: 'Real Estate & PropTech', desc: 'Property management, lead routing, and dynamic MLS listing models.' },
  { id: 'ecommerce', name: 'Retail & Ecommerce', desc: 'Ultra-fast global storefronts, omnichannel sync, and inventory intelligence.' }
];

const GOALS = [
  { id: 'revenue', name: 'Drive Digital Revenue' },
  { id: 'automation', name: 'Automate Workflows' },
  { id: 'experience', name: 'Elevate UX/UI Design' },
  { id: 'scale', name: 'Scale Infrastructure' }
];

const RECOMMENDATIONS: Record<string, { service: string, features: string[], baseCost: number, timeline: string, integrations: string[], businessSolutions: string[], techStack: string[], projectPriority: string, deliverables: string[] }> = {
  healthcare: {
    service: 'MedTech Digital Infrastructure',
    features: ['Patient Portal & Mobile App', 'HL7/EHR Integration', 'Telemedicine Video Subsystem', 'HIPAA Compliant Datastores'],
    baseCost: 85000,
    timeline: '16-24 Weeks',
    integrations: ['Epic / Cerner EHR', 'Stripe Medical', 'Twilio Video', 'AWS HealthLake'],
    businessSolutions: ['Reduce No-Show Rates', 'Automate Intake Forms', 'Provide 24/7 Virtual Care'],
    techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'WebRTC', 'AWS HIPAA-Eligible Services'],
    projectPriority: 'CRITICAL: Security & Compliance',
    deliverables: ['HIPAA Compliance Audit', 'Core Patient Portal', 'Telehealth System', 'Provider Dashboard']
  },
  hotel: {
    service: 'Hospitality Booking Engine',
    features: ['Real-time PMS Sync', 'Dynamic Revenue Pricing', 'VIP Concierge Dashboard', 'Immersive UX Flows'],
    baseCost: 65000,
    timeline: '12-16 Weeks',
    integrations: ['Opera PMS', 'Stripe Connect', 'SendGrid', 'Smart Room IoT'],
    businessSolutions: ['Increase Direct Bookings', 'Upsell Amenities', 'Streamline Check-in'],
    techStack: ['React', 'Node.js', 'Redis', 'Vercel'],
    projectPriority: 'HIGH: User Experience & Conversion',
    deliverables: ['Custom Booking Engine', 'Guest App', 'Staff Admin Panel', 'Pricing Algorithm Integration']
  },
  restaurant: {
    service: 'Omnichannel Dining System',
    features: ['Direct Mobile Ordering', 'Kitchen Display System (KDS)', 'Loyalty & Rewards Ledger', '3rd-Party Delivery Sync'],
    baseCost: 45000,
    timeline: '8-12 Weeks',
    integrations: ['Square POS', 'Toast / Revel', 'UberEats / DoorDash API'],
    businessSolutions: ['Own Customer Data', 'Bypass Aggregator Fees', 'Optimize Table Turns'],
    techStack: ['React Native', 'Firebase', 'Node.js'],
    projectPriority: 'HIGH: Speed & Reliability',
    deliverables: ['Customer Ordering App', 'Kitchen Display Web App', 'Manager Dashboard']
  },
  education: {
    service: 'EdTech Learning Platform',
    features: ['Virtual Classroom Streaming', 'Assessment Engine', 'Student Progress Analytics', 'SCORM Compliant Content'],
    baseCost: 75000,
    timeline: '14-20 Weeks',
    integrations: ['Canvas / Blackboard', 'Zoom SDK', 'Auth0'],
    businessSolutions: ['Scale Remote Learning', 'Automate Grading', 'Increase Student Retention'],
    techStack: ['React', 'Django', 'PostgreSQL', 'WebRTC'],
    projectPriority: 'HIGH: Concurrent Scale',
    deliverables: ['LMS Core', 'Live Video Infrastructure', 'Analytics Engine']
  },
  corporate: {
    service: 'Enterprise Hub Architecture',
    features: ['Legacy System Wrap', 'Global SSO/SAML Auth', 'Real-time Dashboards', 'Workflow Automation Core'],
    baseCost: 150000,
    timeline: '20-30+ Weeks',
    integrations: ['SAP / Oracle', 'Azure AD', 'Salesforce'],
    businessSolutions: ['Eliminate Data Silos', 'Accelerate Reporting', 'Standardize Operations'],
    techStack: ['Next.js', 'Java Spring Boot', 'Kubernetes', 'OAuth2'],
    projectPriority: 'CRITICAL: Data Architecture & Security',
    deliverables: ['Microservices Blueprint', 'SSO Gateway', 'Data Lake Integration', 'Exec Analytics']
  },
  ngo: {
    service: 'Impact & Transparency Core',
    features: ['Secure Donor Ledger', 'Campaign Impact Analytics', 'Volunteer Orchestration', 'CRM Growth Funnels'],
    baseCost: 40000,
    timeline: '8-12 Weeks',
    integrations: ['Stripe / PayPal (Non-profit)', 'Mailchimp', 'Salesforce NPSP'],
    businessSolutions: ['Increase Recurring Donations', 'Automate Tax Receipts', 'Prove Impact Metrics'],
    techStack: ['React', 'Node.js', 'Firebase'],
    projectPriority: 'MEDIUM: Rapid Deployment & Low OPEX',
    deliverables: ['Donation Portal', 'Volunteer DB', 'Impact Visualizer']
  },
  realestate: {
    service: 'PropTech Listing Matrix',
    features: ['Live MLS Synchronization', 'Virtual Tour Subsystem', 'Lead Scoring Engine', 'Broker CRM Portal'],
    baseCost: 70000,
    timeline: '12-18 Weeks',
    integrations: ['RETS / RESO Web API', 'Matterport', 'DocuSign'],
    businessSolutions: ['Accelerate Deal Flow', 'Automate Lead Routing', 'Enhance Property Discovery'],
    techStack: ['Next.js', 'Node.js', 'PostGIS', 'ElasticSearch'],
    projectPriority: 'HIGH: Search Performance & SEO',
    deliverables: ['Global Search Portal', 'Multi-tenant Broker Dashboard', 'MLS Pipeline']
  },
  startup: {
    service: 'Venture-Backed MVP Layer',
    features: ['Scalable Serverless Infrastructure', 'React Native App (iOS/Android)', 'Core Business Logic Engine', 'Investor Dashboard'],
    baseCost: 45000,
    timeline: '8-12 Weeks',
    integrations: ['Stripe Billing', 'Mixpanel', 'AWS Cognito'],
    businessSolutions: ['Validate Product-Market Fit', 'Secure Seed Funding', 'Rapid Feature Iteration'],
    techStack: ['React', 'Go', 'PostgreSQL', 'AWS Serverless'],
    projectPriority: 'CRITICAL: Time-to-Market',
    deliverables: ['Mobile MVP', 'Marketing Landing Page', 'Admin Backoffice']
  },
  ecommerce: {
    service: 'Omnichannel Commerce Engine',
    features: ['Global CDN Deployment', 'Headless React Frontend', 'Predictive Inventory Algorithms', 'Automated Marketing Flows'],
    baseCost: 65000,
    timeline: '12-16 Weeks',
    integrations: ['Shopify Plus API', 'Klaviyo', 'Algolia', 'ShipStation'],
    businessSolutions: ['Increase Conversion Rate', 'Reduce Cart Abandonment', 'Enable Omnichannel Sync'],
    techStack: ['Next.js (Edge)', 'Redis', 'Vercel', 'Sanity CMS'],
    projectPriority: 'CRITICAL: Load Speed & Uptime',
    deliverables: ['Headless Storefront', 'PIM Integration', 'Checkout Flow']
  }
};

export function Services() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    industry: '',
    goal: ''
  });

  const handleNext = () => setStep(p => p + 1);

  const getRecommendation = () => {
    return RECOMMENDATIONS[selections.industry] || RECOMMENDATIONS['corporate'];
  };

  const handleInitiateBuilder = () => {
    navigate('/custom-project');
  };

  return (
    <section className="min-h-screen bg-dark text-white relative pt-32 pb-24 border-b border-light/5">
      <div className="absolute inset-0 bg-dark z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-premium-gold/5 blur-[150px] pointer-events-none z-0" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        <div className="mb-16 text-center max-w-2xl mx-auto">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 geometric-clip mb-6">
             <Activity className="w-4 h-4 text-premium-gold animate-pulse" />
             <span className="text-[10px] uppercase font-mono tracking-widest">Intelligent Consultation Engine</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4 text-white">System <span className="text-premium-gold italic">Architect</span></h2>
           <p className="text-white/60 font-light text-sm">We don't sell generic services. Provide your specific operational parameters, and our diagnostic engine will recommend a tailored enterprise-grade architecture.</p>
        </div>

        <div className="glass-panel p-8 md:p-12 border border-white/10 geometric-clip min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
                 <div>
                   <h3 className="text-xl font-mono uppercase tracking-widest text-silver-metallic border-b border-white/10 pb-4 mb-6">01. Sector Classification</h3>
                   <div className="grid md:grid-cols-2 gap-4">
                     {INDUSTRIES.map(ind => (
                       <button
                         key={ind.id}
                         onClick={() => { setSelections(p => ({ ...p, industry: ind.id })); handleNext(); }}
                         className="p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-premium-gold/50 transition-all text-left flex flex-col group justify-between"
                       >
                         <div>
                            <h4 className="font-display text-xl mb-2 text-white group-hover:text-premium-gold transition-colors">{ind.name}</h4>
                            <p className="text-xs text-white/50 font-light leading-relaxed mb-4">{ind.desc}</p>
                         </div>
                         <div className="flex items-center text-[10px] font-mono tracking-widest uppercase text-white/30 group-hover:text-white transition-colors">Select <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" /></div>
                       </button>
                     ))}
                   </div>
                 </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                 <div>
                   <h3 className="text-xl font-mono uppercase tracking-widest text-silver-metallic border-b border-white/10 pb-4 mb-6">02. Primary Objective</h3>
                   <div className="grid md:grid-cols-2 gap-4">
                     {GOALS.map(goal => (
                       <button
                         key={goal.id}
                         onClick={() => { setSelections(p => ({ ...p, goal: goal.id })); handleNext(); }}
                         className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-premium-gold/50 transition-all text-left flex items-center justify-between group"
                       >
                         <h4 className="font-display text-xl text-white group-hover:text-premium-gold transition-colors">{goal.name}</h4>
                         <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors group-hover:translate-x-1" />
                       </button>
                     ))}
                   </div>
                 </div>
                 <button onClick={() => setStep(1)} className="text-[10px] font-mono uppercase tracking-widest text-white/50 hover:text-white mt-8">← Modify Sector</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <div className="border border-premium-gold/30 bg-premium-gold/5 p-8 md:p-12 geometric-clip">
                    <div className="flex items-center gap-3 mb-8">
                       <ShieldCheck className="w-6 h-6 text-premium-gold" />
                       <h3 className="font-mono text-sm uppercase tracking-widest text-premium-gold font-bold">Diagnostic Blueprint Generated</h3>
                    </div>
                    
                    <h4 className="text-3xl md:text-5xl font-display text-white mb-4">{getRecommendation().service}</h4>
                    <p className="text-white/60 mb-8 font-light text-sm max-w-xl">Based on your operational parameters, our intelligence layer has compiled a reference architecture strictly tailored for {INDUSTRIES.find(i=>i.id === selections.industry)?.name}.</p>
                    
                    <div className="grid md:grid-cols-2 gap-10 mb-10">
                       <div>
                         <p className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-4 border-b border-white/10 pb-2">Core Component Subsystems</p>
                         <ul className="space-y-3 mb-8">
                           {getRecommendation().features.map(f => (
                             <li key={f} className="flex items-start gap-3">
                                <Check className="w-4 h-4 text-premium-gold shrink-0 mt-0.5" />
                                <span className="text-sm font-light text-white/90">{f}</span>
                             </li>
                           ))}
                         </ul>

                         <p className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-4 border-b border-white/10 pb-2">Expected Deliverables</p>
                         <ul className="space-y-3 mb-8">
                           {getRecommendation().deliverables.map(d => (
                             <li key={d} className="flex items-start gap-3">
                                <Check className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                                <span className="text-sm font-light text-white/90">{d}</span>
                             </li>
                           ))}
                         </ul>
                         
                         <p className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-4 border-b border-white/10 pb-2">Business ROI Solutions</p>
                         <ul className="space-y-3">
                           {getRecommendation().businessSolutions.map(s => (
                             <li key={s} className="flex items-start gap-3">
                                <Activity className="w-4 h-4 text-xl shrink-0 mt-0.5" />
                                <span className="text-sm font-light text-white/90">{s}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                       
                       <div className="space-y-6">
                         <div className="bg-dark/50 border border-white/10 p-6 geometric-clip-right flex flex-col justify-center">
                            <div className="mb-6">
                               <p className="font-mono text-[9px] uppercase tracking-widest text-white/50 mb-1">Base Investment Floor</p>
                               <p className="text-2xl font-mono text-white">${getRecommendation().baseCost.toLocaleString()}</p>
                            </div>
                            <div className="mb-6">
                               <p className="font-mono text-[9px] uppercase tracking-widest text-white/50 mb-1">Est. Release Window</p>
                               <p className="text-2xl font-mono text-white">{getRecommendation().timeline}</p>
                            </div>
                            <div>
                               <p className="font-mono text-[9px] uppercase tracking-widest text-white/50 mb-1">Project Priority Level</p>
                               <p className="text-[13px] font-mono text-premium-gold font-bold">{getRecommendation().projectPriority}</p>
                            </div>
                         </div>
                         
                         <div className="bg-white/[0.02] border border-white/5 p-6">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-4 border-b border-white/10 pb-2">Technical Architecture</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {getRecommendation().techStack.map(tech => (
                                <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">{tech}</span>
                              ))}
                            </div>
                            
                            <p className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-4 border-b border-white/10 pb-2">Ecosystem Integrations</p>
                            <div className="flex flex-wrap gap-2">
                              {getRecommendation().integrations.map(integration => (
                                <span key={integration} className="px-2 py-1 bg-white/[0.02] border border-white/5 text-[10px] font-mono text-white/50">{integration}</span>
                              ))}
                            </div>
                         </div>
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 border-t border-white/10 pt-8">
                       <button onClick={handleInitiateBuilder} className="bg-premium-gold text-dark font-mono text-xs uppercase font-bold tracking-widest px-8 py-4 geometric-clip-button hover:bg-white transition-colors flex items-center justify-center gap-2">
                          Launch Blueprint Studio <ArrowRight className="w-4 h-4" />
                       </button>
                       <button onClick={() => setStep(1)} className="bg-transparent border border-white/20 text-white font-mono text-xs uppercase font-bold tracking-widest px-8 py-4 geometric-clip-button hover:bg-white/5 transition-colors">
                          Recalibrate
                       </button>
                    </div>

                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
