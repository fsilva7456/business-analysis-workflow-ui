"use client";

import { useState } from 'react';
import { analyzeCompetitors, getLoyaltyRecommendations } from '../lib/api';
import BusinessForm from './BusinessForm';
import WorkflowResults from './WorkflowResults';
import WorkflowStatus from './WorkflowStatus';

export default function BusinessAnalysisWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [results, setResults] = useState<{
    competitorAnalysis?: any;
    loyaltyProgram?: any;
  } | null>(null);

  const handleSubmit = async (businessName: string) => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      // Step 1: Competitor Analysis
      setCurrentStep('competitor-analysis');
      const competitorData = await analyzeCompetitors(businessName);
      console.log('Got competitor data:', competitorData);

      // Step 2: Loyalty Program Recommendations
      setCurrentStep('loyalty-program');
      const loyaltyData = await getLoyaltyRecommendations(competitorData);
      console.log('Got loyalty data:', loyaltyData);
      
      setResults({
        competitorAnalysis: competitorData,
        loyaltyProgram: loyaltyData,
      });
    } catch (err) {
      console.error('Workflow error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  };

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
      
      {results && <WorkflowResults results={results} />}
    </div>
  );
}