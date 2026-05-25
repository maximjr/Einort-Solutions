import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, MoreHorizontal, MessageSquare, Phone, Mail, TrendingUp, DollarSign, Calendar, BarChart3, ChevronDown, Activity, X, User } from 'lucide-react';
import { useCRMStore, LeadStage, Lead } from '../../features/crm/store/crmStore';

const STAGES: LeadStage[] = ['new', 'qualified', 'discovery', 'proposal_sent', 'negotiation', 'won', 'lost'];

export function AdminCRM() {
  const { leads, activeStage, setActiveStage, searchQuery, setSearchQuery, initializeListener, updateLeadStage, addActivity } = useCRMStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    const unsub = initializeListener();
    return () => unsub();
  }, [initializeListener]);

  useEffect(() => {
    if (selectedLead) {
      const updated = leads.find(l => l.id === selectedLead.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedLead)) {
         setSelectedLead(updated);
      }
    }
  }, [leads, selectedLead]);

  const filteredLeads = leads.filter(lead => {
    const matchesStage = activeStage === 'All' || lead.stage === activeStage;
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.contact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalPipelineValue = filteredLeads.reduce((acc, lead) => acc + lead.value, 0);
  const avgProbability = Math.round(filteredLeads.reduce((acc, lead) => acc + (lead.forecast || 0), 0) / (filteredLeads.length || 1));

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const handleAddActivity = () => {
    if (!selectedLead || !noteContent.trim()) return;
    addActivity(selectedLead.id, {
      type: 'Note',
      content: noteContent,
      author: 'Admin'
    });
    setNoteContent('');
  };

  const getStageLabel = (stage: string) => {
     return stage.replace('_', ' ');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto pb-12 relative flex h-full gap-6"
    >
      <div className={`flex-1 transition-all duration-500 ${selectedLead ? 'pr-[400px]' : ''}`}>
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
          <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-x-auto custom-scrollbar shrink-0 bg-white/[0.02]">
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
                  {getStageLabel(stage)}
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
                className="pl-11 pr-4 py-2.5 bg-dark-surface border border-white/10 rounded-lg text-sm font-sans text-white focus:outline-none focus:border-premium-gold/50 transition-all w-full md:w-48 focus:w-64 shadow-inner"
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
                   <tr key={lead.id} onClick={() => setSelectedLead(leads.find(l => l.id === lead.id) || null)} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
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
                     <td className="py-5 px-4 relative">
                       <div className="relative group/dropdown" onClick={(e) => e.stopPropagation()}>
                         <button className="inline-flex items-center justify-between min-w-[140px] px-3 py-1.5 bg-dark border border-white/10 hover:border-white/20 rounded-md transition-colors group-hover/dropdown:bg-white/5">
                           <span className="text-[10px] font-mono uppercase tracking-wider text-white/80">{getStageLabel(lead.stage)}</span>
                           <ChevronDown className="w-3 h-3 text-white/30" />
                         </button>
                         <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] bg-dark border border-white/10 rounded-md shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-20 overflow-hidden">
                           {STAGES.map(stage => (
                             <button 
                               key={stage}
                               onClick={() => updateLeadStage(lead.id, stage)}
                               className={`w-full text-left px-3 py-2 text-[10px] font-mono uppercase tracking-wider hover:bg-white/10 transition-colors ${lead.stage === stage ? 'text-premium-gold bg-premium-gold/5' : 'text-white/70'}`}
                             >
                               {getStageLabel(stage)}
                             </button>
                           ))}
                         </div>
                       </div>
                     </td>
                     <td className="py-5 px-4 text-right">
                       <div className="font-mono text-white/90">{formatCurrency(lead.value)}</div>
                       <div className="text-[10px] font-sans text-white/40 mt-1">{lead.forecast}% Win Prob</div>
                     </td>
                     <td className="py-5 px-6">
                       <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 hover:bg-white/10 rounded-lg transition-colors tooltip-trigger" title="Email Contact"><Mail className="w-4 h-4 text-white" /></button>
                         <button className="p-2 hover:bg-white/10 rounded-lg transition-colors tooltip-trigger" title="Log Call"><Phone className="w-4 h-4 text-white" /></button>
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
      </div>

      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-0 right-0 w-[400px] h-full"
          >
            <div className="glass-panel border-l border-white/10 h-[calc(100vh-120px)] flex flex-col shadow-[-10px_0_30px_rgb(0,0,0,0.5)]">
              <div className="p-6 border-b border-white/5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-display font-medium text-white">{selectedLead.name}</h2>
                    {selectedLead.health && (
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase border ${selectedLead.health === 'Accelerated' ? 'text-green-400 border-green-400/20 bg-green-400/10' : selectedLead.health === 'At Risk' ? 'text-red-400 border-red-400/20 bg-red-400/10' : 'text-blue-400 border-blue-400/20 bg-blue-400/10'}`}>
                        {selectedLead.health}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/50">
                     <User className="w-3.5 h-3.5" />
                     {selectedLead.contact} ({selectedLead.email})
                  </div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">Status</span>
                    <span className="text-sm font-medium text-white capitalize">{getStageLabel(selectedLead.stage)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">Deal Value</span>
                    <span className="text-sm font-mono text-white">{formatCurrency(selectedLead.value)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">Forecast</span>
                    <span className="text-sm font-mono text-white">{selectedLead.forecast}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">Next Follow Up</span>
                    <input 
                      type="date"
                      value={selectedLead.nextFollowUp || ''}
                      onChange={(e) => {
                         addActivity(selectedLead.id, {
                           type: 'Follow-Up Scheduled',
                           content: `Scheduled for ${e.target.value}`,
                           author: 'Admin'
                         });
                         // Note: ideally we'd have a specific update field function, but for now we'll trigger an activity
                      }}
                      className="bg-transparent text-sm font-sans text-white border-b border-white/10 focus:border-premium-gold outline-none w-full pb-1" 
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => {
                      addActivity(selectedLead.id, { type: 'Proposal', content: 'Sent custom architecture proposal', author: 'Admin' });
                      updateLeadStage(selectedLead.id, 'proposal_sent');
                    }}
                    className={`flex-1 py-2 rounded font-mono text-[9px] uppercase tracking-widest border transition-all ${selectedLead.proposalSent ? 'bg-green-400/10 border-green-400/20 text-green-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                  >
                    {selectedLead.proposalSent ? 'Proposal Sent' : 'Send Proposal'}
                  </button>
                  <button 
                    onClick={() => {
                      addActivity(selectedLead.id, { type: 'Contract', content: 'Sent MSA & Retainer Agreement', author: 'Admin' });
                    }}
                    className={`flex-1 py-2 rounded font-mono text-[9px] uppercase tracking-widest border transition-all ${selectedLead.contractSent ? 'bg-green-400/10 border-green-400/20 text-green-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                  >
                    {selectedLead.contractSent ? 'Contract Sent' : 'Send Contract'}
                  </button>
                </div>

                <div className="bg-dark/50 border border-white/5 p-4 rounded-lg">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2 flex items-center gap-2"><Activity className="w-3 h-3"/> AI Summary</span>
                  <p className="text-xs text-white/70 leading-relaxed">{selectedLead.aiNote}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-6">Activity Timeline</h3>
                
                <div className="space-y-6">
                  {selectedLead.activities?.map(activity => (
                    <div key={activity.id} className="relative pl-6 border-l border-white/10">
                      <div className="absolute w-2 h-2 bg-premium-gold rounded-full -left-[4.5px] top-1" />
                      <div className="mb-1 flex items-center justify-between">
                         <span className="text-xs font-semibold text-white/90">{activity.type}</span>
                         <span className="text-[10px] font-mono text-white/40">{new Date(activity.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-white/60 mb-2">{activity.content}</p>
                      <span className="text-[10px] font-mono text-white/30">By {activity.author}</span>
                    </div>
                  ))}
                  {(!selectedLead.activities || selectedLead.activities.length === 0) && (
                    <p className="text-xs text-white/40">No activity recorded yet.</p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-dark-surface shrink-0">
                <div className="flex flex-col gap-3">
                  <textarea 
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Log a note or call..."
                    className="w-full bg-dark/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-premium-gold/50 h-24 resize-none transition-colors"
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={handleAddActivity}
                      disabled={!noteContent.trim()}
                      className="px-4 py-2 bg-premium-gold text-dark rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
