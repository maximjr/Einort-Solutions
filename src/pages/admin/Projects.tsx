import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Layers, ChevronRight, Inbox, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectOrder {
  id: string;
  projectId: string;
  userEmail: string;
  userName?: string;
  status: string;
  createdAt: any;
  selections: {
    theme: string;
    layout: string;
    font: string;
    buttonStyle?: string;
  }
}

export function AdminProjects() {
  const [projects, setProjects] = useState<ProjectOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projectSubmissions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectOrder));
      setProjects(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching projects:", err);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'active': return 'text-electric-blue bg-electric-blue/10 border-electric-blue/20';
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-silver-metallic bg-white/5 border-white/10';
    }
  };

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
            <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Manage architectural submissions.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="glass-panel geometric-clip border border-white/5 p-6 flex flex-col gap-2 relative overflow-hidden group hover:border-electric-blue/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-electric-blue/10 transition-colors" />
            <Inbox className="w-5 h-5 text-electric-blue mb-2" />
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
        <div className="p-4 border-b border-white/5">
           <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-white">Transmission Log</h3>
        </div>
        <div className="divide-y divide-white/5">
           {loading ? (
             <div className="p-8 text-center font-mono text-xs uppercase tracking-widest text-silver-metallic animate-pulse">Syncing Database...</div>
           ) : projects.length === 0 ? (
             <div className="p-8 text-center font-mono text-xs uppercase tracking-widest text-silver-metallic">No Transmissions Found.</div>
           ) : (
             projects.map((project) => (
               <div key={project.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 group relative overflow-hidden">
                 
                 <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-electric-blue transform scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500" />

                 <div className="flex items-start gap-5">
                    <div className="w-12 h-12 geometric-clip bg-dark border border-white/10 group-hover:border-electric-blue/50 flex items-center justify-center shrink-0 transition-colors duration-500">
                       <Layers className="w-5 h-5 text-silver-metallic group-hover:text-electric-blue transition-colors duration-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-display text-lg tracking-tight text-white">{project.projectId.toUpperCase()}</h4>
                        <span className={`px-2 py-0.5 border text-[9px] font-mono uppercase tracking-widest rounded-sm ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-silver-metallic tracking-[0.1em] uppercase">Client: <span className="text-white opacity-80">{project.userName || 'Unknown'}</span> <span className="text-white opacity-50 lowercase">({project.userEmail})</span></p>
                      
                      {/* Selections breakdown */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-[9px] font-mono uppercase tracking-widest">
                         <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip">Theme: {project.selections?.theme}</span>
                         <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip">Layout: {project.selections?.layout}</span>
                         <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip">Font: {project.selections?.font}</span>
                         {project.selections?.buttonStyle && <span className="bg-white/5 border border-white/10 px-2 py-1 geometric-clip">UI: {project.selections.buttonStyle}</span>}
                      </div>
                    </div>
                 </div>

                 <div className="flex flex-col items-end gap-4 shrink-0 w-full xl:w-auto mt-4 xl:mt-0">
                    <span className="font-mono text-[10px] text-silver-metallic tracking-wider">
                      {project.createdAt?.toDate ? format(project.createdAt.toDate(), 'PPpp') : 'Recent'}
                    </span>
                    <button className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white border border-white/20 px-4 py-2 geometric-clip-button hover:bg-electric-blue hover:border-electric-blue transition-all w-full md:w-auto justify-center shadow-[0_0_15px_rgba(37,99,235,0)] hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]">
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
