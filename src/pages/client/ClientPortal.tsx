import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { 
  FileText, CheckCircle2, Clock, Download, ArrowRight, Activity, 
  CalendarDays, Loader2, MessageSquare, Bell, Settings, 
  CreditCard, FolderOpen, Video, Send, LogOut, ChevronRight,
  TrendingUp, Award, Layers, AlertCircle, Sparkles, Building2, Smartphone
} from 'lucide-react';
import { CinematicTransition } from '../../components/CinematicTransition';

// Standardized Interface for both Sandbox & Custom Build Submissions
interface Project {
  id: string;
  type: 'sandbox' | 'custom';
  title?: string;
  projectId?: string;
  status: string;
  createdAt: any;
  progress?: number;
  
  // Custom specs payload mapping
  fullName?: string;
  clientName?: string;
  company?: string;
  email?: string;
  phone?: string;
  industry?: string;
  category?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  description?: string;
  features?: string[];
  selectedFeatures?: string[];
  integrations?: string[];
  suggestedStack?: string[];
  recommendedStack?: string[];
  estimatedCost?: number;
  projectPhases?: string[];
  aiComplexity?: string;
  priority?: string;
  requirementsSummary?: string;
  adminNotes?: string; 
  milestonesCompleted?: string[];
  missingRequirements?: string[];
  highRiskBlockers?: string;
  complexityScore?: string;
  scope?: string;
  timelineEst?: string;
}

const MOCK_MESSAGES = [
  { id: 1, text: "The latest prototype looks fantastic. Proceeding to architectural review.", sender: "Rheinard N.", time: "10:24 AM" },
  { id: 2, text: "Awesome. I'll review the technical roadmap tonight.", sender: "Client", time: "10:30 AM" },
  { id: 3, text: "Your requirements dossier is currently matching hot priority criteria.", sender: "Rheinard N.", time: "11:15 AM" }
];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Milestone 1 Approved: System Architecture Completed", time: "2h ago", read: false },
  { id: 2, text: "New Deliverable: High-Fidelity Prototype Document", time: "1d ago", read: true },
];

