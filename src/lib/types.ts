// Common types used across the application

export type WorkflowStep = 'competitor-analysis' | 'loyalty-program';

export type WorkflowState = {
  loading: boolean;
  error: string | null;
  currentStep: WorkflowStep | null;
  results: WorkflowResults | null;
};

export type WorkflowResults = {
  competitorAnalysis?: CompetitorAnalysisData;
  loyaltyProgram?: LoyaltyProgramData;
};

export type CompetitorAnalysisData = {
  competitors: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
    marketShare?: number;
  }>;
  marketInsights: Array<{
    trend: string;
    impact: string;
    recommendation: string;
  }>;
};

export type LoyaltyProgramData = {
  objectives: Array<{
    objective: string;
    metrics: string[];
    priority: 'high' | 'medium' | 'low';
  }>;
  recommendations: Array<{
    feature: string;
    description: string;
    benefits: string[];
    implementation: string;
  }>;
};