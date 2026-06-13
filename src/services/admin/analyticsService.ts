import { Project } from "../../types";

export interface AggregationData {
  name:  string;
  value: number;
}

export interface RiskLevelInfo {
  label: string;
  color: string;
}

// Canonical budget midpoints for pipeline value estimation.
// Using a lookup instead of substring matching prevents "50k-100k" from
// matching both the "50k" and "100k" branches depending on traversal order.
const BUDGET_MIDPOINTS: Record<string, number> = {
  "10k-25k":   17_500,
  "25k-50k":   37_500,
  "50k-100k":  75_000,
  "100k+":    150_000,
};

export const analyticsService = {
  getAggregation(arr: unknown[], key: string): AggregationData[] {
    const counts = (arr as Record<string, unknown>[]).reduce(
      (acc, item) => {
        const raw = item[key];
        const val = raw
          ? String(raw).charAt(0).toUpperCase() + String(raw).slice(1)
          : "Unspecified";
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => b.value - a.value);
  },

  calculateTotalPipeline(projects: Project[]): number {
    return projects.reduce((acc, p) => acc + (BUDGET_MIDPOINTS[p.budget ?? ""] ?? 0), 0);
  },

  formatCurrency(val: number): string {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000)     return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val}`;
  },

  getRiskLevel(proj: Partial<Project>): RiskLevelInfo {
    let score = 0;
    if (proj.urgency   === "high")   score += 3;
    if ((proj.leadScore ?? 100) < 40) score += 2;
    if ((proj.budget   ?? "").includes("500k+")) score += 1;

    if (score >= 4) return { label: "High Risk", color: "text-red-400 bg-red-400/10 border-red-400/20" };
    if (score >= 2) return { label: "Elevated",  color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" };
    return           { label: "Stable",    color: "text-green-400 bg-green-400/10 border-green-400/20" };
  },

  calculateCRMStats(projects: Project[], activeClientsCount: number) {
    const clientsWithProjects = new Set(projects.map((p) => p.userId)).size;
    const abandonedPrototypes = Math.max(0, activeClientsCount - clientsWithProjects);
    const conversionRate =
      activeClientsCount > 0
        ? Math.round((clientsWithProjects / activeClientsCount) * 100)
        : 0;
    return { clientsWithProjects, abandonedPrototypes, conversionRate };
  },

  calculateAverageLeadScore(projects: Project[]): number {
    if (projects.length === 0) return 0;
    const sum = projects.reduce((acc, p) => acc + (p.leadScore || 0), 0);
    return Math.round(sum / projects.length);
  },
};