export function ClientPortal() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'deliverables' | 'messages' | 'settings'>('overview');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Real-Time Subscriptions for Both Collections with automatic synchronization & clean-up
  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;
    
    // Sandbox Query Match User
    const qSandbox = query(
      collection(db, 'projectSubmissions'), 
      where('userId', '==', user.uid)
    );
    
    // Custom Build Query Match User
    const qCustom = query(
      collection(db, 'customProjects'), 
      where('userId', '==', user.uid)
    );
    
    let sandboxProjects: Project[] = [];
    let customProjects: Project[] = [];
    
    const updateMergedList = () => {
      if (!isMounted) return;
      
      const merged = [
        ...sandboxProjects.map(p => ({ ...p, type: 'sandbox' as const })),
        ...customProjects.map(p => ({ ...p, type: 'custom' as const }))
      ].sort((a, b) => {
        const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return tB - tA;
      });

      setProjects(merged);
      
      // Select the first project if no active ID is chosen yet
      if (merged.length > 0 && !activeProjectId) {
        setActiveProjectId(merged[0].id);
      }
      
      setInitialLoad(false);
    };

    const unsubSandbox = onSnapshot(qSandbox, (snap) => {
      sandboxProjects = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      updateMergedList();
    }, (err) => {
      console.warn("ClientPortal sandbox realtime subscription failed:", err);
    });

    const unsubCustom = onSnapshot(qCustom, (snap) => {
      customProjects = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      updateMergedList();
    }, (err) => {
      console.warn("ClientPortal custom realtime subscription failed:", err);
    });

    return () => {
      isMounted = false;
      unsubSandbox();
      unsubCustom();
    };
  }, [user]);

  // Keep active project details synced
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  const getProgress = (project: Project) => {
    if (project.progress !== undefined) return project.progress;
    if (project.status === 'completed') return 100;
    if (project.status === 'active') return 45;
    return 15;
  };

  const getPhaseName = (project: Project) => {
    if (project.status === 'completed') return 'Deployment & Technical Handoff';
    if (project.status === 'active') return 'Dev Integration & Engineering';
    if (project.status === 'pending') return 'Architectural Discovery & Planning';
    return 'Dossier Validation';
  };

  if (authLoading || (!user && authLoading)) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center pt-24 text-white">
        <div className="w-12 h-12 border-2 border-premium-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <CinematicTransition>
      <div className="min-h-screen bg-[#070707] text-white pt-28 pb-20 selection:bg-premium-gold/30">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* TOP BAR / GREETINGS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-white/5 pb-6">
            <div>
              <p className="text-xs font-mono tracking-widest text-premium-gold uppercase mb-1">Authenticated Client Portal</p>
              <h1 className="text-3xl font-display font-medium text-white">
                Workspace: <span className="text-premium-gold">{user?.displayName || 'Partner'}</span>
              </h1>
            </div>
            
            {/* Quick Action Tabs */}
            {activeProject && (
              <div className="flex flex-wrap items-center bg-[#111] p-1 rounded-xl border border-white/5">
                {[
                  { id: 'overview', icon: Activity, label: 'Overview' },
                  { id: 'deliverables', icon: FolderOpen, label: 'Blueprint Assets' },
                  { id: 'messages', icon: MessageSquare, label: 'Architect Sync' },
                  { id: 'settings', icon: Settings, label: 'Settings' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-white/10 text-white font-semibold' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 text-premium-gold" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {initialLoad ? (
             <div className="grid lg:grid-cols-12 gap-8 animate-pulse">
               <div className="lg:col-span-4 space-y-4">
                 <div className="h-12 bg-white/5 rounded-xl"></div>
                 <div className="h-64 bg-white/5 rounded-xl"></div>
               </div>
               <div className="lg:col-span-8 space-y-6">
                 <div className="h-48 bg-white/5 rounded-[2rem]"></div>
                 <div className="h-96 bg-white/5 rounded-[2rem]"></div>
               </div>
             </div>
          ) : projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: MY PROJECTS SIDEBAR SELECTOR (4 COLS) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* PROJECT LIST PANEL */}
                <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-mono font-medium tracking-widest text-white/50 uppercase">My Submitted Projects ({projects.length})</h3>
                    <span className="text-[10px] bg-premium-gold/10 text-premium-gold px-2 py-0.5 rounded-full font-mono">Real-time</span>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {projects.map((proj) => {
                      const isSelected = proj.id === activeProjectId;
                      const title = proj.type === 'sandbox' 
                        ? (proj.projectType || 'Sandbox Prototype')
                        : (proj.title || 'Custom Enterprise Build');
                      const industry = proj.industry || 'General';
                      const dateStr = proj.createdAt?.toDate 
                        ? proj.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                        : (proj.createdAt ? new Date(proj.createdAt).toLocaleDateString() : 'Just now');
                      const budgetVal = proj.type === 'custom' && proj.estimatedCost 
                        ? `$${proj.estimatedCost.toLocaleString()}`
                        : (proj.budget || 'Discovery Stage');

                      return (
                        <div
                          key={proj.id}
                          onClick={() => setActiveProjectId(proj.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-gradient-to-r from-premium-gold/15 to-transparent border-premium-gold/40' 
                              : 'bg-[#111]/40 border-white/5 hover:border-white/10 hover:bg-[#111]/70'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                              proj.type === 'custom' 
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                : 'bg-premium-gold/10 text-premium-gold border border-premium-gold/20'
                            }`}>
                              {proj.type === 'custom' ? 'Custom Request' : 'Sandbox Blueprint'}
                            </span>
                            <span className="text-[10px] text-white/40 font-mono">{dateStr}</span>
                          </div>

                          <h4 className="font-medium text-sm text-white group-hover:text-premium-gold line-clamp-1">{title}</h4>
                          <p className="text-xs text-white/50 mt-1 font-mono">Industry: {industry}</p>
                          
                          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs font-mono text-premium-gold">{budgetVal}</span>
                            <span className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1 ${
                              proj.status === 'completed' ? 'text-green-400' :
                              proj.status === 'active' ? 'text-blue-400' : 'text-yellow-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                proj.status === 'completed' ? 'bg-green-400 animate-pulse' :
                                proj.status === 'active' ? 'bg-blue-400 animate-pulse' : 'bg-yellow-400 animate-pulse'
                              }`} />
                              {proj.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* NOTIFICATIONS & ACTIVITY MINI */}
                <NotificationsCard />

                {/* CONSULTATION BOOKING CARD */}
                <BookConsultationCard />

              </div>

              {/* RIGHT COLUMN: WORKSPACE DATA VIEW (8 COLS) */}
              <div className="lg:col-span-8 space-y-8">
                
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div 
                      key="overview-tab"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }} 
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      {/* ACTIVE STATUS BANNER */}
                      <div className="bg-gradient-to-r from-[#111] to-[#0a0a0a] p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-premium-gold/5 blur-[90px] rounded-full" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div>
                            <span className="text-[10px] font-mono text-premium-gold uppercase tracking-widest">Active Workspace Delivery</span>
                            <h2 className="text-2xl font-display font-medium text-white mt-1 mb-2">{getPhaseName(activeProject)}</h2>
                            <p className="text-xs text-white/50 leading-relaxed max-w-lg">
                              We are executing client directives for this blueprint. The delivery roadmap progresses in lockstep with the status configurations.
                            </p>
                          </div>
                          <div className="md:text-right shrink-0">
                            <p className="font-mono text-4xl font-light text-premium-gold">{getProgress(activeProject)}%</p>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest font-mono mt-0.5">COMPLETION SCALE</p>
                          </div>
                        </div>

                        {/* Premium Progress Meter */}
                        <div className="w-full h-1 bg-white/5 rounded-full mt-6 overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgress(activeProject)}%` }}
                            transition={{ duration: 1.0, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-premium-gold rounded-full" 
                          />
                        </div>
                      </div>

                      {/* ROADMAP / MILESTONES PROGRESSION */}
                      <MilestoneTimeline project={activeProject} />

                      {/* BENTO GRID SPECIFICATION DETAILS */}
                      <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* SPEC CARD 1: TECHNICAL PROFILE & STACK */}
                        <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <Layers className="w-4 h-4 text-premium-gold" />
                            <h3 className="text-xs font-mono font-medium text-white/70 uppercase tracking-wider">Software Stack & Spec</h3>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] font-mono text-white/40 uppercase">Architectural Stack</p>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {(activeProject.recommendedStack || activeProject.suggestedStack || ['React', 'TypeScript', 'Node.js', 'Firestore']).map((tech, idx) => (
                                  <span key={idx} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[11px] text-white/80 font-mono">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-[10px] font-mono text-white/40 uppercase mt-2">Complexity Classification</p>
                              <p className="text-xs text-white/95 font-medium mt-1">
                                {activeProject.complexityScore || activeProject.aiComplexity || 'Calculated High (Tier-1 Enterprise Class)'}
                              </p>
                            </div>

                            {activeProject.scope && (
                              <div>
                                <p className="text-[10px] font-mono text-white/40 uppercase">Scope Matrix</p>
                                <p className="text-xs text-white/60 leading-relaxed mt-1">{activeProject.scope}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* SPEC CARD 2: DOSSIER SPECS & INTEGRATIONS */}
                        <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 space-y-4">
                          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <Sparkles className="w-4 h-4 text-premium-gold" />
                            <h3 className="text-xs font-mono font-medium text-white/70 uppercase tracking-wider">Features & Directives</h3>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] font-mono text-white/40 uppercase">Selected Blueprint Features</p>
                              <div className="flex flex-wrap gap-1 mt-1.5 max-h-[85px] overflow-y-auto pr-1">
                                {(activeProject.selectedFeatures || activeProject.features || ['Secure Auth Gate', 'Unified Data Engine', 'Direct Integrations']).map((feat, idx) => (
                                  <span key={idx} className="bg-premium-gold/5 border border-premium-gold/20 px-2.5 py-0.5 rounded-full text-[10px] text-premium-gold/90 font-mono">
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-[10px] font-mono text-white/40 uppercase">External APIs / Integrations</p>
                              <p className="text-xs text-white/70 mt-1">
                                {activeProject.integrations && activeProject.integrations.length > 0 
                                  ? activeProject.integrations.join(', ')
                                  : 'Strategic Enterprise Integrations Attached'}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* CLIENT SPECS SUMMARY & DETAILS */}
                      <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 space-y-3">
                        <p className="text-xs font-mono font-medium text-premium-gold uppercase tracking-widest">Requirements Summary Dossier</p>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {activeProject.requirementsSummary || activeProject.description || "Dossier containing strict structural, backend integration, and compliance parameters compiled during rapid blueprinting."}
                        </p>
                        
                        {/* Summary details metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                          <div>
                            <span className="text-[10px] text-white/40 font-mono block">BUDGET ESTIMATE</span>
                            <span className="text-sm font-medium text-white mt-1 block">
                              {activeProject.type === 'custom' && activeProject.estimatedCost 
                                ? `$${activeProject.estimatedCost.toLocaleString()}` 
                                : (activeProject.budget || 'Discovery Stage')}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/40 font-mono block">DELIVERY TIMELINE</span>
                            <span className="text-sm font-medium text-white mt-1 block">
                              {activeProject.timeline || activeProject.timelineEst || '4-6 Weeks'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/40 font-mono block">PRIORITY TIER</span>
                            <span className="text-sm font-medium text-premium-gold mt-1 block uppercase">
                              {activeProject.priority || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-white/40 font-mono block">INDUSTRY SECTOR</span>
                            <span className="text-sm font-medium text-white mt-1 block">
                              {activeProject.industry || 'General'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ARCHITECT DIRECTIVE PANEL (FUTURE READY ADM NOTES) */}
                      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-2 h-2 rounded-full bg-premium-gold animate-pulse" />
                          <h4 className="text-xs font-mono font-medium tracking-widest text-premium-gold uppercase">Directive: Lead Architect Notes</h4>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed">
                          {activeProject.adminNotes || "Hello. Your blueprint submission has been fully received into the master pipeline and is under active planning compilation. The system requirements, selected feature sets, and estimated investment have been prioritized. No structural blocks exist. We will coordinate on direct system checkpoints."}
                        </p>
                        {activeProject.highRiskBlockers && (
                          <div className="mt-4 p-3 bg-red-950/20 border border-red-500/20 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-mono font-medium text-red-400 uppercase">Attention Required</p>
                              <p className="text-xs text-red-300 font-light mt-0.5">{activeProject.highRiskBlockers}</p>
                            </div>
                          </div>
                        )}
                      </div>

                    </motion.div>
                  )}

                  {/* BLUEPRINT DELIVERABLES VIEW */}
                  {activeTab === 'deliverables' && (
                    <motion.div 
                      key="deliverables-tab"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                    >
                      <DeliverablesCenter project={activeProject} />
                    </motion.div>
                  )}

                  {/* MESSAGES SYNC THERAD */}
                  {activeTab === 'messages' && (
                    <motion.div 
                      key="messages-tab"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                    >
                      <MessagesCenter />
                    </motion.div>
                  )}

                  {/* PROFILE / ACCOUNT SETTINGS */}
                  {activeTab === 'settings' && (
                    <motion.div 
                      key="settings-tab"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                    >
                      <ProfileSettings />
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>
          )}
        </div>
      </div>
    </CinematicTransition>
  );
}

// ------------------------------------------------------------------------------------------------
// ROADMAP TIMELINE COMPONENT
// ------------------------------------------------------------------------------------------------

function MilestoneTimeline({ project }: { project: Project }) {
  // Determine statuses for milestones
  const milestones = [
    { name: "discovery", label: "Dossier Discovery", status: 'completed', desc: "Comprehensive business specification collection." },
    { name: "planning", label: "Architectural Planning", status: project.status === 'pending' ? 'active' : 'completed', desc: "Figma layout, system scheme & database definitions." },
    { name: "development", label: "Dev & Integration", status: project.status === 'completed' ? 'completed' : project.status === 'active' ? 'active' : 'pending', desc: "Deployment to staging sandboxes and API hookups." },
    { name: "qa", label: "Audit & Refining", status: project.status === 'completed' ? 'completed' : 'pending', desc: "Manual pen testing, rule overrides, and response checks." },
    { name: "handover", label: "Production Release", status: project.status === 'completed' ? 'completed' : 'pending', desc: "Final source transfer and DNS routing live." }
  ];

  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 md:p-8">
      <h3 className="text-xs font-mono font-medium text-white/50 uppercase tracking-widest mb-8">Engineering Milestones Roadmap</h3>
      <div className="space-y-6">
        {milestones.map((m, idx) => {
          const isCompleted = m.status === 'completed';
          const isActive = m.status === 'active';
          
          return (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                  isCompleted ? 'bg-premium-gold border-premium-gold text-dark' : 
                  isActive ? 'border-premium-gold text-premium-gold bg-premium-gold/10' : 
                  'border-white/10 text-transparent bg-[#111]'
                }`}>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-premium-gold animate-ping" />}
                </div>
                {idx !== milestones.length - 1 && (
                  <div className={`w-[1px] h-12 my-1 ${isCompleted ? 'bg-premium-gold/40' : 'bg-white/5'}`} />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3">
                  <h4 className={`text-sm font-medium ${isActive ? 'text-white font-semibold' : isCompleted ? 'text-white/80' : 'text-white/40'}`}>
                    {m.label}
                  </h4>
                  {isActive && (
                    <span className="text-[9px] font-mono uppercase bg-premium-gold/10 text-premium-gold px-2 py-0.5 rounded tracking-widest animate-pulse">
                      Active Stage
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-1 font-light leading-relaxed">{m.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// EMPTY STATE COMPONENT
// ------------------------------------------------------------------------------------------------

function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="text-center py-24 px-6 border border-white/5 rounded-3xl bg-[#0a0a0a] max-w-xl mx-auto my-12">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10">
        <FolderOpen className="w-8 h-8 text-premium-gold" />
      </div>
      <h3 className="font-display text-2xl text-white mb-3">No Blueprint Deliveries Found</h3>
      <p className="text-white/50 text-sm font-light mb-8 max-w-sm mx-auto leading-relaxed">
        We have validated your identity, but you have no current discovery dossiers or custom builds. Initiate a new project specification to unlock delivery dashboards.
      </p>
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => navigate('/customization')}
          className="px-6 py-3 bg-gradient-to-r from-premium-gold/80 to-premium-gold text-dark font-medium text-sm rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          Prototyping Studio
        </button>
        <button 
          onClick={() => navigate('/custom-project')}
          className="px-6 py-3 bg-[#111] border border-white/10 text-white font-medium text-sm rounded-xl hover:bg-white/5 transition-all"
        >
          Request Custom Build
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// BLUEPRINT DELIVERABLES CENTER
// ------------------------------------------------------------------------------------------------

function DeliverablesCenter({ project }: { project: Project | null }) {
  const defaultFiles = [
    { name: "Requirements_Specifications.pdf", size: "2.4 MB", date: "Blueprint generated" },
    { name: "Core_System_Architecture_Layout.png", size: "1.1 MB", date: "System generated" },
    { name: "API_Contract_Technical_Draft.json", size: "45 KB", date: "Database schema" },
  ];

  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-display text-white">Deliverable Assets</h3>
          <p className="text-xs text-white/50 mt-1">Direct secure system compilation files download.</p>
        </div>
        <span className="text-[10px] font-mono text-premium-gold border border-premium-gold/30 px-2.5 py-0.5 rounded uppercase">Secure Access</span>
      </div>

      <div className="space-y-3">
        {defaultFiles.map((f, i) => (
          <div 
            key={i} 
            className="flex items-center justify-between p-4 rounded-xl bg-[#111]/40 border border-white/5 hover:border-premium-gold/30 hover:bg-[#111] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-premium-gold/10 transition-colors">
                <FileText className="w-5 h-5 text-white/60 group-hover:text-premium-gold transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">{f.name}</p>
                <p className="text-xs text-white/40 font-mono mt-0.5">{f.size} • {f.date}</p>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// MESSAGES ARCHITECT SYNC LIVE
// ------------------------------------------------------------------------------------------------

function MessagesCenter() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMsg = {
      id: messages.length + 1,
      text: inputText,
      sender: "Client",
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
  };

  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl flex flex-col h-[520px] overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center gap-4 bg-[#111]">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-premium-gold/20 flex items-center justify-center text-premium-gold font-mono border border-premium-gold/30">
            RN
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#111] rounded-full animate-pulse"></div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">Rheinard N.</h3>
          <p className="text-[9px] uppercase font-mono tracking-widest text-premium-gold">Principle Architect</p>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#070707]/60">
        {messages.map((msg, i) => {
          const isClient = msg.sender === 'Client';
          return (
            <div key={i} className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-xl text-xs leading-relaxed ${
                isClient 
                  ? 'bg-premium-gold text-dark rounded-br-none font-medium' 
                  : 'bg-[#111] border border-white/5 text-white/90 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-white/30 font-mono mt-1.5 uppercase tracking-wider">{msg.time}</span>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#111]">
        <div className="flex items-center gap-3 bg-[#070707] p-2 rounded-xl border border-white/5 focus-within:border-premium-gold/40 transition-colors">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Direct message to Lead Architect..." 
            className="flex-1 bg-transparent border-none text-xs text-white px-3 py-2 focus:outline-none focus:ring-0"
          />
          <button 
            type="submit" 
            className="w-10 h-10 rounded-lg bg-white text-dark hover:bg-premium-gold flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// PROFILE SETTINGS COMPONENT
// ------------------------------------------------------------------------------------------------

function ProfileSettings() {
  const { signOut } = useAuth();
  
  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-display text-white">Security & Workspace Settings</h3>
          <p className="text-xs text-white/50 mt-1">Configure company profiles and signout safe keys.</p>
        </div>
      </div>

      <div className="space-y-6">
        <label className="block">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-2">Company Name</span>
          <input 
            type="text" 
            disabled
            value="Enterprise Client Identity Verified" 
            className="w-full bg-[#111]/60 border border-white/5 rounded-xl px-4 py-3 text-xs text-white/60 focus:outline-none focus:border-premium-gold/50 cursor-not-allowed" 
          />
        </label>
        
        <label className="block font-mono">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-2">Portal Access Passkey</span>
          <div className="p-4 rounded-xl bg-premium-gold/5 border border-premium-gold/10 text-xs text-premium-gold/90">
            Validated via Federated Auth Verification Token
          </div>
        </label>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <button 
            onClick={signOut} 
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors font-mono uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" /> SECURE TERMINAL SIGNOUT
          </button>
          
          <span className="text-[10px] font-mono text-white/30 tracking-widest">EINORT SECURITY MODULE v1.2</span>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// NOTIFICATIONS BAR SUB-CARD
// ------------------------------------------------------------------------------------------------

function NotificationsCard() {
  return (
    <div className="bg-[#0b0b0b] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-premium-gold animate-bounce" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-white/50">Recent Logs</h3>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-premium-gold"></div>
      </div>
      <div className="space-y-4">
        {MOCK_NOTIFICATIONS.map((n, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-white/10' : 'bg-premium-gold bg-amber-400'}`} />
            <div>
              <p className={`text-xs ${n.read ? 'text-white/50' : 'text-white/90 font-medium'}`}>{n.text}</p>
              <p className="text-[9px] text-white/30 font-mono mt-0.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------------------------------------
// BOOK CONSULTATION LINK CARD
// ------------------------------------------------------------------------------------------------

function BookConsultationCard() {
  return (
    <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-premium-gold/5 rounded-full blur-2xl group-hover:bg-premium-gold/10 transition-colors"></div>
      <h3 className="text-md font-display text-white mb-1.5 relative z-10 font-medium">Need an Architectural Review?</h3>
      <p className="text-xs text-white/50 mb-5 relative z-10 leading-relaxed">
        Coordinate directly with Rheinard on system optimizations and custom schemas.
      </p>
      <button className="w-full flex items-center justify-center gap-2 bg-white text-dark py-2.5 rounded-xl text-xs font-semibold hover:bg-premium-gold transition-colors relative z-10">
        <Video className="w-3.5 h-3.5" /> Book 1-on-1 Review Sync
      </button>
    </div>
  );
}
