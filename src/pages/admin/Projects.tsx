import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Layers, ChevronRight, Inbox, Clock, CheckCircle, TerminalSquare, ChevronDown } from 'lucide-react';
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
  }
}

export function AdminProjects() {
  const [projects, setProjects] = useState<ProjectOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'sandbox' | 'custom'>('all');

  useEffect(() => {
    let sandboxData: ProjectOrder[] = [];
    let customData: ProjectOrder[] = [];
    let isSandboxLoaded = false;
    let isCustomLoaded = false;

    const mergeData = () => {
      // Only set state when BOTH data streams have reported at least once
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
      sandboxData = snap.docs.map(doc => ({ 
        id: doc.id, 
        type: 'sandbox',
        ...doc.data() 
      } as ProjectOrder));
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
          title: data.title,
          userEmail: data.email,
          userName: data.fullName,
          status: data.status,
          createdAt: data.createdAt,
          customDetails: {
            industry: data.industry,
            category: data.category,
            budget: data.budget,
            timeline: data.timeline,
            suggestedStack: data.suggestedStack || [],
            complexity: data.complexity
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'active': return 'text-premium-gold bg-premium-gold/10 border-premium-gold/20';
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-silver-metallic bg-white/5 border-white/10';
    }
  };

  const updateStatus = async (id: string, type: 'sandbox' | 'custom', newStatus: string) => {
    try {
      const collectionName = type === 'sandbox' ? 'projectSubmissions' : 'customProjects';
      const ref = doc(db, collectionName, id);
      await updateDoc(ref, { status: newStatus });
    } catch (e: any) {
      console.error("Failed to update status", e);
      setError(e.message);
    }
  };

  const filteredProjects = projects.filter(p => activeTab === 'all' || p.type === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="font-display text-4xl text-white font-medium tracking-tight mb-2">Project Orders</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Manage architectural submissions and custom leads.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="glass-panel geometric-clip border border-white/5 p-6 flex flex-col gap-2 relative overflow-hidden group hover:border-premium-gold/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-premium-gold/10 transition-colors" />
            <Inbox className="w-5 h-5 text-premium-gold mb-2" />
            <span className="font-display text-3xl">{projects.length}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-bold">Total Transmissions</span>
         </div>
         <div className="glass-panel geometric-clip border border-white/5 p-6 flex flex-col gap-2 relative overflow-hidden group hover:border-yellow-400/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-yellow-400/10 transition-colors" />
            <Clock className="w-5 h-5 text-yellow-400 mb-2" />
            <span className="font-display text-3xl">{projects.filter(p => p.status === 'pending').length}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-bold">Awaiting Engineering Review</span>
         </div>
         <div className="glass-panel geometric-clip border border-white/5 p-6 flex flex-col gap-2 relative overflow-hidden group hover:border-green-400/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-green-400/10 transition-colors" />
            <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
            <span className="font-display text-3xl">{projects.filter(p => p.status === 'completed').length}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-bold">Architecture Deployed</span>
         </div>
      </div>

      <div className="glass-panel geometric-clip border border-white/5 bg-dark/50">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
           <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-white">Transmission Log</h3>
           <div className="flex gap-2">
             <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 font-mono text-[9px] uppercase tracking-widest border border-white/10 ${activeTab === 'all' ? 'bg-premium-gold/20 border-premium-gold/50 text-premium-gold' : 'text-silver-metallic hover:text-white hover:bg-white/5'}`}>All</button>
             <button onClick={() => setActiveTab('sandbox')} className={`px-4 py-1.5 font-mono text-[9px] uppercase tracking-widest border border-white/10 ${activeTab === 'sandbox' ? 'bg-premium-gold/20 border-premium-gold/50 text-premium-gold' : 'text-silver-metallic hover:text-white hover:bg-white/5'}`}>Sandbox</button>
             <button onClick={() => setActiveTab('custom')} className={`px-4 py-1.5 font-mono text-[9px] uppercase tracking-widest border border-white/10 ${activeTab === 'custom' ? 'bg-premium-gold/20 border-premium-gold/50 text-premium-gold' : 'text-silver-metallic hover:text-white hover:bg-white/5'}`}>Custom</button>
           </div>
        </div>
        <div className="divide-y divide-white/5">
           {error ? (
             <div className="p-8 text-center font-mono text-xs text-red-400">Error reading data: {error}</div>
           ) : loading ? (
             <div className="p-8 text-center font-mono text-xs uppercase tracking-widest text-silver-metallic animate-pulse">Syncing Database...</div>
           ) : filteredProjects.length === 0 ? (
             <div className="p-8 text-center font-mono text-xs uppercase tracking-widest text-silver-metallic">No Transmissions Found.</div>
           ) : (
             filteredProjects.map((project) => (
               <div key={project.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 group relative overflow-hidden">
                 
                 <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-premium-gold transform scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500" />

                 <div className="flex items-start gap-5">
                    <div className="w-12 h-12 geometric-clip bg-dark border border-white/10 group-hover:border-premium-gold/50 flex items-center justify-center shrink-0 transition-colors duration-500">
                       {project.type === 'sandbox' ? (
                         <Layers className="w-5 h-5 text-silver-metallic group-hover:text-premium-gold transition-colors duration-500" />
                       ) : (
                         <TerminalSquare className="w-5 h-5 text-silver-metallic group-hover:text-oxblood transition-colors duration-500" />
                       )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-display text-lg tracking-tight text-white">{project.type === 'sandbox' ? project.projectId?.toUpperCase() : project.title}</h4>
                        
                        <div className="relative group/status ml-1">
                          <button className={`flex items-center gap-1 px-2 py-0.5 border text-[9px] font-mono uppercase tracking-widest rounded-sm ${getStatusColor(project.status)}`}>
                            {project.status} <ChevronDown className="w-2 h-2 opacity-50" />
                          </button>
                          <div className="absolute top-full left-0 mt-1 w-32 bg-dark border border-white/10 rounded-md shadow-xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-20 overflow-hidden flex flex-col">
                            {['pending', 'active', 'completed'].map(s => (
                              <button 
                                key={s}
                                onClick={() => updateStatus(project.id, project.type, s)}
                                className={`text-left px-3 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors ${project.status === s ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <span className="px-2 py-0.5 border border-white/10 bg-white/5 text-[9px] font-mono uppercase tracking-widest rounded-sm text-silver-metallic">
                          {project.type}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-silver-metallic tracking-[0.1em] uppercase">Client: <span className="text-white opacity-80">{project.userName || 'Unknown'}</span> <span className="text-white opacity-50 lowercase">({project.userEmail})</span></p>
                      
                      {/* Selections breakdown */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-[9px] font-mono uppercase tracking-widest">
                         {project.type === 'sandbox' && project.selections ? (
                           <>
                             <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip">Theme: {project.selections.theme}</span>
                             <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip">Layout: {project.selections.layout}</span>
                             <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip">Font: {project.selections.font}</span>
                           </>
                         ) : project.customDetails ? (
                           <>
                             <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip">Sector: {project.customDetails.industry}</span>
                             <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip">Budget: {project.customDetails.budget || 'Open'}</span>
                             <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip text-premium-gold">AI Comp: {project.customDetails.complexity}</span>
                           </>
                         ) : null}
                      </div>
                    </div>
                 </div>

                 <div className="flex flex-col items-end gap-4 shrink-0 w-full xl:w-auto mt-4 xl:mt-0">
                    <span className="font-mono text-[10px] text-silver-metallic tracking-wider">
                      {project.createdAt?.toDate ? format(project.createdAt.toDate(), 'PPpp') : 'Recent'}
                    </span>
                    <button className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white border border-white/20 px-4 py-2 geometric-clip-button hover:bg-premium-gold hover:border-premium-gold transition-all w-full md:w-auto justify-center shadow-[0_0_15px_rgba(37,99,235,0)] hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                       Inspect Architecture <ChevronRight className="w-3 h-3" />
                    </button>
                 </div>
               </div>
             ))
           )}
        </div>
      </div>
    </motion.div>
  );
}
