import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  MessageSquare, 
  Phone, 
  Mail, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  ChevronDown, 
  Activity, 
  X, 
  User, 
  Target, 
  Briefcase, 
  Clock, 
  Cpu, 
  AlertTriangle,
  Compass,
  FileText
} from 'lucide-react';
import { useCRMStore, LeadStage, Lead } from '../../features/crm/store/crmStore';
import { db } from '../../lib/firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const STAGES: LeadStage[] = ['new', 'qualified', 'discovery', 'proposal_sent', 'negotiation', 'won', 'lost'];

const INTENTION_OPTIONS = [
  "Immediate Production Build",
  "Exploring Architectural Scopes",
  "Awaiting Executive Budget",
  "Standard Feature Evaluation",
  "Competitive Sourcing Match",
  "Stagnant / Follow Up Required"
];

export function AdminCRM() {
  const { leads, activeStage, setActiveStage, searchQuery, setSearchQuery, initializeListener, updateLeadStage, addActivity } = useCRMStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Custom interactive edits states
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<'Note' | 'Email' | 'Call' | 'Meeting'>('Note');
  
  // Lead Creation Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newRepName, setNewRepName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newValue, setNewValue] = useState("45000");
  const [newScore, setNewScore] = useState("75");

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
    
    const leadName = lead.name || "";
    const contactName = lead.contact || "";
    const compName = lead.company || "";
    const emailStr = lead.email || "";
    const combinedSearch = `${leadName} ${contactName} ${compName} ${emailStr}`.toLowerCase();
    
    const matchesSearch = combinedSearch.includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalPipelineValue = filteredLeads.reduce((acc, lead) => acc + lead.value, 0);
  const avgProbability = Math.round(filteredLeads.reduce((acc, lead) => acc + (lead.forecast || 0), 0) / (filteredLeads.length || 1));

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  // Firestore direct field patcher for operational efficiency
  const updateLeadField = async (id: string, fields: Partial<Lead>) => {
    try {
      const ref = doc(db, 'leads', id);
      await updateDoc(ref, fields);
    } catch (e) {
      console.error("Failed to update lead fields:", e);
    }
  };

  const handleAddActivity = () => {
    if (!selectedLead || !noteContent.trim()) return;
    addActivity(selectedLead.id, {
      type: noteType,
      content: noteContent,
      author: 'Ecosystem Auditor'
    });
    setNoteContent('');
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim() || !newRepName.trim() || !newEmail.trim()) return;
    
    try {
      await addDoc(collection(db, 'leads'), {
        company: newOrgName,
        name: newRepName,
        email: newEmail,
        contact: "Lead Representative",
        value: Number(newValue) || 35000,
        score: Number(newScore) || 50,
        stage: 'new',
        status: Number(newScore) > 80 ? 'Hot' : Number(newScore) > 55 ? 'Warm' : 'Cold',
        forecast: Math.min(95, Math.max(10, Number(newScore) - 5)),
        health: 'On Track',
        aiNote: "Manual enterprise registration. Prospect evaluated for custom infrastructure allocation.",
        date: new Date().toLocaleDateString(),
        createdAt: serverTimestamp(),
        activities: [
          {
            id: crypto.randomUUID(),
            type: 'StatusChange',
            content: "Pipeline card created.",
            timestamp: new Date().toISOString(),
            author: "System Audit"
          }
        ]
      });

      // Reset
      setNewOrgName("");
      setNewRepName("");
      setNewEmail("");
      setShowAddForm(false);
    } catch (err) {
      console.error("Error creating manual lead:", err);
    }
  };

  const getStageLabel = (stage: string) => {
     return stage.replace('_', ' ');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1400px] mx-auto pb-12 relative flex flex-col lg:flex-row h-full gap-6"
    >
      <div className={`flex-1 transition-all duration-500 ease-in-out ${selectedLead ? 'lg:pr-[460px]' : ''}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-display font-medium text-white tracking-tight">CRM Intelligence</h1>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-premium-gold/15 text-premium-gold border border-premium-gold/25 font-semibold">
                HubSpot x Linear Grade
              </span>
            </div>
            <p className="text-white/50 font-sans text-xs max-w-lg">Monitor, analyze, and override deal pipelines, win probabilities, priority status scales, and integration lifecycles.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-dark rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-90 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4 shrink-0" /> Manually Add Prospect
            </button>
          </div>
        </div>

        {/* Lead Manual Insertion Form (Real & persisting) */}
        {showAddForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleCreateLead}
            className="p-6 bg-[#040814]/90 border border-premium-gold/20 rounded-xl mb-6 space-y-4"
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-premium-gold">Enterprise Onboarding Form</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="Organization Name (e.g. Novartis)" 
                value={newOrgName}
                onChange={e => setNewOrgName(e.target.value)}
                required
                className="bg-dark/80 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-premium-gold"
              />
              <input 
                type="text" 
                placeholder="Client Rep Name" 
                value={newRepName}
                onChange={e => setNewRepName(e.target.value)}
                required
                className="bg-dark/80 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-premium-gold"
              />
              <input 
                type="email" 
                placeholder="Corporate Email Address" 
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                required
                className="bg-dark/80 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-premium-gold"
              />
              <input 
                type="number" 
                placeholder="Deal Value ($)" 
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                className="bg-dark/80 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-premium-gold"
              />
              <input 
                type="number" 
                placeholder="Lead Matching Score (0-100)" 
                value={newScore}
                onChange={e => setNewScore(e.target.value)}
                className="bg-dark/80 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-premium-gold"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-premium-gold text-dark font-mono text-[10px] uppercase font-bold py-2 rounded">Inject</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="px-3 bg-white/5 border border-white/10 font-mono text-[10px] text-white py-2 rounded">Cancel</button>
              </div>
            </div>
          </motion.form>
        )}

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between bg-white/[0.01]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <DollarSign className="w-5 h-5 text-premium-gold" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded"><TrendingUp className="w-3 h-3"/> +12.5%</span>
            </div>
            <div>
              <h4 className="text-white/50 font-mono text-[10px] uppercase tracking-widest mb-1">Unified Sales Pipeline</h4>
              <div className="text-3xl font-display font-medium text-white tracking-tight">{formatCurrency(totalPipelineValue)}</div>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between bg-white/[0.01]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Activity className="w-5 h-5 text-premium-gold" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded"><TrendingUp className="w-3 h-3"/> +5.2%</span>
            </div>
            <div>
              <h4 className="text-white/50 font-mono text-[10px] uppercase tracking-widest mb-1">Engaged Deal Cards</h4>
              <div className="text-3xl font-display font-medium text-white tracking-tight">{filteredLeads.length} <span className="text-sm text-white/30 font-sans tracking-normal font-normal">Active</span></div>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between bg-white/[0.01]">
             <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <BarChart3 className="w-5 h-5 text-premium-gold" />
              </div>
            </div>
            <div>
              <h4 className="text-white/50 font-mono text-[10px] uppercase tracking-widest mb-1">Algorithmic Win Velocity</h4>
              <div className="text-3xl font-display font-medium text-white tracking-tight">{avgProbability}% <span className="text-sm text-white/30 font-sans tracking-normal font-normal">SLA forecast</span></div>
            </div>
          </div>
        </div>

        {/* Lead Table Ledger */}
        <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[650px] bg-[#020617]/90">
          
          <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-x-auto custom-scrollbar shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-1.5 scrollbar-none overflow-x-auto">
              <button 
                onClick={() => setActiveStage('All')}
                className={`px-4 py-2 rounded-md font-mono text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap transition-all ${activeStage === 'All' ? 'bg-white text-dark shadow-md' : 'bg-transparent text-white/50 hover:bg-white/5 hover:text-white'}`}
              >
                All Pipelines
              </button>
              <div className="w-px h-5 bg-white/10 mx-1 shrink-0"></div>
              {STAGES.map(stage => (
                <button 
                  key={stage}
                  onClick={() => setActiveStage(stage)}
                  className={`px-3.5 py-2 rounded-md font-mono text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${activeStage === stage ? 'bg-white/10 text-white border border-white/15' : 'bg-transparent text-white/40 border border-transparent hover:text-white hover:bg-white/5'}`}
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
                className="pl-11 pr-4 py-2 bg-dark-surface border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-premium-gold/50 transition-all w-full md:w-48 focus:w-64"
              />
            </div>
          </div>

          {/* CRM List */}
          <div className="flex-1 overflow-auto custom-scrollbar">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/5">
                   <th className="sticky top-0 bg-[#040814] pb-4 pt-6 px-6 font-mono text-[10px] uppercase tracking-widest text-white/50 font-semibold z-10 w-1/4">Partner Firm</th>
                   <th className="sticky top-0 bg-[#040814] pb-4 pt-6 px-4 font-mono text-[10px] uppercase tracking-widest text-white/50 font-semibold z-10">AI Diagnostic Ledger</th>
                   <th className="sticky top-0 bg-[#040814] pb-4 pt-6 px-4 font-mono text-[10px] uppercase tracking-widest text-white/50 font-semibold z-10">Pipeline stage</th>
                   <th className="sticky top-0 bg-[#040814] pb-4 pt-6 px-4 font-mono text-[10px] uppercase tracking-widest text-white/50 font-semibold z-10 text-right">Deal Value ($)</th>
                   <th className="sticky top-0 bg-[#040814] pb-4 pt-6 px-6 font-mono text-[10px] uppercase tracking-widest text-white/50 font-semibold z-10 text-right">Channel Link</th>
                 </tr>
               </thead>
               <tbody className="text-sm">
                 {filteredLeads.map(lead => (
                   <tr 
                     key={lead.id} 
                     onClick={() => setSelectedLead(lead)} 
                     className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer ${selectedLead?.id === lead.id ? 'bg-white/[0.015]' : ''}`}
                   >
                     <td className="py-5 px-6">
                       <div className="font-display font-medium text-white group-hover:text-premium-gold transition-colors flex items-center gap-3">
                         {lead.company || lead.name}
                         {lead.status === 'Hot' && <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.7)]" />}
                       </div>
                       <div className="flex items-center gap-2 mt-2">
                         <span className="text-[11px] font-sans text-white/60">{lead.name !== lead.company ? lead.name : lead.contact}</span>
                         <span className="w-1 h-1 rounded-full bg-white/20"></span>
                         <span className="text-[10px] font-mono text-white/40">{lead.date}</span>
                       </div>
                     </td>
                     <td className="py-5 px-4 w-1/3">
                       <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-3">
                           <span className={`inline-flex items-center justify-center min-w-[38px] py-1 rounded bg-dark border font-mono text-[9px] font-bold ${lead.score >= 82 ? 'text-green-400 border-green-400/20' : lead.score >= 55 ? 'text-yellow-400 border-yellow-400/20' : 'text-red-400 border-red-400/20'}`}>
                             {lead.score}
                           </span>
                           <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Lead Score</span>
                         </div>
                         <span className="text-xs font-sans text-white/50 truncate pr-4 leading-relaxed tracking-wide">{lead.aiNote}</span>
                       </div>
                     </td>
                     <td className="py-5 px-4 relative">
                       <div className="relative group/dropdown" onClick={(e) => e.stopPropagation()}>
                         <button className="inline-flex items-center justify-between min-w-[130px] px-3 py-1.5 bg-dark border border-white/10 hover:border-white/20 rounded-md transition-colors">
                           <span className="text-[9px] font-mono uppercase tracking-wider text-white/80">{getStageLabel(lead.stage)}</span>
                           <ChevronDown className="w-3 h-3 text-white/30" />
                         </button>
                         <div className="absolute top-full left-0 mt-1 w-full min-w-[130px] bg-dark border border-white/10 rounded-md shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-20 overflow-hidden">
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
                       <div className="font-mono text-white/95 font-semibold text-xs">{formatCurrency(lead.value)}</div>
                       <div className="text-[10px] font-sans text-white/40 mt-1">{lead.forecast}% Win Prob</div>
                     </td>
                     <td className="py-5 px-6">
                       <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                         <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Mail className="w-4 h-4 text-white" /></a>
                       </div>
                     </td>
                   </tr>
                 ))}
                 {filteredLeads.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-20 text-center">
                       <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                         <Search className="w-6 h-6 text-white/30" />
                       </div>
                       <p className="text-white/50 font-sans text-sm">No enterprise cards matched the search inputs.</p>
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>
      </div>

      {/* CRM DETAILED LEAD INSPECT DRAWER */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed top-0 right-0 w-full sm:w-[440px] h-screen bg-[#040814]/98 border-l border-white/15 shadow-2xl z-50 overflow-y-auto custom-scrollbar flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-[#080f24] flex items-start justify-between sticky top-0 z-30">
              <div>
                <span className="text-[9px] font-mono text-premium-gold font-bold uppercase tracking-widest block mb-1">Corporate Client Dossier</span>
                <h2 className="text-2xl font-display font-medium text-white tracking-tight truncate max-w-[300px]">
                  {selectedLead.company || selectedLead.name}
                </h2>
                <span className="text-[10px] text-white/50 block font-mono capitalize mt-1 border-tl border-white/10 pt-1">
                  Lead ID: <span className="text-white font-mono">{selectedLead.id.substring(0, 12)}...</span>
                </span>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form controls/edits persisting live to Firestore (7E) */}
            <div className="p-6 border-b border-white/10 bg-white/[0.01] space-y-5">
              
              <h3 className="font-mono text-[9px] uppercase tracking-widest text-[#00ffcc] font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> SCOPING OPERATIONS CONTROL
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Deal Worth */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 block uppercase">Project Contract Worth ($)</label>
                  <input 
                    type="number"
                    value={selectedLead.value}
                    onChange={(e) => updateLeadField(selectedLead.id, { value: Number(e.target.value) || 0 })}
                    className="w-full bg-dark border border-white/10 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-premium-gold text-xs"
                  />
                </div>

                {/* Match score */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 block uppercase">Lead Score Rating (0-100)</label>
                  <input 
                    type="number"
                    value={selectedLead.score}
                    onChange={(e) => updateLeadField(selectedLead.id, { score: Number(e.target.value) || 0 })}
                    className="w-full bg-dark border border-white/10 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-premium-gold text-xs"
                  />
                </div>

                {/* Win Prob */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 block uppercase">Win Probability Forecast (%)</label>
                  <input 
                    type="number"
                    value={selectedLead.forecast || 0}
                    onChange={(e) => updateLeadField(selectedLead.id, { forecast: Number(e.target.value) || 0 })}
                    className="w-full bg-dark border border-white/10 rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-premium-gold text-xs"
                  />
                </div>

                {/* Lead Status Temperature */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 block uppercase">Lead Temperature</label>
                  <select 
                    value={selectedLead.status}
                    onChange={(e) => updateLeadField(selectedLead.id, { status: e.target.value as 'Hot' | 'Warm' | 'Cold' })}
                    className="w-full bg-dark border border-white/10 rounded px-2 py-1.5 text-white focus:outline-none text-xs"
                  >
                    <option value="Hot">🔥 Hot Impact</option>
                    <option value="Warm">⚡ Warm Scoped</option>
                    <option value="Cold">❄️ Cold Inactive</option>
                  </select>
                </div>

                {/* Health */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 block uppercase">Project Health Scale</label>
                  <select 
                    value={selectedLead.health || "On Track"}
                    onChange={(e) => updateLeadField(selectedLead.id, { health: e.target.value as any })}
                    className="w-full bg-dark border border-white/10 rounded px-2 py-1.5 text-white focus:outline-none text-xs"
                  >
                    <option value="Accelerated">🟢 Accelerated Speed</option>
                    <option value="On Track">🔵 Standard On-Track</option>
                    <option value="At Risk">🔴 At Risk / Stalled</option>
                  </select>
                </div>

                {/* Business Maturity Scale */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 block uppercase">Business Maturity Scale</label>
                  <select 
                    value={(selectedLead as any).maturity || "Growth Venture"}
                    onChange={(e) => updateLeadField(selectedLead.id, { maturity: e.target.value })}
                    className="w-full bg-dark border border-white/10 rounded px-2 py-1.5 text-white focus:outline-none text-xs"
                  >
                    <option value="Early Stage Startup">Early Stage Startup</option>
                    <option value="Growth Venture">Growth Venture</option>
                    <option value="Mid-Market Enterprise">Mid-Market Enterprise</option>
                    <option value="Fortune 500 Corporate">Fortune 500 Corporate</option>
                  </select>
                </div>

                {/* Industry Priority Level */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 block uppercase">Industry Priority Level</label>
                  <select 
                    value={(selectedLead as any).priorityIndex || "Standard Priority"}
                    onChange={(e) => updateLeadField(selectedLead.id, { priorityIndex: e.target.value })}
                    className="w-full bg-dark border border-white/10 rounded px-2 py-1.5 text-white focus:outline-none text-xs"
                  >
                    <option value="Standard Priority">Standard Priority</option>
                    <option value="Elevated Priority">Elevated Priority</option>
                    <option value="Strategic Core Initiative">Strategic Core Initiative</option>
                  </select>
                </div>

                {/* Engineering Complexity Assessment */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 block uppercase">Complexity Assessment</label>
                  <select 
                    value={(selectedLead as any).complexityScale || "Standard MVP Scope"}
                    onChange={(e) => updateLeadField(selectedLead.id, { complexityScale: e.target.value })}
                    className="w-full bg-dark border border-white/10 rounded px-2 py-1.5 text-white focus:outline-none text-xs"
                  >
                    <option value="Standard MVP Scope">Standard MVP Scope</option>
                    <option value="Advanced Modular Architecture">Advanced Modular Architecture</option>
                    <option value="Full Custom High-Scale Enterprise">Full Custom High-Scale Enterprise</option>
                  </select>
                </div>

                {/* Intent */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-mono text-white/40 block uppercase">Client Strategic Intention Vector</label>
                  <select 
                    value={(selectedLead as any).intention || INTENTION_OPTIONS[1]}
                    onChange={(e) => updateLeadField(selectedLead.id, { intention: e.target.value } as any)}
                    className="w-full bg-dark border border-white/10 rounded p-2 text-white focus:outline-none text-xs"
                  >
                    {INTENTION_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Plan Next Action */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-mono text-white/40 block uppercase">Execution Path: Next Planned Action</label>
                  <input 
                    type="text"
                    value={(selectedLead as any).nextActionPlan || ""}
                    placeholder="e.g. Host video review of Milestone 1 models Friday..."
                    onChange={(e) => updateLeadField(selectedLead.id, { nextActionPlan: e.target.value } as any)}
                    className="w-full bg-dark border border-white/10 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-premium-gold text-xs font-sans"
                  />
                </div>

                {/* Follow up Date picker */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-mono text-white/40 block uppercase font-semibold">Target Follow-Up Date</label>
                  <input 
                    type="date"
                    value={selectedLead.nextFollowUp || ''}
                    onChange={(e) => {
                       updateLeadField(selectedLead.id, { nextFollowUp: e.target.value });
                       addActivity(selectedLead.id, {
                         type: 'Follow-Up Scheduled',
                         content: `Scoping target follow-up shifted to ${e.target.value}`,
                         author: 'Ecosystem CRM Audits'
                       });
                    }}
                    className="w-full bg-dark border border-white/10 rounded text-xs text-white p-2 focus:outline-none" 
                  />
                </div>

                {/* Urgency and Risk telemetry indicators */}
                <div className="col-span-2 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono border-t border-b border-white/5 py-2">
                    <span className="text-white/40 uppercase">FOLLOW-UP URGENCY:</span>
                    {(() => {
                      const urg = selectedLead.nextFollowUp 
                        ? (selectedLead.nextFollowUp < new Date().toISOString().split('T')[0] 
                          ? { label: '🔴 CRITICAL - OVERDUE', color: 'text-red-400 bg-red-400/10' }
                          : selectedLead.nextFollowUp === new Date().toISOString().split('T')[0]
                            ? { label: '🟡 HIGH - PROCESS TODAY', color: 'text-yellow-400 bg-yellow-400/10' }
                            : { label: '🟢 SCHEDULED', color: 'text-green-400 bg-green-400/10' })
                        : { label: '⚪ NOT SET', color: 'text-white/30 bg-white/5' };
                      return (
                        <span className={`px-2.5 py-1 rounded font-bold border border-white/5 tracking-wider ${urg.color}`}>
                          {urg.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Cold / Stagnation Danger Warnings */}
                  {(selectedLead.status === 'Cold' || selectedLead.health === 'At Risk') && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
                      <div className="text-[10px] leading-relaxed text-red-300 font-sans">
                        <strong className="font-semibold block text-red-200">CHURN WARNING LEVEL: HIGH</strong>
                        This strategic contract is currently stagnant or marked At-Risk. Prompt custom engagement is advised.
                      </div>
                    </div>
                  )}

                  {/* Operational Recommendations Card */}
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex flex-col gap-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-blue-400 font-semibold block flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> RECOMMENDED NEXT ACTION
                    </span>
                    <p className="text-[11px] leading-relaxed text-blue-200 font-sans">
                      {(() => {
                        const s = selectedLead.stage;
                        if (s === 'new') return "Initiate deep-dive discovery session and establish preliminary custom technical boundaries.";
                        if (s === 'qualified') return "Process active draft specifications into a highly aligned SLA framework proposal.";
                        if (s === 'discovery') return "Consolidate integration requirements and detail custom developer delivery hours.";
                        if (s === 'proposal_sent') return "Arrange interactive review call to adjust scope and secure executive budget approval.";
                        if (s === 'negotiation') return "Finalize C-Suite security criteria and dispatch the binding enterprise contract.";
                        if (s === 'won') return "Onboard team to Production Workspace and allocate physical engineering sprint.";
                        return "Maintain standard client nurturing protocols.";
                      })()}
                    </p>
                  </div>
                </div>

              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    addActivity(selectedLead.id, { type: 'Proposal', content: 'Transmitted Custom Enterprise Architecture proposal dossier', author: 'Ecosystem Auditor' });
                    updateLeadField(selectedLead.id, { proposalSent: true });
                  }}
                  className={`flex-1 py-2.5 rounded font-mono text-[9px] uppercase tracking-widest border transition-all font-semibold ${selectedLead.proposalSent ? 'bg-green-400/10 border-green-400/20 text-green-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                >
                  {selectedLead.proposalSent ? '✓ Proposal Dispatched' : 'Issue SLA Proposal'}
                </button>
                <button 
                  onClick={() => {
                    addActivity(selectedLead.id, { type: 'Contract', content: ' MSA Governance & billing records transmitted', author: 'Ecosystem Auditor' });
                    updateLeadField(selectedLead.id, { contractSent: true });
                  }}
                  className={`flex-1 py-2.5 rounded font-mono text-[9px] uppercase tracking-widest border transition-all font-semibold ${selectedLead.contractSent ? 'bg-green-400/10 border-green-400/20 text-green-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                >
                  {selectedLead.contractSent ? '✓ Agreement Dispatched' : 'Issue SLA Agreement'}
                </button>
              </div>

              {/* CRM AI briefing container */}
              <div className="bg-dark/50 border border-white/5 p-4 rounded-xl relative overflow-hidden flex flex-col gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-premium-gold block flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> AI Diagnostic briefing</span>
                <p className="text-xs text-white/70 leading-relaxed font-sans">{selectedLead.aiNote}</p>
              </div>

            </div>

            {/* Custom Notes / Communication entry logging */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Activity Timeline Ledger</h3>
              
              <div className="space-y-5">
                {selectedLead.activities?.map(activity => (
                  <div key={activity.id} className="relative pl-5 border-l border-white/10 text-xs">
                    <div className="absolute w-2 h-2 bg-premium-gold rounded-full -left-[4.5px] top-1" />
                    <div className="mb-1 flex items-center justify-between">
                       <span className="font-semibold text-white/90">{activity.type}</span>
                       <span className="text-[9px] font-mono text-white/30">{new Date(activity.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-white/60 mb-2 leading-relaxed font-sans">{activity.content}</p>
                    <span className="text-[9px] font-mono text-white/30">Author: {activity.author}</span>
                  </div>
                ))}
                {(!selectedLead.activities || selectedLead.activities.length === 0) && (
                  <p className="text-xs font-mono text-white/40">No operations history registered on this prospect.</p>
                )}
              </div>
            </div>

            {/* Logging input station */}
            <div className="p-6 border-t border-white/10 bg-[#040814] sticky bottom-0 z-30 space-y-3">
              <div className="flex gap-2">
                {(['Note', 'Email', 'Call', 'Meeting'] as const).map(t => (
                  <button 
                    key={t}
                    onClick={() => setNoteType(t)}
                    type="button" 
                    className={`flex-1 py-1 px-1.5 rounded text-[9px] font-mono uppercase tracking-widest border transition-all ${noteType === t ? 'bg-premium-gold/25 border-premium-gold/40 text-premium-gold font-bold' : 'bg-transparent border-white/5 text-white/40 hover:text-white'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              
              <textarea 
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={`Log custom ${noteType} or executive summary...`}
                className="w-full bg-dark/80 border border-white/10 rounded-lg p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-premium-gold/50 h-20 resize-none font-sans"
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleAddActivity}
                  disabled={!noteContent.trim()}
                  className="px-4 py-2 bg-premium-gold text-dark rounded font-mono text-[10px] uppercase font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Commit Log entry
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
