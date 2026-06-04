import { Container } from "../../components/layout/Container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { FadeUp } from "../../components/animations/FadeUp";
import React, { useEffect, useState, useMemo } from "react";
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
  AlertTriangle,
  ShieldAlert,
  Zap,
  Target,
  DollarSign,
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

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#64748b",
];


export function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setLoadingUsers(false);
      return;
    }

    const activeDb = db;

    let unsubscribeProjects = () => {};
    let unsubscribeUsers = () => {};
    let unsubscribeActivities = () => {};

    const setupSubscriptions = async () => {
      try {
        const projectsQuery = query(
          collection(activeDb, "projects"),
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
          (error: any) => {
            if (error.code === "permission-denied") {
              setSyncError(
                "Firestore Security Rules denied access. Please deploy your customized firestore.rules to your Firebase project.",
              );
            } else {
              setSyncError(
                "Realtime ledger sync interrupted. Using secure static fallback.",
              );
            }
            try {
              getDocs(projectsQuery)
                .then((snapshot) => {
                  const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));
                  setProjects(data);
                  setLoading(false);
                })
                .catch(() => setLoading(false));
            } catch {
              setLoading(false);
            }
          },
        );

        const usersQuery = query(
          collection(activeDb, "users"),
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
          (error: any) => {
            if (error.code === "permission-denied") {
              setSyncError(
                "Firestore Security Rules denied access. Please deploy your customized firestore.rules to your Firebase project.",
              );
            }
            try {
              getDocs(usersQuery)
                .then((snapshot) => {
                  const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));
                  setUsers(data);
                  setLoadingUsers(false);
                })
                .catch(() => setLoadingUsers(false));
            } catch {
              setLoadingUsers(false);
            }
          },
        );

        const activityQuery = query(
          collection(activeDb, "clientActivity"),
          orderBy("timestamp", "desc"),
          limit(50),
        );
        unsubscribeActivities = onSnapshot(
          activityQuery,
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setActivities(data);
          },
          () => {
            // Silently handle error
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
      unsubscribeActivities();
    };
  }, []);

  const activeClientsCount = useMemo(
    () => users.filter((u) => u.role === "client" || !u.role).length,
    [users],
  );

  const getAggregation = (arr: any[], key: string) => {
    const counts = arr.reduce(
      (acc, item) => {
        const val = item[key]
          ? String(item[key]).charAt(0).toUpperCase() +
            String(item[key]).slice(1)
          : "Unspecified";
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => b.value - a.value);
  };

  const industryData = useMemo(
    () => getAggregation(projects, "industry"),
    [projects],
  );
  const budgetData = useMemo(
    () => getAggregation(projects, "budget"),
    [projects],
  );
  const timelineData = useMemo(
    () => getAggregation(projects, "timeline"),
    [projects],
  );
  const statusData = useMemo(
    () => getAggregation(projects, "status"),
    [projects],
  );

  const averageLeadScore = useMemo(
    () =>
      projects.length > 0
        ? Math.round(
            projects.reduce((acc, p) => acc + (p.leadScore || 0), 0) /
              projects.length,
          )
        : 0,
    [projects],
  );

  // Intelligence calculations
  const totalPipelineValue = useMemo(
    () =>
      projects.reduce((acc, p) => {
        if (!p.budget) return acc;
        if (p.budget.includes("50k")) return acc + 50000;
        if (p.budget.includes("100k")) return acc + 100000;
        if (p.budget.includes("250k")) return acc + 250000;
        if (p.budget.includes("500k+")) return acc + 500000;
        return acc;
      }, 0),
    [projects],
  );

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
    if (score >= 4)
      return {
        label: "High Risk",
        color: "text-red-400 bg-red-400/10 border-red-400/20",
      };
    if (score >= 2)
      return {
        label: "Elevated",
        color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
      };
    return {
      label: "Stable",
      color: "text-green-400 bg-green-400/10 border-green-400/20",
    };
  };

  const clientsWithProjects = useMemo(
    () => new Set(projects.map((p) => p.userId)).size,
    [projects],
  );
  const abandonedPrototypes = Math.max(
    0,
    activeClientsCount - clientsWithProjects,
  );
  const conversionRate =
    activeClientsCount > 0
      ? Math.round((clientsWithProjects / activeClientsCount) * 100)
      : 0;

  const urgentProjectsCount = useMemo(
    () => projects.filter((p) => p.urgency === "high").length,
    [projects],
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
                Executive Command Center
              </h1>
              <p className="text-text-muted font-light text-lg">
                Enterprise Business Operating System
              </p>
            </div>
            {syncError && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl text-red-500 text-sm shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <AlertTriangle size={18} className="text-red-500" />
                <p className="font-medium tracking-wide">
                  System Notice: Realtime replication degraded.{" "}
                  {syncError.includes("Security Rules")
                    ? "Missing IAM permissions or security rules."
                    : ""}
                </p>
              </div>
            )}
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Active Projects",
              value: projects.length,
              trend: "Live",
              icon: <Briefcase size={20} />,
              color: "text-blue-400",
              bg: "bg-blue-400/10",
              border: "border-blue-400/20",
            },
            {
              label: "Est. Revenue Pipeline",
              value: formatCurrency(totalPipelineValue),
              trend: "Volume",
              icon: <DollarSign size={20} />,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
              border: "border-emerald-400/20",
            },
            {
              label: "High Priority Deals",
              value: urgentProjectsCount,
              trend: "Urgent",
              icon: <Zap size={20} />,
              color: "text-orange-400",
              bg: "bg-orange-400/10",
              border: "border-orange-400/20",
            },
            {
              label: "Projected Conversion",
              value: `${conversionRate}%`,
              trend: "Avg",
              icon: <Target size={20} />,
              color: "text-purple-400",
              bg: "bg-purple-400/10",
              border: "border-purple-400/20",
            },
            {
              label: "Active Client Base",
              value: loadingUsers ? "-" : activeClientsCount,
              trend: "Users",
              icon: <Users size={20} />,
              color: "text-cyan-400",
              bg: "bg-cyan-400/10",
              border: "border-cyan-400/20",
            },
            {
              label: "Avg. Lead Score",
              value: loading ? "-" : averageLeadScore,
              trend: "Score",
              icon: <Activity size={20} />,
              color: "text-indigo-400",
              bg: "bg-indigo-400/10",
              border: "border-indigo-400/20",
            },
            {
              label: "Abandoned Drafts",
              value: abandonedPrototypes,
              trend: "Lost",
              icon: <ShieldAlert size={20} />,
              color: "text-red-400",
              bg: "bg-red-400/10",
              border: "border-red-400/20",
            },
            {
              label: "System Health",
              value: syncError ? "Degraded" : "Nominal",
              trend: "Ops",
              icon: <Activity size={20} />,
              color: syncError ? "text-red-400" : "text-green-400",
              bg: syncError ? "bg-red-400/10" : "bg-green-400/10",
              border: syncError ? "border-red-400/20" : "border-green-400/20",
            },
          ].map((stat, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <Card className="bg-white/[0.015] border-white/[0.05] hover:border-white/10 transition-all relative overflow-hidden group shadow-none hover:shadow-2xl hover:shadow-primary/5 rounded-2xl">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[60px] -mt-10 -mr-10 transition-all duration-500 opacity-30 group-hover:opacity-80 scale-100 group-hover:scale-150`}
                ></div>
                <CardContent className="p-6 relative z-10 flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.border} border ${stat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}
                    >
                      {stat.icon}
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-widest font-bold ${stat.color} bg-white/5 px-2 py-0.5 rounded-full border border-white/5 shadow-sm`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-mono text-white tracking-tight mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-[11px] uppercase tracking-widest text-slate-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <FadeUp delay={0.2}>
            <Card className="bg-white/[0.015] border-white/[0.05] shadow-none rounded-2xl h-full flex flex-col">
              <CardHeader className="border-b border-white/[0.05] pb-4">
                <CardTitle className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">
                  Sector Concentration
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-6">
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
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "8px",
                        }}
                        itemStyle={{ color: "#f8fafc" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 mt-6 justify-center">
                  {industryData.map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <span className="text-slate-300">{entry.name}</span>
                      <span className="text-slate-500 font-mono">
                        ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp delay={0.3}>
            <Card className="bg-white/[0.015] border-white/[0.05] shadow-none rounded-2xl h-full flex flex-col">
              <CardHeader className="border-b border-white/[0.05] pb-4">
                <CardTitle className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">
                  Value Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-6">
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={budgetData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <RechartsTooltip
                        cursor={{ fill: "#1e293b" }}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp delay={0.4}>
            <Card className="bg-white/[0.015] border-white/[0.05] shadow-none rounded-2xl h-full flex flex-col">
              <CardHeader className="border-b border-white/[0.05] pb-4">
                <CardTitle className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">
                  Delivery Trajectory
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-6">
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
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[(index + 3) % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "8px",
                        }}
                        itemStyle={{ color: "#f8fafc" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 mt-6 justify-center">
                  {timelineData.map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[(index + 3) % COLORS.length],
                        }}
                      ></div>
                      <span className="text-slate-300">{entry.name}</span>
                      <span className="text-slate-500 font-mono">
                        ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp delay={0.5}>
            <Card className="bg-white/[0.015] border-white/[0.05] shadow-none rounded-2xl h-full flex flex-col">
              <CardHeader className="border-b border-white/[0.05] pb-4">
                <CardTitle className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">
                  Operational Status
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-6">
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statusData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <RechartsTooltip
                        cursor={{ fill: "#1e293b" }}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </FadeUp>
        </div>

        <FadeUp delay={0.6}>
          <Card className="bg-white/[0.015] border-white/[0.05] shadow-none rounded-2xl overflow-hidden mb-6">
            <CardHeader className="border-b border-white/[0.05] bg-white/[0.01]">
              <CardTitle className="text-lg font-medium text-white">
                Project Pipeline Command Center
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="w-full animate-pulse">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/[0.01] border-b border-white/[0.05]">
                      <tr>
                        {[...Array(8)].map((_, i) => (
                          <th key={i} className="px-6 py-4">
                            <div className="h-3 bg-white/[0.03] rounded w-20"></div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {[...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-5">
                            <div className="h-4 bg-white/[0.05] rounded w-32 mb-2"></div>
                            <div className="h-3 bg-white/[0.03] rounded w-24"></div>
                          </td>
                          <td className="px-6 py-5"><div className="h-4 bg-white/[0.03] rounded w-24"></div></td>
                          <td className="px-6 py-5"><div className="h-4 bg-white/[0.03] rounded w-28"></div></td>
                          <td className="px-6 py-5">
                            <div className="h-4 bg-white/[0.05] rounded w-20 mb-2"></div>
                            <div className="h-3 bg-white/[0.03] rounded w-16"></div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="h-5 bg-white/[0.03] rounded w-20 mb-2"></div>
                            <div className="h-5 bg-white/[0.03] rounded w-24"></div>
                          </td>
                          <td className="px-6 py-5"><div className="h-4 bg-white/[0.03] rounded w-32"></div></td>
                          <td className="px-6 py-5"><div className="h-2 bg-white/[0.05] rounded w-16"></div></td>
                          <td className="px-6 py-5"><div className="h-6 bg-white/[0.05] rounded w-16"></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : projects.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-medium">
                  No projects in the pipeline.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-white/[0.01] text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/[0.05]">
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
                              onClick={() =>
                                setExpandedProject(
                                  expandedProject === proj.id ? null : proj.id,
                                )
                              }
                              className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                            >
                              <td className="px-6 py-5">
                                <p className="font-medium text-white group-hover:text-primary transition-colors">
                                  {proj.clientName || "Unknown"}
                                </p>
                                <p className="text-[11px] text-slate-500 font-mono mt-1">
                                  {proj.company || ""}
                                </p>
                              </td>
                              <td className="px-6 py-5 text-slate-400 capitalize">
                                {proj.industry || "N/A"}
                              </td>
                              <td className="px-6 py-5 text-slate-400 capitalize">
                                {proj.projectType}
                              </td>
                              <td className="px-6 py-5">
                                <p className="text-white font-mono text-sm">
                                  {proj.budget || "N/A"}
                                </p>
                                <p className="text-[11px] text-slate-500 font-mono mt-1">
                                  {proj.timeline || "N/A"}
                                </p>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex flex-col gap-2 items-start">
                                  <span
                                    className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest rounded border ${proj.urgency === "high" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : proj.urgency === "medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-primary/10 text-primary border-primary/20"}`}
                                  >
                                    {proj.urgency || "Normal"} Urgency
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest rounded border ${risk.color}`}
                                  >
                                    {risk.label}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5 max-w-[200px] truncate">
                                <span
                                  className="text-[11px] text-slate-500 tracking-wide"
                                  title={proj.requirements}
                                >
                                  {proj.requirements || "N/A"}
                                </span>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden max-w-[60px] border border-white/5">
                                    <div
                                      className={`h-full ${proj.leadScore >= 70 ? "bg-emerald-400" : proj.leadScore >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
                                      style={{
                                        width: `${proj.leadScore || 0}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-[11px] font-mono text-slate-400">
                                    {proj.leadScore || 0}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <span className="px-2.5 py-1 bg-white/[0.03] border border-white/10 text-slate-300 text-[10px] uppercase font-bold tracking-widest rounded shadow-sm">
                                  {proj.status || "New"}
                                </span>
                              </td>
                            </tr>
                            {expandedProject === proj.id && (
                              <tr>
                                <td colSpan={8} className="p-0 border-0">
                                  <div className="bg-[#0a0f1d] border-b border-t border-white/[0.05] px-8 pt-6 pb-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                                    <div className="flex justify-between items-center mb-8">
                                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                                        Intelligence Detail Pane
                                      </p>
                                      <button className="text-[11px] font-bold uppercase tracking-widest bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all">
                                        Accept Deal
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.7}>
          <Card className="bg-white/[0.015] border-white/[0.05] shadow-none rounded-2xl overflow-hidden mt-6 mb-6">
            <CardHeader className="border-b border-white/[0.05] bg-white/[0.01]">
              <CardTitle className="text-lg font-medium text-white">
                Global Client Base
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadingUsers ? (
                <div className="w-full animate-pulse">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-white/[0.01] border-b border-white/[0.05]">
                      <tr>
                        {[...Array(5)].map((_, i) => (
                          <th key={i} className="px-6 py-4">
                            <div className="h-3 bg-white/[0.03] rounded w-20"></div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {[...Array(3)].map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-5">
                            <div className="h-4 bg-white/[0.05] rounded w-32 mb-2"></div>
                            <div className="h-3 bg-white/[0.03] rounded w-24"></div>
                          </td>
                          <td className="px-6 py-5"><div className="h-4 bg-white/[0.03] rounded w-24"></div></td>
                          <td className="px-6 py-5"><div className="h-5 bg-white/[0.03] rounded w-20"></div></td>
                          <td className="px-6 py-5"><div className="h-6 bg-white/[0.03] rounded w-12"></div></td>
                          <td className="px-6 py-5"><div className="h-4 bg-white/[0.03] rounded w-24"></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-medium">
                  No clients registered.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-white/[0.01] text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/[0.05]">
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
                        const userProjects = projects.filter(
                          (p) => p.userId === u.id,
                        ).length;
                        return (
                          <tr
                            key={u.id}
                            className="hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="px-6 py-5">
                              <p className="font-medium text-white">
                                {u.name || "Unknown"}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono mt-1">
                                {u.email || ""}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-slate-400 capitalize">
                              {u.accountType || "Standard"}
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest rounded border ${u.role === "super_admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : u.role === "admin" ? "bg-primary/10 text-primary border-primary/20" : "bg-white/[0.02] text-slate-400 border-white/10"}`}
                              >
                                {u.role || "Client"}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-[11px] text-slate-300 bg-slate-800 border border-slate-700/50 px-2.5 py-1 rounded shadow-inner font-mono">
                                {userProjects}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-slate-400 font-mono text-[11px]">
                              {u.createdAt
                                ? u.createdAt.toDate?.().toLocaleDateString()
                                : "Internal"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.8}>
          <Card className="bg-white/[0.015] border-white/[0.05] shadow-none rounded-2xl overflow-hidden mt-6">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.05] bg-white/[0.01]">
              <CardTitle className="text-lg font-medium text-white">
                Live Activity Feed
              </CardTitle>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-[0_0_10px_rgba(59,130,246,0.15)] pulse-glow">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                System Stream
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {activities.length === 0 ? (
                <div className="py-8 text-center border-t border-white/5 text-slate-500 text-sm">
                  Waiting for client activity events...
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Activity size={14} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-white font-medium">
                            {act.actionTitle || "System Event"}
                          </p>
                          <span className="text-xs font-mono text-slate-500">
                            {act.timestamp?.toDate
                              ? act.timestamp.toDate().toLocaleTimeString()
                              : "Just now"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {act.description}
                        </p>
                        {act.clientEmail && (
                          <div className="mt-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex gap-2 items-center">
                            <Users size={10} />
                            {act.clientEmail}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>
      </Container>
    </section>
  );
}
