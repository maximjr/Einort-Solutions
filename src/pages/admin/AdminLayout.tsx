import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import { LayoutDashboard, Users, Folders, BarChart3, Settings, LogOut, ShieldAlert, Activity, Command } from 'lucide-react';
import { useEffect } from 'react';

const sidebarLinks = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'CRM & Leads', path: '/admin/crm', icon: Activity },
  { name: 'User Intelligence', path: '/admin/users', icon: Users },
  { name: 'Project Orders', path: '/admin/projects', icon: Folders },
  { name: 'System Analytics', path: '/admin/analytics', icon: BarChart3 }
];

export function AdminLayout() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/dashboard'); // or a specific admin login page
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-premium-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white flex-col gap-4">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-display uppercase tracking-widest text-silver-metallic">Access Denied</h1>
        <p className="font-mono text-xs">Admin privileges required.</p>
        <button onClick={() => navigate('/')} className="geometric-clip-button px-6 py-3 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase transition-colors">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden font-sans selection:bg-premium-gold selection:text-white relative">
      <SEO title="EINORT || NEXUS ADMIN" />
      
      {/* Ambient background for the entire admin */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-premium-gold/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-72 border-r border-white/5 bg-[#020617]/80 backdrop-blur-xl flex flex-col z-20 relative"
      >
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-premium-gold/20 to-transparent" />
        
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 geometric-clip border border-premium-gold/30 bg-premium-gold/10 flex items-center justify-center">
              <Command className="w-4 h-4 text-premium-gold" />
            </div>
            <div>
              <h2 className="font-display font-medium text-sm tracking-[0.2em] uppercase leading-none">Nexus</h2>
              <span className="font-mono text-[9px] text-premium-gold tracking-widest uppercase opacity-80">Command Center</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-2 custom-scrollbar">
          <div className="mb-4 px-2">
             <span className="font-mono text-[10px] text-silver-metallic uppercase tracking-widest">Intelligence Modules</span>
          </div>
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg geometric-clip font-mono text-xs tracking-widest uppercase transition-all duration-300 relative group overflow-hidden ${
                  isActive 
                    ? 'text-white border border-premium-gold/30 bg-premium-gold/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'text-silver-metallic hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-premium-gold" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/0 via-premium-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-premium-gold' : 'text-silver-metallic/70 group-hover:text-white'}`} />
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile / Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="glass-panel geometric-clip border-white/5 p-4 flex items-center justify-between group hover:border-premium-gold/30 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
               {user.photoURL ? (
                 <img src={user.photoURL} className="w-8 h-8 geometric-clip border border-white/20" alt="Admin" />
               ) : (
                 <div className="w-8 h-8 geometric-clip bg-white/10 flex items-center justify-center">
                   <Command className="w-4 h-4 text-silver-metallic" />
                 </div>
               )}
               <div className="flex flex-col truncate">
                 <span className="font-mono text-[10px] text-white truncate tracking-wider">{user.displayName || 'Admin'}</span>
                 <span className="font-mono text-[9px] text-premium-gold truncate tracking-widest uppercase mt-0.5">Level 9 Auth</span>
               </div>
            </div>
            <button onClick={signOut} className="p-2 text-silver-metallic hover:text-red-400 transition-colors shrink-0">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-[#020617]">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md flex items-center justify-between px-8 z-20 shrink-0">
           <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-premium-gold animate-pulse" />
             <span className="font-mono text-xs uppercase tracking-widest text-silver-metallic">Environment: Production</span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5 text-[10px] font-mono tracking-widest uppercase">
                <span className="text-silver-metallic">System Status:</span>
                <span className="text-oxblood">Optimal</span>
              </div>
              <button onClick={() => navigate('/')} className="text-xs font-mono uppercase tracking-[0.2em] text-silver-metallic hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">
                View Website
              </button>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar relative p-6 md:p-10">
           <AnimatePresence mode="wait">
             <Outlet />
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
