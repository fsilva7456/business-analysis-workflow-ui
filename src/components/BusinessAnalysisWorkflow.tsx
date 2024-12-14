"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { analyzeCompetitors, getLoyaltyRecommendations, type CompetitorData, type LoyaltyData } from '../lib/api';

type WorkflowData = {
  competitor: CompetitorData | null;
  loyalty: LoyaltyData | null;
};

const Steps = ({ currentStep }: { currentStep: number }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center">
      {[
        { num: 1, title: "Business Info" },
        { num: 2, title: "Competitor Analysis" },
        { num: 3, title: "Loyalty Program" }
      ].map(({ num, title }) => (
        <div key={num} className="flex items-center">
          <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
            currentStep > num ? "bg-green-500" :
            currentStep === num ? "bg-blue-500" : "bg-gray-200"
          } text-white`}>
            {currentStep > num ? <CheckCircle2 className="h-6 w-6" /> : num}
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-gray-500">
              {currentStep > num ? "Completed" : 
               currentStep === num ? "In Progress" : "Pending"}
            </p>
          </div>
          {num < 3 && (
            <ChevronRight className="mx-4 text-gray-400" />
          )}
        </div>
      ))}
    </div>
  </div>
);

const QuickStats = ({ data }: { data: WorkflowData }) => {
  if (!data.competitor) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Market Position</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Top Market</div>
          <p className="text-xs text-gray-500">Based on analysis</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Competitor Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.competitor.main_competitors.length}</div>
          <p className="text-xs text-gray-500">Direct competitors</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Loyalty Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.loyalty?.objectives.length || 0}</div>
          <p className="text-xs text-gray-500">Recommended objectives</p>
        </CardContent>
      </Card>
    </div>
  );
};

const ResultsDisplay = ({ data }: { data: WorkflowData }) => {
  const { competitor, loyalty } = data;
  if (!competitor || !loyalty) return null;

  const marketData = [
    { month: 'Jan', marketShare: 25, competitors: competitor.main_competitors.length },
    { month: 'Feb', marketShare: 28, competitors: competitor.main_competitors.length },
    { month: 'Mar', marketShare: 32, competitors: competitor.main_competitors.length },
    { month: 'Apr', marketShare: 35, competitors: competitor.main_competitors.length },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="marketShare" stroke="#2563eb" />
                  <Line yAxisId="right" type="monotone" dataKey="competitors" stroke="#16a34a" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Direct Competitors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {competitor.main_competitors.map((comp, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{comp}</span>
                      <span className="text-sm text-gray-500">Competitor {index + 1}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm">
                  {competitor.competitor_details}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="loyalty">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Program Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function BusinessAnalysisWorkflow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WorkflowData | null>(null);
  const [step, setStep] = useState(1);

  const handleSubmit = async (businessName: string) => {
    setLoading(true);
    setError(null);
    setStep(2);
    try {
      const competitor = await analyzeCompetitors(businessName);
      setStep(3);
      const loyalty = await getLoyaltyRecommendations(competitor);
      setData({ competitor, loyalty });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep(1);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <Steps currentStep={step} />
      
      <form onSubmit={(e) => { e.preventDefault(); const form = e.target as HTMLFormElement; const formData = new FormData(form); handleSubmit(formData.get('businessName') as string); }}
            className="bg-white p-6 rounded-lg shadow">
        <input type="text" name="businessName" placeholder="Enter business name" disabled={loading}
               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4" required />
        <button type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Analyzing...' : 'Analyze Business'}
        </button>
      </form>
      
      {loading && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis in Progress</AlertTitle>
          <AlertDescription>
            Analyzing business data and generating insights. This may take a few moments.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {data && (
        <>
          <QuickStats data={data} />
          <ResultsDisplay data={data} />
        </>
      )}
    </div>
  );
}