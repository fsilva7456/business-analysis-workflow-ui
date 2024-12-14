import BusinessAnalysisWorkflow from '@/components/BusinessAnalysisWorkflow';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Business Analysis Workflow</h1>
        <BusinessAnalysisWorkflow />
      </div>
    </main>
  );
}
