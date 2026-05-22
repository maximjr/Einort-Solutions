import { motion } from 'motion/react';
import { FileText, CheckCircle2, Clock, Download, ArrowRight, Activity, CalendarDays } from 'lucide-react';
import { CinematicTransition } from '../../components/CinematicTransition';

export function ClientPortal() {
  return (
    <CinematicTransition>
      <div className="min-h-screen bg-dark pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-display font-medium mb-1">Stark Industries <span className="text-premium-gold ml-2">Portal</span></h1>
            <p className="text-silver-metallic font-mono text-xs uppercase tracking-widest">Active Project: Zenith OS Rebuild</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Action Area */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Status Header */}
              <div className="glass-panel p-8 rounded-3xl border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-premium-gold/10 blur-[100px]" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div>
                     <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-premium-gold/30 bg-premium-gold/10 text-premium-gold text-[10px] font-mono uppercase tracking-widest mb-4">
                       <Activity className="w-3 h-3" /> In Progress
                     </span>
                     <h2 className="text-2xl font-display font-medium mb-2">Phase 2: Architectural Backend</h2>
                     <p className="text-white/60 text-sm max-w-md">Our engineering team is currently integrating the custom database schemas and setting up OAuth flow.</p>
                   </div>
                   <div className="shrink-0 text-right">
                     <p className="font-mono text-4xl font-light text-white mb-1">68%</p>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Completion</p>
                   </div>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
                  <div className="w-[68%] h-full bg-gradient-to-r from-premium-gold/50 to-premium-gold rounded-full" />
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8">
                <h3 className="text-sm font-sans font-medium text-white mb-6 uppercase tracking-widest text-white/50">Project Timeline</h3>
                
                <div className="space-y-6">
                   {[
                     { name: "Discovery & Blueprint Strategy", date: "Oct 01, 2026", status: "completed" },
                     { name: "Frontend Visual Design & UX", date: "Oct 15, 2026", status: "completed" },
                     { name: "Backend Architecture & Database", date: "Nov 05, 2026", status: "active" },
                     { name: "QA, Security Audit & Launch", date: "Nov 20, 2026", status: "pending" }
                   ].map((milestone, idx) => (
                     <div key={idx} className="flex gap-4">
                       <div className="flex flex-col items-center">
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${milestone.status === 'completed' ? 'bg-premium-gold text-dark' : milestone.status === 'active' ? 'border-2 border-premium-gold text-premium-gold' : 'border border-white/20 text-transparent'}`}>
                           {milestone.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                           {milestone.status === 'active' && <div className="w-2 h-2 rounded-full bg-premium-gold" />}
                         </div>
                         {idx !== 3 && <div className={`w-[1px] h-12 mt-2 ${milestone.status === 'completed' ? 'bg-premium-gold/30' : 'bg-white/10'}`} />}
                       </div>
                       <div className="pt-0.5">
                         <h4 className={`text-sm font-medium ${milestone.status === 'pending' ? 'text-white/40' : 'text-white'}`}>{milestone.name}</h4>
                         <p className="text-[11px] font-mono text-white/40 mt-1">{milestone.date}</p>
                       </div>
                     </div>
                   ))}
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-8">
               
               {/* Action Required */}
               <div className="glass-panel border-premium-gold/30 p-6 rounded-3xl bg-premium-gold/5">
                 <div className="w-10 h-10 rounded-full bg-premium-gold/20 flex items-center justify-center mb-4">
                   <Clock className="w-5 h-5 text-premium-gold" />
                 </div>
                 <h3 className="font-display font-medium text-white mb-2">Approval Required</h3>
                 <p className="text-xs text-white/60 mb-6">Review the latest Figma prototypes for the Admin Dashboard.</p>
                 <button className="w-full py-3 bg-premium-gold text-dark font-semibold text-xs rounded-full hover:brightness-110 transition-all flex items-center justify-center gap-2">
                   Review Designs <ArrowRight className="w-4 h-4" />
                 </button>
               </div>

               {/* Invoices */}
               <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
                 <h3 className="text-xs font-sans font-medium text-white mb-4 uppercase tracking-widest text-white/50 flex items-center gap-2"><FileText className="w-4 h-4" /> Financials</h3>
                 <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                     <div>
                       <p className="text-xs font-medium">Invoice #INV-2041</p>
                       <p className="text-[10px] text-white/40 font-mono mt-1">Paid • Oct 01</p>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors text-white/50 group-hover:text-white">
                       <Download className="w-4 h-4" />
                     </div>
                   </div>
                   <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                     <div>
                       <p className="text-xs font-medium">Invoice #INV-2088</p>
                       <p className="text-[10px] text-premium-gold font-mono mt-1">Due • Nov 01</p>
                     </div>
                     <div className="font-mono text-sm group-hover:text-premium-gold transition-colors">
                       $24,500
                     </div>
                   </div>
                 </div>
               </div>

               {/* Contact Lead */}
               <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden shrink-0 filter grayscale">
                   <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Lead Architect" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <p className="text-sm font-medium">Rheinard N.</p>
                   <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest mt-0.5">Lead Architect</p>
                   <button className="text-xs text-premium-gold mt-2 hover:underline">Schedule Sync</button>
                 </div>
               </div>

            </div>
          </div>
        </div>
      </div>
    </CinematicTransition>
  )
}
