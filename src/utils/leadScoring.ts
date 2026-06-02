export type LeadScoringParams = {
  budget?: string;
  value?: number;
  timeline?: string;
  urgency?: string;
  complexity?: string; // e.g. High, Medium, Low
  featuresCount?: number;
  hasCompany?: boolean;
  industry?: string;
  projectType?: string;
  completionRate?: number; // 0 to 1
};

export const calculateLeadScore = (params: LeadScoringParams): number => {
  let score = 10; // Initial baseline

  // 1. Industry Premium Factor (Max 15pts)
  if (params.industry) {
    const ind = params.industry.toLowerCase();
    if (['finance', 'healthcare', 'real estate', 'corporate'].some(w => ind.includes(w))) {
      score += 15;
    } else if (['ecommerce', 'saas', 'startup', 'hotel'].some(w => ind.includes(w))) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // 2. Budget Range Scoring (Max 25pts)
  if (params.budget) {
    const bud = params.budget.toLowerCase();
    if (bud.includes('50k')) {
      score += 25;
    } else if (bud.includes('15k') || bud.includes('50k')) {
      score += 18;
    } else if (bud.includes('5k')) {
      score += 10;
    } else if (bud.includes('1k')) {
      score += 3;
    }
  } else if (params.value) {
    const val = params.value;
    if (val >= 50000) score += 25;
    else if (val >= 15000) score += 18;
    else if (val >= 5000) score += 10;
    else if (val > 0) score += 3;
  }

  // 3. Timeline / Urgency (Max 20pts)
  if (params.timeline || params.urgency) {
    const time = (params.timeline || params.urgency || '').toLowerCase();
    if (time.includes('urgent') || time.includes('asap') || time.includes('immediately')) {
      score += 20;
    } else if (time.includes('1 month')) {
      score += 15;
    } else if (time.includes('2-3') || time.includes('3 months') || time.includes('medium')) {
      score += 10;
    } else if (time.includes('6 months') || time.includes('flexible') || time.includes('low')) {
      score += 5;
    }
  }

  // 4. Complexity & Scope Weight (Max 15pts)
  if (params.projectType) {
    const pType = params.projectType.toLowerCase();
    if (['erp', 'marketplace', 'booking system', 'booking_system'].some(w => pType.includes(w))) {
      score += 15;
    } else if (['crm', 'saas', 'mobile app', 'internal platform'].some(w => pType.includes(w))) {
      score += 10;
    } else {
      score += 5;
    }
  } else if (params.complexity) {
    const comp = params.complexity.toLowerCase();
    if (comp.includes('high') || comp.includes('enterprise')) {
      score += 15;
    } else if (comp.includes('medium')) {
      score += 10;
    } else if (comp.includes('low')) {
      score += 5;
    }
  }

  // 5. Scope Engagement (Max 15pts)
  const featCount = params.featuresCount || 0;
  if (featCount >= 5) {
    score += 15;
  } else if (featCount >= 3) {
    score += 10;
  } else if (featCount > 0) {
    score += 5;
  }

  // 6. Funnel Completion Progress (Max 10pts)
  if (params.completionRate !== undefined) {
    score += Math.round(params.completionRate * 10);
  } else if (params.hasCompany) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
};

export const getLeadStatus = (score: number): 'Hot' | 'Warm' | 'Cold' => {
  if (score >= 70) return 'Hot';
  if (score >= 40) return 'Warm';
  return 'Cold';
};

