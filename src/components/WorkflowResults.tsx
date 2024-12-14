"use client";

import { CompetitorAnalysisResponse, LoyaltyProgramResponse } from '../lib/api';

type WorkflowResultsProps = {
  results: {
    competitorAnalysis?: CompetitorAnalysisResponse;
    loyaltyProgram?: LoyaltyProgramResponse;
  };
};

export default function WorkflowResults({ results }: WorkflowResultsProps) {
  console.log('Rendering WorkflowResults with:', JSON.stringify(results, null, 2));
  
  if (!results) {
    console.log('No results to display');
    return null;
  }

  const { competitorAnalysis, loyaltyProgram } = results;

  return (
    <div className="space-y-6">
      {competitorAnalysis && (
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Competitor Analysis</h2>
          
          <div className="space-y-6">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <p><strong>Company:</strong> {competitorAnalysis.company_name}</p>
                <p><strong>Industry:</strong> {competitorAnalysis.industry || 'Not specified'}</p>
              </div>
            </div>

            {/* Competitors List */}
            {Array.isArray(competitorAnalysis.main_competitors) && competitorAnalysis.main_competitors.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Main Competitors</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <ul className="list-disc list-inside space-y-1">
                    {competitorAnalysis.main_competitors.map((competitor, index) => (
                      <li key={index} className="text-gray-700">{competitor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Detailed Analysis */}
            {competitorAnalysis.competitor_details && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Detailed Analysis</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-gray-700 overflow-auto">
                    {competitorAnalysis.competitor_details}
                  </pre>
                </div>
              </div>
            )}

            {/* Comparative Analysis */}
            {competitorAnalysis.comparative_analysis && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Comparative Analysis</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-gray-700 overflow-auto">
                    {competitorAnalysis.comparative_analysis}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {loyaltyProgram && (
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Loyalty Program Recommendations</h2>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">Program Context</h3>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <p><strong>Company:</strong> {loyaltyProgram.company_name}</p>
                <p><strong>Industry:</strong> {loyaltyProgram.industry || 'Not specified'}</p>
                <p><strong>Business Type:</strong> {loyaltyProgram.business_type}</p>
              </div>
            </div>

            {/* Objectives */}
            {Array.isArray(loyaltyProgram.objectives) && loyaltyProgram.objectives.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Recommended Objectives</h3>
                {loyaltyProgram.objectives.map((objective, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium text-gray-900">
                      Objective {index + 1}
                    </h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Objective:</span><br />
                        {objective.objective}
                      </p>
                      {objective.rationale && (
                        <p className="text-gray-700">
                          <span className="font-medium">Rationale:</span><br />
                          {objective.rationale}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Metadata */}
            {loyaltyProgram.metadata && (
              <div className="text-sm text-gray-500 mt-4 p-4 bg-gray-50 rounded-md">
                <p><strong>Analysis Details:</strong></p>
                <p>Model: {loyaltyProgram.metadata.model}</p>
                <p>Max Tokens: {loyaltyProgram.metadata.max_tokens}</p>
                <p>Temperature: {loyaltyProgram.metadata.temperature}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}