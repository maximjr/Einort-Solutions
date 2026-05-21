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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Process', href: '/process' },
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'py-3 bg-dark/60 backdrop-blur-xl border-b border-white/5' : 'py-6 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group z-50">
          <div className="w-9 h-9 flex items-center justify-center">
            <img 
              src="https://i.imgur.com/6V1ecDU.png" 
              alt="EINORT Logo" 
              className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-300" 
            />
          </div>
          <span className="font-display font-medium text-base tracking-[0.1em] text-white">
            EINORT
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 z-50">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "text-[13px] font-sans font-medium transition-colors relative group",
                location.pathname === link.href ? "text-white" : "text-white/60 hover:text-white"
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300",
                location.pathname === link.href ? "w-full opacity-100" : "w-full scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100 origin-left"
              )} />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6 z-50">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-9 h-9 rounded-full border border-white/10 overflow-hidden hover:border-white/30 transition-all bg-white/5 flex items-center justify-center shadow-sm"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-white/80" />
                )}
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-56 bg-dark/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 flex flex-col z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="font-sans font-medium text-[13px] truncate text-white">{user.displayName}</p>
                      <p className="font-sans text-[11px] text-white/50 truncate mt-0.5">{user.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="px-4 py-2 font-sans text-[13px] hover:bg-white/5 transition-colors text-left text-white/80 hover:text-white">
                      Dashboard
                    </Link>
                    <button onClick={() => { signOut(); setProfileDropdownOpen(false); }} className="px-4 py-2 font-sans text-[13px] hover:bg-red-500/10 text-red-400 transition-colors text-left flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-[13px] font-sans font-medium text-white/60 hover:text-white transition-colors"
            >
              Sign In
            </button>
          )}

          <Link
            to="/contact"
            className="px-5 py-2 bg-white text-dark rounded-full text-[13px] font-sans font-semibold hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            Start Project
          </Link>
        </div>

        <button
          className="md:hidden relative z-50 text-white p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-dark/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-6 w-full max-w-sm px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={link.name}
                  className="w-full text-center"
                >
                  <Link
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-2xl font-display font-medium text-white/60 hover:text-white transition-colors py-2"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="mt-6 flex flex-col gap-3 w-full"
              >
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-6 py-3 border border-white/10 rounded-full text-white font-sans text-sm font-medium transition-colors hover:bg-white/5"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}
                    className="w-full text-center px-6 py-3 border border-white/10 rounded-full text-white font-sans text-sm font-medium transition-colors hover:bg-white/5"
                  >
                    Sign In
                  </button>
                )}

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-6 py-3 bg-white text-dark rounded-full font-sans text-sm font-semibold transition-colors hover:bg-white/90"
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
