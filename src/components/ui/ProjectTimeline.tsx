import { motion } from "motion/react";
import { CheckCircle2, Clock, Map, Layout, Code2, ShieldAlert, FileSearch, RefreshCw, Server, Send, Ban } from "lucide-react";

export interface ProjectTimelineProps {
  status: string;
}

// Full 10-stage execution pipeline plus custom styling for decommissioning
const PIPELINE_STAGES = [
  { key: "pending", label: "01. Submission", icon: Clock, description: "Awaiting workspace verification" },
  { key: "discovery", label: "02. Discovery", icon: Map, description: "Evaluating architecture & team scope" },
  { key: "planning", label: "03. Planning", icon: ShieldAlert, description: "Laying out software schematics" },
  { key: "ui_ux", label: "04. UI/UX Design", icon: Layout, description: "Prototyping dynamic visual layers" },
  { key: "development", label: "05. Engineering", icon: Code2, description: "Active software engineering sprint" },
  { key: "testing", label: "06. QA Testing", icon: FileSearch, description: "Rigorous stress & integrity testing" },
  { key: "review", label: "07. Gov Review", icon: ShieldAlert, description: "Evaluating regulatory & visual compliance" },
  { key: "revision", label: "08. Revision", icon: RefreshCw, description: "Resolving feedback iterations" },
  { key: "deployment", label: "09. Deployment", icon: Server, description: "Deploying to production hypervisor" },
  { key: "completed", label: "10. Launched", icon: Send, description: "Production release active" },
];

export function ProjectTimeline({ status }: ProjectTimelineProps) {
  const currentStatus = (status || "pending").toLowerCase();
  const isCancelled = currentStatus === "cancelled";

  // Gracefully resolve legacy or sub-states
  let mappedStatus = currentStatus;
  if (currentStatus === "new") mappedStatus = "pending";
  if (currentStatus === "analysis") mappedStatus = "planning";
  if (currentStatus === "design") mappedStatus = "ui_ux";
  if (currentStatus === "in-progress" || currentStatus === "active" || currentStatus === "building") mappedStatus = "development";

  const targetIndex = PIPELINE_STAGES.findIndex(s => s.key === mappedStatus);
  const currentIndex = targetIndex === -1 ? 0 : targetIndex;

  return (
    <div className="w-full py-8 px-4 bg-white/[0.01] border border-white/5 rounded-3xl relative overflow-hidden">
      {isCancelled ? (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
          <Ban className="text-red-400 shrink-0" size={20} />
          <div>
            <h4 className="text-sm font-semibold text-red-200">PROJECT DECOMMISSIONED</h4>
            <p className="text-xs text-red-400">This engagement has been archived. State transitions are frozen until re-activated.</p>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">Active Operational Milestone</span>
            <h4 className="text-[15px] font-medium text-white capitalize mt-1 flex items-center gap-2">
              {PIPELINE_STAGES[currentIndex]?.label || "N/A"}
            </h4>
          </div>
          <p className="text-xs text-slate-400 font-mono italic">
            {PIPELINE_STAGES[currentIndex]?.description || "N/A"}
          </p>
        </div>
      )}

      {/* Pipeline Navigation Nodes Ribbon */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 mt-4 select-none">
        {/* Connecting Line (Only Desktop) */}
        <div className="absolute left-[20px] right-[20px] top-[24px] h-[2px] bg-white/[0.05] -translate-y-1/2 hidden md:block" />

        {/* Active Connecting Line Progress Ribbon */}
        {!isCancelled && (
          <motion.div
            className="absolute left-[20px] top-[24px] h-[2px] bg-primary -translate-y-1/2 hidden md:block shadow-[0_0_15px_rgba(59,130,246,0.6)]"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentIndex / (PIPELINE_STAGES.length - 1)) * 96}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}

        {PIPELINE_STAGES.map((step, index) => {
          const isCompleted = !isCancelled && index < currentIndex;
          const isActive = !isCancelled && index === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex md:flex-col items-center gap-4 md:gap-2 relative group flex-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-500 bg-[#0d1224] ${
                  isCancelled
                    ? "border-red-500/20 text-red-500/50"
                    : isCompleted
                    ? "border-primary text-primary bg-[#0d1224] shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                    : isActive
                    ? "border-primary text-white bg-primary scale-110 shadow-[0_0_20px_rgba(59,130,246,0.4)] ring-4 ring-primary/10"
                    : "border-white/10 text-slate-500 hover:border-white/30"
                }`}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <StepIcon size={16} />}
              </motion.div>

              <div className="flex flex-col md:items-center text-left md:text-center mt-1">
                <span
                  className={`text-[9px] uppercase font-bold tracking-widest transition-colors ${
                    isCancelled
                      ? "text-red-500/40"
                      : isActive
                      ? "text-primary font-extrabold"
                      : isCompleted
                      ? "text-slate-300"
                      : "text-slate-600 group-hover:text-slate-400"
                  }`}
                >
                  {step.label.split(". ")[1]}
                </span>
                <span className="text-[8px] text-slate-500 hidden lg:block font-mono mt-0.5 max-w-[80px] leading-tight">
                  {step.description.substring(0, 24)}...
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
