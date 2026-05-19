import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
    { name: 'Process', href: '/process' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'py-4' : 'py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className={cn(
          "absolute inset-0 transition-opacity duration-500 -z-10",
          isScrolled ? "opacity-100 glass-panel border-x-0 border-t-0" : "opacity-0"
        )} />
        
        <Link to="/" className="flex items-center gap-4 group z-50">
          <div className="relative">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="https://i.imgur.com/6V1ecDU.png" 
                alt="EINORT Logo" 
                className="w-full h-full object-contain transition-transform group-hover:scale-110 duration-500 relative z-10" 
              />
              <div className="absolute inset-0 bg-electric-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
          <span className="font-display font-medium text-lg tracking-[0.2em] text-white">
            EINORT<span className="text-electric-blue font-bold">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 z-50">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "text-xs font-mono font-medium hover:text-white transition-colors uppercase tracking-[0.2em] relative group",
                location.pathname === link.href ? "text-white" : "text-silver-metallic"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-2 left-0 h-[2px] bg-electric-blue transition-all duration-300",
                location.pathname === link.href ? "w-full shadow-[0_0_10px_#2563eb]" : "w-0 group-hover:w-full group-hover:shadow-[0_0_10px_#2563eb]"
              )} />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6 z-50">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-10 h-10 geometric-clip border border-white/20 overflow-hidden hover:border-electric-blue transition-all bg-dark-blue flex items-center justify-center"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5 text-electric-blue" />
                )}
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-56 glass-panel border-neon geometric-clip shadow-[0_0_30px_rgba(59,130,246,0.15)] py-2 flex flex-col z-50"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="font-sans font-semibold text-sm truncate text-white">{user.displayName}</p>
                      <p className="font-mono text-xs text-silver-metallic truncate tracking-wider mt-1">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-white/5 hover:text-electric-blue transition-colors text-left flex items-center gap-2 text-white/80">
                      Dashboard
                    </Link>
                    <button onClick={() => { signOut(); setProfileDropdownOpen(false); }} className="px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-white/5 text-red-400 hover:text-red-300 transition-colors text-left flex items-center gap-2">
                      <LogOut className="w-3 h-3" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-silver-metallic hover:text-white transition-colors"
            >
              Sign In
            </button>
          )}

          <Link
            to="/contact"
            className="px-6 py-2.5 bg-electric-blue geometric-clip-button text-white text-xs font-mono font-bold uppercase tracking-[0.2em] hover:bg-neon-blue transition-all"
          >
            Start Project
          </Link>
        </div>

        <button
          className="md:hidden relative z-50 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-dark/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center pt-20"
          >
            <div className="flex flex-col items-center gap-8">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-4xl font-bold uppercase tracking-[0.2em] text-silver-metallic hover:text-white transition-colors"
              >
                HOME
              </Link>
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                >
                  <Link
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display text-4xl font-bold uppercase tracking-[0.2em] text-silver-metallic hover:text-white transition-colors hover:text-glow-silver"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-8 flex flex-col items-center gap-4 w-full px-8 max-w-sm"
              >
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-8 py-4 geometric-clip border border-white/20 text-white font-mono font-bold uppercase tracking-[0.2em] text-xs transition-all hover:border-electric-blue"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}
                    className="w-full text-center px-8 py-4 geometric-clip border border-white/20 text-white font-mono font-bold uppercase tracking-[0.2em] text-xs transition-all hover:border-electric-blue"
                  >
                    Sign In
                  </button>
                )}

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-8 py-4 geometric-clip-button bg-electric-blue text-white font-mono font-bold uppercase tracking-[0.2em] text-xs transition-all"
                >
                  Start Project
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </motion.header>
  );
}
