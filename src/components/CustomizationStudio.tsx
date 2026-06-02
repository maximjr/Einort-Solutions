import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { SEO } from './SEO';
import { 
  Check, 
  Sparkles, 
  ChevronLeft, 
  Layout, 
  Type, 
  Palette, 
  ArrowRight, 
  Wand2, 
  Monitor, 
  Smartphone as SmartphoneIcon, 
  Code, 
  Layers, 
  Activity, 
  Building, 
  Target, 
  Compass, 
  Link as LinkIcon, 
  DollarSign, 
  Clock, 
  Eye, 
  ShieldAlert,
  Sliders,
  Send,
  HelpCircle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { calculateLeadScore, getLeadStatus } from '../utils/leadScoring';
import { logClientActivity } from '../utils/activityLogger';

// Constant Data for Discovery Options
const INDUSTRIES = [
  { id: 'healthcare', label: 'Healthcare & Pharma', icon: Activity, desc: 'Patient-centric, secure & compliant architectures.' },
  { id: 'hotel', label: 'Bespoke Hospitality', icon: Building, desc: 'Luxury bookings and reservation coordination.' },
  { id: 'restaurant', label: 'Premium F&B / Restaurant', icon: Compass, desc: 'E-commerce logistics, reservations & POS sync.' },
  { id: 'education', label: 'EdTech & Training', icon: Type, desc: 'Secure portals, course-builders & analytics hubs.' },
  { id: 'corporate', label: 'Enterprise Corporate', icon: Layers, desc: 'Scalable internal directories & document clouds.' },
  { id: 'ngo', label: 'NGO / Philanthropy', icon: Target, desc: 'Impact calculators, micro-donation & donor CRM.' },
  { id: 'startup', label: 'Hyper-Growth Startup', icon: Sparkles, desc: 'Fast MVP architectures, waitlists & early billing.' },
  { id: 'finance', label: 'FinTech & Capital', icon: DollarSign, desc: 'Military-grade auth, transaction ledgers & logs.' },
  { id: 'ecommerce', label: 'High-Volume Retail', icon: Sliders, desc: 'Product matrix, analytics, cart & fast checkout.' },
  { id: 'realestate', label: 'Real Estate & Land', icon: Eye, desc: 'Interactive listing maps, tours & portal capture.' }
];

const GOALS = [
  { id: 'leads', label: 'Generate Enterprise Leads' },
  { id: 'bookings', label: 'Increase Client Bookings' },
  { id: 'sales', label: 'Scale Online Sales' },
  { id: 'inventory', label: 'Automate Inventory Control' },
  { id: 'ops', label: 'Optimize Internal Operations' },
  { id: 'seo', label: 'Shatter Search Rankings (SEO)' },
  { id: 'mvp', label: 'Launch Secure MVP Fast' },
  { id: 'transformation', label: 'Complete Digital Upgrades' }
];

const PROJECT_TYPES = [
  { id: 'website', label: 'Bespoke Digital Window (Website)' },
  { id: 'erp', label: 'Enterprise Resource Planner (ERP)' },
  { id: 'crm', label: 'Custom Operations CRM' },
  { id: 'mobile', label: 'High-Fidelity Mobile App' },
  { id: 'saas', label: 'Multi-Tenant SaaS Platform' },
  { id: 'booking', label: 'Interactive Scheduling Engine' },
  { id: 'marketplace', label: 'Distributed Marketplace' },
  { id: 'internal', label: 'Core Employee Framework' }
];

const INDUSTRY_FEATURES: Record<string, string[]> = {
  healthcare: ['Secure HIPAA Portal', 'Smart Appointment Booking', 'Doctor Activity Grid', 'Integrated Medical CRM', 'Clinical Compliance Admin'],
  hotel: ['Direct Booking Gateway', 'Secure Multi-Currencies Checkout', 'Room Allotment Ledger', 'VIP Guest Experience CRM', 'Staff Rota Coordination'],
  restaurant: ['Contactless Online ordering', 'Table Booking Orchestrator', 'Dynamic Menu Composer', 'Integrated Kitchen Display', 'Loyalty Rewards Hub'],
  education: ['Dynamic Student Portal', 'Syllabus Course Builder', 'Grading Log & Attendance', 'Live Class Feed Integration', 'Parent Guardian Dash'],
  corporate: ['Unified Employee Index', 'Milestone KPI Tracker', 'Document Version Control', 'Media Hub Aggregator', 'Shared Room Reservation'],
  ngo: ['Authenticated Donor Portal', 'Volunteer Coordination Logs', 'Verified Donation Campaign Hub', 'Dynamic Impact Estimator', 'Secure Direct CRM'],
  startup: ['Robust MVP Launch Console', 'Live Sentiment Feedback', 'Frictionless Payment Checkout', 'Waitlist Growth Engine', 'Custom Metric Dashboard'],
  finance: ['Multifactor Secure login', 'Live Trading/Allocation Dash', 'Immutable Transaction Records', 'Custom Stock/Rate Tickers', 'Dynamic Risk Assessor'],
  ecommerce: ['Dynamic Product Options Matrix', 'Frictionless Cart & Checkouts', 'Automated Stock Tracker', 'Social Reviews Connector', 'Multi-Store Administration'],
  realestate: ['Interactive Listings Panel', 'Broker Management Console', 'Advanced Live Vector Mapping', 'Full Sandbox Virtual Tours', 'Prospect Matcher CRM']
};

const INTEGRATIONS = [
  { id: 'payment', label: 'Stripe Secure Checkout' },
  { id: 'whatsapp', label: 'WhatsApp Automated Agent' },
  { id: 'crm', label: 'CRM Synchronization (HubSpot/Salesforce)' },
  { id: 'analytics', label: 'Advanced Recharts Analytics' },
  { id: 'booking_api', label: 'Calendar Scheduling APIs' },
  { id: 'maps', label: 'Google Maps Premium Platform' },
  { id: 'email', label: 'SendGrid Automated Flows' }
];

const BUDGET_RANGES = [
  { id: '1k-5k', label: '$1k–$5k', scale: 'Standard Startup Tier' },
  { id: '5k-15k', label: '$5k–$15k', scale: 'Professional Business Tier' },
  { id: '15k-50k', label: '$15k–$50k', scale: 'Premium Growth Tier' },
  { id: '50k+', label: '$50k+ Enterprise', scale: 'High-Scale Custom Infrastructure' }
];

const TIMELINES = [
  { id: 'urgent', label: 'ASAP / Urgent Protocol' },
  { id: '1month', label: 'Within 1 Month' },
  { id: '2-3months', label: '2–3 Months' },
  { id: '6months+', label: '6 Months / Flexible' }
];

const DIRECTIONS = [
  { id: 'premium', label: 'Premium Elegant' },
  { id: 'luxury', label: 'Luxury & Spacious' },
  { id: 'minimal', label: 'Ultra Minimalist' },
  { id: 'corporate', label: 'Corporate Technical' },
  { id: 'modern', label: 'Bold Modern' },
  { id: 'futuristic', label: 'Futuristic Sci-Fi' }
];

const THEMES = [
  { id: 'obsidian', name: 'Obsidian Dark', primary: '#020617', secondary: '#0f172a', accent: '#3b82f6', text: '#f8fafc' },
  { id: 'ceramic', name: 'Ceramic White', primary: '#ffffff', secondary: '#f1f5f9', accent: '#000000', text: '#09090b' },
  { id: 'neon', name: 'Cyber Neon', primary: '#050505', secondary: '#111111', accent: '#00ffcc', text: '#e2e8f0' },
  { id: 'royal', name: 'Royal Velvet', primary: '#170f11', secondary: '#2a171d', accent: '#e82561', text: '#ffe4e6' },
];

const LAYOUTS = [
  { id: 'bento', name: 'Bento Grid', desc: 'Modern card-based architecture' },
  { id: 'split', name: 'Split Screen', desc: 'High-impact dual visual hierarchy' },
  { id: 'minimal', name: 'Zen Focus', desc: 'Ultra-minimalist spacious design' },
];

const FONTS = [
  { id: 'sans', name: 'Inter', desc: 'Modern & Clean' },
  { id: 'display', name: 'Space Grotesk', desc: 'Technical & Bold' },
  { id: 'serif', name: 'Playfair', desc: 'Editorial & Elegant' },
  { id: 'mono', name: 'JetBrains Mono', desc: 'Developer & Brutalist' }
];

const BUTTONS = [
  { id: 'geometric', name: 'Geometric Clip', className: 'geometric-clip-button rounded-none' },
  { id: 'rounded', name: 'Pill Rounded', className: 'rounded-full' },
  { id: 'soft', name: 'Soft Edge', className: 'rounded-lg' },
];

export function CustomizationStudio() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Wizard Navigation Step
  const [currentStep, setCurrentStep] = useState(1);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Show draft restoration dialogue
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<any>(null);

  // Discovery Variables selections
  const [selections, setSelections] = useState({
    industry: '',
    businessGoals: [] as string[],
    projectType: '',
    selectedFeatures: [] as string[],
    integrations: [] as string[],
    competitors: [] as string[],
    budget: '',
    timeline: '',
    designDirection: 'Premium Elegant',
    theme: 'obsidian',
    layout: 'bento',
    font: 'display',
    buttonStyle: 'geometric'
  });

  // Client Identification fields
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // Competitor draft input
  const [competitorInput, setCompetitorInput] = useState('');

  // Session ID for anonymous abandoned tracking
  const [sessionId, setSessionId] = useState<string>('');

  // Generate unique session ID on init to track drafts
  useEffect(() => {
    let sId = localStorage.getItem('einort_proto_session_id');
    if (!sId) {
      sId = 'sess_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('einort_proto_session_id', sId);
    }
    setSessionId(sId);

    // Initial audit log
    logClientActivity(user?.uid || null, user?.email || null, 'started_prototype', `Loaded Discovery Engine for ${projectId || 'custom_architecture'}`);

    // Pre-fill email state if authenticated
    if (user) {
      setClientName(user.displayName || '');
      setClientEmail(user.email || '');
    }

    // Check for existing saved drafts in localStorage
    const savedDraft = localStorage.getItem('einort_blueprint_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed && parsed.currentStep > 1) {
          setPendingDraft(parsed);
          setShowResumeDialog(true);
        }
      } catch (e) {
        console.warn("Could not read saved draft:", e);
      }
    }
  }, [user, projectId]);

  // Sync draft progress on change
  useEffect(() => {
    if (currentStep > 1) {
      const draftObj = {
        sessionId,
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous',
        currentStep,
        selections,
        clientName,
        companyName,
        phoneNumber,
        clientEmail,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('einort_blueprint_draft', JSON.stringify(draftObj));

      // Asynchronously trigger Firestore draft progress update helper
      const syncDraftFirebase = async () => {
        try {
          const draftId = sessionId || 'draft_temp';
          await setDoc(doc(db, 'prototypeDrafts', draftId), {
            ...draftObj,
            status: 'abandoned', // default to abandoned until completely submitted
            updatedAt: serverTimestamp()
          });
        } catch (e) {
          console.warn("Failed syncing db draft telemetry:", e);
        }
      };
      syncDraftFirebase();
    }
  }, [currentStep, selections, clientName, companyName, phoneNumber, clientEmail, sessionId, user]);

  // Handle restoring a blueprint session
  const handleRestoreBlueprint = () => {
    if (pendingDraft) {
      setSelections(pendingDraft.selections);
      setCurrentStep(pendingDraft.currentStep);
      setClientName(pendingDraft.clientName || '');
      setCompanyName(pendingDraft.companyName || '');
      setPhoneNumber(pendingDraft.phoneNumber || '');
      setClientEmail(pendingDraft.clientEmail || '');
      
      logClientActivity(
        user?.uid || null, 
        user?.email || null, 
        'resumed_prototype', 
        `Resumed incomplete draft blueprint at Step ${pendingDraft.currentStep}`
      );
    }
    setShowResumeDialog(false);
  };

  const handleStartFreshBlueprint = () => {
    localStorage.removeItem('einort_blueprint_draft');
    setShowResumeDialog(false);
  };

  // Add Competitor links
  const addCompetitor = () => {
    if (competitorInput.trim() && !selections.competitors.includes(competitorInput.trim())) {
      setSelections({
        ...selections,
        competitors: [...selections.competitors, competitorInput.trim()]
      });
      setCompetitorInput('');
    }
  };

  const removeCompetitor = (tag: string) => {
    setSelections({
      ...selections,
      competitors: selections.competitors.filter(c => c !== tag)
    });
  };

  // Generate dynamic features recommended based on Industry Selection
  const availableFeatures = useMemo(() => {
    if (!selections.industry) return [];
    return INDUSTRY_FEATURES[selections.industry] || [];
  }, [selections.industry]);

  // Auto-fill or adjust features when industry changes
  const handleIndustryChange = (indId: string) => {
    const recommendedFeats = INDUSTRY_FEATURES[indId] || [];
    setSelections({
      ...selections,
      industry: indId,
      selectedFeatures: recommendedFeats // auto-toggle prefill for amazing consult experience
    });
    // Advancing step with minor premium delay feels extremely game-like!
    setTimeout(() => setCurrentStep(2), 250);
  };

  const handleProjectTypeChange = (typeId: string) => {
    setSelections({ ...selections, projectType: typeId });
    setTimeout(() => setCurrentStep(4), 250);
  };

  // Toggle Features with safety boundaries
  const toggleFeature = (feat: string) => {
    const currentList = selections.selectedFeatures;
    if (currentList.includes(feat)) {
      setSelections({ ...selections, selectedFeatures: currentList.filter(f => f !== feat) });
    } else {
      setSelections({ ...selections, selectedFeatures: [...currentList, feat] });
    }
  };

  // Toggle Integrations
  const toggleIntegration = (intId: string) => {
    const list = selections.integrations;
    if (list.includes(intId)) {
      setSelections({ ...selections, integrations: list.filter(i => i !== intId) });
    } else {
      setSelections({ ...selections, integrations: [...list, intId] });
    }
  };

  const toggleGoal = (goalId: string) => {
    const list = selections.businessGoals;
    if (list.includes(goalId)) {
      setSelections({ ...selections, businessGoals: list.filter(g => g !== goalId) });
    } else {
      setSelections({ ...selections, businessGoals: [...list, goalId] });
    }
  };

  // Compile final intelligence report details
  const generatedReport = useMemo(() => {
    const ind = selections.industry;
    let stack = ['React/Vite', 'Tailwind CSS', 'Firebase Cloud'];
    let roadmap = [
      { step: 'Phase I', title: 'Architecture Definition & Discovery Logs', dur: 'Weeks 1–2' },
      { step: 'Phase II', title: 'UX Wireframing & Responsive Interfaces Design', dur: 'Weeks 3–4' },
      { step: 'Phase III', title: 'Microservice API Setup & Secure DB Engineering', dur: 'Weeks 5–7' },
      { step: 'Phase IV', title: 'Deployment Orchestration & Verification Sync', dur: 'Weeks 8–10' }
    ];
    let recommendations = [
      'Implement edge servers to optimize visual content loading times.',
      'Utilize key performance indicators (KPIs) maps matching actual goals.'
    ];

    if (ind === 'healthcare') {
      stack = ['Next.js (SSG)', 'HIPAA Encrypted Cloud Engine', 'Tailwind', 'PostgreSQL Admin'];
      recommendations = [
        'Mandate end-to-end payload encrypting for compliance.',
        'Adopt biometric authentication tokens during doctor session authorization.'
      ];
    } else if (ind === 'finance') {
      stack = ['React/Vite Core', 'Plural Ledger API', 'Docker / Node CJS Server', ' सैन्य Layer WebAuthn'];
      recommendations = [
        'Secure communication streams with multi-tenant socket layers.',
        'Run daily automated penetration checking against critical balance nodes.'
      ];
    } else if (ind === 'ecommerce') {
      stack = ['Vite Single Page App', 'Stripe Multi-payment API', 'Algolia Search Node', 'Redis caching'];
      recommendations = [
        'Preload image matrix using cloud global edge distribution networks.',
        'Deploy smart dynamic cart alerts to reduce transaction bounce rates.'
      ];
    } else if (ind === 'hotel' || ind === 'restaurant') {
      stack = ['React Mobile-first View', 'Calendar reservation API', 'Twilio SMS automation', 'Supabase'];
      recommendations = [
        'Embed automated WhatsApp reminders during active booking state transitions.',
        'Sync table/room metrics with physical locations using real-time polling.'
      ];
    }

    // Add integrations specifically to tech stack
    selections.integrations.forEach(i => {
      const label = INTEGRATIONS.find(item => item.id === i)?.label || '';
      if (label) stack.push(label);
    });

    const completionRate = currentStep / 10;
    const finalScore = calculateLeadScore({
      budget: selections.budget,
      timeline: selections.timeline,
      industry: selections.industry,
      projectType: selections.projectType,
      featuresCount: selections.selectedFeatures.length,
      hasCompany: !!companyName,
      completionRate
    });

    const priorityLabel = getLeadStatus(finalScore);

    // Baseline value estimation
    let baseValue = 5000;
    if (selections.budget === '50k+') baseValue = 55000;
    else if (selections.budget === '15k-50k') baseValue = 30000;
    else if (selections.budget === '5k-15k') baseValue = 12000;
    else baseValue = 4000;

    const lengthMultiplier = 1 + (selections.selectedFeatures.length * 0.05);
    const estimatedValue = Math.round(baseValue * lengthMultiplier);

    return {
      stack,
      roadmap,
      recommendations,
      estimatedValue,
      finalScore,
      priorityLabel
    };
  }, [selections, currentStep, companyName]);

  // Final Action: Save deep enterprise discovery payload
  const handleBuild = useCallback(async () => {
    // If not authenticated, require registration before verifying high quality submission!
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (!clientName.trim() || !companyName.trim()) {
      setSubmitError('Verification requires both Full Name and Company Name.');
      return;
    }

    setIsBuilding(true);
    setSubmitError(null);

    try {
      const finalScore = generatedReport.finalScore;
      const priorityLabel = generatedReport.priorityLabel;
      const finalValue = generatedReport.estimatedValue;

      // Real Submission Payload complying to strict normalized schema
      const submissionRef = await addDoc(collection(db, 'projectSubmissions'), {
        userId: user.uid,
        clientName,
        email: clientEmail || user.email,
        company: companyName,
        phone: phoneNumber || 'Not Provided',
        industry: INDUSTRIES.find(i => i.id === selections.industry)?.label || selections.industry,
        businessGoals: selections.businessGoals,
        projectType: PROJECT_TYPES.find(p => p.id === selections.projectType)?.label || selections.projectType,
        selectedFeatures: selections.selectedFeatures,
        integrations: selections.integrations,
        competitors: selections.competitors,
        budget: BUDGET_RANGES.find(b => b.id === selections.budget)?.label || selections.budget,
        timeline: TIMELINES.find(t => t.id === selections.timeline)?.label || selections.timeline,
        urgency: selections.timeline === 'urgent' ? 'high' : 'standard',
        designDirection: selections.designDirection,
        recommendedStack: generatedReport.stack,
        complexityScore: finalScore > 75 ? 'High (Enterprise Class)' : finalScore > 40 ? 'Medium (Balanced Tier)' : 'Low (Standard Tier)',
        leadScore: finalScore,
        priority: priorityLabel,
        recommendedRoadmap: generatedReport.roadmap,
        deliverables: ['Responsive Web Framework', 'Integrated Configured API', 'Visual Database Scheme', 'Security Certification Doc'],
        scope: `Custom specialized ${selections.projectType} prototype engineered for ${selections.industry}. Powered by ${generatedReport.stack.slice(0,3).join(', ')}.`,
        requirementsSummary: `Client requested ${selections.selectedFeatures.length} core features and ${selections.integrations.length} third-party APIs. Visual alignment is ${selections.designDirection} using the ${selections.theme} blueprint.`,
        submissionHistory: [`Initialized: ${new Date().toLocaleDateString()}`, `Dossier Configured: ${new Date().toLocaleDateString()}`],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Synchronize back to Leads Collection (which feeds Admin CRM)
      await addDoc(collection(db, 'leads'), {
        userId: user.uid,
        name: clientName,
        contact: phoneNumber || clientEmail || user.email,
        email: clientEmail || user.email,
        value: finalValue,
        stage: 'new',
        date: new Date().toISOString().split('T')[0],
        status: priorityLabel, // 'Hot' | 'Warm' | 'Cold'
        score: finalScore,
        company: companyName,
        aiNote: `DISCOVERY DOSSIER SUBMISSION: Project is a custom ${selections.projectType} in the ${selections.industry} sector. Budget: $${finalValue}. Key Integrations: ${selections.integrations.join(', ') || 'None'}. Completed all 10 discovery steps successfully. Priority assigned: ${priorityLabel}.`,
        lastContact: new Date().toISOString().split('T')[0],
        forecast: priorityLabel === 'Hot' ? 80 : priorityLabel === 'Warm' ? 45 : 15,
        health: finalScore > 75 ? 'Accelerated' : 'On Track',
        createdAt: serverTimestamp()
      });

      // Mark Draft telemetry as completed
      if (sessionId) {
        await updateDoc(doc(db, 'prototypeDrafts', sessionId), {
          status: 'submitted',
          updatedAt: serverTimestamp()
        });
      }

      // Log complete client submission event
      await logClientActivity(
        user.uid, 
        user.email, 
        'submitted_project', 
        `Completed and verified Discovery Dossier (Est: $${finalValue})`
      );

      // Clear local states
      localStorage.removeItem('einort_blueprint_draft');
      setShowSuccess(true);
    } catch (e: any) {
      console.error("Transmission Error:", e);
      setSubmitError(e.message || 'Verification secure handshake failed. Try again.');
    } finally {
      setIsBuilding(false);
    }
  }, [user, clientName, companyName, phoneNumber, clientEmail, selections, generatedReport, sessionId]);

  // Derived styling helpers
  const activeThemeObj = useMemo(() => THEMES.find(t => t.id === selections.theme) || THEMES[0], [selections.theme]);
  const activeFontFamily = useMemo(() => {
    switch(selections.font) {
      case 'serif': return 'font-serif';
      case 'display': return 'font-display';
      case 'mono': return 'font-mono tracking-tight';
      default: return 'font-sans';
    }
  }, [selections.font]);
  const activeButtonClass = useMemo(() => BUTTONS.find(b => b.id === selections.buttonStyle)?.className || 'rounded-none', [selections.buttonStyle]);

  return (
    <div className="h-[100dvh] bg-dark flex flex-col lg:flex-row overflow-hidden font-sans text-white relative">
      <SEO title="Discovery Architect | EINORT SOLUTIONS" />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* RETHINK RESUME DIALOGUE BOX */}
      <AnimatePresence>
        {showResumeDialog && (
          <div className="fixed inset-0 z-[110] bg-dark/95 backdrop-blur-2xl flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/[0.02] border border-white/10 p-6 md:p-8 rounded-2xl max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-[50px] pointer-events-none" />
              <Sliders className="w-10 h-10 text-premium-gold mb-4" />
              <h2 className="text-xl font-display font-medium text-white mb-2">Restore Discovery Blueprint?</h2>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-6">
                An unfinished architectural configuration was recovered from a previous session (Step {pendingDraft?.currentStep}/10). Would you like to resume?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={handleRestoreBlueprint} 
                  className="flex-1 py-3 bg-white text-dark text-xs font-mono font-semibold uppercase tracking-widest hover:bg-white/90 rounded transition-all"
                >
                  Resume Blueprint
                </button>
                <button 
                  onClick={handleStartFreshBlueprint} 
                  className="px-4 py-3 border border-white/10 hover:bg-white/5 text-white/50 hover:text-white text-xs font-mono font-semibold uppercase tracking-widest rounded transition-all"
                >
                  Start Fresh
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONTROLS SIDEBAR (RIGHT) */}
      <div className="w-full lg:w-[460px] bg-dark/95 backdrop-blur-3xl border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col h-full shrink-0 relative lg:order-2 overflow-hidden shadow-2xl">
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        
        {/* Step Indicator Top */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (currentStep > 1) setCurrentStep(currentStep - 1);
                else navigate(-1);
              }}
              className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-left">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block">Corporate Protocol Context</span>
              <span className="text-[12px] font-display font-medium text-premium-gold font-bold">Step {currentStep} of 10</span>
            </div>
          </div>
          
          <div className="text-[10px] font-mono px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-premium-gold animate-pulse" />
            Discovery Mode
          </div>
        </div>

        {/* Global Blueprint Progress Bar */}
        <div className="w-full h-[2px] bg-white/5 shrink-0">
          <div className="h-full bg-premium-gold transition-all duration-300" style={{ width: `${(currentStep / 10) * 100}%` }} />
        </div>

        {/* STEP CONTENT SWITCHBOARD */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: INDUSTRY */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-6">
                  <div className="w-8 h-8 rounded-lg bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mb-3">
                    <Building className="w-4 h-4 text-premium-gold" />
                  </div>
                  <h3 className="text-lg font-display text-white font-medium tracking-tight mb-2">Select Industry Sector</h3>
                  <p className="text-xs text-white/50 leading-relaxed">Let us know the environment your software will optimize. Your selection dynamically transforms the feature palette recommendations.</p>
                </div>

                <div className="space-y-2">
                  {INDUSTRIES.map(ind => {
                    const Icon = ind.icon;
                    return (
                      <button
                        key={ind.id}
                        onClick={() => handleIndustryChange(ind.id)}
                        className={`w-full p-3 text-left rounded-xl border flex items-start gap-3 transition-all duration-200 group ${selections.industry === ind.id ? 'border-premium-gold bg-premium-gold/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                      >
                        <div className={`p-2 rounded-lg border shrink-0 transition-colors ${selections.industry === ind.id ? 'border-premium-gold/40 text-premium-gold' : 'border-white/10 text-white/50 bg-black/10'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-display font-medium text-xs block mb-0.5 text-white">{ind.label}</span>
                          <span className="text-[10px] text-white/40 block leading-tight truncate">{ind.desc}</span>
                        </div>
                        {selections.industry === ind.id && (
                          <div className="w-4 h-4 rounded-full bg-premium-gold flex items-center justify-center shrink-0 mt-2">
                            <Check className="w-2.5 h-2.5 text-dark" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: BUSINESS GOALS */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-6">
                  <div className="w-8 h-8 rounded-lg bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mb-3">
                    <Target className="w-4 h-4 text-premium-gold" />
                  </div>
                  <h3 className="text-lg font-display text-white font-medium tracking-tight mb-2">Define Business Goals</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">Choose the main objectives you expect this platform to handle. You can highlight several options.</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {GOALS.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`w-full p-4 text-left rounded-xl border flex items-center justify-between transition-all duration-200 ${selections.businessGoals.includes(goal.id) ? 'border-premium-gold bg-premium-gold/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                      <span className="text-xs font-medium text-white/95">{goal.label}</span>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${selections.businessGoals.includes(goal.id) ? 'border-premium-gold bg-premium-gold text-dark' : 'border-white/20'}`}>
                        {selections.businessGoals.includes(goal.id) && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: PROJECT TYPE */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-6">
                  <div className="w-8 h-8 rounded-lg bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mb-3">
                    <Sliders className="w-4 h-4 text-premium-gold" />
                  </div>
                  <h3 className="text-lg font-display text-white font-medium tracking-tight mb-2">Platform Typology</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">Determine the structural foundation of the architectural prototype.</p>
                </div>

                <div className="space-y-2">
                  {PROJECT_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => handleProjectTypeChange(type.id)}
                      className={`w-full p-4 text-left rounded-xl border flex items-center justify-between transition-all duration-200 ${selections.projectType === type.id ? 'border-premium-gold bg-premium-gold/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                      <span className="text-xs font-semibold text-white">{type.label}</span>
                      {selections.projectType === type.id && (
                        <div className="w-5 h-5 rounded-full bg-premium-gold flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-dark" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: CORE FEATURES */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-6">
                  <div className="w-8 h-8 rounded-lg bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4 text-premium-gold" />
                  </div>
                  <h3 className="text-lg font-display text-white font-medium tracking-tight mb-2">Dynamic Recommended Features</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">These features are dynamically curated based on your chosen sector (<span className="text-premium-gold capitalize font-medium">{selections.industry || 'Global'}</span>).</p>
                </div>

                <div className="space-y-2 mb-6">
                  {availableFeatures.map(feat => (
                    <button
                      key={feat}
                      onClick={() => toggleFeature(feat)}
                      className={`w-full p-4 text-left rounded-xl border flex items-center justify-between transition-all duration-200 ${selections.selectedFeatures.includes(feat) ? 'border-premium-gold bg-premium-gold/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                      <span className="text-xs font-medium text-white">{feat}</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selections.selectedFeatures.includes(feat) ? 'border-premium-gold bg-premium-gold text-dark' : 'border-white/20'}`}>
                        {selections.selectedFeatures.includes(feat) && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: INTEGRATIONS */}
            {currentStep === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-6">
                  <div className="w-8 h-8 rounded-lg bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mb-3">
                    <Layers className="w-4 h-4 text-premium-gold" />
                  </div>
                  <h3 className="text-lg font-display text-white font-medium tracking-tight mb-2">Platform Integrations</h3>
                  <p className="text-xs text-white/50 leading-relaxed">Synchronize your software with leading global digital services & databases.</p>
                </div>

                <div className="space-y-2">
                  {INTEGRATIONS.map(int => (
                    <button
                      key={int.id}
                      onClick={() => toggleIntegration(int.id)}
                      className={`w-full p-4 text-left rounded-xl border flex items-center justify-between transition-all duration-200 ${selections.integrations.includes(int.id) ? 'border-premium-gold bg-premium-gold/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                      <span className="text-xs font-medium text-white">{int.label}</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selections.integrations.includes(int.id) ? 'border-premium-gold bg-premium-gold text-dark' : 'border-white/20'}`}>
                        {selections.integrations.includes(int.id) && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 6: COMPETITORS */}
            {currentStep === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-6">
                  <div className="w-8 h-8 rounded-lg bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mb-3">
                    <LinkIcon className="w-4 h-4 text-premium-gold" />
                  </div>
                  <h3 className="text-lg font-display text-white font-medium tracking-tight mb-2">Competitors & Inspiration</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">Input reference websites, inspirational links, or competing platforms so we can audit their gaps.</p>
                </div>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={competitorInput}
                    onChange={(e) => setCompetitorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCompetitor();
                      }
                    }}
                    placeholder="e.g. competitor.com"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-premium-gold"
                  />
                  <button 
                    onClick={addCompetitor}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-mono rounded-lg tracking-widest uppercase"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {selections.competitors.length === 0 ? (
                    <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-white/40 text-xs">
                      No reference links highlighted yet.
                    </div>
                  ) : (
                    selections.competitors.map(tag => (
                      <div key={tag} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl text-xs">
                        <span className="truncate text-white/80 font-mono">{tag}</span>
                        <button 
                          onClick={() => removeCompetitor(tag)}
                          className="text-red-400 hover:text-red-300 font-mono font-bold text-xs px-2 py-0.5"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 7: BUDGET RANGE */}
            {currentStep === 7 && (
              <motion.div key="step7" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-6">
                  <div className="w-8 h-8 rounded-lg bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mb-3">
                    <DollarSign className="w-4 h-4 text-premium-gold" />
                  </div>
                  <h3 className="text-lg font-display text-white font-medium tracking-tight mb-2">Budget Matrix</h3>
                  <p className="text-xs text-white/50 leading-relaxed">Let us align your infrastructure complexity estimate with available corporate funding scopes.</p>
                </div>

                <div className="space-y-2.5">
                  {BUDGET_RANGES.map(range => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setSelections({ ...selections, budget: range.id });
                        setTimeout(() => setCurrentStep(8), 250);
                      }}
                      className={`w-full p-4 text-left rounded-xl border flex flex-col gap-1 transition-all duration-200 ${selections.budget === range.id ? 'border-premium-gold bg-premium-gold/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-display font-medium text-xs text-white">{range.label}</span>
                        {selections.budget === range.id && <div className="w-1.5 h-1.5 rounded-full bg-premium-gold" />}
                      </div>
                      <span className="text-[10px] text-white/40 leading-none">{range.scale}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 8: TIMELINE */}
            {currentStep === 8 && (
              <motion.div key="step8" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-6">
                  <div className="w-8 h-8 rounded-lg bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mb-3">
                    <Clock className="w-4 h-4 text-premium-gold" />
                  </div>
                  <h3 className="text-lg font-display text-white font-medium tracking-tight mb-2">Engineering Delivery Timeline</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">Determine the expected launch protocol delivery phase.</p>
                </div>

                <div className="space-y-2">
                  {TIMELINES.map(timeline => (
                    <button
                      key={timeline.id}
                      onClick={() => {
                        setSelections({ ...selections, timeline: timeline.id });
                        setTimeout(() => setCurrentStep(9), 250);
                      }}
                      className={`w-full p-4 text-left rounded-xl border flex items-center justify-between transition-all duration-200 ${selections.timeline === timeline.id ? 'border-premium-gold bg-premium-gold/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                      <span className="text-xs font-medium text-white">{timeline.label}</span>
                      {selections.timeline === timeline.id && <div className="w-1.5 h-1.5 bg-premium-gold rounded-full" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 9: DESIGN & AESTHETIC DIRECTION */}
            {currentStep === 9 && (
              <motion.div key="step9" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-6">
                  <div className="w-8 h-8 rounded-lg bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mb-3">
                    <Palette className="w-4 h-4 text-premium-gold" />
                  </div>
                  <h3 className="text-lg font-display text-white font-medium tracking-tight mb-2">Design & Visual Aesthetics</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">Customize the visual mood, layout structures, and core typographies to align with corporate guidelines.</p>
                </div>

                <div className="space-y-4">
                  {/* Theme Selector */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">Color Blueprint</label>
                    <div className="grid grid-cols-2 gap-2">
                      {THEMES.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setSelections({...selections, theme: theme.id})}
                          className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${selections.theme === theme.id ? 'border-white bg-white/10' : 'border-white/5 hover:border-white/15 bg-white/5'}`}
                        >
                          <span className="text-[11px] truncate whitespace-nowrap text-white/90">{theme.name}</span>
                          <div className="w-3.5 h-3.5 rounded-full flex overflow-hidden shrink-0">
                            <div className="w-1.5 h-full" style={{backgroundColor: theme.primary}} />
                            <div className="w-1 h-full" style={{backgroundColor: theme.secondary}} />
                            <div className="w-1 h-full" style={{backgroundColor: theme.accent}} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Layout Selector */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">Layout Architecture</label>
                    <div className="space-y-1.5">
                      {LAYOUTS.map(layout => (
                        <button
                          key={layout.id}
                          onClick={() => setSelections({...selections, layout: layout.id})}
                          className={`w-full p-3 rounded-lg border flex items-center justify-between transition-all ${selections.layout === layout.id ? 'border-white bg-white/10' : 'border-white/5 hover:border-white/15 bg-white/5'}`}
                        >
                          <div className="text-left">
                            <span className="text-[11px] block text-white/90 font-medium">{layout.name}</span>
                            <span className="text-[9px] text-white/40 block leading-none">{layout.desc}</span>
                          </div>
                          {selections.layout === layout.id && <Check className="w-3.5 h-3.5 text-premium-gold" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typography Selector */}
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">Typography Pack</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FONTS.map(font => (
                        <button
                          key={font.id}
                          onClick={() => setSelections({...selections, font: font.id})}
                          className={`p-3 rounded-lg border text-left transition-all ${selections.font === font.id ? 'border-white bg-white/10' : 'border-white/5 hover:border-white/15 bg-white/5'}`}
                        >
                          <span className={`text-sm block text-white/90 ${font.id === 'serif' ? 'font-serif' : font.id === 'display' ? 'font-display' : font.id === 'mono' ? 'font-mono' : 'font-sans'}`}>{font.name}</span>
                          <span className="text-[9px] text-white/40 block whitespace-nowrap overflow-hidden text-ellipsis">{font.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 10: ARCHITECTURE DOSSIER SUMMARY */}
            {currentStep === 10 && (
              <motion.div key="step10" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                <div className="mb-6">
                  <div className="w-8 h-8 rounded-lg bg-premium-gold/10 border border-premium-gold/20 flex items-center justify-center mb-3">
                    <ShieldAlert className="w-4 h-4 text-premium-gold" />
                  </div>
                  <h3 className="text-lg font-display text-white font-medium tracking-tight mb-2">Discovery Dossier Summary</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">Confirm your corporate parameters and verify identification to register your discovery ticket.</p>
                </div>

                {/* Secure Dossier Data Card */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-premium-gold/5 blur-[40px] pointer-events-none" />
                  
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono text-white/45 uppercase">Complexity Match</span>
                    <span className="text-[11px] font-mono text-premium-gold font-bold">{generatedReport.finalScore}% Rating</span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono text-white/45 uppercase">Recommended Tier</span>
                    <span className="text-[11px] font-mono text-white font-semibold">
                      {generatedReport.priorityLabel === 'Hot' ? 'Hot / Accelerated' : generatedReport.priorityLabel === 'Warm' ? 'Warm / Recommended' : 'Cold / Standard'}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono text-white/45 uppercase">Platform Scope</span>
                    <span className="text-[11px] font-mono text-white font-semibold capitalize">{selections.projectType || 'Standard Application'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[10px] font-mono text-white/45 uppercase">Est. Development</span>
                    <span className="text-[11px] font-mono text-white font-semibold">8–12 Weeks</span>
                  </div>
                </div>

                {/* Corporate Partner Contact Details Form */}
                <div className="space-y-3.5">
                  <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] text-premium-gold font-semibold">Client Identity Identification</h4>
                  
                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/30 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-premium-gold"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/30 block mb-1">Company / Institution</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-premium-gold"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono uppercase tracking-widest text-white/30 block mb-1">Direct Phone Line</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +1 (555) 0192"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-premium-gold"
                    />
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* SIDEBAR FOOTER (NAVIGATION BUTTONS) */}
        <div className="p-4 lg:p-5 border-t border-white/5 bg-dark relative z-30 shrink-0">
          {submitError && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] uppercase">
              ⚠️ Synced Error: {submitError}
            </div>
          )}

          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-3 border border-white/15 hover:bg-white/5 text-white/60 hover:text-white text-xs font-mono font-semibold uppercase tracking-widest rounded-lg transition-all"
              >
                Back
              </button>
            )}

            {currentStep < 10 ? (
              <button
                onClick={() => {
                  // Guard step constraints
                  if (currentStep === 1 && !selections.industry) {
                    setSubmitError('Please point to an industry sector to proceed.');
                    return;
                  }
                  if (currentStep === 3 && !selections.projectType) {
                    setSubmitError('Please specify a platform typology.');
                    return;
                  }
                  setSubmitError(null);
                  setCurrentStep(currentStep + 1);
                }}
                className="flex-grow py-3 bg-white hover:bg-white/90 text-dark text-xs font-mono font-semibold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleBuild}
                disabled={isBuilding}
                className="flex-grow py-3 bg-premium-gold hover:bg-premium-gold/90 text-dark text-xs font-mono font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
              >
                {isBuilding ? 'Syncing...' : 'Verify & Setup Protocol'} <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PREVIEW CONTAINER CANVAS (LEFT) */}
      <div className="flex-1 lg:order-1 w-full h-[100dvh] lg:h-screen relative overflow-hidden bg-dark transition-colors duration-1000 flex flex-col">
        
        {/* Editor Top Bar */}
        <div className="h-14 border-b border-white/5 bg-dark/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 z-10 shrink-0 relative">
          <div className="flex items-center gap-2 text-white/60 font-sans text-[11px] lg:text-xs font-medium truncate">
            <button 
              onClick={() => {
                if (currentStep > 1) setCurrentStep(currentStep - 1);
                else navigate(-1);
              }}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-white mr-1 shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline">Active Architectural Dossier</span>
            <span className="opacity-40 hidden sm:inline">/</span> 
            <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest truncate">{selections.industry || 'global'}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 shrink-0">
            <button onClick={() => setDeviceView('desktop')} className={`px-3 py-1.5 rounded transition-all ${deviceView === 'desktop' ? 'bg-white/10 text-white' : 'text-white/60'}`}>
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setDeviceView('mobile')} className={`px-3 py-1.5 rounded transition-all ${deviceView === 'mobile' ? 'bg-white/10 text-white' : 'text-white/60'}`}>
              <SmartphoneIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Canvas Grid Background */}
        <div className="absolute inset-0 bg-[#070B16] z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none animate-pulse" />
        </div>

        {/* RENDER DYNAMIC CANVAS */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-8 z-10 relative">
          <motion.div 
            key={`${deviceView}-${selections.industry}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 relative flex flex-col shrink-0 ${deviceView === 'mobile' ? 'w-full max-w-[340px] h-[580px] border-8 border-dark shadow-black' : 'w-full lg:max-w-4xl min-h-[480px] lg:min-h-[520px] border border-white/5 bg-slate-950'}`}
            style={{ backgroundColor: activeThemeObj.primary }}
          >
            {/* Top Browser header */}
            {deviceView === 'desktop' && (
              <div className="h-10 border-b flex items-center px-4 gap-3 bg-black/15" style={{ borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 12%, transparent)`}}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <div className="flex-1 max-w-xs mx-auto h-6 rounded bg-black/20 flex items-center justify-center border border-white/5 text-[10px] font-mono tracking-wider opacity-40 text-white">
                  <Code className="w-2.5 h-2.5 mr-1" /> einort_preview.local
                </div>
              </div>
            )}

            {/* LIVE CONFIG PREVIEW CANVAS CONTENT */}
            <div className={`p-6 sm:p-10 flex-1 overflow-y-auto ${activeFontFamily}`} style={{ color: activeThemeObj.text }}>
              
              {/* Dynamic Header */}
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: activeThemeObj.accent }}>
                    <div className="w-2 h-2 bg-white rounded-full mix-blend-exclusion" />
                  </div>
                  <span className="font-bold tracking-tight text-sm">EINORT Preview</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50">
                  {selections.projectType || 'Website'}
                </span>
              </div>

              {/* Dynamic Hero Area */}
              <div className="max-w-xl relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border mb-4 text-[10px] font-mono" style={{ borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 25%, transparent)`, color: activeThemeObj.accent, backgroundColor: `color-mix(in srgb, ${activeThemeObj.accent} 8%, transparent)` }}>
                  <Sparkles className="w-3 h-3" /> Active Protocol: {selections.industry || 'Digital Transformation'}
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-semibold mb-3 tracking-tight leading-tight">
                  Premium {INDUSTRIES.find(i => i.id === selections.industry)?.label || 'Aesthetic Systems'} <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${activeThemeObj.text}, ${activeThemeObj.accent})` }}>
                    Engineered at Scale.
                  </span>
                </h1>
                
                <p className="text-[11px] sm:text-xs opacity-70 leading-relaxed mb-6 font-light">
                  Customized for maximum corporate value. Currently aligning {selections.selectedFeatures.length} core features and integrating secure endpoints.
                </p>

                {/* Simulated Custom Toggles or Elements */}
                {selections.selectedFeatures.length > 0 && (
                  <div className="mb-6">
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block mb-1.5">Activated Modules</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selections.selectedFeatures.map(f => (
                        <span key={f} className="px-2 py-1 bg-white/5 border border-white/5 text-[9px] rounded font-mono truncate text-white/70">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Standard Call to Action */}
                <div className="flex items-center gap-2">
                  <button className={`px-4 py-2 text-xs font-semibold ${activeButtonClass} transition-transform`} style={{ backgroundColor: activeThemeObj.text, color: activeThemeObj.primary }}>
                    Launch Dashboard
                  </button>
                  <button className="px-4 py-2 text-xs font-mono text-white bg-transparent border border-white/10 rounded">
                    Security Policy
                  </button>
                </div>
              </div>

              {/* BENTO GRID SIMULATION FOR THE LAYOUT */}
              {selections.layout === 'bento' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10 relative z-10">
                  <div className="sm:col-span-2 p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: activeThemeObj.secondary, borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 15%, transparent)` }}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-medium text-white">Dynamic Database Records</span>
                      <Activity className="w-3.5 h-3.5 text-white/40" />
                    </div>
                    <div className="h-10 border border-dashed opacity-25 rounded flex items-center justify-center text-[10px] uppercase font-mono">
                      Query logs synced
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: activeThemeObj.secondary, borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 15%, transparent)` }}>
                    <span className="text-[10px] font-mono text-white/40 block mb-2 uppercase">Systems integrity</span>
                    <div className="flex gap-1 items-end h-8">
                      {[30, 80, 50, 90].map((h, i) => (
                        <div key={i} className="flex-1 opacity-25" style={{ height: `${h}%`, backgroundColor: activeThemeObj.accent }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selections.layout === 'split' && (
                <div className="flex flex-col sm:flex-row gap-3 mt-10 relative z-10">
                  <div className="flex-1 p-5 rounded-xl border flex flex-col justify-end" style={{ backgroundColor: activeThemeObj.secondary, borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 15%, transparent)` }}>
                    <h4 className="text-sm font-semibold mb-1 text-white">Consolidated Analytics</h4>
                    <p className="text-[10px] text-white/50">Core server status tracks latency, quotas, and lead scoring integrity dynamically.</p>
                  </div>
                  <div className="flex-1 p-5 rounded-xl border flex items-center justify-center flex-col text-center" style={{ backgroundColor: activeThemeObj.accent, color: activeThemeObj.primary }}>
                    <Wand2 className="w-5 h-5 mb-1 opacity-80 animate-bounce" />
                    <span className="text-xs font-semibold uppercase font-mono tracking-widest">Interactive Sync</span>
                  </div>
                </div>
              )}

              {selections.layout === 'minimal' && (
                <div className="mt-12 py-6 border-t border-b text-center text-xs opacity-50 relative z-10" style={{ borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 15%, transparent)` }}>
                  System Focus active. Multi-tenant dashboard synchronization successfully compiled on preview viewport.
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>

      {/* VERIFIED SUCCESS SCREEN OVERLAY */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-dark/95 backdrop-blur-3xl flex items-center justify-center px-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 max-w-xl w-full text-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-premium-gold/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 border border-green-400 rounded-full animate-ping opacity-25" />
                <Check className="w-6 h-6 text-green-400" />
              </div>

              <h2 className="text-2xl font-display font-medium text-white mb-2 tracking-tight">Discovery Dossier Transmitted</h2>
              <p className="text-white/60 font-sans font-light leading-relaxed mb-6 text-xs sm:text-sm">
                Your consulting requirements have been processed by the EINORT Architect Engine. Your priority match has been categorized as <span className="text-premium-gold uppercase font-mono font-bold">{generatedReport.priorityLabel}</span>.
              </p>

              <div className="bg-dark/50 border border-white/5 p-4 rounded-xl text-left mb-6 space-y-2">
                <span className="text-[10px] font-mono uppercase text-white/40 block pb-1 border-b border-white/5">Active Synthesis Log</span>
                <div className="flex justify-between text-xs font-sans text-white/80">
                  <span>Authorized Partner:</span>
                  <span className="text-white font-medium">{clientName} ({companyName})</span>
                </div>
                <div className="flex justify-between text-xs font-sans text-white/80">
                  <span>Match Score:</span>
                  <span className="text-premium-gold font-mono font-bold">{generatedReport.finalScore}/100</span>
                </div>
                <div className="flex justify-between text-xs font-sans text-white/80">
                  <span>Technology Stack:</span>
                  <span className="text-white text-[10px] font-mono truncate max-w-[240px] block">{generatedReport.stack.join(', ')}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-3.5 bg-white text-dark text-xs font-mono font-bold uppercase tracking-widest hover:bg-white/90 rounded-lg transition-colors shadow-lg"
              >
                Enter Personal Client Console
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
