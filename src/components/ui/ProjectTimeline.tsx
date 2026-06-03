import { motion } from "motion/react";
import { CheckCircle2, Clock, Briefcase, Rocket } from "lucide-react";

export interface ProjectTimelineProps {
  status: string;
}

const STEPS = [
  { id: "submission", label: "Submission", icon: Clock },
  { id: "consultation", label: "Consultation", icon: Briefcase },
  { id: "development", label: "Development", icon: Rocket },
  { id: "delivery", label: "Delivery", icon: CheckCircle2 },
];

export function ProjectTimeline({ status }: ProjectTimelineProps) {
  const currentStatus = (status || "new").toLowerCase();

  let currentIndex = 0;
  if (["review", "consultation"].includes(currentStatus)) {
    currentIndex = 1;
  } else if (
    ["development", "in-progress", "building", "active"].includes(currentStatus)
  ) {
    currentIndex = 2;
  } else if (["completed", "delivered", "done"].includes(currentStatus)) {
    currentIndex = 3;
  }

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line Backdrop */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-white/5" />

        {/* Active Connecting Line */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="relative flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-colors duration-500 bg-background ${
                  isCompleted
                    ? "border-primary text-primary"
                    : "border-white/10 text-slate-500"
                } ${isActive ? "shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-2 ring-primary/20 ring-offset-2 ring-offset-background" : ""}`}
              >
                <StepIcon size={18} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                className="absolute top-12 whitespace-nowrap"
              >
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-slate-300"
                        : "text-slate-600"
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
