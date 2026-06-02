import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { SEO } from "../../components/SEO";
import {
  LayoutDashboard,
  Users,
  Folders,
  BarChart3,
  Settings,
  LogOut,
  ShieldAlert,
  Activity,
  Command,
  Hexagon,
  Terminal,
  Radar,
} from "lucide-react";
import { useEffect, useState } from "react";

const sidebarLinks = [
  { name: "Command Center", path: "/admin", icon: Radar },
  { name: "CRM & Pipeline", path: "/admin/crm", icon: Activity },
  { name: "Client Observability", path: "/admin/users", icon: Users },
  { name: "Project Orders", path: "/admin/projects", icon: Folders },
  { name: "Business Analytics", path: "/admin/analytics", icon: BarChart3 },
];

export function AdminLayout() {
  const { user, loading, isAdmin, userRole, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [timeStr, setTimeStr] = useState<string>("");
  const [forceLoad, setForceLoad] = useState(false);

  useEffect(() => {
    // If auth state is hanging for more than 4s, force the layout to resolve
    const timer = setTimeout(() => {
      if (loading) {
        setForceLoad(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const updateTime = () =>
      setTimeStr(new Date().toISOString().substring(11, 19) + " UTC");
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    if (!loading || forceLoad) {
      if (!user) {
        navigate("/dashboard");
      } else if (!userRole || !["super_admin", "admin", "manager", "developer", "designer"].includes(userRole)) {
        console.warn(`[AdminLayout Security] Access denied for role: "${userRole}". Redirecting to Home page.`);
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, userRole, navigate, forceLoad]);

  if ((loading && !forceLoad) || !user) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 flex items-center justify-center relative">
          <div className="w-full h-full border-2 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin" />
          <Command className="w-3 h-3 text-premium-gold absolute animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white flex-col gap-4">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-display uppercase tracking-widest text-silver-metallic">
          Access Denied
        </h1>
        <p className="font-mono text-xs text-white/50">
          Admin clearance level required for Nexus Interface.
        </p>
        <button
          onClick={() => navigate("/")}
          className="geometric-clip-button px-6 py-3 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase transition-colors"
        >
          Return to Surface
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex overflow-hidden font-sans selection:bg-premium-gold selection:text-white relative">
      <SEO title="EINORT || NEXUS COMMAND CENTER" />

      {/* Ambient background for the entire admin */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[600px] h-[400px] bg-premium-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-[260px] border-r border-white/5 bg-[#020617]/95 flex flex-col z-20 relative shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-premium-gold/20 to-transparent" />

        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <Hexagon
                className="w-8 h-8 text-premium-gold/30 absolute"
                strokeWidth={1}
              />
              <Command className="w-4 h-4 text-premium-gold relative z-10" />
            </div>
            <div>
              <h2 className="font-display font-medium text-sm tracking-[0.2em] uppercase leading-none text-white">
                NEXUS
              </h2>
              <span className="font-mono text-[8px] text-premium-gold tracking-widest uppercase opacity-80 mt-0.5 block">
                Operating System
              </span>
            </div>
          </div>
        </div>

        {/* Global Stats Micro */}
        <div className="px-6 py-4 border-b border-white/5 flex gap-4 bg-white/[0.01]">
          <div className="flex-1">
            <p className="font-mono text-[8px] uppercase tracking-widest text-white/40 mb-1">
              Network
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              <span className="font-mono text-[10px] text-white">ONLINE</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex-1">
            <p className="font-mono text-[8px] uppercase tracking-widest text-white/40 mb-1">
              Latency
            </p>
            <span className="font-mono text-[10px] text-white flex items-center gap-1">
              12<span className="text-white/40">ms</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
          <div className="mb-3 px-2 flex justify-between items-center">
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em]">
              Core Subsystems
            </span>
          </div>
          {sidebarLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path === "/admin" && location.pathname === "/admin/");
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-[10px] font-mono tracking-widest uppercase transition-all duration-300 relative group overflow-hidden ${
                  isActive
                    ? "text-white border border-premium-gold/30 bg-premium-gold/10"
                    : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-premium-gold shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/0 via-premium-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Icon
                  className={`w-4 h-4 shrink-0 relative z-10 ${isActive ? "text-premium-gold drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]" : "text-white/30 group-hover:text-white/70"}`}
                />
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile / Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="glass-panel border-white/5 p-3 flex items-center justify-between group hover:border-premium-gold/30 transition-colors bg-white/[0.01]">
            <div className="flex items-center gap-3 overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  className="w-8 h-8 rounded border border-white/20"
                  alt="Admin"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center border border-white/5">
                  <Terminal className="w-4 h-4 text-white/50" />
                </div>
              )}
              <div className="flex flex-col truncate">
                <span className="font-mono text-[10px] text-white truncate tracking-wider">
                  {user.displayName || "Root Admin"}
                </span>
                <span className="font-mono text-[8px] text-premium-gold truncate tracking-widest uppercase mt-0.5">
                  {userRole || "Superuser"}
                </span>
              </div>
            </div>
            <button
              onClick={signOut}
              className="p-2 text-white/30 hover:text-red-400 transition-colors shrink-0 tooltip-trigger"
              title="Terminate Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-transparent">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-[#020617]/50 backdrop-blur-md flex items-center justify-between px-8 z-20 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                ENV:
              </span>
              <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded font-mono text-[9px] uppercase tracking-widest">
                Production
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-6">
              <Terminal className="w-4 h-4 text-white/30" />
              <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
                {timeStr}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group text-white/50 hover:text-white transition-colors"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] border-b border-transparent group-hover:border-white/50 pb-0.5">
                Deploy to Root
              </span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar relative p-6 md:p-10">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
