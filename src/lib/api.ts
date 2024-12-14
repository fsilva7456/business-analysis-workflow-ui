import axios from 'axios';

// Get the base URLs from environment variables
const COMPETITOR_API = process.env.NEXT_PUBLIC_COMPETITOR_ANALYSIS_API;
const LOYALTY_API = process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_API;

// Ensure URLs have protocol and no trailing slash
const ensureFullUrl = (url: string | undefined) => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const BASE_URLS = {
  competitorAnalysis: ensureFullUrl(COMPETITOR_API),
  loyaltyProgram: ensureFullUrl(LOYALTY_API),
};

// Log the configured URLs during initialization
console.log('API URLs:', {
  competitorAnalysis: BASE_URLS.competitorAnalysis,
  loyaltyProgram: BASE_URLS.loyaltyProgram
});

export type CompetitorAnalysisResponse = {
  company_name: string;
  industry?: string;
  main_competitors: string[];
  competitor_details: string;
  comparative_analysis: string;
  analysis_includes_loyalty: boolean;
};

export type LoyaltyProgramResponse = {
  company_name: string;
  industry?: string;
  business_type?: string;
  objectives: Array<{
    objective: string;
    rationale: string;
  }>;
  metadata: {
    model: string;
    max_tokens: number;
    temperature: number;
  };
};

export const analyzeCompetitors = async (businessName: string): Promise<CompetitorAnalysisResponse> => {
  const url = BASE_URLS.competitorAnalysis;
  if (!url) {
    throw new Error('Competitor Analysis API URL not configured');
  }

  try {
    const endpoint = '/api/v1/competitor-analysis';
    const fullUrl = `${url}${endpoint}`;
    
    console.log('Making competitor analysis request:', {
      url: fullUrl,
      payload: { company_name: businessName, include_loyalty_program: true }
    });
    
    const response = await axios.post(
      fullUrl,
      { 
        company_name: businessName,
        include_loyalty_program: true
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log('Competitor analysis response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error analyzing competitors:', error);
    if (axios.isAxiosError(error)) {
      const errorDetail = error.response?.data?.detail || error.message;
      throw new Error(`Error analyzing competitors: ${errorDetail}`);
    }
    throw error;
  }
};

export const getLoyaltyRecommendations = async (
  competitorData: CompetitorAnalysisResponse
): Promise<LoyaltyProgramResponse> => {
  const url = BASE_URLS.loyaltyProgram;
  if (!url) {
    throw new Error('Loyalty Program API URL not configured');
  }

  try {
    const endpoint = '/api/v1/analyze-objectives';
    const fullUrl = `${url}${endpoint}`;
    
    const requestPayload = {
      company_name: competitorData.company_name,
      industry: competitorData.industry,
      competitor_analysis: competitorData
    };

    console.log('Making loyalty analysis request:', {
      url: fullUrl,
      payload: requestPayload
    });

    const response = await axios.post(
      fullUrl,
      requestPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('Loyalty analysis response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting loyalty recommendations:', error);
    if (axios.isAxiosError(error)) {
      const errorDetail = error.response?.data?.detail || error.message;
      throw new Error(`Error getting loyalty recommendations: ${errorDetail}`);
    }
    throw error;
  }
};