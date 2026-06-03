import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Link } from "react-router-dom";
import { Clock, Activity, FileText, History } from "lucide-react";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { FadeUp } from "../../components/animations/FadeUp";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";

import { ProjectTimeline } from "../../components/ui/ProjectTimeline";

export function ClientPortal() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid || !user?.email) return;

    const q = query(
      collection(db, "projects"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
        setProjects(data);
        setLoading(false);
        setSyncError(null);
      },
      () => {
        setSyncError(
          "Unable to sync projects. The datastore rules require manual deployment.",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uid, user?.email]);

  return (
    <section className="py-24 bg-surface min-h-[80vh] relative pt-32">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <Container>
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Client Portal" }]}
        />
        <FadeUp>
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-display font-medium text-white mb-4">
              Client Portal
            </h1>
            <p className="text-text-muted font-light text-lg">
              Welcome back, {user?.email}. View your active projects and
              billing.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-6">
            <FadeUp delay={0.1}>
              <h2 className="text-xl font-display text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" /> My Projects
              </h2>
            </FadeUp>

            {syncError && (
              <FadeUp delay={0.15}>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-red-400 text-sm mb-6 flex flex-col gap-2">
                  <p className="font-bold">
                    Missing or insufficient permissions.
                  </p>
                  <p>
                    {syncError} Please run{" "}
                    <code>npx firebase deploy --only firestore:rules</code> on
                    your backend to apply the new enterprise security models.
                  </p>
                </div>
              </FadeUp>
            )}

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-40 bg-white/5 rounded-xl w-full"
                  ></div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <FadeUp delay={0.2}>
                <Card className="bg-background/50 border-white/5 p-12 text-center flex flex-col items-center justify-center">
                  <h3 className="text-xl font-display text-white mb-4">
                    No Active Projects
                  </h3>
                  <p className="text-text-muted font-light mb-8 max-w-sm">
                    You currently don't have any active enterprise projects.
                    Submit a discovery brief to begin.
                  </p>
                  <Link to="/#contact">
                    <Button
                      variant="primary"
                      className="uppercase tracking-widest text-[11px] font-bold"
                    >
                      Start New Project
                    </Button>
                  </Link>
                </Card>
              </FadeUp>
            ) : (
              <div className="space-y-6">
                {projects.map((proj, i) => (
                  <FadeUp key={proj.id} delay={0.1 + i * 0.1}>
                    <Card className="bg-background/50 border-white/5 p-6 hover:border-white/10 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                        <div>
                          <h3 className="text-2xl font-display text-white capitalize">
                            {proj.projectType} Platform
                          </h3>
                          <p className="text-sm text-text-muted mt-1 font-mono">
                            ID: {proj.id?.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                              Status
                            </p>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider rounded-md border border-primary/20">
                              {proj.status || "Under Review"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/[0.02] rounded-lg mb-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                            Timeline
                          </p>
                          <p className="text-sm text-white capitalize">
                            {proj.timeline}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                            Budget
                          </p>
                          <p className="text-sm text-white capitalize">
                            {proj.budget}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                            Urgency
                          </p>
                          <p className="text-sm text-white capitalize">
                            {proj.urgency}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                            Submitted
                          </p>
                          <p className="text-sm text-white">
                            {proj.createdAt?.toDate?.()?.toLocaleDateString() || "Just now"}
                          </p>
                        </div>
                      </div>

                      <div className="mb-6 border-y border-white/5 bg-background">
                        <ProjectTimeline status={proj.status} />
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                          Requirements
                        </p>
                        <p className="text-sm text-text-muted font-light leading-relaxed line-clamp-2">
                          {proj.requirements}
                        </p>
                      </div>
                    </Card>
                  </FadeUp>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-4 space-y-6">
            <FadeUp delay={0.3}>
              <Card className="bg-background/50 border-white/5 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <History size={64} className="text-primary" />
                </div>
                <h3 className="text-lg font-display text-white mb-6 relative z-10 flex items-center gap-2">
                  <Activity size={18} className="text-primary" /> Project
                  History
                </h3>
                {projects.length > 0 ? (
                  <div className="space-y-4 relative z-10">
                    <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 mt-2 rounded-full bg-primary flex-shrink-0 relative before:content-[''] before:absolute before:w-px before:h-12 before:bg-white/10 before:left-1/2 before:-translate-x-1/2 before:top-4"></div>
                      <div>
                        <p className="text-sm text-white">Project Submitted</p>
                        <p className="text-xs text-text-muted mt-1">
                          {projects[0]?.createdAt?.toDate?.()?.toLocaleDateString() || "Today"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 mt-2 rounded-full bg-white/20 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-slate-400">
                          Architect Review
                        </p>
                        <p className="text-xs text-slate-600 mt-1">Pending</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-text-muted text-sm italic relative z-10">
                    No history available yet.
                  </p>
                )}
              </Card>
            </FadeUp>

            <FadeUp delay={0.4}>
              <Card className="bg-background/50 border-white/5 p-6">
                <h3 className="text-lg font-display text-white mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-primary" /> Timeline
                </h3>
                <div className="space-y-4">
                  <p className="text-text-muted text-sm font-light">
                    Milestones and deadlines will appear here once your project
                    is initiated by our engineering team.
                  </p>
                </div>
              </Card>
            </FadeUp>
          </div>
        </div>
      </Container>
    </section>
  );
}
