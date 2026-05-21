import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Lock, User, Phone, Eye, EyeOff, ChevronLeft, Mail, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, FormEvent } from 'react';
import { isFirebaseConfigured } from '../config/env';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

type AuthView = 'signIn' | 'signUp' | 'forgotPassword';

export function AuthModal({ isOpen, onClose, onSuccess, title, subtitle }: AuthModalProps) {
  const { signUpWithEmail, loginWithEmail, resetPassword } = useAuth();
  
  const [view, setView] = useState<AuthView>('signIn');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);

  // Reset states when modal closes or view changes
  useEffect(() => {
    setError(null);
    setSuccess(null);
    if (!isOpen) {
      setView('signIn');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setPhoneNumber('');
    }
  }, [isOpen, view]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (view === 'signUp') {
      if (!fullName || !email || !password || !confirmPassword) {
        setError("Please fill in all required fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    } else if (view === 'signIn') {
      if (!email || !password) {
        setError("Email and password are required.");
        return;
      }
    } else if (view === 'forgotPassword') {
      if (!email) {
        setError("Email is required to reset password.");
        return;
      }
    }

    setLoading(true);
    try {
      if (view === 'signUp') {
        await signUpWithEmail(email, password, fullName, phoneNumber);
        if (onSuccess) onSuccess();
        onClose();
      } else if (view === 'signIn') {
        await loginWithEmail(email, password);
        if (onSuccess) onSuccess();
        onClose();
      } else if (view === 'forgotPassword') {
        await resetPassword(email);
        setSuccess("Password reset email sent. Please check your inbox.");
        setTimeout(() => setView('signIn'), 3000);
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
      if (err.message === 'User already exists. Sign in?') {
        setTimeout(() => setView('signIn'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const isConfigured = isFirebaseConfigured();

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
            onClick={!loading ? onClose : undefined}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
             <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
              className="w-full max-w-[400px] bg-dark/95 border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden pointer-events-auto shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={onClose}
                disabled={loading}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-20 disabled:opacity-50 bg-white/5 rounded-full p-1.5 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-8 mt-2">
                <div className="flex items-center gap-2 mb-6 relative z-10 w-fit mx-auto md:mx-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full">
                    <img 
                      src="https://i.imgur.com/6V1ecDU.png" 
                      alt="EINORT Logo" 
                      className="w-5 h-5 object-contain" 
                    />
                  </div>
                  <span className="font-display font-medium text-sm tracking-[0.1em] text-white">
                    EINORT
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative z-10 text-center md:text-left"
                  >
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-2 tracking-tight">
                      {title ? title : (view === 'signIn' ? "Welcome back." : view === 'signUp' ? "Join the future." : "Reset password.")}
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm font-sans">
                      {subtitle ? subtitle : (view === 'signIn' ? "Sign in with your email and password." : view === 'signUp' ? "Create an account to begin your journey." : "Enter your email to receive recovery instructions.")}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {!isConfigured && view !== 'forgotPassword' && (
                <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 relative z-10">
                   <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                      <h4 className="font-sans text-sm font-semibold text-red-500">Firebase Unconfigured</h4>
                   </div>
                   <p className="text-xs text-white/70 leading-relaxed font-sans">
                     Authentication services require Firebase environment variables to be set.
                   </p>
                </div>
              )}

              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs sm:text-sm overflow-hidden"
                    >
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-white/10 border border-white/20 rounded-xl text-white text-xs sm:text-sm overflow-hidden"
                    >
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4 shadow-sm">
                  {view === 'signUp' && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-white/40" />
                        </div>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Name"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all disabled:opacity-50 text-sm font-sans"
                          disabled={loading || !isConfigured}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 text-white/40" />
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Phone Number (Optional)"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all disabled:opacity-50 text-sm font-sans"
                          disabled={loading || !isConfigured}
                        />
                      </div>
                    </>
                  )}

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-white/40" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all disabled:opacity-50 text-sm font-sans"
                      disabled={loading || !isConfigured}
                    />
                  </div>

                  {view !== 'forgotPassword' && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-white/40" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all disabled:opacity-50 text-sm font-sans"
                        disabled={loading || !isConfigured}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {view === 'signUp' && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-white/40" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all disabled:opacity-50 text-sm font-sans"
                        disabled={loading || !isConfigured}
                      />
                       <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  {view === 'signIn' && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setView('forgotPassword')}
                        className="text-xs text-white/60 hover:text-white transition-colors font-sans"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !isConfigured}
                    className="w-full relative group overflow-hidden bg-white text-dark font-semibold py-3 sm:py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 flex justify-center items-center font-sans text-sm"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                      ) : (
                        <>
                          {view === 'signIn' ? "Sign In" : view === 'signUp' ? "Create Account" : "Send Reset Link"}
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {view === 'forgotPassword' ? (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setView('signIn')}
                      className="flex items-center justify-center gap-2 text-xs sm:text-sm text-white/60 hover:text-white transition-colors mx-auto font-sans"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to Sign In
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-8 text-center text-xs sm:text-[13px] text-white/60 font-sans">
                      {view === 'signIn' ? (
                        <p>
                          Don't have an account?{' '}
                          <button onClick={() => setView('signUp')} className="text-white hover:underline font-medium transition-colors">
                            Sign up
                          </button>
                        </p>
                      ) : (
                        <p>
                          Already have an account?{' '}
                          <button onClick={() => setView('signIn')} className="text-white hover:underline font-medium transition-colors">
                            Sign in
                          </button>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
