/**
 * Deterministic project scoring.
 *
 * Replaces the Math.random() placeholders that were generating meaningless CRM
 * metrics. Scores are reproducible from the same inputs. Changing these tables
 * should be an intentional product decision tracked in git, not a runtime accident.
 */

interface ScoringInput {
  budget?:       string;
  urgency?:      string;
  timeline?:     string;
  projectType?:  string;
  requirements?: string;
  company?:      string;
}

const BUDGET_LEAD_POINTS: Record<string, number> = {
  "100k+":    45,
  "50k-100k": 30,
  "25k-50k":  15,
  "10k-25k":   5,
};

const URGENCY_LEAD_POINTS: Record<string, number> = {
  high:     25,
  medium:   15,
  standard: 10,
  low:       5,
};

const COMPLEXITY_BY_TYPE: Record<string, number> = {
  saas:       5,
  enterprise: 4,
  other:      3,
  uiux:       2,
};

/**
 * Returns a lead quality score in the range [0, 100].
 * Higher = more qualified lead.
 */
export function calculateLeadScore(input: ScoringInput): number {
  let score = 0;
  score += BUDGET_LEAD_POINTS[input.budget   ?? ""] ?? 0;
  score += URGENCY_LEAD_POINTS[input.urgency ?? ""] ?? 0;
  if ((input.company      ?? "").length > 2)   score += 10; // Named company
  if ((input.requirements ?? "").length > 100) score += 10; // Detailed brief
  if (input.timeline === "immediate")           score += 10; // High urgency timeline
  return Math.min(100, score);
}

/**
 * Returns a project complexity score in the range [1, 10].
 * Higher = more complex / higher-risk engagement.
 */
export function calculateComplexityScore(input: ScoringInput): number {
  let score = 1;
  score += COMPLEXITY_BY_TYPE[input.projectType ?? ""] ?? 1;
  if ((input.budget ?? "").includes("100k"))            score += 2;
  if ((input.requirements ?? "").length > 200)          score += 1;
  if (input.urgency === "high")                         score += 1;
  return Math.min(10, score);
}
