import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import { LayoutDashboard, Users, Folders, BarChart3, LogOut, ShieldAlert, Activity, Command, Bell, X, Zap, Target, Clock, Globe } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { useDebouncedSnapshot } from '../../hooks/useDebouncedSnapshot';

const sidebarLinks = [
  { name: 'Executive Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Live Intel Feed', path: '/admin/users', icon: Activity },
  { name: 'Pipeline CRM', path: '/admin/crm', icon: Users },
  { name: 'Project Operations', path: '/admin/projects', icon: Folders },
  { name: 'Business Analytics', path: '/admin/analytics', icon: BarChart3 }
];

export function AdminLayout() {
  const { user, loading, isAdmin, userRole, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/dashboard'); // or a specific admin login page
    }
  }, [user, loading, navigate]);

  const qNotifications = useMemo(() => {
    if (!isAdmin) return null;
    return query(collection(db, 'clientActivity'), orderBy('timestamp', 'desc'), limit(10));
  }, [isAdmin]);

  useDebouncedSnapshot(qNotifications, (snap) => {
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotifications(data);
    // Simple unread logic - if menu is closed, count goes up, otherwise 0
    if (!showNotifications) setUnreadCount(prev => prev + 1);
  }, 1000);

  const viewNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) setUnreadCount(0);
  };

  const getActionFormat = (type: string) => {
     const t = type || '';
     if (t.includes('started_prototype')) return { color: 'text-blue-400', icon: Zap };
     if (t.includes('completed_prototype')) return { color: 'text-green-400', icon: Target };
     if (t.includes('booked_consultation')) return { color: 'text-premium-gold', icon: Clock };
     if (t.includes('opened_services')) return { color: 'text-silver-metallic', icon: Globe };
     return { color: 'text-white/50', icon: Activity };
  };

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
                    ? 'text-white border border-premium-gold/30 bg-premium-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
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
                 <span className="font-mono text-[9px] text-premium-gold truncate tracking-widest uppercase mt-0.5">{userRole || 'Admin'}</span>
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
             <div className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-premium-gold opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-premium-gold"></span>
             </div>
             <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-silver-metallic">Ops Normal <span className="mx-2 text-white/20">|</span> Server: U.S. Core</span>
           </div>
           
           <div className="flex items-center gap-6 relative">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-white/10 rounded-sm bg-white/[0.02] text-[9px] font-mono tracking-[0.2em] uppercase geometric-clip">
                <span className="text-silver-metallic">Architecture:</span>
                <span className="text-premium-gold">Live</span>
              </div>

              {/* Notification Engine */}
              <div className="relative flex items-center">
                <button 
                  onClick={viewNotifications}
                  className="relative p-2 text-silver-metallic hover:text-white transition-colors hover:bg-white/5 rounded-sm geometric-clip"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#020617] animate-pulse"></span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-[calc(100%+15px)] right-0 w-80 bg-[#060B1E] border border-white/10 rounded-sm geometric-clip shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-50 flex flex-col max-h-[400px]"
                    >
                      <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                         <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold text-white flex items-center gap-2"><Activity className="w-3 h-3 text-premium-gold" /> LIVE ACTIVITY LOG</span>
                         <button onClick={() => setShowNotifications(false)} className="text-white/40 hover:text-white transition-colors">
                           <X className="w-3 h-3" />
                         </button>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                         {notifications.map(notif => {
                           const format = getActionFormat(notif.type);
                           const Icon = format.icon;
                           return (
                             <div key={notif.id} className="p-3 bg-dark/40 hover:bg-white/5 border border-white/5 rounded-sm transition-colors group">
                               <div className="flex items-start gap-3">
                                  <div className={`mt-0.5 ${format.color}`}>
                                     <Icon className="w-3 h-3" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-sans text-xs text-white/90 leading-tight mb-1 truncate">{notif.details || notif.type.replace('_', ' ')}</p>
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono text-[8px] uppercase tracking-widest text-silver-metallic truncate max-w-[150px]">{notif.email || notif.userId || 'Ghost user'}</span>
                                      <span className="font-mono text-[8px] uppercase tracking-widest text-white/30">{notif.timestamp?.toDate ? formatDistanceToNow(notif.timestamp.toDate(), { addSuffix: true }) : 'Just now'}</span>
                                    </div>
                                  </div>
                               </div>
                             </div>
                           );
                         })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => navigate('/')} className="text-[10px] font-mono tracking-[0.2em] font-bold uppercase border border-white/10 px-4 py-2 hover:bg-white/5 transition-colors geometric-clip-button">
                VISIT NEXUS
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
