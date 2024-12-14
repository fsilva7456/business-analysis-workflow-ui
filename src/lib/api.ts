import axios from 'axios';

const BASE_URLS = {
  competitorAnalysis: process.env.NEXT_PUBLIC_COMPETITOR_ANALYSIS_API || '',
  loyaltyProgram: process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_API || '',
};

export type Competitor = {
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketShare?: number;
};

export type MarketInsight = {
  trend: string;
  impact: string;
  recommendation: string;
};

export type CompetitorAnalysisResponse = {
  competitors: Competitor[];
  marketInsights: MarketInsight[];
};

export type LoyaltyObjective = {
  objective: string;
  metrics: string[];
  priority: 'high' | 'medium' | 'low';
};

export type LoyaltyRecommendation = {
  feature: string;
  description: string;
  benefits: string[];
  implementation: string;
};

export type LoyaltyProgramResponse = {
  objectives: LoyaltyObjective[];
  recommendations: LoyaltyRecommendation[];
};

export const analyzeCompetitors = async (businessName: string): Promise<CompetitorAnalysisResponse> => {
  try {
    const response = await axios.post(`${BASE_URLS.competitorAnalysis}/analyze`, {
      business_name: businessName,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error analyzing competitors');
    }
    throw error;
  }
};

export const getLoyaltyRecommendations = async (
  competitorData: CompetitorAnalysisResponse
): Promise<LoyaltyProgramResponse> => {
  try {
    const response = await axios.post(`${BASE_URLS.loyaltyProgram}/objectives`, {
      competitor_analysis: competitorData,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error getting loyalty recommendations');
    }
    throw error;
  }
};