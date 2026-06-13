/**
 * Shared status pill configuration.
 *
 * Previously duplicated verbatim in AdminDashboard.tsx and ClientPortal.tsx.
 * Any new status value (e.g. "on_hold", "in_review") must now be added in exactly
 * one place and takes effect everywhere instantly.
 */

export interface StatusPillConfig {
  label:    string;
  bgClass:  string;
  dotClass: string;
}

const STATUS_MAP: Record<string, StatusPillConfig> = {
  cancelled: {
    label:    "Cancelled",
    bgClass:  "bg-red-500/10 text-red-400 border-red-500/20",
    dotClass: "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]",
  },
  pending: {
    label:    "Pending Review",
    bgClass:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse",
  },
  new: {
    label:    "Pending Review",
    bgClass:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse",
  },
  discovery: {
    label:    "Pending Review",
    bgClass:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse",
  },
  completed: {
    label:    "Completed",
    bgClass:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  },
  launched: {
    label:    "Completed",
    bgClass:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  },
  deployment: {
    label:    "Completed",
    bgClass:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  },
};

const DEFAULT_PILL: StatusPillConfig = {
  label:    "In Progress",
  bgClass:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  dotClass: "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse",
};

export function getStatusPill(status?: string): StatusPillConfig {
  return STATUS_MAP[(status ?? "").toLowerCase()] ?? DEFAULT_PILL;
}
