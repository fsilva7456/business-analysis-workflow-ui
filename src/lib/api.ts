import axios from 'axios';

const ensureFullUrl = (url: string | undefined) => 
  !url ? '' : url.startsWith('http') ? url.replace(/\/$/, '') : `https://${url.replace(/\/$/, '')}`;

const API = {
  competitor: ensureFullUrl(process.env.NEXT_PUBLIC_COMPETITOR_ANALYSIS_API),
  loyalty: ensureFullUrl(process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_API)
};

export type CompetitorData = {
  company_name: string;
  industry?: string;
  main_competitors: string[];
  competitor_details: string;
  comparative_analysis: string;
};

export type LoyaltyData = {
  company_name: string;
  industry: string;
  business_type: string;
  objectives: Array<{ objective: string; rationale: string }>;
  metadata: { model: string; max_tokens: number; temperature: number };
};

export const analyzeCompetitors = async (businessName: string): Promise<CompetitorData> => {
  if (!API.competitor) throw new Error('Competitor API not configured');
  
  const { data } = await axios.post(`${API.competitor}/api/v1/competitor-analysis`, {
    company_name: businessName,
    include_loyalty_program: true
  });
  return data;
};

export const getLoyaltyRecommendations = async (competitorData: CompetitorData): Promise<LoyaltyData> => {
  if (!API.loyalty) throw new Error('Loyalty API not configured');
  
  const { data } = await axios.post(`${API.loyalty}/api/v1/analyze-objectives`, {
    company_name: competitorData.company_name,
    industry: competitorData.industry,
    competitor_analysis: competitorData
  });
  return data;
};