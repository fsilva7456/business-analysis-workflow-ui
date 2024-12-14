"use client";

import { useState } from 'react';
import { analyzeCompetitors, getLoyaltyRecommendations } from '../lib/api';
import BusinessForm from './BusinessForm';
import WorkflowResults from './WorkflowResults';
import WorkflowStatus from './WorkflowStatus';

type CompetitorInfo = {
  company_name: string;
  industry?: string;
  main_competitors: string[];
  competitor_details: string;
  comparative_analysis: string;
  analysis_includes_loyalty: boolean;
};

type LoyaltyInfo = {
  company_name: string;
  industry: string;
  business_type: string;
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

export type WorkflowData = {
  competitorAnalysis: CompetitorInfo | null;
  loyaltyProgram: LoyaltyInfo | null;
};

export default function BusinessAnalysisWorkflow() {
  console.log('Rendering BusinessAnalysisWorkflow');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);

  const handleSubmit = async (businessName: string) => {
    console.log('Starting analysis for:', businessName);
    setLoading(true);
    setError(null);
    setWorkflowData(null);
    
    try {
      // Step 1: Competitor Analysis
      setCurrentStep('competitor-analysis');
      const competitorData = await analyzeCompetitors(businessName);
      console.log('Competitor analysis completed:', competitorData);

      // Step 2: Loyalty Program Recommendations
      setCurrentStep('loyalty-program');
      const loyaltyData = await getLoyaltyRecommendations(competitorData);
      console.log('Loyalty analysis completed:', loyaltyData);
      
      const newData = {
        competitorAnalysis: competitorData,
        loyaltyProgram: loyaltyData
      };
      
      console.log('Setting workflow data:', newData);
      setWorkflowData(newData);
    } catch (err) {
      console.error('Error in workflow:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  };

  console.log('Current workflow data:', workflowData);

  return (
    <div className="space-y-8">
      <BusinessForm onSubmit={handleSubmit} loading={loading} />
      
      {(loading || currentStep) && (
        <WorkflowStatus 
          loading={loading}
          currentStep={currentStep}
        />
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {workflowData && (
        <div data-testid="workflow-results">
          <WorkflowResults data={workflowData} />
        </div>
      )}
    </div>
  );
}