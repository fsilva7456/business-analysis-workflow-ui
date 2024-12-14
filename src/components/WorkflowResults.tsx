"use client";

import type { WorkflowData } from './BusinessAnalysisWorkflow';

type Props = {
  data: WorkflowData;
};

export default function WorkflowResults({ data }: Props) {
  console.log('WorkflowResults received data:', JSON.stringify(data, null, 2));
  
  if (!data) {
    console.log('No data provided to WorkflowResults');
    return null;
  }

  const { competitorAnalysis, loyaltyProgram } = data;

  const renderCompetitorSection = () => {
    if (!competitorAnalysis) {
      console.log('No competitor analysis data available');
      return null;
    }

    console.log('Rendering competitor analysis section with:', 
      JSON.stringify(competitorAnalysis, null, 2));

    return (
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

          {/* Competitors List - with explicit null check */}
          {Array.isArray(competitorAnalysis.main_competitors) && (
            <div>
              <h3 className="text-lg font-medium text-gray-900">Main Competitors</h3>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                {competitorAnalysis.main_competitors.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {competitorAnalysis.main_competitors.map((competitor, index) => {
                      console.log('Rendering competitor:', competitor, 'at index:', index);
                      return (
                        <li key={index} className="text-gray-700">
                          {competitor}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500">No competitors listed</p>
                )}
              </div>
            </div>
          )}

          {/* Analysis */}
          {competitorAnalysis.competitor_details && (
            <div>
              <h3 className="text-lg font-medium text-gray-900">Detailed Analysis</h3>
              <div className="mt-2 bg-gray-50 p-4 rounded-md overflow-auto">
                <div className="whitespace-pre-wrap text-gray-700">
                  {competitorAnalysis.competitor_details}
                </div>
              </div>
            </div>
          )}

          {competitorAnalysis.comparative_analysis && (
            <div>
              <h3 className="text-lg font-medium text-gray-900">Comparative Analysis</h3>
              <div className="mt-2 bg-gray-50 p-4 rounded-md overflow-auto">
                <div className="whitespace-pre-wrap text-gray-700">
                  {competitorAnalysis.comparative_analysis}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderLoyaltySection = () => {
    if (!loyaltyProgram) {
      console.log('No loyalty program data available');
      return null;
    }

    console.log('Rendering loyalty program section with:', 
      JSON.stringify(loyaltyProgram, null, 2));

    return (
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Loyalty Program Recommendations</h2>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Program Context</h3>
            <div className="mt-2 bg-gray-50 p-4 rounded-md">
              <p><strong>Company:</strong> {loyaltyProgram.company_name}</p>
              <p><strong>Industry:</strong> {loyaltyProgram.industry}</p>
              <p><strong>Business Type:</strong> {loyaltyProgram.business_type}</p>
            </div>
          </div>

          {/* Objectives - with explicit null check */}
          {Array.isArray(loyaltyProgram.objectives) && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Recommended Objectives</h3>
              {loyaltyProgram.objectives.length > 0 ? (
                loyaltyProgram.objectives.map((objective, index) => {
                  console.log('Rendering objective:', objective, 'at index:', index);
                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium text-gray-900">
                        Objective {index + 1}
                      </h4>
                      <div className="mt-2 space-y-2">
                        <p className="text-gray-700">{objective.objective}</p>
                        {objective.rationale && objective.rationale !== 'Not provided' && (
                          <div className="mt-2 pl-4 border-l-2 border-gray-200">
                            <p className="text-sm text-gray-600 font-medium">Rationale:</p>
                            <p className="text-gray-700">{objective.rationale}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No objectives available</p>
              )}
            </div>
          )}

          {/* Metadata */}
          {loyaltyProgram.metadata && (
            <div className="text-sm text-gray-500 mt-4 p-4 bg-gray-50 rounded-md">
              <p><strong>Analysis Details</strong></p>
              <p>Model: {loyaltyProgram.metadata.model}</p>
              <p>Temperature: {loyaltyProgram.metadata.temperature}</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-6" data-testid="results-container">
      {renderCompetitorSection()}
      {renderLoyaltySection()}
    </div>
  );
}