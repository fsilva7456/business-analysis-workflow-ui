import axios from 'axios';

export type CompetitorData = {
  main_competitors: string[];
  competitor_details: string;
};

export type LoyaltyObjective = {
  objective: string;
  rationale?: string;
};

export type LoyaltyData = {
  objectives: LoyaltyObjective[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const COMPETITOR_API = process.env.NEXT_PUBLIC_COMPETITOR_ANALYSIS_API || '';
const LOYALTY_API = process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_API || '';

export async function analyzeCompetitors(businessName: string): Promise<CompetitorData> {
  try {
    const response = await axios.post(`${COMPETITOR_API}/analyze`, { business_name: businessName });
    return response.data;
  } catch (error) {
    throw new Error('Failed to analyze competitors');
  }
}

export async function getLoyaltyRecommendations(competitorData: CompetitorData): Promise<LoyaltyData> {
  try {
    const response = await axios.post(`${LOYALTY_API}/objectives`, competitorData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to get loyalty recommendations');
  }
}
