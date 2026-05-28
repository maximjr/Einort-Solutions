import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Activity, ShieldCheck, Globe, Clock, Zap, Target, ArrowRight, Monitor } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDebouncedSnapshot } from '../../hooks/useDebouncedSnapshot';

interface LogData {
  id: string;
  type: string;
  details?: string;
  email?: string;
  userId?: string;
  timestamp: any;
  industry?: string;
  location?: string;
  userAgent?: string;
}

export function AdminUsers() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);

  const q = useMemo(() => query(collection(db, 'clientActivity'), orderBy('timestamp', 'desc'), limit(150)), []);
  useDebouncedSnapshot(q, (snap) => {
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogData));
    setLogs(data);
    setLoading(false);
  }, 1000, (err) => {
    console.error("Error fetching logs:", err);
    setLoading(false);
  });

  const getActionFormat = (log: LogData) => {
     const t = log.type || '';
     if (t.includes('started_prototype')) return { color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'PROTOTYPE STARTED', icon: Zap };
     if (t.includes('completed_prototype')) return { color: 'text-green-400', bg: 'bg-green-400/10', label: 'PROTOTYPE COMPLETED', icon: Target };
     if (t.includes('booked_consultation')) return { color: 'text-premium-gold', bg: 'bg-premium-gold/10', label: 'CONSULTATION BOOKED', icon: Clock };
     if (t.includes('abandon')) return { color: 'text-oxblood', bg: 'bg-oxblood/10', label: 'ABANDONED', icon: ShieldCheck };
     if (t.includes('opened_services')) return { color: 'text-white', bg: 'bg-white/5', label: 'SERVICE VIEW', icon: Globe };
     if (t.includes('signed_up') || t.includes('logged_in')) return { color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'AUTHENTICATION', icon: ShieldCheck };
     return { color: 'text-silver-metallic', bg: 'bg-white/5', label: t.toUpperCase().replace('_', ' '), icon: Activity };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-8 h-full flex flex-col"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl text-white font-medium tracking-tight mb-2">Live Intel Feed</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-green-400">Streaming</span>
              </div>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Real-time surveillance of user behaviors and conversion tracking.</p>
         </div>
      </div>

      <div className="glass-panel geometric-clip border border-white/5 bg-dark/50 flex flex-col flex-1 overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
        
        {/* Table / List */}
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-premium-gold border-t-transparent animate-spin" />
                <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Establishing Uplink...</p>
             </div>
          ) : logs.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full gap-4">
                <ShieldCheck className="w-8 h-8 text-silver-metallic" />
                <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">No Network Activity Detected</p>
             </div>
          ) : (
             <div className="space-y-4">
               <AnimatePresence>
                 {logs.map((log) => {
                   const format = getActionFormat(log);
                   const Icon = format.icon;
                   return (
                     <motion.div 
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       key={log.id} 
                       className="group border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
                     >
                        <div className={`absolute left-0 top-0 bottom-0 w-[3px] opacity-20 group-hover:opacity-100 transition-opacity ${format.color.replace('text-', 'bg-')}`} />
                        
                        <div className="flex items-center gap-5 w-full md:w-1/3 shrink-0">
                           <div className={`w-10 h-10 geometric-clip flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors ${format.bg}`}>
                              <Icon className={`w-4 h-4 ${format.color}`} />
                           </div>
                           <div className="min-w-0">
                              <span className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 mb-2 inline-block ${format.color}`}>{format.label}</span>
                              <div className="font-sans text-sm font-medium text-white truncate max-w-[200px]">{log.email || log.userId || 'Anonymous Ghost'}</div>
                           </div>
                        </div>

                        <div className="flex-1 min-w-0">
                           <p className="font-mono text-[11px] text-silver-metallic leading-relaxed tracking-wider break-words"><span className="text-white/30 mr-2">&gt;</span>{log.details || 'System event recorded without details.'}</p>
                           
                           <div className="flex items-center gap-4 mt-3">
                              {log.industry && (
                                <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-premium-gold bg-premium-gold/5 px-2 py-1 rounded">
                                  <Globe className="w-3 h-3" /> {log.industry}
                                </div>
                              )}
                              {log.userAgent && (
                                <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-blue-400 bg-blue-400/5 px-2 py-1 rounded max-w-[120px] truncate">
                                  <Monitor className="w-3 h-3" /> {log.userAgent.split(' ')[0]}
                                </div>
                              )}
                           </div>
                        </div>

                        <div className="shrink-0 flex items-center justify-end w-32">
                           <div className="font-mono text-[10px] text-silver-metallic text-right">
                              {log.timestamp?.toDate ? formatDistanceToNow(log.timestamp.toDate(), { addSuffix: true }) : 'Just now'}
                           </div>
                        </div>
                     </motion.div>
                   );
                 })}
               </AnimatePresence>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
