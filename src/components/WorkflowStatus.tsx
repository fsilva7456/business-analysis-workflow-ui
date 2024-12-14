type WorkflowStatusProps = {
  loading: boolean;
  currentStep: string | null;
};

export default function WorkflowStatus({ loading, currentStep }: WorkflowStatusProps) {
  const steps = [
    { id: 'competitor-analysis', name: 'Competitor Analysis' },
    { id: 'loyalty-program', name: 'Loyalty Program Recommendations' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full 
                ${currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {index + 1}
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">{step.name}</span>
            {index < steps.length - 1 && (
              <div className="ml-4 flex-1 h-0.5 bg-gray-200" />
            )}
          </div>
        ))}
      </div>
      {loading && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Processing {currentStep === 'competitor-analysis' ? 'competitor analysis' : 'loyalty program recommendations'}...
        </div>
      )}
    </div>
  );
}