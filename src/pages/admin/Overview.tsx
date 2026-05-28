import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Users, Folders, Zap, ArrowUpRight, ArrowDownRight, DollarSign, CalendarCheck, Target, Globe, AlertCircle, Timer } from 'lucide-react';
import { format, formatDistanceToNow, startOfDay } from 'date-fns';
import { useCRMStore } from '../../features/crm/store/crmStore';
import { useDebouncedSnapshot } from '../../hooks/useDebouncedSnapshot';

export function Overview() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeSessions: 0,
    totalProjects: 0,
    abandonedPrototypes: 0,
    completedPrototypes: 0,
    consultations: 0,
    sysHealth: '100%'
  });
  
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [trafficData, setTrafficData] = useState<{name: string, events: number, interactions: number}[]>([]);
  const [loadingTraffic, setLoadingTraffic] = useState(true);

  const { leads, initializeListener: initCrm } = useCRMStore();

  const trafficQuery = useMemo(() => query(collection(db, 'clientActivity'), orderBy('timestamp', 'desc'), limit(500)), []);

  useDebouncedSnapshot(trafficQuery, (snap) => {
      const grouped: Record<string, {events: number, interactions: number}> = {};
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      const today = startOfDay(new Date());
      let activeSess = 0;
      let newUsers = 0;
      let abandoned = 0;
      let completed = 0;
      let booked = 0;

      for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        grouped[days[d.getDay()]] = { events: 0, interactions: 0 };
      }

      const activities = snap.docs.map(doc => {
         const data = doc.data();
         if(data.timestamp) {
            const date = data.timestamp.toDate();
            // Check if it's within last 7 days
            const diffTime = Math.abs(new Date().getTime() - date.getTime());
            if (diffTime < 7 * 24 * 60 * 60 * 1000) {
               const day = days[date.getDay()];
               if (grouped[day]) {
                 grouped[day].interactions++;
                 if(data.type === 'logged_in' || data.type === 'started_prototype' || data.type === 'opened_services' || data.type === 'viewed_pricing') {
                   grouped[day].events++;
                 }
               }
            }
            
            // Today's metrics
            if (date >= today) {
              if (data.type === 'logged_in') activeSess++;
              if (data.type === 'signed_up') newUsers++;
              if (data.type === 'booked_consultation') booked++;
            }
            // All-time in this window
            if (data.type === 'abandoned_prototype' || data.type === 'prototype_abandoned' || (data.details && data.details.includes('abandon'))) abandoned++;
            if (data.type === 'completed_prototype') completed++;
         }
         return {
          id: doc.id,
          type: data.type || 'system',
          title: data.details || 'Action logged',
          desc: data.email || data.userId || 'Anonymous User',
          time: data.timestamp?.toDate() || new Date(),
          industry: data.industry || 'Unknown'
         };
      });
      
      const realData = Object.keys(grouped).map(key => ({ name: key, ...grouped[key] }));
      
      const todayIdx = new Date().getDay();
      const orderedData = [];
      for(let i=6; i>=0; i--) {
         const idx = (todayIdx - i + 7) % 7;
         orderedData.push(realData.find(d => d.name === days[idx]) || { name: days[idx], events: 0, interactions: 0 });
      }

      setTrafficData(orderedData);
      setRecentActivity(activities.slice(0, 20));
      setMetrics(p => ({
         ...p,
         activeSessions: activeSess,
         newUsersToday: newUsers,
         abandonedPrototypes: abandoned,
         completedPrototypes: completed,
         consultations: booked
      }));
      setLoadingTraffic(false);
  }, 1000, (err) => console.error("Error fetching traffic:", err));

  const usersQuery = useMemo(() => collection(db, 'users'), []);
  useDebouncedSnapshot(usersQuery, (snap) => {
    setMetrics(p => ({...p, totalUsers: snap.size}));
  }, 1000);

  const customProjectsQuery = useMemo(() => collection(db, 'customProjects'), []);
  useDebouncedSnapshot(customProjectsQuery, (snap) => {
    setMetrics(p => ({...p, totalProjects: snap.size}));
  }, 1000);

  useEffect(() => {
    const unsubCrm = initCrm();
    return () => {
      unsubCrm();
    };
  }, []);

  const totalPipelineRevenue = leads.reduce((acc, l) => acc + l.value, 0);
  const conversionRate = metrics.completedPrototypes > 0 ? ((metrics.completedPrototypes / (metrics.completedPrototypes + metrics.abandonedPrototypes)) * 100).toFixed(1) : 0;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const stats = [
    { label: 'Active Pipeline', value: formatCurrency(totalPipelineRevenue), increase: '+14.5%', icon: DollarSign, trend: 'up' },
    { label: 'Total Users', value: metrics.totalUsers.toLocaleString(), increase: `+${metrics.newUsersToday} Today`, icon: Users, trend: 'up' },
    { label: 'Active Sessions', value: metrics.activeSessions, increase: 'Live', icon: Globe, trend: 'up' },
    { label: 'Conversion Rate', value: `${conversionRate}%`, increase: 'Prototypes', icon: Target, trend: 'up' },
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
            <h1 className="font-display text-4xl text-white font-medium tracking-tight mb-2">Executive Command Center</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Real-time holistic ecosystem overview and unified system metrics.</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="px-4 py-2 border border-premium-gold/30 geometric-clip bg-premium-gold/10 font-mono text-xs tracking-widest text-premium-gold flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
               LIVE CONNECTION
               <div className="w-1.5 h-1.5 rounded-full bg-premium-gold animate-pulse" />
            </div>
         </div>
      </div>

      {/* Primary KPI Cards */}
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
               <div className="w-8 h-8 geometric-clip bg-dark flex items-center justify-center border border-white/10 group-hover:border-premium-gold/30 transition-colors">
                 <stat.icon className="w-4 h-4 text-premium-gold" />
               </div>
             </div>
             <div className="flex items-baseline gap-3 relative z-10">
               <span className="font-display text-3xl font-medium text-white tracking-tight">{stat.value}</span>
               <span className={`font-mono text-[10px] tracking-wider flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-400 bg-green-400/10' : 'text-oxblood bg-oxblood/10'} px-1.5 py-0.5 rounded`}>
                 {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {stat.increase}
               </span>
             </div>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Intelligence Chart */}
        <div className="lg:col-span-2 glass-panel geometric-clip border border-white/5 p-6 bg-dark/50 flex flex-col">
           <div className="flex justify-between items-center mb-8">
              <div>
                 <h3 className="font-mono text-xs uppercase tracking-widest text-white">Global Traffic & Engagement</h3>
                 <p className="font-mono text-[9px] text-silver-metallic mt-1 uppercase tracking-widest">Cross-platform session analysis</p>
              </div>
              <div className="flex gap-2">
                 <span className="px-2 py-1 bg-white/5 text-[9px] font-mono uppercase tracking-widest text-white/70">7 Days</span>
              </div>
           </div>
           <div className="h-[300px] w-full mt-auto">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(2,6,23,0.95)', borderColor: 'rgba(212,175,55,0.2)', borderRadius: '0px', fontSize: '12px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="interactions" stroke="#ffffff" strokeOpacity={0.5} strokeWidth={2} fillOpacity={1} fill="url(#colorDirect)" name="Pageviews" />
                  <Area type="monotone" dataKey="events" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorOrganic)" name="Key Conversions" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Real-time Event Feed */}
        <div className="glass-panel geometric-clip border border-white/5 p-6 bg-dark/50 flex flex-col h-[400px] lg:h-auto">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-mono text-xs uppercase tracking-widest text-white">Live Event Stream</h3>
             <div className="flex items-center gap-2">
               <span className="font-mono text-[9px] text-premium-gold uppercase tracking-widest">{metrics.activeSessions} Active</span>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
             <AnimatePresence>
             {recentActivity.length > 0 ? recentActivity.map((log, i) => {
               let dotColor = 'bg-gray-500';
               let icon = <Activity className="w-3 h-3" />;
               
               if (log.type.includes('started')) { dotColor = 'bg-blue-400'; icon = <Timer className="w-3 h-3" />; }
               else if (log.type.includes('completed')) { dotColor = 'bg-green-400'; icon = <Target className="w-3 h-3" />; }
               else if (log.type.includes('consultation')) { dotColor = 'bg-premium-gold'; icon = <CalendarCheck className="w-3 h-3 truncate text-dark" />; }
               else if (log.type.includes('logged') || log.type.includes('signed')) { dotColor = 'bg-purple-400'; icon = <Users className="w-3 h-3" />; }
               else if (log.type.includes('abandon')) { dotColor = 'bg-oxblood'; icon = <AlertCircle className="w-3 h-3" />; }
               
               return (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 key={log.id || i} 
                 className="flex gap-3 p-3 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative group"
               >
                 <div className={`absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${dotColor.replace('bg-', 'bg-')}`} />
                 <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${dotColor} bg-opacity-20 text-${dotColor.split('-')[1]}-400`}>
                    {icon}
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="font-sans text-xs font-medium text-white truncate">{log.title}</p>
                   <p className="font-mono text-[9px] text-silver-metallic tracking-wider truncate hidden md:block">{log.desc}</p>
                 </div>
                 <span className="font-mono text-[9px] text-premium-gold/70 whitespace-nowrap pt-0.5">{formatDistanceToNow(log.time, { addSuffix: true }).replace('about ', '')}</span>
               </motion.div>
             )}) : (
                <div className="text-center font-mono text-xs text-silver-metallic py-4">No recent activity detected.</div>
             )}
             </AnimatePresence>
           </div>
        </div>
      </div>
      
      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="p-4 border border-white/5 bg-white/[0.02]">
            <p className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1">Abandoned Prototypes</p>
            <p className="font-display text-xl text-oxblood">{metrics.abandonedPrototypes}</p>
         </div>
         <div className="p-4 border border-white/5 bg-white/[0.02]">
            <p className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1">Completed Prototypes</p>
            <p className="font-display text-xl text-green-400">{metrics.completedPrototypes}</p>
         </div>
         <div className="p-4 border border-white/5 bg-white/[0.02]">
            <p className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1">Consultations Booked</p>
            <p className="font-display text-xl text-premium-gold">{metrics.consultations}</p>
         </div>
         <div className="p-4 border border-white/5 bg-white/[0.02]">
            <p className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1">System Health</p>
            <p className="font-display text-xl text-white">{metrics.sysHealth}</p>
         </div>
      </div>
      
    </motion.div>
  );
}

