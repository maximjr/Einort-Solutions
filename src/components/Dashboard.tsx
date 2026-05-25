import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { Clock, Star, Settings, FileText, ChevronRight, Activity, ArrowRight, ShieldCheck, Layout } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  accountType?: string;
  lastLogin?: any;
  onboardingStatus?: string;
}

export function Dashboard() {
  const { user, loading, isAdmin } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    let unsub: () => void = () => {};
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      unsub = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
        setProfileLoading(false);
      }, (err) => {
        console.warn(`Could not fetch profile for user ${user.uid}: `, err);
        setProfileLoading(false);
      });
    } else {
      setProfileLoading(false);
    }
    return () => unsub();
  }, [user]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center pt-24 text-white">
        <div className="w-12 h-12 border-2 border-premium-gold border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profile && profile.onboardingStatus === 'pending') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-24 text-white relative">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-premium-gold/10 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* User Identity Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-premium-gold/50 via-white/10 to-transparent" />
          
          <div className="flex items-center gap-8 pb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 geometric-clip bg-white/5 border border-white/20 p-2 flex items-center justify-center relative shadow-[0_0_30px_rgba(37,99,235,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-full h-full geometric-clip overflow-hidden bg-dark-blue flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-display text-premium-gold uppercase">
                    {profile?.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 glass-panel-light border-l-2 border-l-oxblood geometric-clip-right w-fit mb-4"
              >
                <div className="w-2 h-2 bg-oxblood geometric-diamond animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white">Encrypted Session</span>
              </motion.div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 tracking-tight">{profile?.displayName || user.displayName || 'Architect'}</h1>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-premium-gold" />
                <p className="text-silver-metallic font-mono text-xs">{profile?.email || user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 pb-8">
            {isAdmin && (
              <Link to="/admin" className="px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/10 geometric-clip hover:bg-premium-gold/10 hover:border-premium-gold/50 transition-all duration-300 flex items-center gap-3 group">
                 Terminal (Admin) <Settings className="w-4 h-4 text-gray-400 group-hover:text-premium-gold transition-colors" />
              </Link>
            )}
            
            <Link to="/client" className="px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/10 geometric-clip hover:bg-premium-gold/10 hover:border-premium-gold/50 transition-all duration-300 flex items-center gap-3 group">
               Client Portal <Layout className="w-4 h-4 text-gray-400 group-hover:text-premium-gold transition-colors" />
            </Link>

            <Link to="/contact" className="group relative inline-flex items-center justify-center px-8 py-3 bg-white overflow-hidden geometric-clip-right hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:transition-transform group-hover:translate-x-[150%] duration-1000" />
              <span className="relative z-10 tracking-[0.2em] text-xs font-bold uppercase text-dark flex items-center gap-2 font-mono">
                Initialize Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        {/* Telemetry HUD Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="holographic-panel p-8 geometric-clip border border-white/10 flex flex-col gap-4 relative overflow-hidden group hover:border-premium-gold/40 transition-colors duration-500"
          >
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-premium-gold/10 rounded-full blur-2xl pointer-events-none group-hover:bg-premium-gold/20 transition-colors duration-700" />
            <div className="w-12 h-12 geometric-diamond bg-white/5 flex items-center justify-center border border-white/10 mb-4 shadow-sm group-hover:border-premium-gold/50 transition-colors">
              <Activity className="w-5 h-5 text-premium-gold" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-metallic">System Velocity</span>
              <p className="text-4xl font-display font-bold mt-2 text-white group-hover:text-glow-silver transition-all">Optimal</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-premium-gold to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8 geometric-clip border border-white/5 flex flex-col gap-4 group hover:border-white/20 transition-colors duration-500 relative"
          >
            <div className="w-12 h-12 geometric-diamond bg-white/5 flex items-center justify-center border border-white/10 mb-4">
              <Star className="w-5 h-5 text-premium-gold group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-metallic">Saved Architectures</span>
              <p className="text-4xl font-display font-bold mt-2 text-white">02</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-8 geometric-clip border border-white/5 flex flex-col gap-4 group hover:border-white/20 transition-colors duration-500 relative"
          >
            <div className="w-12 h-12 geometric-diamond bg-white/5 flex items-center justify-center border border-white/10 mb-4">
              <FileText className="w-5 h-5 text-premium-gold group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-metallic">Active Consultations</span>
              <p className="text-4xl font-display font-bold mt-2 text-white">00</p>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Modules */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-oxblood geometric-diamond animate-pulse" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em]">Activity Log</h2>
              </div>
              <button className="text-[10px] font-mono font-bold uppercase tracking-widest text-premium-gold hover:text-white transition-colors">View All Archive</button>
            </div>
            
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="group p-5 geometric-clip-right border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition-all flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-5">
                    <div className="mt-1 sm:mt-0 w-10 h-10 geometric-diamond bg-dark flex items-center justify-center shrink-0 border border-white/5 group-hover:border-premium-gold/30 transition-colors">
                      <Clock className="w-4 h-4 text-silver-metallic group-hover:text-premium-gold transition-colors" />
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-wide mb-1 group-hover:text-white transition-colors">Accessed "System Architecture" Blueprint</p>
                      <p className="text-xs font-mono tracking-widest text-silver-metallic">T-{i * 12 + 5} MINUTES AGO</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-premium-gold transition-colors hidden sm:block shrink-0 group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em]">Inspiration Core</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Mock Saved Cards */}
              <div className="aspect-[4/5] geometric-clip overflow-hidden relative group cursor-pointer block border border-transparent hover:border-premium-gold/50 transition-colors duration-500">
                <img src="https://images.unsplash.com/photo-1616803140344-6682afb13cda?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Saved" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-1.5 h-1.5 geometric-diamond bg-premium-gold" />
                     <p className="text-[9px] font-bold uppercase tracking-widest text-premium-gold">Fintech Model</p>
                   </div>
                   <p className="text-white font-bold text-sm tracking-wide">Nexus Interface</p>
                </div>
              </div>
              
              <div className="aspect-[4/5] geometric-clip overflow-hidden relative group cursor-pointer block border border-transparent hover:border-white/20 transition-colors duration-500">
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale" alt="Saved" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-1.5 h-1.5 geometric-diamond bg-white" />
                     <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">Platform</p>
                   </div>
                   <p className="text-white font-bold text-sm tracking-wide">Cognitive Core</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
