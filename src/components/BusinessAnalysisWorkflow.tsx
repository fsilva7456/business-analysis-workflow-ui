"use client";

import { useState } from 'react';
import { analyzeCompetitors, getLoyaltyRecommendations, type CompetitorData, type LoyaltyData } from '../lib/api';

type WorkflowData = {
  competitor: CompetitorData | null;
  loyalty: LoyaltyData | null;
};

const BusinessForm = ({ onSubmit, loading }: { onSubmit: (name: string) => void; loading: boolean }) => {
  const [name, setName] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); name && onSubmit(name); }}
          className="bg-white p-6 rounded-lg shadow">
      <input type="text" value={name} onChange={e => setName(e.target.value)}
             placeholder="Enter business name" disabled={loading}
             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4" />
      <button type="submit" disabled={loading || !name.trim()}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Analyzing...' : 'Analyze Business'}
      </button>
    </form>
  );
};

const ResultsDisplay = ({ data }: { data: WorkflowData }) => {
  const { competitor, loyalty } = data;
  if (!competitor || !loyalty) return null;

  return (
    <div className="space-y-6">
      {/* Competitor Analysis */}
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Competitor Analysis</h2>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Main Competitors</h3>
          <ul className="list-disc list-inside space-y-1">
            {competitor.main_competitors.map((name, i) => (
              <li key={i} className="text-gray-700">{name}</li>
            ))}
          </ul>
        </div>

        {competitor.competitor_details && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Analysis</h3>
            <div className="whitespace-pre-wrap text-gray-700">
              {competitor.competitor_details}
            </div>
          </div>
        )}
      </section>

      {/* Loyalty Program */}
      <section className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Loyalty Program Recommendations</h2>
        
        <div className="space-y-4">
          {loyalty.objectives.map((obj, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Objective {i + 1}</h3>
              <p className="text-gray-700">{obj.objective}</p>
              {obj.rationale && obj.rationale !== 'Not provided' && (
                <div className="mt-2 pl-4 border-l-2 border-gray-200">
                  <p className="text-sm text-gray-600">{obj.rationale}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default function BusinessAnalysisWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WorkflowData | null>(null);

  const handleSubmit = async (businessName: string) => {
    setLoading(true);
    setError(null);
    try {
      const competitor = await analyzeCompetitors(businessName);
      const loyalty = await getLoyaltyRecommendations(competitor);
      setData({ competitor, loyalty });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <BusinessForm onSubmit={handleSubmit} loading={loading} />
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
      {data && <ResultsDisplay data={data} />}
    </div>
  );
}