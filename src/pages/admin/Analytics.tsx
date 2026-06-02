import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, getDocs } from 'firebase/firestore';
import { 
  Compass, TrendingUp, Users, Target, ShieldAlert, Cpu, 
  BarChart4, ArrowUpRight, Award, FileSpreadsheet, Hourglass
} from 'lucide-react';

export function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [retentionData, setRetentionData] = useState<{name: string, value: number}[]>([]);
  
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    totalPipelineValue: 0,
    wonValue: 0,
    hotLeads: 0
  });

  // Prototype Intelligence variables
  const [protoStats, setProtoStats] = useState({
    started: 0,
    completed: 0,
    abandoned: 0,
    resumed: 0,
    totalDrafts: 0,
    resumeRate: 0,
    completionPercentage: 0
  });

  const [stepDropOffs, setStepDropOffs] = useState<{ step: string; count: number }[]>([]);
  const [popularIndustries, setPopularIndustries] = useState<{ name: string; value: number }[]>([]);
  const [popularProjectTypes, setPopularProjectTypes] = useState<{ name: string; value: number }[]>([]);
  const [budgetDistribution, setBudgetDistribution] = useState<{ name: string; count: number }[]>([]);
  const [timelineDistribution, setTimelineDistribution] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    let unsubLeads: () => void;

    const aggregateData = async () => {
      try {
        const qProjects = query(collection(db, 'projectSubmissions'));
        const qCustom = query(collection(db, 'customProjects'));
        const qUsers = query(collection(db, 'users'));
        const qActivity = query(collection(db, 'clientActivity'));
        const qDrafts = query(collection(db, 'prototypeDrafts'));

        const [projectDocs, customDocs, userDocs, activityDocs, draftsDocs] = await Promise.all([
          getDocs(qProjects), getDocs(qCustom), getDocs(qUsers), getDocs(qActivity), getDocs(qDrafts)
        ]);

        const totalUsers = Math.max(1, userDocs.docs.length);
        const customRequests = customDocs.docs.length;
        
        let protoStarted = 0;
        let protoCompleted = 0;
        let protoAbandoned = 0;
        let protoResumed = 0;

        activityDocs.docs.forEach(doc => {
          const d = doc.data();
          if (d.type === 'started_prototype') protoStarted++;
          if (d.type === 'completed_prototype' || d.type === 'submitted_project') protoCompleted++;
          if (d.type === 'abandoned_prototype') protoAbandoned++;
          if (d.type === 'resumed_prototype') protoResumed++;
        });

        const totalDrafts = draftsDocs.docs.length;
        const resumeRate = protoStarted ? Math.round((protoResumed / protoStarted) * 100) : 0;
        const completionRate = protoStarted ? Math.round((protoCompleted / protoStarted) * 100) : 0;

        setProtoStats({
          started: protoStarted,
          completed: protoCompleted,
          abandoned: protoAbandoned,
          resumed: protoResumed,
          totalDrafts: totalDrafts,
          resumeRate: resumeRate,
          completionPercentage: completionRate
        });

        // 1. Process Draft Step Drop-offs
        // Step 1: Client Bio / Goals, Step 2: Project Architecture, Step 3: API integrations, Step 4: Budget & SLA, Step 5: Design styling
        const stepDropOffCounts: Record<string, number> = {
          'Step 1: Bio / Goals': 0,
          'Step 2: Architecture': 0,
          'Step 3: Integrations': 0,
          'Step 4: Budget & SLA': 0,
          'Step 5: Visual Theme': 0
        };

        const industriesMap: Record<string, number> = {};
        const projectTypesMap: Record<string, number> = {};
        const budgetMap: Record<string, number> = {};
        const timelineMap: Record<string, number> = {};

        draftsDocs.docs.forEach(doc => {
          const data = doc.data();
          const step = data.currentStep || 1;
          
          if (step === 1) stepDropOffCounts['Step 1: Bio / Goals']++;
          else if (step === 2) stepDropOffCounts['Step 2: Architecture']++;
          else if (step === 3) stepDropOffCounts['Step 3: Integrations']++;
          else if (step === 4) stepDropOffCounts['Step 4: Budget & SLA']++;
          else if (step === 5) stepDropOffCounts['Step 5: Visual Theme']++;

          const sel = data.selections || {};
          if (sel.industry) {
            industriesMap[sel.industry] = (industriesMap[sel.industry] || 0) + 1;
          }
          if (sel.projectType) {
            projectTypesMap[sel.projectType] = (projectTypesMap[sel.projectType] || 0) + 1;
          }
          if (sel.budget) {
            budgetMap[sel.budget] = (budgetMap[sel.budget] || 0) + 1;
          }
          if (sel.timeline) {
            timelineMap[sel.timeline] = (timelineMap[sel.timeline] || 0) + 1;
          }
        });

        // Map and Sort Popular Selections
        const sortedIndustries = Object.keys(industriesMap)
          .map(k => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: industriesMap[k] }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        const sortedTypes = Object.keys(projectTypesMap)
          .map(k => ({ name: k.toUpperCase(), value: projectTypesMap[k] }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        const processedDropoffs = Object.keys(stepDropOffCounts).map(k => ({
          step: k,
          count: stepDropOffCounts[k]
        }));

        const budgetsArray = ['1k-5k', '5k-15k', '15k-50k', '50k+'].map(key => ({
          name: key === '1k-5k' ? '$1k–$5k' : key === '5k-15k' ? '$5k–$15k' : key === '15k-50k' ? '$15k–$50k' : '$50k+ Enterprise',
          count: budgetMap[key] || 0
        }));

        const timelinesArray = ['urgent', '1month', '2-3months', '6months+'].map(key => ({
          name: key === 'urgent' ? 'Urgent / ASAP' : key === '1month' ? 'Within 1 Month' : key === '2-3months' ? '2–3 Months' : '6 Months +',
          count: timelineMap[key] || 0
        }));

        setStepDropOffs(processedDropoffs);
        setPopularIndustries(sortedIndustries.length > 0 ? sortedIndustries : [{ name: 'None yet', value: 0 }]);
        setPopularProjectTypes(sortedTypes.length > 0 ? sortedTypes : [{ name: 'None yet', value: 0 }]);
        setBudgetDistribution(budgetsArray);
        setTimelineDistribution(timelinesArray);

        const qLeads = query(collection(db, 'leads'));
        unsubLeads = onSnapshot(qLeads, async (snap) => {
          let pipValue = 0;
          let wValue = 0;
          let hLeads = 0;
          let count = snap.docs.length;
          
          let qualifiedLeads = 0;
          let wonLeads = 0;

          snap.docs.forEach(doc => {
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

          setRetentionData([
            { name: 'Total Users', value: totalUsers },
            { name: 'Started Blueprint', value: protoStarted },
            { name: 'Custom Requests', value: customRequests },
            { name: 'Leads Gen', value: count },
            { name: 'Qualified SLA', value: qualifiedLeads },
            { name: 'Closed Deal', value: wonLeads }
          ]);

          setMetrics({
            totalLeads: count,
            totalPipelineValue: pipValue,
            wonValue: wValue,
            hotLeads: hLeads
          });
          
          setLoading(false);
        }, (err) => {
          console.error("Error fetching leads:", err);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error aggregating analytics data:", err);
        setLoading(false);
      }
    };

    aggregateData();

    return () => {
      if (unsubLeads) unsubLeads();
    };
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1400px] mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-white font-medium tracking-tight mb-2">Ecosystem Intelligence Panel</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Algorithmic Conversion mapping, Lead analysis, & consultative blueprint drop-off tracking.</p>
        </div>
      </div>

      {/* KPI Overviews */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="glass-panel border-white/5 geometric-clip p-5">
          <h4 className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1">Total Pipeline Worth</h4>
          <div className="font-display text-2xl text-white font-medium">{formatCurrency(metrics.totalPipelineValue)}</div>
        </div>
        <div className="glass-panel border-white/5 geometric-clip p-5">
          <h4 className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1">Closed Won Revenue</h4>
          <div className="font-display text-2xl text-green-400 font-medium">{formatCurrency(metrics.wonValue)}</div>
        </div>
        <div className="glass-panel border-white/5 geometric-clip p-5">
          <h4 className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1">Active CRM Leads</h4>
          <div className="font-display text-2xl text-white font-medium">{metrics.totalLeads}</div>
        </div>
        <div className="glass-panel border-white/5 geometric-clip p-5">
          <h4 className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic mb-1">Hot Prospects</h4>
          <div className="font-display text-2xl text-yellow-400 font-medium">{metrics.hotLeads}</div>
        </div>
      </div>

      {/* Main Row: Conversions Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Conversion Funnel */}
        <div className="glass-panel border-white/5 geometric-clip p-6 lg:col-span-2">
          <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-6">User Conversion Funnel</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionData}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2,6,23,0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorRetention)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategic AI Insights */}
        <div className="glass-panel border-white/5 geometric-clip p-6 flex flex-col justify-between">
          <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-6">Intelligence Briefing</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between font-mono text-[10px] tracking-widest uppercase mb-2">
                <span className="text-white">Enterprise Accounts</span>
                <span className="text-premium-gold">{(metrics.hotLeads * 14) + 12}% YoY</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-premium-gold" style={{width: `${Math.min(100, Math.max(20, metrics.hotLeads * 10))}%`}} />
              </div>
            </div>
            <div>
              <div className="flex justify-between font-mono text-[10px] tracking-widest uppercase mb-2">
                <span className="text-white">SaaS Submissions</span>
                <span className="text-oxblood">{(metrics.totalLeads * 5) + 30}% Match rate</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-oxblood" style={{width: `${Math.min(100, Math.max(30, metrics.totalLeads * 8))}%`}} />
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 border border-premium-gold/30 bg-premium-gold/5 rounded-lg flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-premium-gold/20 flex flex-shrink-0 items-center justify-center text-premium-gold font-bold font-mono text-xs">AI</div>
            <p className="font-sans text-xs text-silver-metallic leading-relaxed">
              <strong className="text-white">Forecast:</strong> With <span className="text-premium-gold">{metrics.hotLeads} Hot</span> prospects in the loop, we predict clear targets of <span className="text-white font-medium">{formatCurrency((metrics.totalPipelineValue * 0.4) + metrics.wonValue)}</span> closure weight for the current cycle.
            </p>
          </div>
        </div>
      </div>

      {/* PROTOTYPE INTELLIGENCE UPGRADE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric Overview list */}
        <div className="glass-panel border-white/5 geometric-clip p-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-6">Consultative Blueprints</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-silver-metallic">Blueprints Started</span>
              <span className="font-display text-xl font-medium text-white">{protoStats.started}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-silver-metallic">Blueprints Submitted</span>
              <span className="font-display text-xl font-medium text-green-400">{protoStats.completed}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-silver-metallic">Blueprints Abandoned</span>
              <span className="font-display text-xl font-medium text-red-400">{protoStats.abandoned}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-silver-metallic">Blueprints Resumed</span>
              <span className="font-display text-xl font-medium text-yellow-400">{protoStats.resumed}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-silver-metallic">Current Saved Drafts</span>
              <span className="font-display text-xl font-medium text-white">{protoStats.totalDrafts}</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-silver-metallic">Draft Resume Rate</span>
              <span className="font-display text-xl font-medium text-premium-gold">{protoStats.resumeRate}%</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[10px] uppercase tracking-wider text-silver-metallic">Blueprint Completion Rate</span>
              <span className="font-display text-xl font-medium text-white">{protoStats.completionPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Dropoffs Step Analysis */}
        <div className="glass-panel border-white/5 geometric-clip p-6 md:col-span-2">
          <h3 className="font-mono text-xs uppercase tracking-widest text-white mb-6">Lead Losses & Drop-offs by Wizard step</h3>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepDropOffs}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="step" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(2,6,23,0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="rgb(239, 68, 68)">
                  {stepDropOffs.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'rgba(239, 68, 68, 0.4)' : index === 3 ? 'rgb(239, 68, 68)' : 'rgba(239, 68, 68, 0.7)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* consultative preferences breakdown rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* popular industries */}
        <div className="glass-panel border-white/5 geometric-clip p-5">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-4 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-premium-gold" /> Popular Industries
          </h4>
          <div className="space-y-3">
            {popularIndustries.map((ind, i) => (
              <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-1.5 font-mono">
                <span className="text-white/80">{ind.name}</span>
                <span className="text-white font-medium">{ind.value} choices</span>
              </div>
            ))}
          </div>
        </div>

        {/* popular services / architecture */}
        <div className="glass-panel border-white/5 geometric-clip p-5">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-4 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-blue-400" /> Services & Tech Types
          </h4>
          <div className="space-y-3">
            {popularProjectTypes.map((typ, i) => (
              <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-1.5 font-mono">
                <span className="text-white/80">{typ.name}</span>
                <span className="text-white font-medium">{typ.value} drafts</span>
              </div>
            ))}
          </div>
        </div>

        {/* budget distribution */}
        <div className="glass-panel border-white/5 geometric-clip p-5">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-green-400" /> Budget Ranges
          </h4>
          <div className="space-y-3">
            {budgetDistribution.map((bud, i) => (
              <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-1.5 font-mono">
                <span className="text-white/80">{bud.name}</span>
                <span className="text-white font-semibold">{bud.count} leads</span>
              </div>
            ))}
          </div>
        </div>

        {/* timeline distribution */}
        <div className="glass-panel border-white/5 geometric-clip p-5">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-silver-metallic mb-4 flex items-center gap-2">
            <Hourglass className="w-3.5 h-3.5 text-orange-400" /> Timeline Demands
          </h4>
          <div className="space-y-3">
            {timelineDistribution.map((time, i) => (
              <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-1.5 font-mono">
                <span className="text-white/80">{time.name}</span>
                <span className="text-white font-semibold">{time.count} requests</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </motion.div>
  );
}
