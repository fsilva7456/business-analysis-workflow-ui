"use client";

import { useState } from 'react';
import { analyzeCompetitors, getLoyaltyRecommendations } from '../lib/api';
import BusinessForm from './BusinessForm';
import WorkflowResults from './WorkflowResults';
import WorkflowStatus from './WorkflowStatus';

export type CompetitorAnalysisData = {
  company_name: string;
  industry?: string;
  main_competitors: string[];
  competitor_details: string;
  comparative_analysis: string;
  analysis_includes_loyalty: boolean;
};

export type LoyaltyProgramData = {
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
  competitorAnalysis: CompetitorAnalysisData | null;
  loyaltyProgram: LoyaltyProgramData | null;
};

function safeStringify(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return `Error stringifying object: ${error}`;
  }
}

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
      console.log('Raw competitor data:', safeStringify(competitorData));

      // Step 2: Loyalty Program Recommendations
      setCurrentStep('loyalty-program');
      const loyaltyData = await getLoyaltyRecommendations(competitorData);
      console.log('Raw loyalty data:', safeStringify(loyaltyData));
      
      // Construct and validate the workflow data
      const newData: WorkflowData = {
        competitorAnalysis: competitorData,
        loyaltyProgram: loyaltyData
      };
      
      console.log('Setting workflow data:', safeStringify(newData));
      setWorkflowData(newData);
    } catch (err) {
      console.error('Error in workflow:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  };

  // Debug output for current state
  console.log('Current state:', {
    loading,
    error,
    currentStep,
    hasWorkflowData: !!workflowData,
    workflowData: safeStringify(workflowData)
  });

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
        <div className="mt-8">
          <WorkflowResults 
            data={workflowData} 
            key={Date.now()} // Force re-render with new data
          />
        </div>
      )}
    </div>
  );
}