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

function parseCompetitorDetails(details: string): Array<{
  name: string;
  loyalty_program_description?: string;
  strengths?: string[];
  weaknesses?: string[];
}> {
  const competitors = [];
  const sections = details.split('**').filter(s => s.trim());
  
  let currentCompetitor: any = {};
  
  for (const section of sections) {
    if (section.includes('Market Position:')) {
      if (currentCompetitor.name) {
        competitors.push(currentCompetitor);
      }
      currentCompetitor = {
        name: section.split('\n')[0].trim(),
        strengths: [],
        weaknesses: []
      };
    }
    
    if (section.includes('Loyalty Program:')) {
      currentCompetitor.loyalty_program_description = section
        .split('Loyalty Program:')[1]
        .split('\n')[0]
        .trim();
    }

    if (section.includes('Strengths:')) {
      const strengths = section
        .split('Strengths:')[1]
        .split('\n')
        .filter(s => s.trim().startsWith('-'))
        .map(s => s.replace('-', '').trim());
      currentCompetitor.strengths.push(...strengths);
    }

    if (section.includes('Weaknesses:')) {
      const weaknesses = section
        .split('Weaknesses:')[1]
        .split('\n')
        .filter(s => s.trim().startsWith('-'))
        .map(s => s.replace('-', '').trim());
      currentCompetitor.weaknesses.push(...weaknesses);
    }
  }

  if (currentCompetitor.name) {
    competitors.push(currentCompetitor);
  }

  return competitors;
}

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
  
  // Parse competitor details to extract structured information
  const competitors = parseCompetitorDetails(competitorData.competitor_details);
  
  // Prepare request payload according to API schema
  const requestPayload = {
    company_name: competitorData.company_name,
    industry: competitorData.industry || 'Retail', // Default to Retail if not specified
    business_type: 'B2C', // Default to B2C
    customer_segments: ['General Consumers'], // Default segment
    competitors,
    current_loyalty_program: null,
    current_challenges: null,
    business_goals: null,
    max_tokens: 2000,
    temperature: 0.7
  };

  const { data } = await axios.post(
    `${API.loyalty}/api/v1/analyze-objectives`,
    requestPayload
  );
  
  return data;
};