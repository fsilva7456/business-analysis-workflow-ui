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

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const checkApiHealth = async () => {
  const url = BASE_URLS.competitorAnalysis;
  if (!url) {
    throw new Error('Competitor Analysis API URL not configured');
  }

  try {
    const healthEndpoint = `${url}/health`;
    console.log('Checking health at:', healthEndpoint);
    const response = await axios.get(healthEndpoint);
    console.log('Health check response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const analyzeCompetitors = async (businessName: string): Promise<CompetitorAnalysisResponse> => {
  const url = BASE_URLS.competitorAnalysis;
  if (!url) {
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
        const fullUrl = `${url}${endpoint}`;
        console.log('Attempting request to:', fullUrl);
        
        const response = await axios.post(
          fullUrl,
          { 
            company_name: businessName,
            include_loyalty_program: true
          },
          axiosConfig
        );
        
        console.log('Successful response from:', fullUrl);
        return response.data;
      } catch (error) {
        console.log(`Failed attempt to ${endpoint}:`, error);
        lastError = error;
        // Add a small delay before trying the next endpoint
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    throw lastError;
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
    const fullUrl = `${url}/objectives`;
    console.log('Making request to:', fullUrl);
    const response = await axios.post(
      fullUrl,
      { competitor_analysis: competitorData },
      axiosConfig
    );
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