import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
  const { user, userData } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
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
              className="md:hidden text-text-muted hover:text-white focus:outline-none flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors"
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

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-2xl border-b border-white/5 shadow-2xl md:hidden overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={link.name}
                  >
                    <Link
                      to={link.href}
                      className="text-base font-display font-medium tracking-widest uppercase text-text-muted hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-4 mt-4 pt-6 border-t border-white/5"
                >
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
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex justify-center items-center h-12 w-full border border-white/10 rounded-md font-bold tracking-[0.1em] uppercase text-white hover:bg-white/5 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full uppercase tracking-widest font-bold"
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full uppercase tracking-widest font-bold"
                        onClick={() => openAuth("login")}
                      >
                        Login
                      </Button>
                      <Button
                        variant="primary"
                        className="w-full uppercase tracking-widest font-bold"
                        onClick={() => openAuth("register")}
                      >
                        Start Project
                      </Button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
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
