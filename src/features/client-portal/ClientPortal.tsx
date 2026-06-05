import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  CheckCircle,
  Box,
  ArrowRight,
  ShieldCheck,
  Mail,
  Calendar,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { FadeUp } from "../../components/animations/FadeUp";
import { Button } from "../../components/ui/Button";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { useAuth } from "../../hooks/useAuth";
import { projectService } from "../../services/admin/projectService";
import { messageService } from "../../services/admin/messageService";
import { ClientMessenger } from "./ClientMessenger";
import { useMessaging } from "../../hooks/useMessaging";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

const getDetailedStatusPill = (status: string) => {
  const currentStatus = (status || "pending").toLowerCase();
  
  if (currentStatus === "cancelled") {
    return {
      label: "Cancelled",
      bgClass: "bg-red-500/10 text-red-400 border-red-500/20",
      dotClass: "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]",
    };
  }
  
  const pendingStages = ["pending", "new", "discovery"];
  const completedStages = ["completed", "launched", "deployment"];
  
  if (pendingStages.includes(currentStatus)) {
    return {
      label: "Pending Review",
      bgClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      dotClass: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse",
    };
  }
  
  if (completedStages.includes(currentStatus)) {
    return {
      label: "Completed",
      bgClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dotClass: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    };
  }
  
  return {
    label: "In Progress",
    bgClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse",
  };
};

