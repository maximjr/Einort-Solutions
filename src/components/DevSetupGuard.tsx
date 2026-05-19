import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ENV, isFirebaseConfigured, isGoogleAuthEnabled } from '../config/env';

export function DevSetupGuard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development if config is missing
    if (ENV.IS_DEV && (!isFirebaseConfigured() || !isGoogleAuthEnabled())) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[1000] w-[350px] pointer-events-auto"
      >
        <div className="glass-panel border-yellow-500/30 bg-dark/95 p-6 rounded-2xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
          
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-silver-metallic hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 geometric-clip bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20">
              <ShieldAlert className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold text-white tracking-wide">Developer Mode</h3>
              <p className="font-mono text-[10px] text-yellow-500/80 uppercase tracking-widest mt-0.5">Missing Dependencies</p>
            </div>
          </div>

          <p className="font-sans text-xs text-silver-metallic leading-relaxed mb-4">
            Your application is rendering in fallback mode. The following enterprise systems are unconfigured:
          </p>

          <div className="space-y-3 font-mono text-[10px]">
            {!isFirebaseConfigured() && (
              <div className="p-3 border border-red-500/20 bg-red-500/5 rounded-lg">
                <p className="text-red-400 font-bold uppercase tracking-widest mb-1">Firebase SDK Unconfigured</p>
                <p className="text-silver-metallic lowercase tracking-wider">Ensure firebase-applet-config.json exists or VITE_FIREBASE_* variables are set.</p>
              </div>
            )}
            
            {!ENV.GOOGLE_CLIENT_ID && (
              <div className="p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                <p className="text-yellow-500 font-bold uppercase tracking-widest mb-1">Google OAuth Unconfigured</p>
                <p className="text-silver-metallic lowercase tracking-wider">Set VITE_GOOGLE_CLIENT_ID to enable One-Tap Authentication.</p>
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-white/5">
             <p className="text-[9px] font-mono text-silver-metallic tracking-widest uppercase">
               App is continuously rendering in fallback state to ensure zero interruptions in workflow.
             </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
