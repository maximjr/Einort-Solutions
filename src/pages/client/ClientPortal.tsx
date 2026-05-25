import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { FileText, CheckCircle2, Clock, Download, ArrowRight, Activity, CalendarDays, Loader2 } from 'lucide-react';
import { CinematicTransition } from '../../components/CinematicTransition';

interface Project {
  id: string;
  type: 'sandbox' | 'custom';
  title?: string;
  projectId?: string;
  status: string;
  createdAt: any;
  progress?: number;
  [key: string]: any;
}

export function ClientPortal() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let sandboxData: Project[] = [];
    let customData: Project[] = [];
    let isSandboxLoaded = false;
    let isCustomLoaded = false;

    const mergeData = () => {
      // Only set state when BOTH data streams have reported at least once,
      // avoiding duplicate renders for initial load.
      if (!isSandboxLoaded || !isCustomLoaded) return;
      
      setProjects((currentProjects) => {
        const merged = [...sandboxData, ...customData].sort((a, b) => {
          const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return timeB - timeA;
        });

        // Prevention of stale data / pointer mismatches by storing purely the ID
        if (merged.length > 0 && !activeProjectId) {
          setActiveProjectId(merged[0].id);
        }
        
        return merged;
      });
      setLoading(false);
    };

    const qSandbox = query(collection(db, 'projectSubmissions'), where('userId', '==', user.uid));
    const unsubSandbox = onSnapshot(qSandbox, (snap) => {
      sandboxData = snap.docs.map(doc => ({ 
        id: doc.id, 
        type: 'sandbox',
        ...doc.data() 
      } as Project));
      isSandboxLoaded = true;
      mergeData();
    });

    const qCustom = query(collection(db, 'customProjects'), where('userId', '==', user.uid));
    const unsubCustom = onSnapshot(qCustom, (snap) => {
      customData = snap.docs.map(doc => ({ 
        id: doc.id, 
        type: 'custom',
        ...doc.data() 
      } as Project));
      isCustomLoaded = true;
      mergeData();
    });

    return () => {
      unsubSandbox();
      unsubCustom();
    };
  }, [user, activeProjectId]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  // Derived status logic
  const getProgress = (project: Project) => {
    if (project.progress !== undefined) return project.progress;
    if (project.status === 'completed') return 100;
    if (project.status === 'active') return 45;
    return 10;
  };

  const getPhaseName = (project: Project) => {
    if (project.status === 'completed') return 'Deployment & Handoff';
    if (project.status === 'active') return 'Engineering Integration';
    return 'Architectural Review';
  };

  const getPhaseDescription = (project: Project) => {
    if (project.status === 'completed') return 'Project has been successfully deployed and handed over.';
    if (project.status === 'active') return 'Our engineering team is currently integrating the core architecture and features.';
    return 'Reviewing specifications and assigning resources.';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-premium-gold animate-spin" />
      </div>
    );
  }

  return (
    <CinematicTransition>
      <div className="min-h-screen bg-dark pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-display font-medium mb-1">{user?.displayName || 'Client'} <span className="text-premium-gold ml-2">Portal</span></h1>
            {activeProject ? (
              <p className="text-silver-metallic font-mono text-xs uppercase tracking-widest">Active Project: {activeProject.type === 'sandbox' ? activeProject.projectId?.toUpperCase() : activeProject.title}</p>
            ) : (
              <p className="text-silver-metallic font-mono text-xs uppercase tracking-widest">No active projects found.</p>
            )}
          </div>

          {activeProject ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Action Area */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Status Header */}
                <div className="glass-panel p-8 rounded-3xl border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-premium-gold/10 blur-[100px]" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div>
                       <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-premium-gold/30 bg-premium-gold/10 text-premium-gold text-[10px] font-mono uppercase tracking-widest mb-4">
                         <Activity className="w-3 h-3" /> {activeProject.status}
                       </span>
                       <h2 className="text-2xl font-display font-medium mb-2">{getPhaseName(activeProject)}</h2>
                       <p className="text-white/60 text-sm max-w-md">{getPhaseDescription(activeProject)}</p>
                     </div>
                     <div className="shrink-0 text-right">
                       <p className="font-mono text-4xl font-light text-white mb-1">{getProgress(activeProject)}%</p>
                       <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Completion</p>
                     </div>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-premium-gold/50 to-premium-gold rounded-full transition-all duration-1000`} style={{ width: `${getProgress(activeProject)}%` }} />
                  </div>
                </div>

                {/* Milestones */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-sans font-medium text-white uppercase tracking-widest text-white/50">Project Timeline</h3>
                    {projects.length > 1 && (
                      <select 
                        className="bg-transparent text-xs text-white/70 border border-white/10 rounded-xl px-3 py-1.5 outline-none custom-scrollbar"
                        value={activeProject.id}
                        onChange={(e) => {
                          const p = projects.find(p => p.id === e.target.value);
                          if(p) setActiveProjectId(p.id);
                        }}
                      >
                         {projects.map(p => (
                           <option key={p.id} value={p.id} className="bg-dark text-white">
                              {p.type === 'sandbox' ? p.projectId?.toUpperCase() : p.title}
                           </option>
                         ))}
                      </select>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                     {[
                       { name: "Discovery & Requirements", status: activeProject.status === 'pending' ? 'active' : 'completed' },
                       { name: "Architectural Planning", status: activeProject.status === 'pending' ? 'pending' : activeProject.status === 'active' ? 'active' : 'completed' },
                       { name: "Implementation & Build", status: activeProject.status === 'completed' ? 'completed' : activeProject.status === 'active' ? 'active' : 'pending' },
                       { name: "QA, Security & Delivery", status: activeProject.status === 'completed' ? 'completed' : 'pending' }
                     ].map((milestone, idx) => (
                       <div key={idx} className="flex gap-4">
                         <div className="flex flex-col items-center">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${milestone.status === 'completed' ? 'bg-premium-gold text-dark' : milestone.status === 'active' ? 'border-2 border-premium-gold text-premium-gold' : 'border border-white/20 text-transparent'}`}>
                             {milestone.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                             {milestone.status === 'active' && <div className="w-2 h-2 rounded-full bg-premium-gold" />}
                           </div>
                           {idx !== 3 && <div className={`w-[1px] h-12 mt-2 ${milestone.status === 'completed' ? 'bg-premium-gold/30' : 'bg-white/10'}`} />}
                         </div>
                         <div className="pt-0.5">
                           <h4 className={`text-sm font-medium ${milestone.status === 'pending' ? 'text-white/40' : 'text-white'}`}>{milestone.name}</h4>
                           <p className="text-[11px] font-mono text-white/40 mt-1 uppercase tracking-widest">{milestone.status}</p>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>

              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                 
                 {/* Action Required */}
                 {activeProject.status === 'active' && (
                   <div className="glass-panel border-premium-gold/30 p-6 rounded-3xl bg-premium-gold/5">
                     <div className="w-10 h-10 rounded-full bg-premium-gold/20 flex items-center justify-center mb-4">
                       <Clock className="w-5 h-5 text-premium-gold" />
                     </div>
                     <h3 className="font-display font-medium text-white mb-2">Approval Required</h3>
                     <p className="text-xs text-white/60 mb-6">Review the latest prototypes to proceed to the next milestone.</p>
                     <button className="w-full py-3 bg-premium-gold text-dark font-semibold text-xs rounded-full hover:brightness-110 transition-all flex items-center justify-center gap-2">
                       Review Details <ArrowRight className="w-4 h-4" />
                     </button>
                   </div>
                 )}

                 {/* Invoices - Dynamic logic isn't fully built into backend for invoicing yet, so provide realistic placeholders that adapt to project type/scale */}
                 <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
                   <h3 className="text-xs font-sans font-medium text-white mb-4 uppercase tracking-widest text-white/50 flex items-center gap-2"><FileText className="w-4 h-4" /> Financials</h3>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                       <div>
                         <p className="text-xs font-medium">Invoice #INV-{(activeProject.id.slice(0,4).toUpperCase())}</p>
                         <p className="text-[10px] text-white/40 font-mono mt-1">Paid • Initial Retainer</p>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors text-white/50 group-hover:text-white">
                         <Download className="w-4 h-4" />
                       </div>
                     </div>
                     {activeProject.status !== 'completed' && (
                       <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                         <div>
                           <p className="text-xs font-medium">Invoice #{(activeProject.id.slice(-4).toUpperCase())}</p>
                           <p className="text-[10px] text-premium-gold font-mono mt-1">Due • Final Delivery</p>
                         </div>
                         <div className="font-mono text-sm group-hover:text-premium-gold transition-colors text-white/70">
                           {activeProject.type === 'custom' && activeProject.budget ? activeProject.budget : 'TBD'}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Contact Lead */}
                 <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden shrink-0 filter grayscale">
                     <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Lead Architect" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <p className="text-sm font-medium">Rheinard N.</p>
                     <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mt-0.5">Lead Architect</p>
                     <button className="text-xs text-premium-gold mt-2 hover:underline">Schedule Sync</button>
                   </div>
                 </div>

              </div>
            </div>
          ) : (
            <div className="text-center py-20 px-6 border border-white/5 rounded-3xl glass-panel">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                 <FileText className="w-6 h-6 text-white/50" />
               </div>
               <h3 className="font-display text-2xl text-white mb-2">No Active Operations</h3>
               <p className="text-white/50 text-sm font-light mb-8 max-w-sm mx-auto">You do not have any active project architectures in progress.</p>
            </div>
          )}
        </div>
      </div>
    </CinematicTransition>
  )
}