export function ClientPortal() {
  const { userData, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMessenger, setShowMessenger] = useState(false);
  const [unreadAlertCount, setUnreadAlertCount] = useState(0);
  const [superAdminId, setSuperAdminId] = useState<string>("super_admin");

  const { conversations } = useMessaging();

  useEffect(() => {
    async function resolveAdmin() {
      try {
        const adminId = await messageService.getSuperAdminUid();
        setSuperAdminId(adminId);
      } catch (err) {
        console.warn("Could not dynamically resolve super admin:", err);
      }
    }
    resolveAdmin();
  }, []);

  useEffect(() => {
    if (!user) return;
    const conversationId = `${user.uid}_${superAdminId}`;
    const found = conversations.find((c) => c.id === conversationId);
    if (found?.unreadCount) {
      setUnreadAlertCount(found.unreadCount[user.uid] || 0);
    } else {
      setUnreadAlertCount(0);
    }
  }, [user, conversations, superAdminId]);

  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    const activeDb = db;
    let projectsByUid: any[] = [];
    let projectsByEmail: any[] = [];
    let hasError = false;

    const handleMerge = (byUid: any[], byEmail: any[]) => {
      if (hasError) return;

      const map = new Map();
      byUid.forEach((p) => map.set(p.id, p));
      byEmail.forEach((p) => map.set(p.id, p));

      const merged = Array.from(map.values());

      // Sort by createdAt descending
      merged.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 
                     (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 
                     (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });

      setProjects(merged);
      setLoading(false);
    };

    const qUid = query(
      collection(activeDb, "projects"),
      where("userId", "==", user.uid)
    );

    const unsubscribeUid = onSnapshot(
      qUid,
      (snapshot) => {
        projectsByUid = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        handleMerge(projectsByUid, projectsByEmail);
      },
      (error: any) => {
        if (error.code === "permission-denied") {
          console.warn("UID projects restricted");
        } else {
          console.error("Error fetching projects by UID:", error);
        }
      }
    );

    let unsubscribeEmail = () => {};
    if (user.email) {
      const qEmail = query(
        collection(activeDb, "projects"),
        where("email", "==", user.email)
      );

      unsubscribeEmail = onSnapshot(
        qEmail,
        (snapshot) => {
          projectsByEmail = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          handleMerge(projectsByUid, projectsByEmail);
        },
        (error: any) => {
          if (error.code === "permission-denied" && projectsByUid.length === 0) {
            console.warn("Email projects restricted, falling back gracefully.");
          } else if (error.code !== "permission-denied") {
            console.error("Error fetching projects by Email:", error);
          }
        }
      );
    }

    return () => {
      unsubscribeUid();
      unsubscribeEmail();
    };
  }, [user?.uid, user?.email]);

  const stages = [
    { key: "pending", label: "Submission" },
    { key: "discovery", label: "Discovery" },
    { key: "planning", label: "Planning" },
    { key: "ui_ux", label: "UI / UX Design" },
    { key: "development", label: "Engineering" },
    { key: "testing", label: "QA & Inspection" },
    { key: "review", label: "Governance Review" },
    { key: "revision", label: "Revision Loop" },
    { key: "deployment", label: "Staging & Release" },
    { key: "completed", label: "Launched" },
  ];

  const getStageIndex = (status: string) => {
    if (!status) return 0;
    const s = status.toLowerCase();

    // Map any legacy or near-matching status strings
    let target = s;
    if (s === "new") target = "pending";
    if (s === "analysis") target = "planning";
    if (s === "design") target = "ui_ux";

    const index = stages.findIndex(
      (st) =>
        st.key === target ||
        target.includes(st.key) ||
        st.key.includes(target)
    );
    return index === -1 ? 0 : index;
  };

  return (
    <section className="py-24 bg-[#030712] min-h-screen relative pt-32 overflow-hidden">
      {/* Premium Background Ambience */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[600px] bg-primary/5 blur-[150px] pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2"></div>

      <Container className="relative z-10">
        <Breadcrumbs
          items={[
            { label: "Global Workspace", href: "/" },
            { label: "Client Workspace" },
          ]}
        />

        <FadeUp>
          <div className="mb-14 flex items-end justify-between border-b border-white/[0.05] pb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight mb-2">
                Executive Workspace
              </h1>
              <p className="text-slate-400 font-light text-lg">
                Welcome back,{" "}
                <span className="text-white font-medium">
                  {userData?.fullName || "Valued Partner"}
                </span>
                .
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[11px] uppercase tracking-widest font-bold text-slate-500 bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-full">
              <ShieldCheck size={14} className="text-primary" /> SECURE TUNNEL
              ACTIVE
            </div>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <FadeUp delay={0.1}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Active Engagements
                </h2>
                {projects.length > 0 && !projects[0].isError && (
                  <Link to="/#contact">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                      Request New Build <ArrowRight size={12} />
                    </span>
                  </Link>
                )}
              </div>
            </FadeUp>

            {loading ? (
              <div className="w-full animate-pulse space-y-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-white/[0.02] border border-white/[0.05] rounded-3xl w-full"
                  ></div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <FadeUp delay={0.2}>
                <Card className="bg-white/[0.015] border-white/[0.05] shadow-none rounded-3xl p-16 text-center flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.05] shadow-inner flex items-center justify-center mb-6 relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    <Box className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display text-white mb-4 relative z-10 tracking-tight">
                    You're ready to build something exceptional.
                  </h3>
                  <p className="text-slate-400 font-light mb-10 max-w-md relative z-10 leading-relaxed">
                    Initiate a private consultation to discuss architecture,
                    timelines, and resourcing for your next enterprise
                    application.
                  </p>
                  <Link to="/#contact" className="relative z-10">
                    <Button
                      variant="primary"
                      className="uppercase tracking-widest text-[11px] font-bold h-12 px-8 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
                    >
                      Initiate Discovery
                    </Button>
                  </Link>
                </Card>
              </FadeUp>
            ) : (
              <div className="space-y-6">
                {projects.map((proj, i) => {
                  const currentStageIndex = getStageIndex(proj.status);
                  const detailedPill = getDetailedStatusPill(proj.status);

                  return (
                    <FadeUp key={proj.id} delay={0.1 + i * 0.1}>
                      <Card
                        className={`bg-white/[0.015] border-white/[0.05] shadow-none rounded-3xl overflow-hidden transition-all duration-500 relative group ${proj.isError ? "border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]" : "hover:border-white/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.03)]"}`}
                      >
                        {/* Premium Top Highlight */}
                        <div
                          className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${proj.isError ? "from-red-500/50 to-transparent" : "from-primary/50 to-transparent"} opacity-50`}
                        ></div>

                        <div className="p-8 md:p-10">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10">
                            <div>
                              <h3
                                className={`text-2xl md:text-3xl font-display tracking-tight transition-colors mb-2 ${proj.isError ? "text-red-400 font-mono" : "text-white"}`}
                              >
                                {proj.company || "Classified Build"}
                              </h3>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                  {proj.projectType || "Enterprise Platform"}
                                </span>
                                <span className="text-[11px] uppercase font-bold tracking-widest text-slate-500">
                                  {proj.industry || "N/A"}
                                </span>
                              </div>
                            </div>

                            {/* Live Status indicator */}
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
                              <div
                                className={`flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-xl border shadow-sm ${proj.isError ? "bg-red-500/10 border-red-500/20 text-red-400" : detailedPill.bgClass}`}
                              >
                                {!proj.isError && (
                                  <span className={`w-1.5 h-1.5 rounded-full ${detailedPill.dotClass} block`}></span>
                                )}
                                {proj.isError ? "Error" : detailedPill.label}
                              </div>
                              {!proj.isError && (
                                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-xl">
                                  Stage: {proj.status || "New"}
                                </span>
                              )}
                            </div>
                          </div>

                          {proj.isError ? (
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-sm text-slate-300">
                              <p className="mb-2 font-medium">
                                Project details unavailable
                              </p>
                              <p className="opacity-70 text-xs">
                                Information for this project is currently initializing or restricted.
                              </p>
                            </div>
                          ) : (
                            <>
                              {/* Linear Progress Tracking */}
                              <div className="mb-10 block">
                                <div className="flex justify-between items-end mb-3">
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                                    Delivery Velocity
                                  </p>
                                  <p className="text-[11px] font-mono text-primary">
                                    {Math.round(
                                      ((currentStageIndex + 1) /
                                        stages.length) *
                                        100,
                                    )}
                                    % CLR
                                  </p>
                                </div>
                                
                                {/* Desktop 10-Node Horizontal Ribbon */}
                                <div className="relative hidden md:block">
                                  {/* Track Line */}
                                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/[0.05] -translate-y-1/2"></div>
                                  {/* Active Track Line */}
                                  <div
                                    className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out"
                                    style={{
                                      width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
                                    }}
                                  ></div>
                                  {/* Nodes */}
                                  <div className="relative flex justify-between">
                                    {stages.map((stage, idx) => {
                                      const isCompleted =
                                        idx < currentStageIndex;
                                      const isCurrent =
                                        idx === currentStageIndex;
                                      return (
                                        <div
                                          key={stage.key}
                                          className="flex flex-col items-center group/node relative"
                                        >
                                          <div
                                            className={`w-3 h-3 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${isCompleted ? "bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" : isCurrent ? "bg-[#030712] border-[3px] border-primary scale-125" : "bg-[#030712] border-2 border-white/20"}`}
                                          >
                                            {isCompleted && (
                                              <CheckCircle className="w-2 h-2 text-white" />
                                            )}
                                          </div>
                                          {/* Tooltip purely CSS based */}
                                          <div className="absolute -top-10 bg-white text-black text-[9px] uppercase tracking-widest font-bold py-1 px-3 rounded shadow-xl opacity-0 group-hover/node:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                                            {stage.label}
                                          </div>
                                          <span
                                            className={`text-[9px] uppercase tracking-widest font-bold mt-4 absolute top-2 transition-colors ${isCurrent ? "text-white" : "text-slate-600"}`}
                                          >
                                            {isCurrent ? stage.label : ""}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Mobile High-Contrast Milestone Stepper Grid */}
                                <div className="md:hidden space-y-4">
                                  <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                                    <div>
                                      <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500">
                                        Active Engagement milestone
                                      </p>
                                      <p className="text-sm font-semibold text-white mt-1">
                                        {stages[currentStageIndex]?.label || "N/A"}
                                      </p>
                                    </div>
                                    <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-mono text-primary font-bold">
                                      {Math.round(((currentStageIndex + 1) / stages.length) * 100)}% Complete
                                    </span>
                                  </div>
                                  <div className="text-xs text-slate-400 flex justify-between items-center px-1">
                                    <span>Next Step: {stages[currentStageIndex + 1] ? stages[currentStageIndex + 1].label : "None (In Release Mode)"}</span>
                                    <span className="font-mono text-slate-500">{currentStageIndex + 1} / {stages.length}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Project Metadata Grid */}
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/5">
                                <div>
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
                                    Estimated Budget
                                  </p>
                                  <p className="text-sm text-white font-mono object-contain">
                                    {proj.budget || "TBD"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
                                    Delivery Scope
                                  </p>
                                  <p className="text-sm text-white font-mono">
                                    {proj.timeline || "TBD"}
                                  </p>
                                </div>
                                <div className="lg:col-span-2">
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
                                    Commencement Date
                                  </p>
                                  <p className="text-sm text-slate-400 font-mono">
                                    {proj.createdAt
                                      ? proj.createdAt
                                          .toDate()
                                          .toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })
                                      : "Just now"}
                                  </p>
                                </div>
                              </div>

                              {/* Client Action Panel */}
                              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/5">
                                {deletingId === proj.id ? (
                                  <div className="flex items-center gap-3 bg-red-950/20 border border-red-500/20 px-4 py-2 rounded-2xl animate-pulse">
                                    <span className="text-xs text-red-300 font-mono">Decommission this build?</span>
                                    <button
                                      onClick={async () => {
                                        setIsDeleting(true);
                                        try {
                                          await projectService.deleteProject(proj.id);
                                        } catch (e) {
                                          console.error(e);
                                        } finally {
                                          setIsDeleting(false);
                                          setDeletingId(null);
                                        }
                                      }}
                                      disabled={isDeleting}
                                      className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                                    >
                                      {isDeleting ? "Decommissioning..." : "Confirm"}
                                    </button>
                                    <button
                                      onClick={() => setDeletingId(null)}
                                      disabled={isDeleting}
                                      className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeletingId(proj.id)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.02] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-slate-400 hover:text-red-400 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                    Delete Request
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </Card>
                    </FadeUp>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <FadeUp delay={0.3}>
              <Card className="bg-white/[0.015] border-white/[0.05] shadow-none rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors duration-700"></div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center border-b border-white/[0.05] pb-4">
                  <Activity size={14} className="text-primary mr-2" /> Live
                  Intelligence
                </h3>

                {projects.length > 0 && !projects[0].isError ? (
                  <div className="space-y-6 relative z-10 pl-2">
                    <div className="relative">
                      <div className="absolute left-[-16px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] pulse-glow"></div>
                      <div className="absolute left-[-13px] top-3 bottom-[-24px] w-[1px] bg-white/[0.05]"></div>
                      <p className="text-sm text-white font-medium mb-1 tracking-wide">
                        Project Synchronized
                      </p>
                      <p className="text-[11px] font-mono text-emerald-400">
                        System Nominal • Live
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute left-[-16px] top-1.5 w-1.5 h-1.5 rounded-full bg-white/20"></div>
                      <div className="absolute left-[-13px] top-3 bottom-[-24px] w-[1px] bg-white/[0.05]"></div>
                      <p className="text-sm text-slate-300 font-medium mb-1 tracking-wide">
                        Engineering Review
                      </p>
                      <p className="text-[11px] font-mono text-slate-500">
                        Pending Assignment
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute left-[-16px] top-1.5 w-1.5 h-1.5 rounded-full bg-white/20"></div>
                      <p className="text-sm text-slate-400 font-medium mb-1 tracking-wide">
                        Executive Discovery Call
                      </p>
                      <p className="text-[11px] font-mono text-slate-600">
                        Locked
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-slate-500 text-sm font-light leading-relaxed">
                      Intelligence stream offline until a project is initiated.
                    </p>
                  </div>
                )}
              </Card>
            </FadeUp>

            <FadeUp delay={0.4}>
              <AnimatePresence mode="wait">
                {showMessenger ? (
                  <motion.div
                    key="messenger"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full"
                  >
                    <ClientMessenger
                      userId={user?.uid || ""}
                      userEmail={user?.email || ""}
                      userName={userData?.fullName || "Valued Partner"}
                      onClose={() => setShowMessenger(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="support-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card className="bg-white/[0.015] border-white/[0.05] shadow-none rounded-3xl p-8 hover:border-white/10 transition-colors group relative overflow-hidden">
                      {unreadAlertCount > 0 && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]"></span>
                          <span className="text-[9px] font-bold text-cyan-400 font-mono">
                            {unreadAlertCount} REPLY WAIT
                          </span>
                        </div>
                      )}
                      
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-8 border-b border-white/[0.05] pb-4">
                        Dedicated Support
                      </h3>
                      <div className="space-y-6">
                        {/* Live support button */}
                        <div className="pb-4 border-b border-white/5">
                          <button
                            onClick={() => setShowMessenger(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover border border-primary/20 text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-300 cursor-pointer"
                          >
                            <MessageSquare size={13} className="animate-pulse" />
                            Open Live Pipeline
                          </button>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-white font-medium tracking-wide mb-1">
                              Priority Channel
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed font-light mb-3">
                              Direct access to your assigned engineering lead.
                            </p>
                            <a
                              href="mailto:einortsolutions237@gmail.com"
                              className="text-[10px] uppercase font-bold tracking-widest text-primary hover:text-white transition-colors flex items-center gap-1"
                            >
                              Contact Architect <ArrowRight size={10} />
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm text-white font-medium tracking-wide mb-1">
                              Agile Syncs
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed font-light">
                              Scheduled alignment meetings will populate here
                              post-kickoff.
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </FadeUp>
          </div>
        </div>
      </Container>
    </section>
  );
}
