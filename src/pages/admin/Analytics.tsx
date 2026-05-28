import { motion } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, getDocs, limit, orderBy } from 'firebase/firestore';
import { Target, Activity, Users, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { useDebouncedSnapshot } from '../../hooks/useDebouncedSnapshot';

export function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [retentionData, setRetentionData] = useState<{name: string, value: number}[]>([]);
  const [servicePerformance, setServicePerformance] = useState<{name: string, value: number}[]>([]);
  const [industryTrends, setIndustryTrends] = useState<{name: string, value: number}[]>([]);
  
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    totalPipelineValue: 0,
    wonValue: 0,
    hotLeads: 0,
    conversionRate: 0,
    totalEvents: 0
  });

  const [baseStats, setBaseStats] = useState({ totalUsers: 1, customRequests: 0 });
  const [activityStats, setActivityStats] = useState({ protoStarted: 0, protoCompleted: 0, protoAbandoned: 0, totalEvents: 0 });
  const [leadStats, setLeadStats] = useState({ count: 0, pipValue: 0, wonValue: 0, hLeads: 0, qualifiedLeads: 0, wonLeads: 0 });

  useEffect(() => {
    const fetchBase = async () => {
      const qProjects = query(collection(db, 'projectSubmissions'));
      const qCustom = query(collection(db, 'customProjects'));
      const qUsers = query(collection(db, 'users'));

      const [projectDocs, customDocs, userDocs] = await Promise.all([
        getDocs(qProjects), getDocs(qCustom), getDocs(qUsers)
      ]);

      setBaseStats({
        totalUsers: Math.max(1, userDocs.docs.length),
        customRequests: customDocs.docs.length
      });
    };
    fetchBase();
  }, []);

  const qActivity = useMemo(() => query(collection(db, 'clientActivity'), orderBy('timestamp', 'desc'), limit(1000)), []);
  useDebouncedSnapshot(qActivity, (snap) => {
    let protoStarted = 0;
    let protoCompleted = 0;
    let protoAbandoned = 0;
    let serviceViews: Record<string, number> = {};
    let industries: Record<string, number> = {};
    let totalEvents = snap.docs.length;

    snap.docs.forEach(doc => {
      const d = doc.data();
      if (d.type === 'started_prototype') protoStarted++;
      if (d.type === 'completed_prototype') protoCompleted++;
      if (d.type === 'abandoned_prototype' || (d.details && d.details.includes('abandoned'))) protoAbandoned++;
      
      if (d.type === 'opened_services' && d.details) {
         const svc = d.details.replace('Viewed custom service: ', '').split(' ')[0];
         if (svc && svc !== 'Viewed') {
            serviceViews[svc] = (serviceViews[svc] || 0) + 1;
         }
      }
      
      if (d.industry && d.industry !== 'Unknown') {
         industries[d.industry] = (industries[d.industry] || 0) + 1;
      }
    });

    const topServices = Object.keys(serviceViews)
       .map(k => ({ name: k, value: serviceViews[k] }))
       .sort((a, b) => b.value - a.value)
       .slice(0, 4);

    if (topServices.length === 0) {
       topServices.push({ name: 'Healthcare', value: 0 }, { name: 'SaaS', value: 0 });
    }

    const topIndustries = Object.keys(industries)
       .map(k => ({ name: k, value: industries[k] }))
       .sort((a, b) => b.value - a.value)
       .slice(0, 5);

    setServicePerformance(topServices);
    setIndustryTrends(topIndustries);
    setActivityStats({ protoStarted, protoCompleted, protoAbandoned, totalEvents });
  }, 1000);

  const qLeads = useMemo(() => query(collection(db, 'leads')), []);
  useDebouncedSnapshot(qLeads, (leadSnap) => {
    let pipValue = 0;
    let wValue = 0;
    let hLeads = 0;
    let count = leadSnap.docs.length;
    let qualifiedLeads = 0;
    let wonLeads = 0;

    leadSnap.docs.forEach(doc => {
      const data = doc.data();
      if (data.stage === 'Won' || data.stage === 'won') {
        wValue += data.value || 0;
        wonLeads++;
      } else if (data.stage !== 'Lost' && data.stage !== 'lost') {
        pipValue += data.value || 0;
        if (data.stage !== 'new') qualifiedLeads++;
      }
      if (data.status === 'Hot') hLeads++;
    });

    setLeadStats({ count, pipValue, wonValue: wValue, hLeads, qualifiedLeads, wonLeads });
    setLoading(false);
  }, 1000);

  useEffect(() => {
    setRetentionData([
      { name: 'Total Users', value: baseStats.totalUsers },
      { name: 'Started Prototypes', value: activityStats.protoStarted },
      { name: 'Completed Requests', value: activityStats.protoCompleted },
      { name: 'Total CRM Leads', value: leadStats.count },
      { name: 'Qualified Pursuits', value: leadStats.qualifiedLeads },
      { name: 'Closed Won', value: leadStats.wonLeads }
    ]);

    setMetrics({
      totalLeads: leadStats.count,
      totalPipelineValue: leadStats.pipValue,
      wonValue: leadStats.wonValue,
      hotLeads: leadStats.hLeads,
      conversionRate: leadStats.wonLeads > 0 && leadStats.count > 0 ? (leadStats.wonLeads / leadStats.count) * 100 : 0,
      totalEvents: activityStats.totalEvents
    });
  }, [baseStats, activityStats, leadStats]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-8"
    >
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl text-white font-medium tracking-tight mb-2">Business Analytics</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-premium-gold/10 text-premium-gold border border-premium-gold/20 flex items-center gap-1">
                <Zap className="w-3 h-3" /> LIVE PROCESSING
              </span>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Real-time analytical mapping and CRM performance matrices.</p>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="glass-panel border border-white/5 geometric-clip p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-[40px] group-hover:bg-white/10 transition-colors" />
           <h4 className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1 relative z-10">Active Pipeline Value</h4>
           <div className="font-display text-2xl text-white relative z-10">{formatCurrency(metrics.totalPipelineValue)}</div>
        </div>
        <div className="glass-panel border border-white/5 geometric-clip p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-[40px] group-hover:bg-green-500/10 transition-colors" />
           <h4 className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1 relative z-10">Closed Won Revenue</h4>
           <div className="font-display text-2xl text-green-400 relative z-10">{formatCurrency(metrics.wonValue)}</div>
        </div>
        <div className="glass-panel border border-white/5 geometric-clip p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-premium-gold/5 rounded-full blur-[40px] group-hover:bg-premium-gold/10 transition-colors" />
           <h4 className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1 relative z-10">Absolute Priority Leads</h4>
           <div className="font-display text-2xl text-premium-gold relative z-10">{metrics.hotLeads}</div>
        </div>
        <div className="glass-panel border border-white/5 geometric-clip p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[40px] group-hover:bg-blue-500/10 transition-colors" />
           <h4 className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1 relative z-10">Win Rate Conversion</h4>
           <div className="font-display text-2xl text-white relative z-10">{metrics.conversionRate.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Deep Funnel Analytics */}
         <div className="glass-panel border border-white/5 geometric-clip p-6 bg-dark/50 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-xs uppercase tracking-widest text-white flex items-center gap-2"><Target className="w-4 h-4 text-premium-gold" /> End-to-End User Conversion Funnel</h3>
            </div>
            <div className="flex-1 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={retentionData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                   <defs>
                      <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                   <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                   <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(2,6,23,0.95)', borderColor: 'rgba(212,175,55,0.2)', borderRadius: '0px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#fff', fontSize: '12px' }}
                   />
                   <Area type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={2} fill="url(#colorRetention)" />
                 </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="flex flex-col gap-6 h-[400px]">
           {/* Service Performance Intelligence */}
           <div className="glass-panel border-white/5 geometric-clip p-6 bg-dark/50 flex flex-col flex-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none"><Activity className="w-32 h-32 text-white" /></div>
             <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-6 relative z-10">Service Performance Intel</h3>
             {servicePerformance.length > 0 ? (
               <div className="space-y-4 relative z-10">
                 {servicePerformance.map((svc, i) => (
                   <div key={i}>
                     <div className="flex justify-between font-mono text-[10px] tracking-widest uppercase mb-2">
                       <span className="text-white">{svc.name}</span>
                       <span className="text-premium-gold">{svc.value} Interactions</span>
                     </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-premium-gold transition-all duration-1000" style={{width: `${Math.min(100, Math.max(5, (svc.value / metrics.totalEvents) * 100 * 5))}%`}} />
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="flex-1 flex items-center justify-center font-mono text-xs text-silver-metallic z-10 relative">Awaiting engagement data...</div>
             )}
           </div>

           {/* AI Diagnostic Board */}
           <div className="glass-panel border-premium-gold/20 geometric-clip p-6 bg-premium-gold/5 flex-1 flex flex-col border">
             <h3 className="font-mono text-xs uppercase tracking-widest text-premium-gold mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Operations Forecast</h3>
             <div className="mt-auto space-y-4 font-mono text-[10px] uppercase tracking-widest text-white/70">
               <div className="flex justify-between items-center border-b border-white/10 pb-2">
                 <span>Lead Win Rate Trajectory</span>
                 <span className="text-white flex items-center gap-1">Trending <ArrowRight className="w-3 h-3 text-premium-gold" /> {Math.min(100, (metrics.conversionRate * 1.2)).toFixed(1)}%</span>
               </div>
               <div className="flex justify-between items-center pb-1">
                 <span>Projected Q3 Closure</span>
                 <span className="text-white font-bold tracking-tight text-xs bg-white/10 px-2 py-0.5 rounded">{formatCurrency((metrics.totalPipelineValue * (metrics.conversionRate / 100)) + metrics.wonValue)}</span>
               </div>
             </div>
           </div>
         </div>
         
         {/* Industry Trend Analytics */}
         <div className="lg:col-span-2 glass-panel border border-white/5 geometric-clip p-6 bg-dark/50 mt-2">
           <div className="flex justify-between items-center mb-8">
              <h3 className="font-mono text-xs uppercase tracking-widest text-white">Industry Interest Matrix</h3>
           </div>
           <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={industryTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                 <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                 <Tooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                   contentStyle={{ backgroundColor: 'rgba(2,6,23,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0px', fontFamily: 'monospace' }}
                   itemStyle={{ color: '#fff', fontSize: '12px' }}
                 />
                 <Bar dataKey="value" fill="#fff" radius={[2, 2, 0, 0]} name="Engagement Vol" />
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>

      </div>
    </motion.div>
  );
}
