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

            <div>
              <h3 className="text-lg font-medium text-gray-900">Detailed Analysis</h3>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-gray-700">
                  {competitorAnalysis.competitor_details}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Comparative Analysis</h3>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-gray-700">
                  {competitorAnalysis.comparative_analysis}
                </pre>
              </div>
            </div>
          </div>
        </section>
      )}

      {loyaltyProgram && (
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Loyalty Program Recommendations</h2>
          <div className="space-y-6">
            {loyaltyProgram.objectives && loyaltyProgram.objectives.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Program Objectives</h3>
                <div className="mt-2 space-y-4">
                  {loyaltyProgram.objectives.map((objective, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium text-gray-900">{objective.objective}</h4>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {objective.priority} priority
                        </span>
                      </div>
                      <ul className="mt-2 list-disc list-inside space-y-1">
                        {objective.metrics.map((metric, idx) => (
                          <li key={idx} className="text-gray-700">{metric}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {loyaltyProgram.recommendations && loyaltyProgram.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Specific Recommendations</h3>
                <div className="mt-2 space-y-4">
                  {loyaltyProgram.recommendations.map((recommendation, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-medium text-gray-900">{recommendation.feature}</h4>
                      <p className="mt-1 text-gray-700">{recommendation.description}</p>
                      <h5 className="mt-2 font-medium text-gray-900">Benefits:</h5>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {recommendation.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-gray-700">{benefit}</li>
                        ))}
                      </ul>
                      <h5 className="mt-2 font-medium text-gray-900">Implementation:</h5>
                      <p className="mt-1 text-gray-700">{recommendation.implementation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}