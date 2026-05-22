import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Search, Filter, MoreVertical, ShieldAlert, Cpu } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt?: any;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users')); // Note: requires proper rules indexing if adding orderBy
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
      setUsers(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching users:", err);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-8 h-full flex flex-col"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="font-display text-4xl text-white font-medium tracking-tight mb-2">User Intelligence</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Monitor and manage ecosystem identities.</p>
         </div>
      </div>

      <div className="glass-panel geometric-clip border border-white/5 bg-dark/50 flex flex-col flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/[0.02]">
           <div className="relative w-full md:w-96">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-metallic" />
             <input 
               type="text" 
               placeholder="Search identifiers..." 
               className="w-full bg-dark border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm font-mono text-white focus:outline-none focus:border-premium-gold transition-colors"
             />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 bg-dark border border-white/10 rounded-lg text-xs font-mono uppercase text-silver-metallic hover:text-white transition-colors">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-premium-gold text-white rounded-lg text-xs font-mono uppercase geometric-clip-button hover:bg-oxblood transition-colors">
                Export Data
              </button>
           </div>
        </div>

        {/* Table / List */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Cpu className="w-8 h-8 text-premium-gold animate-pulse" />
                <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Syncing Data...</p>
             </div>
          ) : users.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 gap-4">
                <ShieldAlert className="w-8 h-8 text-silver-metallic" />
                <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">No Identities Found</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal">Identity</th>
                  <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal">UID</th>
                  <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal">Activity</th>
                  <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal">Status</th>
                  <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                         {u.photoURL ? (
                           <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 geometric-clip border border-white/10" />
                         ) : (
                           <div className="w-10 h-10 geometric-clip bg-white/5 flex items-center justify-center border border-white/10">
                              <span className="font-display font-medium">{u.displayName?.substring(0,2).toUpperCase() || 'UN'}</span>
                           </div>
                         )}
                         <div>
                           <p className="font-sans text-sm font-medium text-white">{u.displayName || 'Unknown Entity'}</p>
                           <p className="font-mono text-[10px] text-silver-metallic">{u.email}</p>
                           {u.phoneNumber && <p className="font-mono text-[10px] text-silver-metallic mt-0.5 opacity-80">{u.phoneNumber}</p>}
                         </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[10px] text-silver-metallic">{u.id}</td>
                    <td className="p-4 font-mono text-[10px] text-silver-metallic">
                      <div className="space-y-1">
                        <p><span className="text-gray-500">Joined:</span> {u.createdAt?.toDate ? new Date(u.createdAt.toDate()).toLocaleDateString() : 'Unknown'}</p>
                        <p><span className="text-gray-500">Last seen:</span> {(u as any).lastLogin?.toDate ? new Date((u as any).lastLogin.toDate()).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                    </td>
                    <td className="p-4">
                       <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 text-green-400 text-[9px] font-mono uppercase tracking-wider">
                         <span className="w-1 h-1 rounded-full bg-green-400" /> Active
                       </span>
                    </td>
                    <td className="p-4 text-right">
                       <button className="p-2 text-silver-metallic hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
}
