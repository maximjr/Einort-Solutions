import { motion } from 'motion/react';
import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, MessageSquare, Phone, Mail } from 'lucide-react';

const MOCK_LEADS = [
  { id: 1, name: 'Stark Industries', contact: 'Tony Stark', value: '$120,000', stage: 'Qualified', date: '2026-10-15', status: 'Hot', score: 98, aiNote: 'High precision match for enterprise architectural rebuild.' },
  { id: 2, name: 'Wayne Enterprises', contact: 'Bruce Wayne', value: '$250,000', stage: 'Negotiation', date: '2026-10-12', status: 'Warm', score: 85, aiNote: 'Requires advanced zero-trust security clearance.' },
  { id: 3, name: 'Oscorp', contact: 'Norman Osborn', value: '$85,000', stage: 'New Lead', date: '2026-10-18', status: 'Cold', score: 42, aiNote: 'Timeline constraints identified in early discovery.' },
  { id: 4, name: 'Oasis Meta', contact: 'James Halliday', value: '$450,000', stage: 'Proposal Sent', date: '2026-10-10', status: 'Hot', score: 95, aiNote: 'Massive scale required, perfect match for our backend capabilities.' }
];

const STAGES = ['New Lead', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

export function AdminCRM() {
  const [activeStage, setActiveStage] = useState('All');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-white mb-2 tracking-tight">Client Relationship Management</h1>
          <p className="text-silver-metallic font-mono text-xs uppercase tracking-widest">Pipeline & Deal Flow</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-xs font-mono uppercase tracking-widest text-silver-metallic hover:text-white transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-premium-gold text-dark rounded-lg font-mono text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Plus className="w-4 h-4" /> New Lead
          </button>
        </div>
      </div>

      <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-220px)]">
        {/* CRM Header / Stages */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4 overflow-x-auto custom-scrollbar shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveStage('All')}
              className={`px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors ${activeStage === 'All' ? 'bg-premium-gold/10 text-premium-gold border border-premium-gold/30' : 'bg-white/5 text-white/50 border border-transparent hover:text-white'}`}
            >
              All Pipelines
            </button>
            {STAGES.map(stage => (
              <button 
                key={stage}
                onClick={() => setActiveStage(stage)}
                className={`px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors ${activeStage === stage ? 'bg-premium-gold/10 text-premium-gold border border-premium-gold/30' : 'bg-white/5 text-white/50 border border-transparent hover:text-white'}`}
              >
                {stage}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="pl-9 pr-4 py-2 bg-[#020617] border border-white/10 rounded-lg text-xs font-sans text-white focus:outline-none focus:border-premium-gold/50 transition-colors w-48 focus:w-64"
            />
          </div>
        </div>

        {/* CRM Board / List */}
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-white/5">
                 <th className="pb-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal">Organization</th>
                 <th className="pb-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal px-4">Contact</th>
                 <th className="pb-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal px-4">AI Score</th>
                 <th className="pb-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal px-4">Stage</th>
                 <th className="pb-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal px-4 text-right">Proj. Value</th>
                 <th className="pb-4 font-mono text-[10px] uppercase tracking-widest text-silver-metallic font-normal px-4 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="text-sm">
               {MOCK_LEADS.filter(l => activeStage === 'All' || l.stage === activeStage).map(lead => (
                 <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                   <td className="py-4">
                     <div className="font-display font-medium text-white group-hover:text-premium-gold transition-colors flex items-center gap-2">
                       {lead.name}
                       {lead.status === 'Hot' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                     </div>
                     <div className="text-[10px] font-mono text-white/40 mt-1">{lead.date}</div>
                   </td>
                   <td className="py-4 px-4 text-silver-metallic">{lead.contact}</td>
                   <td className="py-4 px-4">
                     <div className="flex flex-col gap-1">
                       <span className={`inline-flex items-center gap-1 font-mono text-xs ${lead.score >= 90 ? 'text-green-400' : lead.score >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                         {lead.score}/100
                       </span>
                       <span className="text-[10px] font-sans text-white/40 truncate max-w-[150px]">{lead.aiNote}</span>
                     </div>
                   </td>
                   <td className="py-4 px-4">
                     <span className="inline-block px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono uppercase tracking-widest text-white/70">
                       {lead.stage}
                     </span>
                   </td>
                   <td className="py-4 px-4 text-right font-mono text-white/80">{lead.value}</td>
                   <td className="py-4 px-4">
                     <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                       <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><Mail className="w-3.5 h-3.5" /></button>
                       <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><Phone className="w-3.5 h-3.5" /></button>
                       <button className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    </motion.div>
  );
}
