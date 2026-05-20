import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const retentionData = [
  { name: 'Week 1', value: 100 },
  { name: 'Week 2', value: 85 },
  { name: 'Week 3', value: 78 },
  { name: 'Week 4', value: 70 },
  { name: 'Week 5', value: 68 },
  { name: 'Week 6', value: 65 },
];

export function AdminAnalytics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-8"
    >
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="font-display text-4xl text-white font-medium tracking-tight mb-2">Business Intelligence</h1>
            <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Advanced algorithmic insights and conversion mapping.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Retention Chart */}
         <div className="glass-panel border-white/5 geometric-clip p-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-6">User Retention Trajectory</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={retentionData}>
                   <defs>
                      <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                   <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                   <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                   <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(2,6,23,0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
                      itemStyle={{ color: '#fff' }}
                   />
                   <Area type="monotone" dataKey="value" stroke="#00ffcc" fill="url(#colorRetention)" />
                 </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* OS/Device Split */}
         <div className="glass-panel border-white/5 geometric-clip p-6 flex flex-col justify-between">
            <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-6">Device Telemetry</h3>
            
            <div className="space-y-6">
               <div>
                 <div className="flex justify-between font-mono text-[10px] tracking-widest uppercase mb-2">
                   <span className="text-white">Desktop (MacOS)</span>
                   <span className="text-electric-blue">65%</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-electric-blue w-[65%]" />
                 </div>
               </div>
               <div>
                 <div className="flex justify-between font-mono text-[10px] tracking-widest uppercase mb-2">
                   <span className="text-white">Mobile (iOS)</span>
                   <span className="text-neon-blue">25%</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-neon-blue w-[25%]" />
                 </div>
               </div>
               <div>
                 <div className="flex justify-between font-mono text-[10px] tracking-widest uppercase mb-2">
                   <span className="text-white">Other Devices</span>
                   <span className="text-silver-metallic">10%</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-white/20 w-[10%]" />
                 </div>
               </div>
            </div>
            
            <div className="mt-8 p-4 border border-electric-blue/30 bg-electric-blue/5 rounded-lg flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-electric-blue/20 flex flex-shrink-0 items-center justify-center text-electric-blue font-bold font-mono">SYS</div>
              <p className="font-sans text-sm text-silver-metallic">
                <strong className="text-white">Insight:</strong> Desktop conversions for <span className="text-electric-blue">SaaS Templates</span> are up 14% over mobile devices. We recommend optimizing the SaaS preview engine for ultra-wide displays.
              </p>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
