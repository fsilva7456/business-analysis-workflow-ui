import axios from 'axios';

// Get the base URLs from environment variables
const COMPETITOR_API = process.env.NEXT_PUBLIC_COMPETITOR_ANALYSIS_API;
const LOYALTY_API = process.env.NEXT_PUBLIC_LOYALTY_PROGRAM_API;

// Ensure URLs don't end with a slash
const BASE_URLS = {
  competitorAnalysis: COMPETITOR_API?.endsWith('/') ? COMPETITOR_API.slice(0, -1) : COMPETITOR_API,
  loyaltyProgram: LOYALTY_API?.endsWith('/') ? LOYALTY_API.slice(0, -1) : LOYALTY_API,
};

export type CompetitorAnalysisResponse = {
  company_name: string;
  industry?: string;
  main_competitors: string[];
  competitor_details: string;
  comparative_analysis: string;
  analysis_includes_loyalty: boolean;
};

export type LoyaltyProgramResponse = {
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

// Add CORS headers to the requests
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const checkApiHealth = async () => {
  if (!BASE_URLS.competitorAnalysis) {
    throw new Error('Competitor Analysis API URL not configured');
  }

  try {
    const healthEndpoint = `${BASE_URLS.competitorAnalysis}/health`;
    console.log('Checking health at:', healthEndpoint);
    const response = await axios.get(healthEndpoint);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const analyzeCompetitors = async (businessName: string): Promise<CompetitorAnalysisResponse> => {
  if (!BASE_URLS.competitorAnalysis) {
    throw new Error('Competitor Analysis API URL not configured');
  }

  try {
    // First check if the API is accessible
    await checkApiHealth();

    // Try each potential endpoint format
    const endpoints = [
      '/api/v1/competitor-analysis',
      '/competitor-analysis',
      '/analyze'
    ];

    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        const url = `${BASE_URLS.competitorAnalysis}${endpoint}`;
        console.log('Attempting request to:', url);
        
        const response = await axios.post(
          url,
          { 
            company_name: businessName,
            include_loyalty_program: true
          },
          axiosConfig
        );
        
        console.log('Successful response from:', url);
        return response.data;
      } catch (error) {
        console.log(`Failed attempt to ${endpoint}:`, error);
        lastError = error;
      }
    }

    // If we get here, all attempts failed
    throw lastError;
  } catch (error) {
    console.error('Error analyzing competitors:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Error analyzing competitors: ${error.response?.data?.detail || error.message}`);
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