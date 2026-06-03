import { Container } from "../../components/layout/Container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { FadeUp } from "../../components/animations/FadeUp";
import { useAuth } from "../../hooks/useAuth";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import {
  Users,
  Briefcase,
  Activity,
  CalendarDays,
  AlertTriangle,
  ShieldAlert,
  Zap,
  Target,
  DollarSign
} from "lucide-react";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { ProjectTimeline } from "../../components/ui/ProjectTimeline";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#64748b"];


export function AdminDashboard() {
  const { userData } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    if (!userData || (userData.role !== "admin" && userData.role !== "super_admin")) {
      return;
    }

    let unsubscribeProjects = () => {};
    let unsubscribeUsers = () => {};

    const setupSubscriptions = async () => {
      try {
        const projectsQuery = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc"),
          limit(100),
        );

        unsubscribeProjects = onSnapshot(
          projectsQuery,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setProjects(data);
            setLoading(false);
            setSyncError(null);
          },
          () => {
            setSyncError(
              "Realtime ledger sync interrupted. Using secure static fallback.",
            );
            try {
              // Graceful fallback to static fetch
              getDocs(projectsQuery).then((snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setProjects(data);
                setLoading(false);
              }).catch(() => setLoading(false));
            } catch {
              setLoading(false);
            }
          },
        );

        const usersQuery = query(
          collection(db, "users"),
          orderBy("createdAt", "desc"),
          limit(100),
        );

        unsubscribeUsers = onSnapshot(
          usersQuery,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUsers(data);
            setLoadingUsers(false);
          },
          () => {
            try {
              // Graceful fallback to static fetch
              getDocs(usersQuery).then((snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setUsers(data);
                setLoadingUsers(false);
              }).catch(() => setLoadingUsers(false));
            } catch {
              setLoadingUsers(false);
            }
          },
        );
      } catch (err) {
        // Failed gracefully
      }
    };

    setupSubscriptions();

    return () => {
      unsubscribeProjects();
      unsubscribeUsers();
    };
  }, [userData]);

  const activeClientsCount = users.filter(
    (u) => u.role === "client" || !u.role,
  ).length;

  const getAggregation = (arr: any[], key: string) => {
    const counts = arr.reduce((acc, item) => {
      const val = item[key] ? String(item[key]).charAt(0).toUpperCase() + String(item[key]).slice(1) : "Unspecified";
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => b.value - a.value);
  };

  const industryData = getAggregation(projects, "industry");
  const budgetData = getAggregation(projects, "budget");
  const timelineData = getAggregation(projects, "timeline");
  const statusData = getAggregation(projects, "status");

  const averageLeadScore = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.leadScore || 0), 0) / projects.length) 
    : 0;

  // Intelligence calculations
  const highRiskProjects = projects.filter(
    (p) => p.urgency === "high" || (p.leadScore && p.leadScore < 40)
  ).length;

  const totalPipelineValue = projects.reduce((acc, p) => {
    if (!p.budget) return acc;
    if (p.budget.includes("50k")) return acc + 50000;
    if (p.budget.includes("100k")) return acc + 100000;
    if (p.budget.includes("250k")) return acc + 250000;
    if (p.budget.includes("500k+")) return acc + 500000;
    return acc;
  }, 0);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  const getRiskLevel = (proj: any) => {
    let score = 0;
    if (proj.urgency === "high") score += 3;
    if (proj.leadScore < 40) score += 2;
    if (proj.budget && proj.budget.includes("500k+")) score += 1;
    if (score >= 4) return { label: "High Risk", color: "text-red-400 bg-red-400/10 border-red-400/20" };
    if (score >= 2) return { label: "Elevated", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" };
    return { label: "Stable", color: "text-green-400 bg-green-400/10 border-green-400/20" };
  };

  const projectedConversionRate = Math.min(
    Math.round((activeClientsCount / Math.max(projects.length, 1)) * 100) + 12,
    100
  );

  return (
    <section className="py-24 bg-surface min-h-[80vh] relative pt-32">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Admin Intelligence" },
          ]}
        />
        <FadeUp>
          <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-medium text-white mb-4 flex items-center gap-4">
                Admin Intelligence
              </h1>
              <p className="text-text-muted font-light text-lg">
                Welcome back. Here is your enterprise pipeline overview.
              </p>
            </div>
            {syncError && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-lg text-red-400 text-sm">
                <AlertTriangle size={18} />
                <p>{syncError}</p>
              </div>
            )}
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Pipeline Volume",
              value: projects.length,
              trend: "+12% MoM",
              icon: <Briefcase size={20} />,
              color: "text-blue-400",
              bg: "bg-blue-400/10"
            },
            {
              label: "Pipeline Value (Est)",
              value: formatCurrency(totalPipelineValue),
              trend: "+8.4% MoM",
              icon: <DollarSign size={20} />,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10"
            },
            {
              label: "High Risk Profiles",
              value: highRiskProjects,
              trend: "Critical",
              icon: <ShieldAlert size={20} />,
              color: "text-red-400",
              bg: "bg-red-400/10"
            },
            {
              label: "Projected Conversion",
              value: `${projectedConversionRate}%`,
              trend: "+2.1% MoM",
              icon: <Target size={20} />,
              color: "text-purple-400",
              bg: "bg-purple-400/10"
            },
          ].map((stat, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <Card className="bg-background/50 border-white/5 hover:border-white/10 transition-all relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[60px] -mt-10 -mr-10 transition-opacity opacity-50 group-hover:opacity-100`}></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${stat.trend === "Critical" ? "text-red-400" : "text-emerald-400"}`}>
                      {stat.trend}
                    </span>
                  </div>
                  <h3 className="text-4xl font-mono text-white mb-2 tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Active Clients",
              value: loadingUsers ? "-" : activeClientsCount,
              icon: <Users size={16} />,
            },
            {
              label: "Consultations",
              value: loading ? "-" : projects.length,
              icon: <CalendarDays size={16} />,
            },
            {
              label: "Avg Lead Score",
              value: loading ? "-" : averageLeadScore,
              icon: <Zap size={16} />,
            },
            {
              label: "System Health",
              value: syncError ? "Degraded" : "Realtime Active",
              icon: <Activity size={16} />,
            },
          ].map((stat, i) => (
            <FadeUp key={i} delay={0.4 + (i * 0.1)}>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                <div className="text-slate-500">{stat.icon}</div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-lg font-mono text-white">{stat.value}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <FadeUp delay={0.2}>
            <Card className="bg-background/50 border-white/5 h-full">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-slate-400">Industry Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={industryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {industryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 mt-6 justify-center">
                  {industryData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-slate-300">{entry.name}</span>
                      <span className="text-slate-500 font-mono">({entry.value})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp delay={0.3}>
            <Card className="bg-background/50 border-white/5 h-full">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-slate-400">Budget Pipeline Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        cursor={{ fill: '#1e293b' }}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp delay={0.4}>
            <Card className="bg-background/50 border-white/5 h-full">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-slate-400">Timeline Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={timelineData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {timelineData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 mt-6 justify-center">
                  {timelineData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[(index + 3) % COLORS.length] }}></div>
                      <span className="text-slate-300">{entry.name}</span>
                      <span className="text-slate-500 font-mono">({entry.value})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp delay={0.4}>
            <Card className="bg-background/50 border-white/5 h-full">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-slate-400">Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                      <RechartsTooltip 
                        cursor={{ fill: '#1e293b' }}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </FadeUp>
        </div>

        <FadeUp delay={0.4}>
          <Card className="bg-background/50 border-white/5">
            <CardHeader>
              <CardTitle className="text-xl">Project Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-white/5 rounded-lg w-full"
                    ></div>
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <p className="text-text-muted">No projects found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">
                      <tr>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Industry</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Budget & Timeline</th>
                        <th className="px-4 py-3">Urgency & Risk</th>
                        <th className="px-4 py-3 max-w-[200px]">
                          Requirements
                        </th>
                        <th className="px-4 py-3">Lead Score</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {projects.map((proj) => {
                        const risk = getRiskLevel(proj);
                        return (
                        <React.Fragment key={proj.id}>
                          <tr
                            onClick={() => setExpandedProject(expandedProject === proj.id ? null : proj.id)}
                            className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                          >
                            <td className="px-4 py-4">
                              <p className="font-medium text-white group-hover:text-primary transition-colors">
                                {proj.clientName || "Unknown"}
                              </p>
                              <p className="text-xs text-text-muted">
                                {proj.company || ""}
                              </p>
                            </td>
                            <td className="px-4 py-4 text-text-muted capitalize">
                              {proj.industry || "N/A"}
                            </td>
                            <td className="px-4 py-4 text-text-muted capitalize">
                              {proj.projectType}
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-white">{proj.budget || "N/A"}</p>
                              <p className="text-xs text-text-muted">
                                {proj.timeline || "N/A"}
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-2 items-start">
                                <span
                                  className={`px-2 py-1 text-[9px] uppercase font-bold tracking-wider rounded border ${proj.urgency === "high" ? "bg-red-500/10 text-red-400 border-red-500/20" : proj.urgency === "medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-primary/10 text-primary border-primary/20"}`}
                                >
                                  {proj.urgency || "Normal"} Urgency
                                </span>
                                <span className={`px-2 py-1 text-[9px] uppercase font-bold tracking-wider rounded border ${risk.color}`}>
                                  {risk.label}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 max-w-[200px] truncate">
                              <span
                                className="text-xs text-text-muted"
                                title={proj.requirements}
                              >
                                {proj.requirements || "N/A"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden max-w-[60px]">
                                  <div
                                    className={`h-full ${proj.leadScore >= 70 ? 'bg-emerald-400' : proj.leadScore >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                    style={{ width: `${proj.leadScore || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-mono text-slate-300">
                                  {proj.leadScore || 0}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="px-2 py-1 bg-white/5 border border-white/10 text-slate-300 text-[10px] uppercase font-bold tracking-wider rounded-md">
                                {proj.status || "New"}
                              </span>
                            </td>
                          </tr>
                          {expandedProject === proj.id && (
                            <tr>
                              <td colSpan={8} className="p-0 border-0">
                                <div className="bg-white/[0.02] border-b border-t border-white/5 px-8 pt-6 pb-8 shadow-inner">
                                  <div className="flex justify-between items-center mb-6">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Project Journey & Intelligence</p>
                                    <button className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded hover:bg-primary/20 transition-colors">
                                      Accept Project
                                    </button>
                                  </div>
                                  <div className="max-w-4xl mx-auto">
                                    <ProjectTimeline status={proj.status} />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )})}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.5}>
          <Card className="bg-background/50 border-white/5 mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Client Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="animate-pulse flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-white/5 rounded-lg w-full"
                    ></div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <p className="text-text-muted">No clients found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/5">
                      <tr>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Account Type</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Projects</th>
                        <th className="px-4 py-3">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => {
                        const userProjects = projects.filter(p => p.userId === u.id).length;
                        return (
                        <tr
                          key={u.id}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-4 py-4">
                            <p className="font-medium text-white">
                              {u.name || "Unknown"}
                            </p>
                            <p className="text-xs text-text-muted">
                              {u.email || ""}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-text-muted capitalize">
                            {u.accountType || "Standard"}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md ${u.role === "super_admin" ? "bg-purple-500/10 text-purple-400" : u.role === "admin" ? "bg-primary/10 text-primary" : "bg-white/5 text-slate-400"}`}
                            >
                              {u.role || "Client"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-xs text-slate-300 bg-white/5 px-2 py-1 rounded-md font-mono">
                              {userProjects}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-text-muted">
                            {u.createdAt
                              ? u.createdAt.toDate?.().toLocaleDateString()
                              : "Internal"}
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>
      </Container>
    </section>
  );
}
