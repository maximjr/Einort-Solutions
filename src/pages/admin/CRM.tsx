import { motion } from 'motion/react';
import { Plus, Search, Filter, MoreHorizontal, MessageSquare, Phone, Mail, TrendingUp, DollarSign, Calendar, BarChart3, ChevronDown, Activity } from 'lucide-react';
import { useCRMStore, LeadStage, Lead } from '../../features/crm/store/crmStore';

const STAGES: LeadStage[] = ['New Lead', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

export function AdminCRM() {
  const { leads, activeStage, setActiveStage, searchQuery, setSearchQuery } = useCRMStore();

  const filteredLeads = leads.filter(lead => {
    const matchesStage = activeStage === 'All' || lead.stage === activeStage;
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.contact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalPipelineValue = filteredLeads.reduce((acc, lead) => acc + lead.value, 0);
  const avgProbability = Math.round(filteredLeads.reduce((acc, lead) => acc + (lead.forecast || 0), 0) / (filteredLeads.length || 1));

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-medium text-white tracking-tight">CRM Pipeline</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-premium-gold/10 text-premium-gold border border-premium-gold/20">Enterprise</span>
          </div>
          <p className="text-white/50 font-sans text-sm max-w-md">Manage deal flow, analyze lead scoring, and optimize sales forecasting with AI-driven insights.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-lg hover:bg-white/5 text-xs font-semibold uppercase tracking-widest text-silver-metallic hover:text-white transition-all">
            <Filter className="w-4 h-4" /> Filter Views
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-dark rounded-lg font-semibold text-xs uppercase tracking-widest hover:brightness-90 transition-all shadow-lg">
            <Plus className="w-4 h-4" /> Add Prospect
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <DollarSign className="w-5 h-5 text-premium-gold" />
            </div>
            <span className="flex items-center gap-1 text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded"><TrendingUp className="w-3 h-3"/> +12.5%</span>
          </div>
          <div>
            <h4 className="text-white/50 font-mono text-[10px] uppercase tracking-widest mb-1">Total Pipeline Value</h4>
            <div className="text-3xl font-display font-medium text-white tracking-tight">{formatCurrency(totalPipelineValue)}</div>
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Activity className="w-5 h-5 text-premium-gold" />
            </div>
            <span className="flex items-center gap-1 text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded"><TrendingUp className="w-3 h-3"/> +5.2%</span>
          </div>
          <div>
            <h4 className="text-white/50 font-mono text-[10px] uppercase tracking-widest mb-1">Active Prospects</h4>
            <div className="text-3xl font-display font-medium text-white tracking-tight">{filteredLeads.length} <span className="text-sm text-white/30 font-sans tracking-normal">deals</span></div>
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
           <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <BarChart3 className="w-5 h-5 text-premium-gold" />
            </div>
          </div>
          <div>
            <h4 className="text-white/50 font-mono text-[10px] uppercase tracking-widest mb-1">Avg Win Probability</h4>
            <div className="text-3xl font-display font-medium text-white tracking-tight">{avgProbability}% <span className="text-sm text-white/30 font-sans tracking-normal">forecast</span></div>
          </div>
        </div>
      </div>

      <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col h-[600px]">
        {/* CRM Header / Stages */}
        <div className="p-5 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-x-auto custom-scrollbar shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveStage('All')}
              className={`px-5 py-2.5 rounded-lg font-mono text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap transition-all ${activeStage === 'All' ? 'bg-white text-dark shadow-md' : 'bg-transparent text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              All Pipelines
            </button>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            {STAGES.map(stage => (
              <button 
                key={stage}
                onClick={() => setActiveStage(stage)}
                className={`px-4 py-2.5 rounded-lg font-mono text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${activeStage === stage ? 'bg-white/10 text-white border border-white/20' : 'bg-transparent text-white/40 border border-transparent hover:text-white hover:bg-white/5'}`}
              >
                {stage}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organizations..." 
              className="pl-11 pr-4 py-2.5 bg-dark-surface border border-white/10 rounded-lg text-sm font-sans text-white focus:outline-none focus:border-premium-gold/50 transition-all w-full lg:w-64 focus:w-80 shadow-inner"
            />
          </div>
        </div>

        {/* CRM Board / List */}
        <div className="flex-1 overflow-auto custom-scrollbar p-2">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr>
                 <th className="sticky top-0 bg-dark-surface/95 backdrop-blur-md pb-4 pt-6 px-6 font-mono text-[10px] uppercase tracking-widest text-white/50 font-normal border-b border-white/5 z-10 w-1/4">Organization</th>
                 <th className="sticky top-0 bg-dark-surface/95 backdrop-blur-md pb-4 pt-6 px-4 font-mono text-[10px] uppercase tracking-widest text-white/50 font-normal border-b border-white/5 z-10">Lead Scoring</th>
                 <th className="sticky top-0 bg-dark-surface/95 backdrop-blur-md pb-4 pt-6 px-4 font-mono text-[10px] uppercase tracking-widest text-white/50 font-normal border-b border-white/5 z-10">Pipeline Stage</th>
                 <th className="sticky top-0 bg-dark-surface/95 backdrop-blur-md pb-4 pt-6 px-4 font-mono text-[10px] uppercase tracking-widest text-white/50 font-normal border-b border-white/5 z-10 text-right">Proj. Value</th>
                 <th className="sticky top-0 bg-dark-surface/95 backdrop-blur-md pb-4 pt-6 px-6 font-mono text-[10px] uppercase tracking-widest text-white/50 font-normal border-b border-white/5 z-10 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="text-sm">
               {filteredLeads.map(lead => (
                 <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                   <td className="py-5 px-6">
                     <div className="font-display font-medium text-white group-hover:text-premium-gold transition-colors flex items-center gap-3">
                       {lead.name}
                       {lead.status === 'Hot' && <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                     </div>
                     <div className="flex items-center gap-2 mt-2">
                       <span className="text-[11px] font-sans text-white/60">{lead.contact}</span>
                       <span className="w-1 h-1 rounded-full bg-white/20"></span>
                       <span className="text-[11px] font-mono text-white/40">{lead.date}</span>
                     </div>
                   </td>
                   <td className="py-5 px-4 w-1/3">
                     <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-3">
                         <span className={`inline-flex items-center justify-center min-w-[40px] py-1 rounded bg-dark border font-mono text-[10px] font-bold ${lead.score >= 90 ? 'text-green-400 border-green-400/20' : lead.score >= 70 ? 'text-yellow-400 border-yellow-400/20' : 'text-red-400 border-red-400/20'}`}>
                           {lead.score}
                         </span>
                         <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Match Score</span>
                       </div>
                       <span className="text-xs font-sans text-white/50 truncate pr-4 leading-relaxed tracking-wide">{lead.aiNote}</span>
                     </div>
                   </td>
                   <td className="py-5 px-4">
                     <button className="inline-flex items-center justify-between min-w-[140px] px-3 py-1.5 bg-dark-surface border border-white/10 hover:border-white/20 rounded-md transition-colors group/btn">
                       <span className="text-[10px] font-mono uppercase tracking-wider text-white/80">{lead.stage}</span>
                       <ChevronDown className="w-3 h-3 text-white/30 group-hover/btn:text-white/60" />
                     </button>
                   </td>
                   <td className="py-5 px-4 text-right">
                     <div className="font-mono text-white/90">{formatCurrency(lead.value)}</div>
                     <div className="text-[10px] font-sans text-white/40 mt-1">{lead.forecast}% Win Prob</div>
                   </td>
                   <td className="py-5 px-6">
                     <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 hover:bg-white/10 rounded-lg transition-colors tooltip-trigger" title="Email Contact"><Mail className="w-4 h-4 text-white" /></button>
                       <button className="p-2 hover:bg-white/10 rounded-lg transition-colors tooltip-trigger" title="Log Call"><Phone className="w-4 h-4 text-white" /></button>
                       <button className="p-2 hover:bg-white/10 rounded-lg transition-colors tooltip-trigger" title="Add Note"><MessageSquare className="w-4 h-4 text-white" /></button>
                       <button className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-2"><MoreHorizontal className="w-4 h-4 text-white" /></button>
                     </div>
                   </td>
                 </tr>
               ))}
               {filteredLeads.length === 0 && (
                 <tr>
                   <td colSpan={5} className="py-16 text-center">
                     <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                       <Search className="w-6 h-6 text-white/30" />
                     </div>
                     <p className="text-white/50 font-sans text-sm">No prospects found matching your criteria.</p>
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      </div>
    </motion.div>
  );
}
