import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, Users, Folders, Zap, ArrowUpRight } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const trafficData = [
  { name: 'Mon', organic: 4000, direct: 2400 },
  { name: 'Tue', organic: 3000, direct: 1398 },
  { name: 'Wed', organic: 2000, direct: 9800 },
  { name: 'Thu', organic: 2780, direct: 3908 },
  { name: 'Fri', organic: 1890, direct: 4800 },
  { name: 'Sat', organic: 2390, direct: 3800 },
  { name: 'Sun', organic: 3490, direct: 4300 },
];

const categoryData = [
  { name: 'Hotel', projects: 45 },
  { name: 'SaaS', projects: 80 },
  { name: 'E-Comm', projects: 65 },
  { name: 'Fintech', projects: 90 },
  { name: 'Health', projects: 30 },
];

export function Overview() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [themeDemand, setThemeDemand] = useState<{name: string, projects: number}[]>([]);

  useEffect(() => {
    // Listen to Users
    const uq = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5));
    const unsubUsers = onSnapshot(uq, (snap) => {
      setTotalUsers(snap.docs.length); // If we wanted true total we shouldn't limit, but for demo we can map the whole collection or just use size.
    });

    // Listen to All Users for count (Not recommended for massive collections, but okay for MVP)
    const unsubAllUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setTotalUsers(snap.size);
      
      // Update recent activity with users
      const newUsers = snap.docs
        .map(d => ({ id: d.id, type: 'auth', title: 'New User Registered', desc: `${d.data().email}`, time: d.data().createdAt?.toDate() || new Date() }))
        .sort((a, b) => b.time.getTime() - a.time.getTime());
        
      setRecentActivity(prev => [...prev.filter(p => p.type !== 'auth'), ...newUsers].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5));
    });

    // Listen to Projects
    const unsubProjects = onSnapshot(collection(db, 'projectSubmissions'), (snap) => {
      setTotalProjects(snap.size);
      
      const themes: Record<string, number> = {};
      const newProjects = snap.docs.map(doc => {
        const data = doc.data();
        const theme = data.selections?.theme || 'Unknown';
        themes[theme] = (themes[theme] || 0) + 1;
        
        return {
          id: doc.id,
          type: 'project',
          title: 'Project Submission',
          desc: `Project: ${data.projectId} by ${data.userEmail}`,
          time: data.createdAt?.toDate() || new Date()
        };
      });

      setThemeDemand(Object.entries(themes).map(([name, count]) => ({ name, projects: count })));
      
      setRecentActivity(prev => [...prev.filter(p => p.type !== 'project'), ...newProjects].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5));
    });

    return () => {
      unsubUsers();
      unsubAllUsers();
      unsubProjects();
    };
  }, []);

  const stats = [
    { label: 'Total Traffic', value: '1,248,590', increase: '+14.5%', icon: Activity },
    { label: 'Active Users', value: totalUsers.toLocaleString(), increase: '+5.2%', icon: Users },
    { label: 'Submitted Projects', value: totalProjects.toLocaleString(), increase: '+22.4%', icon: Folders },
    { label: 'Conversion Rate', value: '8.4%', increase: '+1.2%', icon: Zap },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
         <div>
            <h1 className="font-display text-4xl text-white font-medium tracking-tight mb-2">System Metrics</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Real-time holistic ecosystem overview.</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="px-4 py-2 border border-white/10 geometric-clip bg-white/5 font-mono text-xs tracking-widest text-white flex items-center gap-2">
               Date: {format(new Date(), 'MMM dd, yyyy')}
            </div>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             key={i} 
             className="glass-panel geometric-clip border border-white/5 p-6 relative overflow-hidden group hover:border-premium-gold/30 transition-colors bg-gradient-to-br from-white/[0.02] to-transparent"
           >
             <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 rounded-full blur-[50px] group-hover:bg-premium-gold/10 transition-colors" />
             <div className="flex justify-between items-start mb-6 relative z-10">
               <span className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic">{stat.label}</span>
               <div className="w-8 h-8 geometric-clip bg-premium-gold/10 flex items-center justify-center border border-premium-gold/20">
                 <stat.icon className="w-4 h-4 text-premium-gold" />
               </div>
             </div>
             <div className="flex items-baseline gap-4 relative z-10">
               <span className="font-display text-3xl font-medium text-white tracking-tight">{stat.value}</span>
               <span className="font-mono text-[10px] tracking-wider text-oxblood flex items-center gap-1">
                 <ArrowUpRight className="w-3 h-3" /> {stat.increase}
               </span>
             </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel geometric-clip border border-white/5 p-6 bg-dark/50">
           <div className="flex justify-between items-center mb-8">
              <h3 className="font-mono text-xs uppercase tracking-widest text-white">Global Traffic Flow</h3>
              <div className="flex gap-2">
                 <button className="px-3 py-1 font-mono text-[9px] uppercase tracking-widest bg-premium-gold text-white geometric-clip transition-colors">Week</button>
                 <button className="px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-silver-metallic hover:bg-white/5 geometric-clip transition-colors">Month</button>
                 <button className="px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-silver-metallic hover:bg-white/5 geometric-clip transition-colors">Year</button>
              </div>
           </div>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(2,6,23,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="organic" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOrganic)" />
                  <Area type="monotone" dataKey="direct" stroke="#00ffcc" strokeWidth={2} fillOpacity={1} fill="url(#colorDirect)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Secondary Chart */}
        <div className="glass-panel geometric-clip border border-white/5 p-6 bg-dark/50">
           <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-8">Architecture Demand</h3>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={themeDemand.length > 0 ? themeDemand : categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                 <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                 <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ backgroundColor: 'rgba(2,6,23,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  />
                 <Bar dataKey="projects" fill="#3b82f6" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
      
      {/* Activity Feed Snippet */}
      <div className="glass-panel geometric-clip border border-white/5 p-6 bg-dark/50">
         <div className="flex justify-between items-center mb-6">
           <h3 className="font-mono text-xs uppercase tracking-widest text-white">Live Activity Stream</h3>
           <button className="text-[10px] font-mono text-premium-gold uppercase tracking-widest hover:text-white transition-colors">View All Events →</button>
         </div>
         <div className="space-y-4">
           {recentActivity.length > 0 ? recentActivity.map((log, i) => (
             <div key={log.id || i} className="flex gap-4 p-4 border border-white/5 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
               <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-premium-gold opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-2 h-2 mt-1.5 rounded-full bg-premium-gold" />
               <div>
                 <p className="font-sans text-sm font-medium text-white">{log.title}</p>
                 <p className="font-mono text-[10px] text-silver-metallic tracking-wider mt-1">{log.desc}</p>
               </div>
               <span className="ml-auto font-mono text-[10px] text-silver-metallic whitespace-nowrap">{formatDistanceToNow(log.time, { addSuffix: true })}</span>
             </div>
           )) : (
              <div className="text-center font-mono text-xs text-silver-metallic py-4">No recent activity</div>
           )}
         </div>
      </div>
    </motion.div>
  );
}
