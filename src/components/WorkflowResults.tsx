"use client";

type WorkflowResultsProps = {
  results: {
    competitorAnalysis?: any;
    loyaltyProgram?: any;
  };
};

export default function WorkflowResults({ results }: WorkflowResultsProps) {
  const { competitorAnalysis, loyaltyProgram } = results;

  return (
    <div className="space-y-6">
      {competitorAnalysis && (
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Competitor Analysis</h2>
          <div className="space-y-4">
            {competitorAnalysis.competitors && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Key Competitors</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(competitorAnalysis.competitors, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {competitorAnalysis.marketInsights && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Market Insights</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(competitorAnalysis.marketInsights, null, 2)}
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
          <div className="space-y-4">
            {loyaltyProgram.objectives && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Program Objectives</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(loyaltyProgram.objectives, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {loyaltyProgram.recommendations && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Specific Recommendations</h3>
                <div className="mt-2 bg-gray-50 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(loyaltyProgram.recommendations, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}