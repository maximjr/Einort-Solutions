import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, onSnapshot, limit, doc } from 'firebase/firestore';
import { 
  FileText, CheckCircle2, Clock, Download, ArrowRight, Activity, 
  CalendarDays, Loader2, MessageSquare, Bell, Settings, 
  CreditCard, FolderOpen, Video, Send, LogOut, ChevronRight
} from 'lucide-react';
import { CinematicTransition } from '../../components/CinematicTransition';

// Types
interface Project {
  id: string;
  type: 'sandbox' | 'custom';
  title?: string;
  projectId?: string;
  status: string;
  createdAt: any;
  progress?: number;
  [key: string]: any;
}

// Simulated data structures for missing collections
const MOCK_MESSAGES = [
  { id: 1, text: "The latest prototype looks fantastic. Proceeding to dev.", sender: "Rheinard N.", time: "10:24 AM" },
  { id: 2, text: "Awesome. I'll review the invoice tonight.", sender: "Client", time: "10:30 AM" }
];

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "Milestone 2 Approved", time: "2h ago", read: false },
  { id: 2, text: "New Deliverable: Figma Files", time: "1d ago", read: true },
];

export function ClientPortal() {
  const { user } = useAuth();
  
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'deliverables' | 'messages' | 'settings'>('overview');

  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;
    
    // 1. Fast initial fetch (load once)
    const fetchInitialData = async () => {
      try {
        const qSandbox = query(collection(db, 'projectSubmissions'), where('userId', '==', user.uid), limit(5));
        const qCustom = query(collection(db, 'customProjects'), where('userId', '==', user.uid), limit(5));
        
        const [sandboxDocs, customDocs] = await Promise.all([
          getDocs(qSandbox),
          getDocs(qCustom)
        ]);

        if (!isMounted) return;

        const merged: Project[] = [
          ...sandboxDocs.docs.map(d => ({ id: d.id, type: 'sandbox' as const, ...d.data() } as Project)),
          ...customDocs.docs.map(d => ({ id: d.id, type: 'custom' as const, ...d.data() } as Project))
        ].sort((a, b) => {
          const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return tB - tA;
        });

        setProjects(merged);
        if (merged.length > 0 && !activeProjectId) {
          setActiveProjectId(merged[0].id);
        }
        
        // Immediate UI reveal
        setInitialLoad(false);

      } catch (err) {
        console.error("Failed to load project data", err);
        setInitialLoad(false);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // 2. Realtime Subscription ONLY for the active project (lazy loaded & minimal read)
  useEffect(() => {
    if (!activeProjectId || !user) return;
    
    const activeProject = projects.find(p => p.id === activeProjectId);
    if (!activeProject) return;

    const collectionName = activeProject.type === 'sandbox' ? 'projectSubmissions' : 'customProjects';
    
    const docRef = doc(db, collectionName, activeProjectId);
    const unsubProject = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const updatedData = { id: docSnap.id, type: activeProject.type, ...docSnap.data() } as Project;
        setProjects(prev => prev.map(p => p.id === activeProjectId ? updatedData : p));
      }
    });

    return () => unsubProject();
  }, [activeProjectId, user]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  const getProgress = (project: Project) => {
    if (project.progress !== undefined) return project.progress;
    if (project.status === 'completed') return 100;
    if (project.status === 'active') return 45;
    return 15;
  };

  const getPhaseName = (project: Project) => {
    if (project.status === 'completed') return 'Deployment & Handoff';
    if (project.status === 'active') return 'Engineering Integration';
    if (project.status === 'pending') return 'Architectural Planning';
    return 'Discovery';
  };

  if (initialLoad) {
    return <DashboardSkeleton />;
  }

  return (
    <CinematicTransition>
      <div className="min-h-screen bg-dark pt-24 pb-20 selection:bg-premium-gold/30">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* SECTION 1: WELCOME HERO */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-3xl font-display font-medium text-white mb-2">
                Welcome back, <span className="text-premium-gold">{user?.displayName?.split(' ')[0] || 'Client'}</span>
              </h1>
              {activeProject ? (
                <div className="flex pl-1 items-center gap-3 text-sm font-mono text-white/50 tracking-widest uppercase">
                  <span>Current: {activeProject.type === 'sandbox' ? activeProject.projectId?.toUpperCase() : activeProject.title}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-premium-gold" /> {activeProject.status}</span>
                </div>
              ) : (
                <p className="text-sm font-mono text-white/40 tracking-widest uppercase">No active projects found.</p>
              )}
            </div>
            
            {/* Quick Navigation Tabs - Premium minimal pill selector */}
            {activeProject && (
              <div className="flex flex-wrap items-center bg-[#111] p-1.5 rounded-2xl border border-white/5">
                {[
                  { id: 'overview', icon: Activity, label: 'Overview' },
                  { id: 'deliverables', icon: FolderOpen, label: 'Files' },
                  { id: 'messages', icon: MessageSquare, label: 'Messages' },
                  { id: 'settings', icon: Settings, label: 'Settings' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-white/10 text-white shadow-sm' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {!activeProject ? (
            <EmptyState />
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              
              {/* MAIN CONTENT AREA */}
              <div className="lg:col-span-8 space-y-8">
                
                <AnimatePresence mode="wait">
                  {/* TAB: OVERVIEW */}
                  {activeTab === 'overview' && (
                    <motion.div 
                      key="overview"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      {/* SECTION 2: PROJECT OVERVIEW */}
                      <ProjectOverviewCard project={activeProject} progress={getProgress(activeProject)} phase={getPhaseName(activeProject)} />
                      
                      {/* SECTION 3: MILESTONE TRACKER */}
                      <MilestoneTracker project={activeProject} />
                    </motion.div>
                  )}

                  {/* TAB: DELIVERABLES */}
                  {activeTab === 'deliverables' && (
                    <motion.div 
                      key="deliverables"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                    >
                      <DeliverablesCenter />
                    </motion.div>
                  )}

                  {/* TAB: MESSAGES */}
                  {activeTab === 'messages' && (
                    <motion.div 
                      key="messages"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                    >
                      <MessagesCenter />
                    </motion.div>
                  )}

                  {/* TAB: SETTINGS */}
                  {activeTab === 'settings' && (
                    <motion.div 
                      key="settings"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                    >
                      <ProfileSettings />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SIDEBAR AREA */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* SECTION 8: NOTIFICATIONS */}
                <NotificationsCard />

                {/* SECTION 6: INVOICE & PAYMENT */}
                <FinanceCard />

                {/* SECTION 7: BOOK CONSULTATION */}
                <BookConsultationCard />

              </div>
            </div>
          )}
        </div>
      </div>
    </CinematicTransition>
  );
}

// ------------------------------------------------------------------------------------------------
// SUB-COMPONENTS
// ------------------------------------------------------------------------------------------------

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-dark pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 animate-pulse">
        <div className="h-8 w-64 bg-white/5 rounded-lg mb-4"></div>
        <div className="h-4 w-48 bg-white/5 rounded-lg mb-12"></div>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-64 bg-white/5 rounded-[2rem]"></div>
            <div className="h-96 bg-white/5 rounded-[2rem]"></div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-48 bg-white/5 rounded-3xl"></div>
            <div className="h-48 bg-white/5 rounded-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 px-6 border border-white/5 rounded-3xl bg-[#0a0a0a]">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
        <FolderOpen className="w-8 h-8 text-white/30" />
      </div>
      <h3 className="font-display text-2xl text-white mb-3">No Active Projects</h3>
      <p className="text-white/50 text-sm font-light mb-8 max-w-sm mx-auto leading-relaxed">
        You do not have any active project architectures in progress. You can start a new prototype or request a custom build.
      </p>
      <button className="px-8 py-3 bg-white text-dark font-medium text-sm rounded-full hover:bg-premium-gold transition-colors">
        Start New Project
      </button>
    </div>
  );
}

function ProjectOverviewCard({ project, progress, phase }: { project: Project, progress: number, phase: string }) {
  return (
    <div className="bg-[#111] p-10 rounded-[2rem] border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-premium-gold/5 blur-[120px] rounded-full group-hover:bg-premium-gold/10 transition-colors duration-1000" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-display font-medium text-white mb-3">{phase}</h2>
          <div className="flex items-center gap-4 text-xs font-mono text-white/50 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Deadline: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
          </div>
        </div>
        <div className="md:text-right shrink-0">
          <p className="font-mono text-5xl font-light text-white mb-2">{progress}%</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Completion Status</p>
        </div>
      </div>
      
      {/* Premium Progress Bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full mt-10 overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-premium-gold rounded-full" 
        />
      </div>
    </div>
  );
}

function MilestoneTracker({ project }: { project: Project }) {
  const milestones = [
    { name: "Discovery & Scope", status: project.status === 'pending' ? 'active' : 'completed' },
    { name: "Architectural Planning", status: project.status === 'pending' ? 'pending' : project.status === 'active' ? 'active' : 'completed' },
    { name: "Development & Integration", status: project.status === 'completed' ? 'completed' : project.status === 'active' ? 'active' : 'pending' },
    { name: "QA & Refinement", status: project.status === 'completed' ? 'completed' : 'pending' },
    { name: "Final Handover", status: project.status === 'completed' ? 'completed' : 'pending' }
  ];

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 md:p-10">
      <h3 className="text-xs font-mono font-medium text-white/50 uppercase tracking-widest mb-10">Project Roadmap</h3>
      <div className="space-y-0 text-sm">
        {milestones.map((milestone, idx) => {
          const isCompleted = milestone.status === 'completed';
          const isActive = milestone.status === 'active';
          
          return (
            <div key={idx} className="flex gap-6 group">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  isCompleted ? 'bg-premium-gold border-premium-gold text-dark' : 
                  isActive ? 'border-premium-gold text-premium-gold bg-premium-gold/10' : 
                  'border-white/10 text-transparent'
                }`}>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-premium-gold" />}
                </div>
                {idx !== milestones.length - 1 && (
                  <div className={`w-[1px] h-10 my-1 ${isCompleted ? 'bg-premium-gold/30' : 'bg-white/5'}`} />
                )}
              </div>
              <div className="pt-0.5 pb-8 flex-1">
                <h4 className={`font-medium ${isActive ? 'text-white' : isCompleted ? 'text-white/80' : 'text-white/40'}`}>{milestone.name}</h4>
                {isActive && <p className="text-xs text-white/50 mt-1.5 leading-relaxed">Currently in progress. We will notify you once this phase requires your review.</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeliverablesCenter() {
  const files = [
    { name: "Requirements_Spec_v2.pdf", size: "2.4 MB", date: "Oct 12" },
    { name: "Architecture_Diagram.png", size: "1.1 MB", date: "Oct 15" },
    { name: "API_Contract_Draft.json", size: "45 KB", date: "Oct 18" },
  ];

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-display text-white">Deliverables</h3>
        <button className="text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white transition-colors">View All</button>
      </div>

      <div className="space-y-3">
        {files.map((f, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#111] border border-white/5 hover:border-premium-gold/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-premium-gold/10 transition-colors">
                <FileText className="w-4 h-4 text-white/60 group-hover:text-premium-gold transition-colors" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">{f.name}</p>
                <p className="text-xs text-white/40 font-mono mt-0.5">{f.size} • {f.date}</p>
              </div>
            </div>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesCenter() {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] flex flex-col h-[600px] overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-[#111]">
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Lead" className="w-10 h-10 rounded-full object-cover filter grayscale" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#111] rounded-full"></div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">Rheinard N.</h3>
          <p className="text-[10px] uppercase font-mono tracking-widest text-premium-gold">Lead Architect</p>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {MOCK_MESSAGES.map((msg, i) => {
          const isClient = msg.sender === 'Client';
          return (
            <div key={i} className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${isClient ? 'bg-premium-gold text-dark rounded-br-sm' : 'bg-[#111] border border-white/5 text-white/90 rounded-bl-sm'}`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-white/30 font-mono mt-2 uppercase tracking-wider">{msg.time}</span>
            </div>
          )
        })}
      </div>

      <div className="p-4 border-t border-white/5 bg-[#111]">
        <div className="flex items-center gap-3 bg-[#0a0a0a] p-2 rounded-2xl border border-white/5 focus-within:border-premium-gold/50 transition-colors">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 bg-transparent border-none text-sm text-white px-3 py-2 focus:outline-none focus:ring-0"
          />
          <button className="w-10 h-10 rounded-xl bg-white text-dark hover:bg-premium-gold flex items-center justify-center transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const { signOut } = useAuth();
  
  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 md:p-10">
      <h3 className="text-lg font-display text-white mb-8">Settings</h3>
      <div className="space-y-6">
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-2">Company Name</span>
          <input type="text" defaultValue="Client Enterprise" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-premium-gold/50 transition-colors" />
        </label>
        <label className="block">
          <span className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-2">Notification Email</span>
          <input type="email" defaultValue="contact@client.com" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-premium-gold/50 transition-colors" />
        </label>
        <div className="pt-4 border-t border-white/5">
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsCard() {
  return (
    <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-white/50" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-white/50">Recent Updates</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-premium-gold"></div>
      </div>
      <div className="space-y-4">
        {MOCK_NOTIFICATIONS.map((n, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${n.read ? 'bg-white/10' : 'bg-premium-gold'}`} />
            <div>
              <p className={`text-sm ${n.read ? 'text-white/60' : 'text-white/90 font-medium'}`}>{n.text}</p>
              <p className="text-[10px] text-white/40 font-mono mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceCard() {
  return (
    <div className="bg-[#111] border border-white/5 rounded-3xl p-6 text-white group cursor-pointer hover:border-premium-gold/30 transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-white/70" />
        </div>
        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-premium-gold group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="text-sm text-white/50 mb-1">Outstanding Balance</h3>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-mono">$0.00</p>
        <p className="text-xs text-green-400 font-medium pb-1 flex items-center gap-1 group-hover:text-green-300"><CheckCircle2 className="w-3 h-3"/> Up to date</p>
      </div>
    </div>
  );
}

function BookConsultationCard() {
  return (
    <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-premium-gold/5 rounded-full blur-2xl group-hover:bg-premium-gold/10 transition-colors"></div>
      <h3 className="text-lg font-display text-white mb-2 relative z-10">Need a Sync?</h3>
      <p className="text-sm text-white/50 mb-6 relative z-10 leading-relaxed">
        Schedule a 30-minute review session with your Lead Architect.
      </p>
      <button className="w-full flex items-center justify-center gap-2 bg-white text-dark py-3 rounded-xl text-sm font-medium transition-all hover:bg-premium-gold relative z-10">
        <Video className="w-4 h-4" /> Book Meeting
      </button>
    </div>
  );
}
