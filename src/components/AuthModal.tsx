import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { ENV, isGoogleAuthEnabled, isFirebaseConfigured } from '../config/env';

declare global {
  interface Window {
    google?: any;
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithGoogle, signInWithGoogleCredential } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    // Check if client ID is configured
    if (!isGoogleAuthEnabled()) return;

    const initializeGSI = () => {
      if (!window.google) return;
      
      window.google.accounts.id.initialize({
        client_id: ENV.GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          setLoading(true);
          try {
            await signInWithGoogleCredential(response.credential);
            onClose();
          } catch (error) {
            console.error("One Tap error", error);
          } finally {
            setLoading(false);
          }
        },
        use_fedcm_for_prompt: true,
        auto_select: false,
      });

      // Show the One Tap UI slide-in
      window.google.accounts.id.prompt();
    };

    if (window.google) {
      initializeGSI();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGSI;
      document.body.appendChild(script);
    }
  }, [isOpen, onClose, signInWithGoogleCredential]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isConfigured = isFirebaseConfigured();
  const authReady = isConfigured && isGoogleAuthEnabled();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-dark/80 backdrop-blur-md"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
              className="w-full max-w-md glass-panel bg-dark/90 border border-white/10 rounded-3xl p-8 relative overflow-hidden pointer-events-auto shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10 mt-4">
                <div className="flex items-center gap-2 mb-6 relative z-10">
                  <div className="w-6 h-6 bg-electric-blue flex items-center justify-center rounded-sm rotate-45">
                    <div className="w-3 h-3 bg-white -rotate-45" />
                  </div>
                  <span className="font-sans font-bold text-lg tracking-widest text-soft-silver">
                    EINORT<span className="text-electric-blue">ID</span>
                  </span>
                </div>
                <h3 className="font-display text-3xl font-bold text-white mb-3 relative z-10">Welcome to the future.</h3>
                <p className="text-gray-400 text-sm font-light relative z-10">
                  Sign in to access your personalized enterprise dashboard, saved architectures, and consultation history.
                </p>
              </div>

              {!authReady ? (
                <div className="space-y-4 relative z-10 p-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                   <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <h4 className="font-sans text-sm font-bold text-yellow-500">Authentication Initializing</h4>
                   </div>
                   <p className="text-xs text-silver-metallic leading-relaxed">
                     Enterprise authentication services are currently starting up or missing vital parameters. You can continue browsing normally without an account.
                   </p>
                   {ENV.IS_DEV && (
                     <div className="mt-4 pt-3 border-t border-yellow-500/10">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-500/80 mb-2 block">Dev Missing Config:</span>
                        <ul className="text-[10px] font-mono text-silver-metallic space-y-1">
                          {!isConfigured && <li>- Firebase Environment Variables</li>}
                          {!ENV.GOOGLE_CLIENT_ID && <li>- VITE_GOOGLE_CLIENT_ID</li>}
                        </ul>
                     </div>
                   )}
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  <button 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full group flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-4">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span className="font-semibold text-sm">Continue with Google</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors group-hover:translate-x-1" />
                  </button>
                </div>
              )}

              <div className="mt-8 text-center relative z-10">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                  By signing in, you agree to our Terms & Privacy Policy
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
