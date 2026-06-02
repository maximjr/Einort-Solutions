import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { 
  Layers, 
  ChevronRight, 
  Inbox, 
  Clock, 
  CheckCircle, 
  TerminalSquare, 
  ChevronDown, 
  X, 
  Activity, 
  User, 
  Cpu, 
  Search, 
  Compass, 
  Code,
  FileText,
  AlertOctagon,
  Users as UsersIcon,
  ShieldAlert,
  Sliders,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface ProjectOrder {
  id: string;
  type: 'sandbox' | 'custom';
  projectId?: string;
  title?: string;
  userEmail: string;
  userName?: string;
  status: string;
  createdAt: any;
  selections?: {
    theme: string;
    layout: string;
    font: string;
    buttonStyle?: string;
  };
  customDetails?: {
    industry: string;
    category: string;
    budget: string;
    timeline: string;
    suggestedStack: string[];
    complexity: string;
  };
  
  // Expanded Discovery Dossier
  clientName?: string;
  company?: string;
  phone?: string;
  industry?: string;
  businessGoals?: string[];
  projectType?: string;
  selectedFeatures?: string[];
  integrations?: string[];
  competitors?: string[];
  budget?: string;
  timeline?: string;
  urgency?: string;
  designDirection?: string;
  recommendedStack?: string[];
  complexityScore?: string;
  leadScore?: number;
  priority?: string;
  recommendedRoadmap?: { step: string; title: string; dur: string }[];
  deliverables?: string[];
  scope?: string;
  requirementsSummary?: string;
  submissionHistory?: string[];

  // Real operations fields (Phase 7D)
  assignedTeam?: string;
  progress?: number;
  milestonesCompleted?: string[];
  missingRequirements?: string[];
  highRiskBlockers?: string;
}

const TEAMS_LIST = [
  "Alpha Engineering Swarm",
  "NeuraCore MedTech Integration",
  "FinPredictive Analytics Guild",
  "Cortex Cybersec Swarm",
  "Velo Fleet Automations Team",
  "Enterprise SLA Delivery Unit"
];

const PRESET_MANDATORY_REQUIREMENTS = [
  "HIPAA Compliance NDA Sign-off",
  "Secure VPN Ingress tunnel established",
  "OAuth Scope Approvals Granted",
  "Baseline Datasets Transmitted",
  "SLA Standard Signed",
  "Billing Retainer Active"
];

export function AdminProjects() {
  const [projects, setProjects] = useState<ProjectOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'sandbox' | 'custom'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectOrder | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Blocker temporary input
  const [tempBlocker, setTempBlocker] = useState("");

  useEffect(() => {
    let sandboxData: ProjectOrder[] = [];
    let customData: ProjectOrder[] = [];
    let isSandboxLoaded = false;
    let isCustomLoaded = false;

    const mergeData = () => {
      if (!isSandboxLoaded || !isCustomLoaded) return;
      
      const merged = [...sandboxData, ...customData].sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      });
      setProjects(merged);
      setLoading(false);
    };

    const qSandbox = query(collection(db, 'projectSubmissions'), orderBy('createdAt', 'desc'));
    const unsubSandbox = onSnapshot(qSandbox, (snap) => {
      sandboxData = snap.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          type: 'sandbox',
          projectId: data.projectId || data.projectType || 'sandbox',
          assignedTeam: data.assignedTeam || "",
          progress: data.progress !== undefined ? data.progress : 15,
          milestonesCompleted: data.milestonesCompleted || [],
          missingRequirements: data.missingRequirements || [],
          highRiskBlockers: data.highRiskBlockers || "",
          ...data 
        } as ProjectOrder;
      });
      isSandboxLoaded = true;
      mergeData();
    }, (err) => {
      console.error("Error fetching sandbox projects:", err);
      setError(err.message);
      setLoading(false);
    });

    const qCustom = query(collection(db, 'customProjects'), orderBy('createdAt', 'desc'));
    const unsubCustom = onSnapshot(qCustom, (snap) => {
      customData = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: 'custom',
          title: data.title || 'Untitled Custom Project',
          userEmail: data.email || data.userEmail || "",
          userName: data.name || data.fullName || data.clientName || 'Unknown Partner',
          company: data.company || "",
          phone: data.phone || "",
          status: data.status || 'pending',
          createdAt: data.createdAt,
          assignedTeam: data.assignedTeam || "",
          progress: data.progress !== undefined ? data.progress : 10,
          milestonesCompleted: data.milestonesCompleted || [],
          missingRequirements: data.missingRequirements || [],
          highRiskBlockers: data.highRiskBlockers || "",
          ...data,
          customDetails: {
            industry: data.industry || "",
            category: data.category || "",
            budget: data.budget || data.estimatedCost || "",
            timeline: data.timeline || data.timelineEst || "",
            suggestedStack: data.suggestedStack || [],
            complexity: data.complexity || data.aiComplexity || "Medium"
          }
        } as ProjectOrder;
      });
      isCustomLoaded = true;
      mergeData();
    }, (err) => {
      console.error("Error fetching custom projects:", err);
      setError(err.message);
      setLoading(false);
    });
    
    return () => {
      unsubSandbox();
      unsubCustom();
    };
  }, []);

  // Live Sync the state of the active selected project drawer
  useEffect(() => {
    if (selectedProject) {
      const updated = projects.find(p => p.id === selectedProject.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedProject)) {
        setSelectedProject(updated);
      }
    }
  }, [projects, selectedProject]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25';
      case 'active': return 'text-premium-gold bg-premium-gold/10 border-premium-gold/25';
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/25';
      default: return 'text-silver-metallic bg-white/5 border-white/10';
    }
  };

  const updateProjectField = async (id: string, type: 'sandbox' | 'custom', fields: Partial<ProjectOrder>) => {
    try {
      const collectionName = type === 'sandbox' ? 'projectSubmissions' : 'customProjects';
      const ref = doc(db, collectionName, id);
      await updateDoc(ref, fields);
    } catch (e: any) {
      console.error("Failed to update project fields", e);
      setError(e.message);
    }
  };

  const handleMilestoneToggle = async (milestoneTitle: string) => {
    if (!selectedProject) return;
    const currentList = selectedProject.milestonesCompleted || [];
    let updated: string[];
    if (currentList.includes(milestoneTitle)) {
      updated = currentList.filter(m => m !== milestoneTitle);
    } else {
      updated = [...currentList, milestoneTitle];
    }
    await updateProjectField(selectedProject.id, selectedProject.type, { milestonesCompleted: updated });
  };

  const handleRequirementToggle = async (reqTitle: string) => {
    if (!selectedProject) return;
    const currentList = selectedProject.missingRequirements || [];
    let updated: string[];
    if (currentList.includes(reqTitle)) {
      updated = currentList.filter(r => r !== reqTitle);
    } else {
      updated = [...currentList, reqTitle];
    }
    await updateProjectField(selectedProject.id, selectedProject.type, { missingRequirements: updated });
  };

  // Filters
  const filteredProjects = projects.filter(p => {
    const matchesTab = activeTab === 'all' || p.type === activeTab;
    
    const clientName = p.clientName || p.userName || "";
    const compName = p.company || "";
    const email = p.userEmail || "";
    const title = p.type === 'sandbox' ? (p.projectType || p.projectId || "") : (p.title || "");
    const searchString = `${clientName} ${compName} ${email} ${title}`.toLowerCase();
    
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1400px] mx-auto space-y-8 relative pb-24"
    >
      <div className={`transition-all duration-500 ease-in-out ${selectedProject ? 'lg:pr-[520px]' : ''}`}>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h1 className="font-display text-4xl text-white font-medium tracking-tight mb-2">Project Intelligence Hub</h1>
              <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic font-semibold">Track specifications, assigned engineering resources, milestones, and blockers.</p>
           </div>
        </div>

        {/* OPERATIONS ANALYTICAL METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
           <div className="glass-panel geometric-clip border border-white/5 p-5 flex flex-col gap-1 relative overflow-hidden group hover:border-premium-gold/30 transition-colors bg-[#080d1a]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-premium-gold/10 transition-colors" />
              <Inbox className="w-5 h-5 text-premium-gold mb-2" />
              <span className="font-display text-3xl text-white font-medium">{projects.length}</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic font-semibold mt-1">Total System Submissions</span>
           </div>
           <button 
             onClick={() => setActiveTab('sandbox')}
             className="text-left glass-panel geometric-clip border border-white/5 p-5 flex flex-col gap-1 relative overflow-hidden group hover:border-blue-500/30 transition-colors bg-[#080d1a]"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none" />
              <Layers className="w-5 h-5 text-blue-400 mb-2" />
              <span className="font-display text-3xl text-white font-medium">{projects.filter(p => p.type === 'sandbox').length}</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic font-semibold mt-1">Sandbox Design Blueprints</span>
           </button>
           <button 
             onClick={() => setActiveTab('custom')}
             className="text-left glass-panel geometric-clip border border-white/5 p-5 flex flex-col gap-1 relative overflow-hidden group hover:border-red-400/30 transition-colors bg-[#080d1a]"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/5 blur-[40px] rounded-full pointer-events-none" />
              <TerminalSquare className="w-5 h-5 text-red-400 mb-2" />
              <span className="font-display text-3xl text-white font-medium">{projects.filter(p => p.type === 'custom').length}</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic font-semibold mt-1">Custom Advanced Requests</span>
           </button>
           <div className="glass-panel geometric-clip border border-white/5 p-5 flex flex-col gap-1 relative overflow-hidden group hover:border-red-500/30 transition-colors bg-[#080d1a]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-red-500/10 transition-colors" />
              <AlertOctagon className="w-5 h-5 text-red-500 mb-2 animate-pulse" />
              <span className="font-display text-3xl text-white font-medium">{projects.filter(p => p.highRiskBlockers && p.highRiskBlockers.length > 0).length}</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-red-400 font-semibold mt-1">Active High-Risk Blockers</span>
           </div>
        </div>

        {/* SEARCH AND FILTERING SYSTEM */}
        <div className="glass-panel border border-white/5 p-4 bg-dark/40 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between geometric-clip">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-metallic" />
            <input 
              type="text" 
              placeholder="Search partner, company, or architectural spec..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark border border-white/10 rounded-lg py-2.5 pl-11 pr-4 text-xs font-mono text-white focus:outline-none focus:border-premium-gold transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto shrink-0 scrollbar-none overflow-x-auto">
             <button onClick={() => setActiveTab('all')} className={`px-4 py-2 font-mono text-[9px] uppercase tracking-widest border border-white/10 ${activeTab === 'all' ? 'bg-premium-gold/20 border-premium-gold/50 text-premium-gold' : 'text-silver-metallic hover:text-white hover:bg-white/5'}`}>All</button>
             <button onClick={() => setActiveTab('sandbox')} className={`px-4 py-2 font-mono text-[9px] uppercase tracking-widest border border-white/10 whitespace-nowrap ${activeTab === 'sandbox' ? 'bg-premium-gold/20 border-premium-gold/50 text-premium-gold' : 'text-silver-metallic hover:text-white hover:bg-white/5'}`}>Consult Dossiers (Sandbox)</button>
             <button onClick={() => setActiveTab('custom')} className={`px-4 py-2 font-mono text-[9px] uppercase tracking-widest border border-white/10 whitespace-nowrap ${activeTab === 'custom' ? 'bg-premium-gold/20 border-premium-gold/50 text-premium-gold' : 'text-silver-metallic hover:text-white hover:bg-white/5'}`}>Custom Advanced Build</button>
          </div>
        </div>

        {/* CLOUD LEDGER DATA DOCKETS */}
        <div className="glass-panel geometric-clip border border-white/5 bg-[#020617]/80 shadow-2xl overflow-hidden min-h-[400px]">
          <div className="divide-y divide-white/5">
             {error ? (
                <div className="p-16 text-center font-mono text-xs uppercase tracking-widest text-silver-metallic flex flex-col items-center justify-center gap-4">
                  <Inbox className="w-8 h-8 text-white/10" />
                  <span>No project intelligence data available yet</span>
                  <span className="text-[10px] text-white/30 lowercase tracking-normal font-sans">
                    {error.toLowerCase().includes('permission') || error.toLowerCase().includes('insufficient') 
                      ? 'Re-establishing secure clearance protocols...' 
                      : error}
                  </span>
                </div>
             ) : loading ? (
                <div className="p-16 text-center font-mono text-xs uppercase tracking-widest text-silver-metallic animate-pulse">Syncing encrypted engineering indices...</div>
             ) : filteredProjects.length === 0 ? (
                <div className="p-16 text-center font-mono text-xs uppercase tracking-widest text-white/50 flex flex-col items-center justify-center gap-4">
                  <Inbox className="w-8 h-8 text-white/10" />
                  No project transmissions matched the parameters.
                </div>
             ) : (
                filteredProjects.map((project) => (
                  <div 
                    key={project.id} 
                    onClick={() => setSelectedProject(project)}
                    className={`p-6 hover:bg-white/[0.02] cursor-pointer transition-colors flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 group relative overflow-hidden ${selectedProject?.id === project.id ? 'bg-white/[0.015] border-l-2 border-premium-gold pl-[22px]' : ''}`}
                  >
                    
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-premium-gold transform scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500" />

                    <div className="flex items-start gap-5 min-w-0 flex-1">
                       <div className={`w-12 h-12 geometric-clip bg-dark border flex items-center justify-center shrink-0 transition-all duration-500 ${selectedProject?.id === project.id ? 'border-premium-gold bg-premium-gold/10' : 'border-white/10 group-hover:border-premium-gold/50'}`}>
                          {project.type === 'sandbox' ? (
                            <Layers className={`w-5 h-5 transition-colors duration-500 ${selectedProject?.id === project.id ? 'text-premium-gold font-bold' : 'text-silver-metallic group-hover:text-premium-gold'}`} />
                          ) : (
                            <TerminalSquare className={`w-5 h-5 transition-colors duration-500 ${selectedProject?.id === project.id ? 'text-premium-gold font-bold' : 'text-silver-metallic group-hover:text-red-400'}`} />
                          )}
                       </div>
                       
                       <div className="min-w-0 flex-1">
                         <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                           <h4 className="font-display text-lg font-medium tracking-tight text-white capitalize truncate max-w-sm sm:max-w-md">
                             {project.type === 'sandbox' ? (project.projectType || project.projectId || 'Dossier Sandbox') : project.title}
                           </h4>
                           
                           <span className="px-2 py-0.5 border border-white/10 bg-white/5 text-[9px] font-mono uppercase tracking-widest rounded-sm text-silver-metallic shrink-0">
                             {project.type}
                           </span>

                           {project.priority && (
                             <span className={`px-2 py-0.5 border text-[9px] font-mono uppercase tracking-widest rounded-sm shrink-0 font-semibold ${project.priority === 'Hot' ? 'bg-red-500/10 border-red-500/25 text-red-400' : project.priority === 'Warm' ? 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400' : 'bg-blue-500/10 border-blue-500/25 text-blue-400'}`}>
                               PRIORITY: {project.priority}
                             </span>
                           )}

                           {project.highRiskBlockers && (
                             <span className="px-2 py-0.5 bg-red-500/15 border border-red-500/30 text-red-400 text-[9px] font-mono uppercase tracking-widest rounded-sm animate-pulse flex items-center gap-1 font-semibold shrink-0">
                               <AlertTriangle className="w-2.5 h-2.5" /> BLOCKERED
                             </span>
                           )}
                         </div>

                         <p className="font-mono text-[10px] text-silver-metallic tracking-wider uppercase">
                           Partner: <span className="text-white font-medium opacity-90">{project.clientName || project.userName || 'Unknown Client'}</span> 
                           {project.company && <span className="text-premium-gold font-semibold"> @ {project.company}</span>}
                         </p>
                         
                         {/* Selections / Tags Row */}
                         <div className="flex flex-wrap items-center gap-2 mt-3.5 text-[9px] font-mono uppercase tracking-widest">
                           {project.type === 'sandbox' ? (
                             <>
                               <span className="bg-[#0c1524] border border-blue-500/20 px-2 py-1 geometric-clip text-blue-400">Sector: {project.industry || 'Global'}</span>
                               <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip text-white/50">Budget: <span className="text-white/80">{project.budget || 'Custom'}</span></span>
                               <span className="bg-[#1c1810] border border-premium-gold/25 px-2 py-1 geometric-clip text-premium-gold font-semibold">T-Score: {project.leadScore || 0}%</span>
                             </>
                           ) : project.customDetails ? (
                             <>
                               <span className="bg-[#1c1315] border border-red-500/20 px-2 py-1 geometric-clip text-red-400">Sector: {project.customDetails.industry}</span>
                               <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip text-white/50">Budget: <span className="text-white/80">{project.customDetails.budget || 'Open'}</span></span>
                               <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip text-white/50">AI Complex: <span className="text-white/80">{project.customDetails.complexity}</span></span>
                             </>
                           ) : null}

                           {/* Operational Details Overlay */}
                           {project.assignedTeam && (
                             <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-1 rounded flex items-center gap-1 font-semibold">
                               <UsersIcon className="w-2.5 h-2.5" /> Assigned: {project.assignedTeam.split(" ")[0]}
                             </span>
                           )}

                           {project.progress !== undefined && (
                             <span className="bg-white/5 border border-white/10 px-2 py-1 rounded">
                               {(project as any).slaLevel && (
                                 <span className="text-purple-400 font-bold mr-2">
                                   [{(project as any).slaLevel.split(" ")[0]}]
                                 </span>
                               )}
                               {(project as any).estimatedValue && (
                                 <span className="text-green-400 font-semibold mr-2">
                                   ${new Intl.NumberFormat().format((project as any).estimatedValue)}
                                 </span>
                               )}
                               Task Progress: <span className="text-white font-bold">{project.progress}%</span>
                             </span>
                           )}
                         </div>
                       </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0 w-full xl:w-auto mt-4 xl:mt-0">
                      <span className="font-mono text-[9px] text-silver-metallic/60 tracking-wider">
                        {project.createdAt?.toDate ? format(project.createdAt.toDate(), 'PPpp') : 'Recent Delivery'}
                      </span>
                      
                      {/* Live status capsule overlay */}
                      <span className={`px-2.5 py-1 border text-[9px] font-mono uppercase tracking-widest rounded-md ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                  </div>
                ))
              )}
          </div>
        </div>
      </div>

      {/* DETAILED PROJECT INTELLIGENCE DOSSIER DRAWER (Phase 7D) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 120 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-0 right-0 w-full sm:w-[500px] h-screen bg-[#040814]/98 border-l border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.9)] z-50 overflow-y-auto custom-scrollbar flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-start justify-between bg-[#080f24] sticky top-0 z-30">
              <div>
                <span className="text-[9px] font-mono text-premium-gold font-bold uppercase tracking-widest block mb-1">Ecosystem Operational Dossier</span>
                <h2 className="text-2xl font-display font-medium text-white tracking-tight capitalize">
                  {selectedProject.type === 'sandbox' ? (selectedProject.projectType || 'Sandbox Blueprint') : selectedProject.title}
                </h2>
                <div className="flex items-center gap-2 text-[10px] text-silver-metallic font-mono mt-1">
                  <span>Docket:</span>
                  <span className="text-white font-mono text-[10px] font-semibold tracking-wider">{selectedProject.id}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProject(null)} 
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body representing full project intelligence dossier */}
            <div className="p-6 flex-1 space-y-6">
              
              {/* Partner Contact Card */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-[50px] pointer-events-none" />
                <h3 className="text-[10px] font-mono text-premium-gold font-bold uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Corporate Partner Identifiers
                </h3>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                  <div>
                    <span className="text-[10px] text-white/40 block font-mono uppercase tracking-wider">Representative</span>
                    <span className="text-white font-semibold font-sans">{selectedProject.clientName || selectedProject.userName || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block font-mono uppercase tracking-wider">Institution</span>
                    <span className="text-white font-semibold font-sans">{selectedProject.company || 'Not Transmitted'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block font-mono uppercase tracking-wider">Verified Identity</span>
                    <span className="text-white font-mono text-[11px] break-all">{selectedProject.userEmail}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block font-mono uppercase tracking-wider">Direct Access</span>
                    <span className="text-white font-mono text-[11px]">{selectedProject.phone || 'Not Logged'}</span>
                  </div>
                </div>
              </div>

              {/* ACTIVE THREAT DECTECTOR MONITOR (High-Risk Blockers Widget) */}
              <div className={`p-4 rounded-xl border relative overflow-hidden flex flex-col gap-2.5 transition-colors ${selectedProject.highRiskBlockers ? 'bg-red-500/10 border-red-500/30' : 'bg-[#0f1d1a]/50 border-teal-500/20 text-teal-400'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Active Risk-Blocker Detector
                  </span>
                  {selectedProject.highRiskBlockers && (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  )}
                </div>
                
                {selectedProject.highRiskBlockers ? (
                  <div>
                    <p className="text-xs text-white/90 font-sans leading-relaxed">{selectedProject.highRiskBlockers}</p>
                    <button 
                      onClick={() => updateProjectField(selectedProject.id, selectedProject.type, { highRiskBlockers: "" })}
                      className="text-[10px] font-mono text-red-400 underline uppercase mt-2 hover:text-white tracking-widest block font-bold"
                    >
                      [Dismiss & Resolve Blocker]
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[#52b39e] font-sans">No immediate structural bottlenecks or high-risk legal/data blocks registered.</p>
                )}

                <div className="mt-2 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Register custom danger blocker..." 
                    value={tempBlocker}
                    onChange={(e) => setTempBlocker(e.target.value)}
                    className="flex-1 bg-dark border border-white/15 rounded px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none"
                  />
                  <button 
                    onClick={() => {
                      if (!tempBlocker.trim()) return;
                      updateProjectField(selectedProject.id, selectedProject.type, { highRiskBlockers: tempBlocker.trim() });
                      setTempBlocker("");
                    }}
                    className="px-3 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono uppercase rounded-md font-bold"
                  >
                    Lock
                  </button>
                </div>
              </div>

              {/* INTEGRATION OPERATIONS CONTROL CONSOLE (Interactive Status, Team, Progress) */}
              <div className="p-4 bg-[#0a1124] border border-white/5 rounded-xl space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-premium-gold block font-semibold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Scoping & Allocation Suite
                </span>

                {/* Team dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 block font-mono uppercase tracking-wider">Assigned Delivery Resource Unit</label>
                  <select 
                    value={selectedProject.assignedTeam || ""}
                    onChange={(e) => updateProjectField(selectedProject.id, selectedProject.type, { assignedTeam: e.target.value })}
                    className="w-full bg-dark border border-white/10 text-xs text-white p-2.5 focus:outline-none focus:border-premium-gold"
                  >
                    <option value="">-- Resource Unassigned --</option>
                    {TEAMS_LIST.map(team => (
                      <option key={team} value={team}>{team}</option>
                    ))}
                  </select>
                </div>

                {/* SLA Level selection */}
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 block font-mono uppercase tracking-wider">Designated SLA Classification</label>
                  <select 
                    value={(selectedProject as any).slaLevel || "99.5% Standard SLA"}
                    onChange={(e) => updateProjectField(selectedProject.id, selectedProject.type, { slaLevel: e.target.value } as any)}
                    className="w-full bg-dark border border-white/10 text-xs text-white p-2.5 focus:outline-none focus:border-premium-gold"
                  >
                    <option value="99.9% Critical Care SLA">99.9% Critical Care SLA</option>
                    <option value="99.5% Standard SLA">99.5% Standard SLA</option>
                    <option value="99.0% Basic SLA">99.0% Basic SLA</option>
                  </select>
                </div>

                {/* Estimated Project Value */}
                <div className="space-y-1">
                  <label className="text-[10px] text-white/40 block font-mono uppercase tracking-wider">Estimated Project Value ($)</label>
                  <input 
                    type="number" 
                    value={(selectedProject as any).estimatedValue || ""}
                    placeholder="e.g. 55000"
                    onChange={(e) => updateProjectField(selectedProject.id, selectedProject.type, { estimatedValue: Number(e.target.value) || 0 } as any)}
                    className="w-full bg-dark border border-white/10 rounded text-xs text-white p-2.5 focus:outline-none focus:border-premium-gold font-mono"
                  />
                </div>

                {/* Progress Slider */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                    <span className="text-white/40">Physical Integration Progress</span>
                    <span className="text-green-400 font-bold text-xs">{selectedProject.progress || 0}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5"
                    value={selectedProject.progress || 0}
                    onChange={(e) => updateProjectField(selectedProject.id, selectedProject.type, { progress: parseInt(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-premium-gold"
                  />
                </div>
              </div>

              {/* REQUISITE CHECKLISTS (Milestones & Requirements) */}
              <div className="grid grid-cols-1 gap-6">
                
                {/* Milestone Checklist */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/50 border-b border-white/5 pb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-premium-gold" /> Integration Lifecycle Checkpoint Sign-Offs
                  </h4>

                  <div className="space-y-2 pl-1">
                    {(selectedProject.recommendedRoadmap && selectedProject.recommendedRoadmap.length > 0
                      ? selectedProject.recommendedRoadmap.map(r => r.title)
                      : ["Diagnostic Phase Initiation", "System Framework Modeling", "Data Gateway Security Audit", "Production Deployment Authorization"]
                    ).map((milestone) => {
                      const isDone = selectedProject.milestonesCompleted?.includes(milestone);
                      return (
                        <label 
                          key={milestone} 
                          className="flex items-start gap-2.5 p-2 rounded hover:bg-white/[0.02] cursor-pointer text-xs"
                        >
                          <input 
                            type="checkbox" 
                            checked={isDone}
                            onChange={() => handleMilestoneToggle(milestone)}
                            className="mt-0.5 rounded border-white/10 bg-dark text-premium-gold focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                          />
                          <span className={`leading-relaxed ${isDone ? 'line-through text-white/30' : 'text-white/80'}`}>{milestone}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Missing Requirements List */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/50 border-b border-white/5 pb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-400" /> Prerequisite Requirements Registry
                  </h4>

                  <div className="space-y-2 pl-1">
                    {PRESET_MANDATORY_REQUIREMENTS.map((req) => {
                      // Note: We track matching completed requirements
                      const isVerified = selectedProject.missingRequirements?.includes(req);
                      return (
                        <label 
                          key={req} 
                          className="flex items-start gap-2.5 p-2 rounded hover:bg-white/[0.02] cursor-pointer text-xs"
                        >
                          <input 
                            type="checkbox" 
                            checked={isVerified}
                            onChange={() => handleRequirementToggle(req)}
                            className="mt-0.5 rounded border-white/10 bg-dark text-blue-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                          />
                          <span className={`leading-relaxed ${isVerified ? 'text-green-400 font-semibold' : 'text-white/60'}`}>
                            {isVerified ? "✓ " : "❌ "} {req}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Requirement Context Parameters */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2 font-semibold">Technical Environment</h3>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-white/40 block font-mono uppercase">Industry / Sector</span>
                    <span className="text-white font-medium capitalize">{selectedProject.industry || 'Global Context'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block font-mono uppercase">Design Aesthetics</span>
                    <span className="text-white font-medium">{selectedProject.designDirection || 'Premium Slate'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block font-mono uppercase">Budget Allocation</span>
                    <span className="text-white font-mono font-medium">{selectedProject.budget || 'Custom Estimates'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block font-mono uppercase">Deployment Timeline</span>
                    <span className="text-white font-medium">{selectedProject.timeline || 'Flexible Delivery'}</span>
                  </div>
                </div>
              </div>

              {/* Features and Integrations tags */}
              {selectedProject.selectedFeatures && selectedProject.selectedFeatures.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">Modular Features Required</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.selectedFeatures.map(feat => (
                      <span key={feat} className="text-[10px] font-mono px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-white/70">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Competitors and References */}
              {selectedProject.competitors && selectedProject.competitors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">Inspirational Reference Channels</span>
                  <div className="space-y-1">
                    {selectedProject.competitors.map(url => (
                      <a 
                        key={url} 
                        href={`https://${url}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs font-mono text-premium-gold hover:underline block truncate flex items-center gap-1.5"
                      >
                        <Compass className="w-3 h-3 shrink-0" /> {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack suggestion */}
              {selectedProject.recommendedStack && selectedProject.recommendedStack.length > 0 && (
                <div className="p-4 bg-dark border border-white/5 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> AI Recommended Systems Stack
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.recommendedStack.map(st => (
                      <span key={st} className="text-[10px] font-mono px-2 py-0.5 bg-white/5 rounded text-white/80">{st}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Brief Project Scope Statement */}
              {selectedProject.scope && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">Estimated Project Scope</span>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">{selectedProject.scope}</p>
                </div>
              )}

            </div>

            {/* Sidebar actions inside log */}
            <div className="p-6 border-t border-white/15 bg-[#040814] sticky bottom-0 z-30 flex gap-3">
              <button 
                onClick={() => updateProjectField(selectedProject.id, selectedProject.type, { status: "active" })}
                className="flex-1 py-3 bg-white text-dark text-xs font-mono font-bold uppercase tracking-widest hover:bg-white/90 rounded-md transition-all"
              >
                Start Scoping Active
              </button>
              <button 
                onClick={() => updateProjectField(selectedProject.id, selectedProject.type, { status: "completed" })}
                className="flex-1 py-3 border border-white/15 hover:bg-white/10 text-white text-xs font-mono font-semibold uppercase tracking-widest rounded-md transition-all"
              >
                Approve Deployment
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
