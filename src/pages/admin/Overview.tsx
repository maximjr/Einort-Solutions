import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Users, Folders, Zap, ArrowUpRight, DollarSign, CalendarCheck } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useCRMStore } from '../../features/crm/store/crmStore';

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
  const [trafficData, setTrafficData] = useState<{name: string, events: number, interactions: number}[]>([]);
  const [loadingTraffic, setLoadingTraffic] = useState(true);

  const { leads, initializeListener: initCrm } = useCRMStore();

  useEffect(() => {
    const unsubActivityTraffic = onSnapshot(query(collection(db, 'clientActivity'), orderBy('timestamp', 'desc'), limit(150)), (snap) => {
      const grouped: Record<string, {events: number, interactions: number}> = {};
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      // Initialize last 7 days
      for(let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        grouped[days[d.getDay()]] = { events: 0, interactions: 0 };
      }

      snap.docs.forEach(doc => {
         const data = doc.data();
         if(data.timestamp) {
            const date = data.timestamp.toDate();
            // Check if it's within last 7 days
            const diffTime = Math.abs(new Date().getTime() - date.getTime());
            if (diffTime < 7 * 24 * 60 * 60 * 1000) {
               const day = days[date.getDay()];
               if (grouped[day]) {
                 grouped[day].interactions++;
                 if(data.type === 'logged_in' || data.type === 'started_prototype' || data.type === 'opened_services') {
                   grouped[day].events++;
                 }
               }
            }
         }
      });
      
      const realData = Object.keys(grouped).map(key => ({ name: key, ...grouped[key] }));
      
      // Re-order to end with today
      const todayIdx = new Date().getDay();
      const orderedData = [];
      for(let i=6; i>=0; i--) {
         const idx = (todayIdx - i + 7) % 7;
         orderedData.push(realData.find(d => d.name === days[idx]) || { name: days[idx], events: 0, interactions: 0 });
      }

      setTrafficData(orderedData);
      setLoadingTraffic(false);
    });

    return () => unsubActivityTraffic();
  }, []);

  useEffect(() => {
    const unsubCrm = initCrm();
    
    // Listen to All Users for count (Not recommended for massive collections, but okay for MVP)
    const unsubAllUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setTotalUsers(snap.size);
    }, (err) => console.error("Error fetching all users:", err));

    // Listen to Custom Projects for metrics
    const unsubCustom = onSnapshot(collection(db, 'customProjects'), (snap) => {
      setTotalProjects(snap.size);
    });

    // Listen to True Client Activity Stream
    const unsubActivity = onSnapshot(query(collection(db, 'clientActivity'), orderBy('timestamp', 'desc'), limit(15)), (snap) => {
      const activities = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type || 'system',
          title: data.details || 'Action logged',
          desc: data.email || data.userId || 'Anonymous User',
          time: data.timestamp?.toDate() || new Date()
        };
      });
      setRecentActivity(activities);
    });

    return () => {
      unsubCrm();
      unsubAllUsers();
      unsubCustom();
      unsubActivity();
    };
  }, []);

  const totalPipelineRevenue = leads.reduce((acc, l) => acc + l.value, 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const stats = [
    { label: 'Active Pipeline', value: formatCurrency(totalPipelineRevenue), increase: '+14.5%', icon: DollarSign },
    { label: 'Active Users', value: totalUsers.toLocaleString(), increase: '+5.2%', icon: Users },
    { label: 'Submitted Blueprints', value: totalProjects.toLocaleString(), increase: '+22.4%', icon: Folders },
    { label: 'Upcoming Client KPIs', value: '3 Active', increase: 'On Track', icon: CalendarCheck },
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
            <h1 className="font-display text-4xl text-white font-medium tracking-tight mb-2">Agency Command Center</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Real-time holistic ecosystem overview and unified system metrics.</p>
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
              <h3 className="font-mono text-xs uppercase tracking-widest text-white">Global Traffic & System Load</h3>
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
                  <Area type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOrganic)" />
                  <Area type="monotone" dataKey="interactions" stroke="#00ffcc" strokeWidth={2} fillOpacity={1} fill="url(#colorDirect)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Real-time Intel */}
        <div className="glass-panel geometric-clip border border-white/5 p-6 bg-dark/50 flex flex-col">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-mono text-xs uppercase tracking-widest text-white">Live System Observability</h3>
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
             {recentActivity.length > 0 ? recentActivity.map((log, i) => (
               <div key={log.id || i} className="flex gap-4 p-4 border border-white/5 rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
                 <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-premium-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-premium-gold shrink-0" />
                 <div>
                   <p className="font-sans text-sm font-medium text-white">{log.title}</p>
                   <p className="font-mono text-[10px] text-silver-metallic tracking-wider mt-1">{log.desc}</p>
                 </div>
                 <span className="ml-auto font-mono text-[10px] text-silver-metallic whitespace-nowrap">{formatDistanceToNow(log.time, { addSuffix: true })}</span>
               </div>
             )) : (
                <div className="text-center font-mono text-xs text-silver-metallic py-4">No recent activity detected.</div>
             )}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
