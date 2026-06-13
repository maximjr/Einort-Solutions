import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  ChevronRight,
  LayoutDashboard,
  MessageSquare,
  FolderGit2,
  LifeBuoy,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container } from "./Container";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { Logo } from "../ui/Logo";

const navLinks = [
  { name: "Services",      href: "/#services" },
  { name: "Architecture",  href: "/#architecture" },
  { name: "Why Us",        href: "/#why-us" },
  { name: "Testimonials",  href: "/#testimonials" },
];

export function Navbar() {
  const [isScrolled,      setIsScrolled]      = useState(false);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const scrollYRef                             = useRef(0);

  const location   = useLocation();
  const navigate   = useNavigate();
  const { user, userData } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  // ─── Scroll detection ─────────────────────────────────────────────────────

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Hash scroll on route change ──────────────────────────────────────────

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.getElementById(location.hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // ─── iOS-safe scroll lock ─────────────────────────────────────────────────
  // `overflow: hidden` alone doesn't prevent rubber-band scroll on iOS Safari.
  // The position:fixed approach freezes the page at its current scroll position
  // and restores it precisely when the drawer closes.

  useEffect(() => {
    if (mobileMenuOpen) {
      scrollYRef.current = window.scrollY;
      Object.assign(document.body.style, {
        position:  "fixed",
        top:       `-${scrollYRef.current}px`,
        width:     "100%",
        overflowY: "scroll", // keep scrollbar width so layout doesn't jump
      });
    } else {
      Object.assign(document.body.style, {
        position:  "",
        top:       "",
        width:     "",
        overflowY: "",
      });
      window.scrollTo(0, scrollYRef.current);
    }

    return () => {
      Object.assign(document.body.style, {
        position:  "",
        top:       "",
        width:     "",
        overflowY: "",
      });
    };
  }, [mobileMenuOpen]);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const prefetchRoute = (path: string) => {
    if (path.includes("admin"))           import("../../features/admin/AdminDashboard").catch(() => {});
    else if (path.includes("client-portal")) import("../../features/client-portal/ClientPortal").catch(() => {});
    else if (path.includes("services"))   import("../../features/services/ServicesPage").catch(() => {});
    else if (path.includes("industries")) import("../../features/seo/IndustryPage").catch(() => {});
    else if (path.includes("locations"))  import("../../features/seo/LocationPage").catch(() => {});
  };

  const handleSignOut = async () => {
    try {
      const { auth }     = await import("../../lib/firebase");
      const { signOut }  = await import("firebase/auth");
      if (auth) await signOut(auth);
    } catch (e) {
      console.warn("Failed to sign out", e);
    }
  };

  const isAdminUser = Boolean(
    userData?.role === "admin" || userData?.role === "super_admin" || userData?.isAdmin,
  );
  const dashboardPath = isAdminUser ? "/admin" : "/client-portal";

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/70 backdrop-blur-md border-b border-white/5 py-4 shadow-2xl"
            : "bg-transparent py-6"
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
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

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-[13px] font-medium tracking-[0.1em] uppercase text-text-muted hover:text-white transition-colors relative group"
                >
                  {link.name}
                  <div className="absolute -bottom-2 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    onMouseEnter={() => prefetchRoute(dashboardPath)}
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
                    onClick={() => openAuthModal("login")}
                    className="text-[13px] font-bold tracking-[0.1em] uppercase text-text-muted hover:text-white transition-colors flex items-center gap-2 focus:outline-none"
                  >
                    <LogIn size={16} className="text-primary" /> Login
                  </button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="font-bold text-[11px] tracking-[0.15em] uppercase px-6"
                    onClick={() => openAuthModal("register")}
                  >
                    Start Project
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu toggle — 48px touch target (WCAG 2.5.5) */}
            <button
              className="md:hidden text-text-muted hover:text-white focus:outline-none flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/5 transition-colors relative z-[60]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Menu
                  size={24}
                  className={`absolute transition-all duration-300 ${mobileMenuOpen ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`}
                />
                <X
                  size={24}
                  className={`absolute transition-all duration-300 ${mobileMenuOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"}`}
                />
              </div>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Nav Drawer */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-50 bg-black/60 md:hidden transition-opacity duration-300 ease-out ${
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
          style={{ willChange: "opacity" }}
        />

        {/* Sheet */}
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`fixed inset-x-0 bottom-0 z-[55] h-[92dvh] bg-[#0b0f19] border-t border-white/10 rounded-t-[2.5rem] md:hidden flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            mobileMenuOpen
              ? "shadow-[0_-20px_80px_rgba(0,0,0,0.6)] pointer-events-auto"
              : "shadow-none pointer-events-none"
          }`}
          style={{
            willChange: "transform",
            transform:  mobileMenuOpen ? "translate3d(0, 0, 0)" : "translate3d(0, 130%, 0)",
          }}
          aria-hidden={!mobileMenuOpen}
        >
          {/* Ambient glow */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-primary/5 to-transparent pointer-events-none rounded-t-[2.5rem]" />

          {/* Drag indicator */}
          <div className="w-full flex justify-center py-4 shrink-0">
            <div className="w-12 h-1.5 bg-white/[0.15] rounded-full" />
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto px-6 pb-[max(3rem,env(safe-area-inset-bottom,3rem))] pt-2 scrollbar-none overscroll-contain z-10 relative">
            {user ? (
              <>
                {/* Profile card */}
                <div className="flex items-center gap-4 mb-8 bg-white/[0.03] border border-white/10 rounded-3xl p-4 shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl shadow-inner relative">
                    {userData?.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0b0f19]" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-white font-display font-medium text-lg truncate">
                      {userData?.fullName || "Authenticated User"}
                    </span>
                    <span className="text-primary font-mono text-[10px] uppercase tracking-widest mt-0.5 truncate">
                      {userData?.role === "super_admin"
                        ? "Super Admin"
                        : userData?.role === "admin"
                          ? "Administrator"
                          : "Enterprise Client"}
                    </span>
                  </div>
                </div>

                {/* Command Center */}
                <div className="mb-8 space-y-2">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2 mb-3">
                    Command Center
                  </p>

                  <button
                    onMouseEnter={() => prefetchRoute(dashboardPath)}
                    onClick={() => handleNavClick(dashboardPath)}
                    className="w-full flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-2xl transition-colors active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <LayoutDashboard size={18} strokeWidth={2.5} />
                      </div>
                      <span className="font-medium text-white text-base tracking-wide">
                        Dashboard
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-slate-500" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNavClick(`${dashboardPath}#projects`)}
                      className="flex flex-col items-start p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-2xl transition-colors active:scale-[0.98] gap-3"
                    >
                      <FolderGit2 size={18} className="text-emerald-400" />
                      <span className="font-medium text-white text-sm tracking-wide">Projects</span>
                    </button>

                    <button
                      onClick={() => handleNavClick(`${dashboardPath}#messages`)}
                      className="flex flex-col items-start p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-2xl transition-colors active:scale-[0.98] gap-3 relative"
                    >
                      <MessageSquare size={18} className="text-cyan-400" />
                      <span className="font-medium text-white text-sm tracking-wide">Messages</span>
                      <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-8 mt-2">
                <h2 className="text-3xl font-display font-medium text-white mb-2 tracking-tight">
                  Welcome to Einort
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 block">
                  Sign in or start a new enterprise project architecture.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    className="flex-1 h-14 rounded-2xl font-bold tracking-wider text-xs shadow-[0_4px_20px_rgba(10,102,194,0.3)] uppercase"
                    onClick={() => { openAuthModal("register"); setMobileMenuOpen(false); }}
                  >
                    Start Project
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl font-bold tracking-wider text-xs border-white/10 text-white hover:bg-white/5 uppercase"
                    onClick={() => { openAuthModal("login"); setMobileMenuOpen(false); }}
                  >
                    Login
                  </Button>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="mb-8 space-y-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2 mb-3">
                Navigation
              </p>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden p-2">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/[0.04] transition-colors active:scale-[0.98]"
                  >
                    <span className="font-medium text-white text-[15px] tracking-wide">
                      {link.name}
                    </span>
                    <ChevronRight size={16} className="text-slate-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer utilities */}
            <div className="mt-auto space-y-3 pt-6 pb-6 border-t border-white/[0.05]">
              <button
                onClick={() => handleNavClick("/support")}
                className="w-full flex items-center justify-between px-4 py-3 font-medium bg-white/[0.02] hover:bg-white/[0.05] rounded-2xl transition-colors border border-white/5 active:scale-[0.98]"
              >
                <span className="text-sm text-slate-300 flex items-center gap-3">
                  <LifeBuoy size={16} className="text-slate-400" /> Professional Support
                </span>
                <ChevronRight size={16} className="text-slate-600" />
              </button>

              {user && (
                <button
                  onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                  className="w-full flex justify-center items-center gap-2 h-14 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold tracking-widest text-[11px] uppercase rounded-2xl transition-colors border border-red-500/10 active:scale-[0.98]"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    </>
  );
}
