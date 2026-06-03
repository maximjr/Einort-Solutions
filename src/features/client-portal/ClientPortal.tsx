import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Activity, FileText, History, Box } from "lucide-react";
import { Container } from "../../components/layout/Container";
import { Card } from "../../components/ui/Card";
import { FadeUp } from "../../components/animations/FadeUp";
import { Button } from "../../components/ui/Button";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { useAuth } from "../../hooks/useAuth";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function ClientPortal() {
  const { userData, user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
       setLoading(false);
       return;
    }

    const q = query(
      collection(db, "projects"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(p);
      setLoading(false);
    }, (error: any) => {
       // Handle the rule error gracefully on the UI
       if (error.code === 'permission-denied') {
          setProjects([{
             id: 'permission-error',
             company: 'Permission Denied',
             projectType: 'System Alert',
             industry: 'Infrastructure',
             status: 'Rule Error',
             budget: 'N/A',
             timeline: 'N/A',
             createdAt: { toDate: () => new Date() },
             isError: true
          }]);
       }
       setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

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
              Welcome back, <span className="text-white font-medium">{userData?.fullName || "Valued Client"}</span>. View your active projects and
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
                   <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                     <Box className="w-8 h-8 text-primary" />
                   </div>
                  <h3 className="text-xl font-display text-white mb-4">
                    No Active Projects
                  </h3>
                  <p className="text-text-muted font-light mb-8 max-w-sm">
                    You currently don't have any enterprise projects deployed.
                    Submit a discovery brief to begin.
                  </p>
                  <Link to="/#contact">
                    <Button
                      variant="primary"
                      className="uppercase tracking-widest text-[11px] font-bold h-12 shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
                    >
                      Start New Project
                    </Button>
                  </Link>
                </Card>
              </FadeUp>
            ) : (
              <div className="space-y-4">
                {projects.map((proj, i) => (
                   <FadeUp key={proj.id} delay={0.1 + (i * 0.1)}>
                      <Card className={`bg-background/50 border-white/5 p-8 transition-colors group ${proj.isError ? 'border-red-500/20 hover:border-red-500/40 bg-red-500/5' : 'hover:border-white/10'}`}>
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <h3 className={`text-xl font-display transition-colors ${proj.isError ? 'text-red-400 group-hover:text-red-300' : 'text-white group-hover:text-primary'}`}>{proj.company || "Project Initialized"}</h3>
                              <p className="text-sm text-text-muted mt-1 capitalize">{proj.projectType} • {proj.industry}</p>
                           </div>
                           <span className={`px-3 py-1.5 border text-[10px] uppercase font-bold tracking-wider rounded-md ${proj.isError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-slate-300'}`}>
                             {proj.status || "In Review"}
                           </span>
                        </div>
                        {proj.isError ? (
                           <div className="pt-6 border-t border-red-500/10 text-sm text-red-200">
                             Firestore Security Rules have denied access to the collection. Please deploy the updated <span className="font-mono text-xs bg-red-500/20 px-1 rounded">firestore.rules</span> to your Firebase project to restore access.
                           </div>
                        ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
                           <div>
                             <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Budget</p>
                             <p className="text-sm text-white">{proj.budget || "TBD"}</p>
                           </div>
                           <div>
                             <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Timeline</p>
                             <p className="text-sm text-white">{proj.timeline || "TBD"}</p>
                           </div>
                           <div className="col-span-2">
                             <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Submitted</p>
                             <p className="text-sm text-slate-400">{proj.createdAt ? proj.createdAt.toDate().toLocaleDateString() : "Just now"}</p>
                           </div>
                        </div>
                        )}
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
                  <Activity size={18} className="text-primary" /> Project Latest Activity
                </h3>
                {projects.length > 0 ? (
                  <div className="space-y-4 relative z-10">
                    <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 mt-2 rounded-full bg-primary flex-shrink-0 relative before:content-[''] before:absolute before:w-px before:h-12 before:bg-white/10 before:left-1/2 before:-translate-x-1/2 before:top-4"></div>
                      <div>
                        <p className="text-sm text-white">Project Submitted</p>
                        <p className="text-xs text-primary mt-1">
                          In Review Phase
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 mt-2 rounded-full bg-white/20 flex-shrink-0 relative before:content-[''] before:absolute before:w-px before:h-12 before:bg-white/10 before:left-1/2 before:-translate-x-1/2 before:top-4"></div>
                      <div>
                        <p className="text-sm text-slate-400">
                          Architect Review
                        </p>
                        <p className="text-xs text-slate-600 mt-1">Pending Assignment</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 mt-2 rounded-full bg-white/20 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm text-slate-400">
                          Kickoff Call
                        </p>
                        <p className="text-xs text-slate-600 mt-1">Pending Approval</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-text-muted text-sm italic relative z-10">
                    Submit a project to view its lifecycle history.
                  </p>
                )}
              </Card>
            </FadeUp>

            <FadeUp delay={0.4}>
              <Card className="bg-background/50 border-white/5 p-6 block hover:bg-white/[0.02] transition-colors cursor-pointer group">
                <h3 className="text-lg font-display text-white mb-4 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                    <Clock size={18} className="text-primary" /> Meetings
                   </div>
                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                     <span className="text-primary text-xs font-bold font-mono">0</span>
                   </div>
                </h3>
                <div className="space-y-4">
                  <p className="text-text-muted text-sm font-light">
                    Kickoff meetings and deadlines will appear here once your project
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
