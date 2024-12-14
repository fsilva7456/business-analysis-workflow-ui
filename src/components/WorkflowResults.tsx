"use client";

import { CompetitorAnalysisResponse, LoyaltyProgramResponse } from '../lib/api';

type WorkflowResultsProps = {
  results: {
    competitorAnalysis?: CompetitorAnalysisResponse;
    loyaltyProgram?: LoyaltyProgramResponse;
  };
};

export default function WorkflowResults({ results }: WorkflowResultsProps) {
  const { competitorAnalysis, loyaltyProgram } = results;

  return (
    <div className="space-y-6">
      {competitorAnalysis && (
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Competitor Analysis</h2>
          <div className="space-y-6">
            {competitorAnalysis.main_competitors && (
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
            {loyaltyProgram.objectives && loyaltyProgram.objectives.length > 0 && (
              <div className="space-y-4">
                {loyaltyProgram.objectives.map((objective, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Objective {index + 1}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Objective:</span><br />
                        {objective.objective}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Rationale:</span><br />
                        {objective.rationale}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {loyaltyProgram.metadata && (
              <div className="text-sm text-gray-500 mt-4">
                <p>Analysis performed using {loyaltyProgram.metadata.model}</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}