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
  status: string;
  createdAt: any;
  selections: {
    theme: string;
    layout: string;
    font: string;
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
         <div className="glass-panel geometric-clip border border-white/5 p-6 flex flex-col gap-2">
            <Inbox className="w-5 h-5 text-electric-blue mb-2" />
            <span className="font-display text-2xl">{projects.length}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic">Total Orders</span>
         </div>
         <div className="glass-panel geometric-clip border border-white/5 p-6 flex flex-col gap-2">
            <Clock className="w-5 h-5 text-yellow-400 mb-2" />
            <span className="font-display text-2xl">{projects.filter(p => p.status === 'pending').length}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic">Pending Review</span>
         </div>
         <div className="glass-panel geometric-clip border border-white/5 p-6 flex flex-col gap-2">
            <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
            <span className="font-display text-2xl">{projects.filter(p => p.status === 'completed').length}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic">Archived / Done</span>
         </div>
      </div>

      <div className="glass-panel geometric-clip border border-white/5 bg-dark/50">
        <div className="p-4 border-b border-white/5">
           <h3 className="font-mono text-xs uppercase tracking-widest text-white">Transmission Log</h3>
        </div>
        <div className="divide-y divide-white/5">
           {loading ? (
             <div className="p-8 text-center font-mono text-xs uppercase text-silver-metallic">Syncing Database...</div>
           ) : projects.length === 0 ? (
             <div className="p-8 text-center font-mono text-xs uppercase text-silver-metallic">No Transmissions Found.</div>
           ) : (
             projects.map((project) => (
               <div key={project.id} className="p-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
                 <div className="flex items-start gap-4">
                    <div className="w-12 h-12 geometric-clip bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center shrink-0">
                       <Layers className="w-5 h-5 text-electric-blue" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-display text-lg tracking-tight text-white">{project.projectId.toUpperCase()}</h4>
                        <span className={`px-2 py-0.5 border text-[9px] font-mono uppercase tracking-widest rounded-sm ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-silver-metallic tracking-wider">Client: {project.userEmail}</p>
                      
                      {/* Selections breakdown */}
                      <div className="flex items-center gap-3 mt-3">
                         <span className="font-mono text-[9px] uppercase tracking-widest bg-white/5 px-2 py-1">Theme: {project.selections?.theme}</span>
                         <span className="font-mono text-[9px] uppercase tracking-widest bg-white/5 px-2 py-1">Layout: {project.selections?.layout}</span>
                         <span className="font-mono text-[9px] uppercase tracking-widest bg-white/5 px-2 py-1">Font: {project.selections?.font}</span>
                      </div>
                    </div>
                 </div>

                 <div className="flex flex-col items-end gap-3 shrink-0 w-full md:w-auto">
                    <span className="font-mono text-[10px] text-silver-metallic">
                      {project.createdAt?.toDate ? format(project.createdAt.toDate(), 'PPpp') : 'Recent'}
                    </span>
                    <button className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-electric-blue border border-electric-blue px-4 py-2 geometric-clip-button hover:bg-electric-blue hover:text-white transition-all w-full md:w-auto justify-center">
                       Inspect Order <ChevronRight className="w-3 h-3" />
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
