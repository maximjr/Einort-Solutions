import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, MessageSquare, Phone, Mail, TrendingUp, DollarSign, Calendar, BarChart3, ChevronDown, Activity, X, User, LayoutGrid, List, Clock } from 'lucide-react';
import { useCRMStore, LeadStage, Lead } from '../../features/crm/store/crmStore';

const STAGES: LeadStage[] = ['new', 'qualified', 'discovery', 'proposal_sent', 'negotiation', 'won', 'lost'];

export function AdminCRM() {
  const { leads, activeStage, setActiveStage, searchQuery, setSearchQuery, initializeListener, updateLeadStage, addActivity } = useCRMStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

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
                          lead.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStage && matchesSearch;
  });

  const totalPipelineValue = leads.reduce((acc, lead) => acc + (lead.stage !== 'lost' ? lead.value : 0), 0);
  const activeLeads = leads.filter(l => l.stage !== 'lost' && l.stage !== 'won');
  const avgProbability = Math.round(activeLeads.reduce((acc, lead) => acc + (lead.forecast || 0), 0) / (activeLeads.length || 1));

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

  const getLeadsByStage = (stage: string) => {
     return filteredLeads.filter(l => l.stage === stage);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1600px] mx-auto pb-12 relative flex h-[calc(100vh-100px)] gap-6"
    >
      <div className={`flex-1 transition-all duration-500 flex flex-col ${selectedLead ? 'pr-[400px]' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-display font-medium text-white tracking-tight">Enterprise CRM</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-premium-gold/10 text-premium-gold border border-premium-gold/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(212,175,55,0.2)]"><Activity className="w-3 h-3"/> LIVE SYNC</span>
            </div>
            <p className="text-silver-metallic font-mono text-xs tracking-widest uppercase">Global deal flow intelligence and advanced revenue forecasting.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex bg-dark border border-white/10 rounded-lg p-1 mr-4">
              <button onClick={() => setViewMode('kanban')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white/10 text-white shadow' : 'text-silver-metallic hover:text-white'}`}>
                 <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white shadow' : 'text-silver-metallic hover:text-white'}`}>
                 <List className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-dark border border-white/20 rounded-lg hover:border-premium-gold/50 text-[10px] font-mono uppercase tracking-widest text-silver-metallic hover:text-premium-gold transition-all">
              <Filter className="w-4 h-4" /> View Rules
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 geometric-clip-button bg-premium-gold text-dark rounded-lg font-bold text-[10px] mono uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Plus className="w-4 h-4" /> Log Prospect
            </button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
          <div className="glass-panel geometric-clip border border-white/5 bg-dark/40 p-6 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-premium-gold/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-premium-gold/10 transition-colors" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 geometric-clip bg-dark flex items-center justify-center border border-white/10 group-hover:border-premium-gold/30 transition-colors">
                <DollarSign className="w-5 h-5 text-premium-gold" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 px-2 py-1 bg-green-400/10 border border-green-400/20 geometric-clip"><TrendingUp className="w-3 h-3"/> +12.5%</span>
            </div>
            <div className="relative z-10">
              <h4 className="text-silver-metallic font-mono text-[10px] uppercase tracking-[0.2em] mb-1 font-bold">Total Pipeline Value</h4>
              <div className="text-3xl font-display font-medium text-white tracking-tight">{formatCurrency(totalPipelineValue)}</div>
            </div>
          </div>
          <div className="glass-panel geometric-clip border border-white/5 bg-dark/40 p-6 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-400/10 transition-colors" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 geometric-clip bg-dark flex items-center justify-center border border-white/10 group-hover:border-blue-400/30 transition-colors">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 px-2 py-1 bg-green-400/10 border border-green-400/20 geometric-clip"><TrendingUp className="w-3 h-3"/> +5.2%</span>
            </div>
            <div className="relative z-10">
              <h4 className="text-silver-metallic font-mono text-[10px] uppercase tracking-[0.2em] mb-1 font-bold">Active Opportunities</h4>
              <div className="text-3xl font-display font-medium text-white tracking-tight">{activeLeads.length} <span className="text-sm text-silver-metallic font-sans tracking-normal">deals</span></div>
            </div>
          </div>
          <div className="glass-panel geometric-clip border border-white/5 bg-dark/40 p-6 flex flex-col justify-between group overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-purple-400/10 transition-colors" />
             <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 geometric-clip bg-dark flex items-center justify-center border border-white/10 group-hover:border-purple-400/30 transition-colors">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="relative z-10">
              <h4 className="text-silver-metallic font-mono text-[10px] uppercase tracking-[0.2em] mb-1 font-bold">Avg Win Probability</h4>
              <div className="text-3xl font-display font-medium text-white tracking-tight">{avgProbability}% <span className="text-sm text-silver-metallic font-sans tracking-normal">forecast</span></div>
            </div>
          </div>
        </div>

        <div className="glass-panel border-white/5 geometric-clip bg-dark/40 shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col flex-1 overflow-hidden">
          {/* CRM Header / Stages */}
          <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-x-auto custom-scrollbar shrink-0 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveStage('All')}
                className={`px-5 py-2 font-mono text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeStage === 'All' ? 'bg-premium-gold text-dark' : 'bg-transparent text-silver-metallic hover:bg-white/5 hover:text-white'}`}
              >
                Global View
              </button>
              <div className="w-px h-4 bg-white/10 mx-2"></div>
              {STAGES.map(stage => (
                <button 
                  key={stage}
                  onClick={() => setActiveStage(stage)}
                  className={`px-4 py-2 font-mono text-[9px] uppercase tracking-widest whitespace-nowrap transition-all geometric-clip ${activeStage === stage ? 'bg-white/10 text-white border border-white/20' : 'bg-transparent text-white/40 border border-transparent hover:text-white hover:bg-white/5'}`}
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
                className="pl-11 pr-4 py-2 bg-dark border border-white/10 rounded-sm text-[11px] font-mono uppercase tracking-wider text-white focus:outline-none focus:border-premium-gold/50 transition-all w-full md:w-56 focus:w-72 shadow-inner"
              />
            </div>
          </div>

          {/* CRM Board / List */}
          <div className="flex-1 overflow-hidden flex flex-col relative w-full h-full">
            {viewMode === 'kanban' ? (
              <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar flex p-4 gap-4 w-full h-full">
                {STAGES.filter(s => activeStage === 'All' || activeStage === s).map(stage => (
                  <div key={stage} className="flex-shrink-0 w-80 h-full flex flex-col bg-dark/30 border border-white/5 rounded-lg overflow-hidden">
                    <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shadow-sm">
                       <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-white flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${stage === 'won' ? 'bg-green-400' : stage === 'lost' ? 'bg-red-400' : 'bg-premium-gold'}`} />
                         {getStageLabel(stage)}
                       </h3>
                       <span className="font-mono text-[10px] text-silver-metallic bg-white/5 px-2 py-0.5 rounded">{getLeadsByStage(stage).length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                      {getLeadsByStage(stage).map(lead => (
                        <div 
                           key={lead.id} 
                           onClick={() => setSelectedLead(leads.find(l => l.id === lead.id) || null)}
                           className="bg-dark border border-white/10 hover:border-premium-gold/40 rounded-lg p-4 cursor-pointer group transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.1)] relative"
                        >
                           {lead.status === 'Hot' && <div className="absolute top-0 right-0 w-full h-full bg-red-500/5 pointer-events-none rounded-lg" />}
                           <div className="flex justify-between items-start mb-2">
                             <h4 className="font-display font-medium text-white tracking-tight">{lead.company || lead.name}</h4>
                             {lead.status === 'Hot' && <Activity className="w-3 h-3 text-red-500 animate-pulse" />}
                           </div>
                           <div className="font-mono text-xl text-white tracking-tight mb-3">
                             {formatCurrency(lead.value)}
                           </div>
                           <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold tracking-widest uppercase border ${lead.score >= 90 ? 'text-green-400 border-green-400/20 bg-green-400/10' : lead.score >= 70 ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10' : 'text-red-400 border-red-400/20 bg-red-400/10'}`}>
                                Score {lead.score}
                              </span>
                              <span className="font-mono text-[10px] text-silver-metallic">{lead.forecast}% Prob</span>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-auto custom-scrollbar p-2 w-full h-full">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr>
                       <th className="sticky top-0 bg-dark-surface/95 backdrop-blur-md pb-4 pt-6 px-6 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-bold border-b border-white/5 z-10 w-1/4">Organization</th>
                       <th className="sticky top-0 bg-dark-surface/95 backdrop-blur-md pb-4 pt-6 px-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-bold border-b border-white/5 z-10">Lead Scoring</th>
                       <th className="sticky top-0 bg-dark-surface/95 backdrop-blur-md pb-4 pt-6 px-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-bold border-b border-white/5 z-10">Pipeline Stage</th>
                       <th className="sticky top-0 bg-dark-surface/95 backdrop-blur-md pb-4 pt-6 px-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-bold border-b border-white/5 z-10 text-right">Proj. Value</th>
                       <th className="sticky top-0 bg-dark-surface/95 backdrop-blur-md pb-4 pt-6 px-6 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-bold border-b border-white/5 z-10 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                     {filteredLeads.map(lead => (
                       <tr key={lead.id} onClick={() => setSelectedLead(leads.find(l => l.id === lead.id) || null)} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                         <td className="py-5 px-6">
                           <div className="font-display font-medium text-white group-hover:text-premium-gold transition-colors flex items-center gap-3">
                             {lead.company || lead.name}
                             {lead.status === 'Hot' && <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                           </div>
                           <div className="flex items-center gap-2 mt-2">
                             <span className="text-[11px] font-sans text-white/60">{lead.name !== lead.company ? lead.name : lead.contact}</span>
                             <span className="w-1 h-1 rounded-full bg-white/20"></span>
                             <span className="text-[11px] font-mono text-white/40">{lead.date}</span>
                           </div>
                         </td>
                         <td className="py-5 px-4 w-1/3">
                           <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-3">
                               <span className={`inline-flex items-center justify-center min-w-[40px] py-1 geometric-clip bg-dark border font-mono text-[10px] font-bold border-white/10 group-hover:border-white/30 ${lead.score >= 90 ? 'text-green-400' : lead.score >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                                 {lead.score}
                               </span>
                             </div>
                             <span className="text-[11px] font-mono tracking-wider text-silver-metallic truncate pr-4 leading-relaxed"><span className="text-white/30 mr-2">&gt;</span>{lead.aiNote}</span>
                           </div>
                         </td>
                         <td className="py-5 px-4 relative">
                           <div className="relative group/dropdown" onClick={(e) => e.stopPropagation()}>
                             <button className="inline-flex items-center justify-between min-w-[140px] px-3 py-1.5 bg-dark border border-white/10 hover:border-white/20 geometric-clip transition-colors group-hover/dropdown:bg-white/5">
                               <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-white/80">{getStageLabel(lead.stage)}</span>
                               <ChevronDown className="w-3 h-3 text-white/30" />
                             </button>
                             <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] bg-dark border border-white/10 geometric-clip shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-20 overflow-hidden">
                               {STAGES.map(stage => (
                                 <button 
                                   key={stage}
                                   onClick={() => updateLeadStage(lead.id, stage)}
                                   className={`w-full text-left px-3 py-2 text-[9px] font-mono uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-colors ${lead.stage === stage ? 'text-premium-gold bg-premium-gold/5' : 'text-silver-metallic hover:text-white'}`}
                                 >
                                   {getStageLabel(stage)}
                                 </button>
                               ))}
                             </div>
                           </div>
                         </td>
                         <td className="py-5 px-4 text-right">
                           <div className="font-mono text-white/90 tracking-tight text-lg">{formatCurrency(lead.value)}</div>
                           <div className="text-[10px] font-mono tracking-wider text-silver-metallic mt-1 uppercase">{lead.forecast}% Prob</div>
                         </td>
                         <td className="py-5 px-6">
                           <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 hover:bg-white/10 rounded-sm geometric-clip transition-colors tooltip-trigger" title="Email Contact"><Mail className="w-4 h-4 text-white" /></button>
                             <button className="p-2 hover:bg-white/10 rounded-sm geometric-clip transition-colors tooltip-trigger" title="Log Call"><Phone className="w-4 h-4 text-white" /></button>
                           </div>
                         </td>
                       </tr>
                     ))}
                     {filteredLeads.length === 0 && (
                       <tr>
                         <td colSpan={5} className="py-16 text-center">
                           <div className="w-16 h-16 geometric-clip bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                             <Search className="w-6 h-6 text-silver-metallic" />
                           </div>
                           <p className="text-silver-metallic font-mono text-xs uppercase tracking-widest">No intelligence found matching criteria.</p>
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
              </div>
            )}
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
            <div className="glass-panel border-l border-t-0 border-b-0 border-white/10 h-full flex flex-col shadow-[-20px_0_50px_rgb(0,0,0,0.5)]">
              <div className="p-6 border-b border-white/5 flex items-start justify-between bg-dark/50">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-display font-medium text-white tracking-tight">{selectedLead.company || selectedLead.name}</h2>
                    {selectedLead.health && (
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase border bg-dark ${selectedLead.health === 'Accelerated' ? 'text-green-400 border-green-400/20' : selectedLead.health === 'At Risk' ? 'text-red-400 border-red-400/20' : 'text-blue-400 border-blue-400/20'}`}>
                        {selectedLead.health}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-silver-metallic">
                     <User className="w-3 h-3" />
                     {selectedLead.name !== selectedLead.company ? selectedLead.name : selectedLead.contact} 
                  </div>
                  <div className="font-mono text-[9px] text-white/30 lowercase mt-1 tracking-widest">{selectedLead.email}</div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-white/5 rounded-sm transition-colors text-white/50 hover:text-white geometric-clip">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-silver-metallic block mb-1">Status</span>
                    <span className="text-xs font-mono uppercase tracking-widest text-white">{getStageLabel(selectedLead.stage)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-silver-metallic block mb-1">Deal Value</span>
                    <span className="text-base font-mono text-premium-gold">{formatCurrency(selectedLead.value)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-silver-metallic block mb-1">Forecast</span>
                    <span className="text-xs font-mono tracking-widest text-white">{selectedLead.forecast}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-silver-metallic block mb-1">Next Objective</span>
                    <input 
                      type="date"
                      value={selectedLead.nextFollowUp || ''}
                      onChange={(e) => {
                         addActivity(selectedLead.id, {
                           type: 'Objective Set',
                           content: `Target date revised to ${e.target.value}`,
                           author: 'System'
                         });
                      }}
                      className="bg-transparent text-xs font-mono tracking-widest text-white border-b border-white/10 hover:border-white/30 focus:border-premium-gold outline-none w-full pb-1 transition-colors" 
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 mb-6">
                  <button 
                    onClick={() => {
                      addActivity(selectedLead.id, { type: 'Proposal', content: 'Sent custom architecture proposal', author: 'System' });
                      updateLeadStage(selectedLead.id, 'proposal_sent');
                    }}
                    className={`flex-1 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] geometric-clip transition-all border ${selectedLead.proposalSent ? 'bg-green-400/10 border-green-400/20 text-green-400' : 'bg-dark border-white/10 text-silver-metallic hover:bg-white/5 hover:text-white'}`}
                  >
                    {selectedLead.proposalSent ? 'PROPOSAL SENT' : 'SEND PROPOSAL'}
                  </button>
                  <button 
                    onClick={() => {
                      addActivity(selectedLead.id, { type: 'Contract', content: 'Sent MSA & Retainer Agreement', author: 'System' });
                    }}
                    className={`flex-1 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] geometric-clip transition-all border ${selectedLead.contractSent ? 'bg-green-400/10 border-green-400/20 text-green-400' : 'bg-dark border-white/10 text-silver-metallic hover:bg-white/5 hover:text-white'}`}
                  >
                    {selectedLead.contractSent ? 'CONTRACT SENT' : 'SEND CONTRACT'}
                  </button>
                </div>

                <div className="bg-dark border border-white/10 geometric-clip p-5 relative overflow-hidden group hover:border-premium-gold/30 transition-colors">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-premium-gold/5 blur-[30px] rounded-full pointer-events-none group-hover:bg-premium-gold/10 transition-colors" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-premium-gold block mb-3 flex items-center gap-2"><Activity className="w-3 h-3"/> AI DEAL INTELLIGENCE</span>
                  <p className="text-[11px] font-mono text-silver-metallic leading-relaxed tracking-wider break-words relative z-10"><span className="text-white/30 mr-2">&gt;</span>{selectedLead.aiNote}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-dark/20">
                <h3 className="text-[9px] font-mono uppercase tracking-[0.2em] font-bold text-white mb-6 flex items-center gap-2"><Clock className="w-3 h-3 text-silver-metallic" /> OPERATIONS LOG</h3>
                
                <div className="space-y-6">
                  {selectedLead.activities?.map(activity => (
                    <div key={activity.id} className="relative pl-6 border-l border-white/10 group">
                      <div className="absolute w-2 h-2 bg-dark border-2 border-premium-gold rounded-full -left-[4px] top-1 group-hover:bg-premium-gold transition-colors shadow-[0_0_8px_rgba(212,175,55,0)] group-hover:shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                      <div className="mb-2 flex items-center justify-between">
                         <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-white">{activity.type}</span>
                         <span className="text-[9px] font-mono tracking-widest text-silver-metallic">{new Date(activity.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] font-mono tracking-wider text-silver-metallic leading-relaxed mb-2"><span className="text-white/20 mr-1">&gt;</span>{activity.content}</p>
                      <span className="inline-block px-1.5 py-0.5 bg-white/5 border border-white/10 text-[8px] font-mono uppercase tracking-widest text-silver-metallic geometric-clip">ID__{activity.author}</span>
                    </div>
                  ))}
                  {(!selectedLead.activities || selectedLead.activities.length === 0) && (
                    <p className="text-[10px] font-mono uppercase tracking-widest text-silver-metallic flex items-center gap-2"><X className="w-3 h-3"/> No recorded operations.</p>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-white/5 bg-dark shrink-0 pb-10">
                <div className="flex flex-col gap-3">
                  <textarea 
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Log reconnaissance data..."
                    className="w-full bg-black/40 border border-white/10 geometric-clip p-4 text-[11px] font-mono text-white focus:outline-none focus:border-premium-gold/50 h-24 resize-none transition-colors"
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={handleAddActivity}
                      disabled={!noteContent.trim()}
                      className="px-5 py-2.5 geometric-clip-button bg-premium-gold text-dark font-bold text-[9px] mono uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
                    >
                      COMMIT RECORD
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
