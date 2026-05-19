import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebase-utils';
import { Clock, Star, Settings, FileText, ChevronRight, Activity } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  accountType?: string;
  lastLogin?: any;
}

export function Dashboard() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        } finally {
          setProfileLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center pt-24 text-white">
        <div className="w-12 h-12 border-2 border-electric-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-24 text-white relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-electric-blue/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-electric-blue p-1 overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden bg-dark-blue">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-display text-electric-blue uppercase">
                    {user.email?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-electric-blue/10 border border-electric-blue/30 rounded-full w-fit mb-3"
              >
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-electric-blue">Active Session</span>
              </motion.div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-1">{profile?.displayName || user.displayName || 'Welcome Back'}</h1>
              <p className="text-gray-400">{profile?.email || user.email}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/admin" className="px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/10 geometric-clip-button hover:bg-white/10 hover:border-white/30 transition-all flex items-center gap-2">
               Command Center <Activity className="w-4 h-4 text-electric-blue" />
            </Link>
            <button className="p-3 bg-white/5 border border-white/10 hover:border-white/30 rounded-full transition-colors text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </button>
            <Link to="/contact" className="px-6 py-3 bg-white text-dark font-bold text-sm tracking-widest uppercase rounded-full hover:bg-electric-blue hover:text-white transition-colors flex xl:w-auto">
              New Project
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-electric-blue/10 rounded-full blur-xl pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-electric-blue mb-2">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">Activity Level</span>
              <p className="text-3xl font-display font-bold mt-1">High</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-electric-blue mb-2">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">Saved Projects</span>
              <p className="text-3xl font-display font-bold mt-1">2</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-electric-blue mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">Consultations</span>
              <p className="text-3xl font-display font-bold mt-1">0</p>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
              <button className="text-sm font-semibold text-electric-blue hover:text-white transition-colors">View All</button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="group p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all flex items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 sm:mt-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-gray-400 group-hover:text-electric-blue transition-colors" />
                    </div>
                    <div>
                      <p className="font-medium mb-1 group-hover:text-white transition-colors">Viewed "Neon Banking" Architecture</p>
                      <p className="text-sm text-gray-500">Just now</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors hidden sm:block shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold tracking-tight">Saved Inspiration</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Mock Saved Cards */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative group cursor-pointer block glass-panel border-white/10">
                <img src="https://images.unsplash.com/photo-1616803140344-6682afb13cda?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Saved" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white">Fintech</p>
                </div>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative group cursor-pointer block glass-panel border-white/10">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale" alt="Saved" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white">Commerce</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
