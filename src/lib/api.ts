import axios from 'axios';

// Get the base URLs from environment variables
const COMPETITOR_API = process.env.NEXT_PUBLIC_COMPETITOR_ANALYSIS_API;
const LOYALTY_API = process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_API;

// Ensure URLs don't end with a slash
const BASE_URLS = {
  competitorAnalysis: COMPETITOR_API?.endsWith('/') ? COMPETITOR_API.slice(0, -1) : COMPETITOR_API,
  loyaltyProgram: LOYALTY_API?.endsWith('/') ? LOYALTY_API.slice(0, -1) : LOYALTY_API,
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

// Add CORS headers to the requests
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

export const analyzeCompetitors = async (businessName: string): Promise<CompetitorAnalysisResponse> => {
  if (!BASE_URLS.competitorAnalysis) {
    throw new Error('Competitor Analysis API URL not configured');
  }

  try {
    console.log('Making request to:', `${BASE_URLS.competitorAnalysis}/analyze`);
    const response = await axios.post(
      `${BASE_URLS.competitorAnalysis}/analyze`,
      { business_name: businessName },
      axiosConfig
    );
    return response.data;
  } catch (error) {
    console.error('Error analyzing competitors:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || `Error analyzing competitors: ${error.message}`);
    }
    throw error;
  }
};

export const getLoyaltyRecommendations = async (
  competitorData: CompetitorAnalysisResponse
): Promise<LoyaltyProgramResponse> => {
  if (!BASE_URLS.loyaltyProgram) {
    throw new Error('Loyalty Program API URL not configured');
  }

  try {
    console.log('Making request to:', `${BASE_URLS.loyaltyProgram}/objectives`);
    const response = await axios.post(
      `${BASE_URLS.loyaltyProgram}/objectives`,
      { competitor_analysis: competitorData },
      axiosConfig
    );
    return response.data;
  } catch (error) {
    console.error('Error getting loyalty recommendations:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || `Error getting loyalty recommendations: ${error.message}`);
    }
    throw error;
  }
};