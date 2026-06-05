import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, User, ChevronRight, LayoutDashboard, MessageSquare, FolderGit2, LifeBuoy } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container } from "./Container";
import { Button } from "../ui/Button";
import { AuthModal } from "../../features/auth/AuthModal";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../hooks/useAuth";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { Logo } from "../ui/Logo";

const navLinks = [
  { name: "Services", href: "/#services" },
  { name: "Architecture", href: "/#architecture" },
  { name: "Why Us", href: "/#why-us" },
  { name: "Testimonials", href: "/#testimonials" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userData } = useAuth();

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash scrolling when coming from another page
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleOpenAuth = (e: any) => {
      openAuth(e.detail?.mode || "login");
    };
    window.addEventListener("open-auth", handleOpenAuth);
    return () => window.removeEventListener("open-auth", handleOpenAuth);
  }, []);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl"
            : "bg-transparent py-6"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-3 group">
                <Logo className="w-10 h-10 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-500" />
                <div className="flex flex-col">
                  <span className="text-xl font-display font-bold uppercase tracking-widest text-white leading-none">
                    Einort
                  </span>
                  <span className="text-[9px] font-display font-bold uppercase tracking-[0.3em] text-primary mt-1">
                    Solutions
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-[13px] font-medium tracking-[0.1em] uppercase text-text-muted hover:text-white transition-colors relative group"
                >
                  {link.name}
                  <div className="absolute -bottom-2 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <>
                  <Link
                    to={
                      userData?.role === "admin" ||
                      userData?.role === "super_admin" ||
                      userData?.isAdmin
                        ? "/admin"
                        : "/client-portal"
                    }
                    className="text-[13px] font-bold tracking-[0.1em] uppercase text-text-muted hover:text-white transition-colors flex items-center gap-2 focus:outline-none"
                  >
                    <User size={16} className="text-primary" /> Dashboard
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold text-[11px] tracking-[0.15em] uppercase px-4 border-white/10 hover:bg-white/5"
                    onClick={handleSignOut}
                  >
                    <LogOut size={14} className="mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openAuth("login")}
                    className="text-[13px] font-bold tracking-[0.1em] uppercase text-text-muted hover:text-white transition-colors flex items-center gap-2 focus:outline-none"
                  >
                    <LogIn size={16} className="text-primary" /> Login
                  </button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="font-bold text-[11px] tracking-[0.15em] uppercase px-6"
                    onClick={() => openAuth("register")}
                  >
                    Start Project
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Nav Toggle */}
            <button
              className="md:hidden text-text-muted hover:text-white focus:outline-none flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors relative z-[60]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </Container>

        {/* Premium Mobile Nav Drawer (iOS-style Bottom Sheet) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay / Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer Sheet */}
              <motion.div
                initial={{ y: "100%", opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0.5 }}
                transition={{ type: "spring", damping: 28, stiffness: 240 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, { offset, velocity }) => {
                  if (offset.y > 150 || velocity.y > 400) {
                    setMobileMenuOpen(false);
                  }
                }}
                className="fixed inset-x-0 bottom-0 z-[55] h-[92vh] bg-[#0b0f19]/90 backdrop-blur-3xl border-t border-white/10 rounded-t-[2.5rem] md:hidden flex flex-col shadow-[0_-20px_80px_rgba(0,0,0,0.6)]"
              >
                {/* Premium Ambience Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[300px] h-32 bg-primary/20 blur-[80px] pointer-events-none rounded-full" />
                
                {/* Drag Indicator */}
                <div className="w-full flex justify-center py-4 shrink-0 cursor-grab active:cursor-grabbing">
                  <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto px-6 pb-[max(3rem,env(safe-area-inset-bottom,3rem))] pt-2 scrollbar-none overscroll-contain z-10 relative">
                  {user ? (
                    <>
                      {/* TOP: Profile Section */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="flex items-center gap-4 mb-8 bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-lg"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl shadow-inner relative">
                          {userData?.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0b0f19]"></div>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-white font-display font-medium text-lg truncate">
                            {userData?.fullName || "Authenticated User"}
                          </span>
                          <span className="text-primary font-mono text-[10px] uppercase tracking-widest mt-0.5 truncate">
                            {userData?.role === "super_admin" ? "Super Admin" : userData?.role === "admin" ? "Administrator" : "Enterprise Client"}
                          </span>
                        </div>
                      </motion.div>

                      {/* MIDDLE: High Priority Actions */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="mb-8 space-y-2"
                      >
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2 mb-3">Command Center</p>
                        
                        <button
                          onClick={() => handleNavClick(userData?.role === "admin" || userData?.role === "super_admin" ? "/admin" : "/client-portal")}
                          className="w-full flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-2xl transition-all active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <LayoutDashboard size={18} strokeWidth={2.5} />
                            </div>
                            <span className="font-medium text-white text-base tracking-wide">Dashboard</span>
                          </div>
                          <ChevronRight size={18} className="text-slate-500" />
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleNavClick(userData?.role === "admin" || userData?.role === "super_admin" ? "/admin#projects" : "/client-portal#projects")}
                            className="flex flex-col items-start p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-2xl transition-all active:scale-[0.98] gap-3"
                          >
                            <FolderGit2 size={18} className="text-emerald-400" />
                            <span className="font-medium text-white text-sm tracking-wide">Projects</span>
                          </button>
                          
                          <button
                            onClick={() => handleNavClick(userData?.role === "admin" || userData?.role === "super_admin" ? "/admin#messages" : "/client-portal#messages")}
                            className="flex flex-col items-start p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-2xl transition-all active:scale-[0.98] gap-3 relative"
                          >
                            <MessageSquare size={18} className="text-cyan-400" />
                            <span className="font-medium text-white text-sm tracking-wide">Messages</span>
                            {/* Example badge */}
                            <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    // Logged out Top section
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className="mb-8 mt-2"
                    >
                      <h2 className="text-3xl font-display font-medium text-white mb-2 tracking-tight">Welcome to Einort</h2>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 block">Sign in or start a new enterprise project architecture.</p>
                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          className="flex-1 h-14 rounded-2xl font-bold tracking-wider text-xs shadow-[0_0_20px_rgba(10,102,194,0.3)] uppercase"
                          onClick={() => openAuth("register")}
                        >
                          Start Project
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 h-14 rounded-2xl font-bold tracking-wider text-xs border-white/10 text-white hover:bg-white/5 uppercase"
                          onClick={() => openAuth("login")}
                        >
                          Login
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* SECONDARY: Navigation Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="mb-8 space-y-1"
                  >
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2 mb-3">Navigation</p>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden p-2">
                      {navLinks.map((link) => (
                        <button
                          key={link.name}
                          onClick={() => handleNavClick(link.href)}
                          className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/[0.04] transition-colors active:scale-[0.98]"
                        >
                          <span className="font-medium text-white text-[15px] tracking-wide">{link.name}</span>
                          <ChevronRight size={16} className="text-slate-600" />
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* BOTTOM: Utilities */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="mt-auto space-y-3 pt-6 pb-6 border-t border-white/[0.05]"
                  >
                    <button
                      onClick={() => handleNavClick("/support")}
                      className="w-full flex items-center justify-between px-4 py-3 font-medium bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl transition-all border border-white/5 active:scale-[0.98]"
                    >
                      <span className="text-sm text-slate-300 flex items-center gap-3">
                         <LifeBuoy size={16} className="text-slate-400" /> Professional Support
                      </span>
                      <ChevronRight size={16} className="text-slate-600" />
                    </button>

                    {user && (
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex justify-center items-center gap-2 h-14 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold tracking-widest text-[11px] uppercase rounded-2xl transition-colors border border-red-500/10 active:scale-[0.98]"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Auth Modal Portal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
