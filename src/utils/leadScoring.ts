export type LeadScoringParams = {
  budget?: string;
  value?: number;
  timeline?: string;
  urgency?: string;
  complexity?: string;
  featuresCount?: number;
  hasCompany?: boolean;
  industry?: string;
};

export const calculateLeadScore = (params: LeadScoringParams): number => {
  let score = 30; // base score

  // Value / Budget
  const value = params.value || 0;
  if (value > 50000) score += 20;
  else if (value > 20000) score += 15;
  else if (value > 5000) score += 10;
  else if (value > 0) score += 5;
  
  if (params.budget) {
      const budgetLower = params.budget.toLowerCase();
      if (budgetLower.includes('50k') || budgetLower.includes('enterprise')) score += 20;
      else if (budgetLower.includes('10k') || budgetLower.includes('25k')) score += 15;
      else if (budgetLower.includes('5k')) score += 10;
  }

  // Timeline / Urgency
  if (params.timeline) {
    const timeline = params.timeline.toLowerCase();
    if (timeline.includes('asap') || timeline.includes('immediately') || timeline.includes('1 month')) score += 20;
    else if (timeline.includes('1-3') || timeline.includes('3 months')) score += 10;
    else if (timeline.includes('6 months') || timeline.includes('flexible')) score += 5;
  }

  // Complexity
  if (params.complexity) {
    const comp = params.complexity.toLowerCase();
    if (comp.includes('enterprise') || comp.includes('high')) score += 15;
    else if (comp.includes('medium')) score += 10;
    else if (comp.includes('low')) score += 5;
  }

  // Completeness / Identity
  if (params.hasCompany) score += 10;
  if (params.featuresCount && params.featuresCount > 3) score += 5;

  return Math.min(100, Math.max(0, score));
};

export const getLeadStatus = (score: number): 'Hot' | 'Warm' | 'Cold' => {
  if (score >= 70) return 'Hot';
  if (score >= 40) return 'Warm';
  return 'Cold';
};
