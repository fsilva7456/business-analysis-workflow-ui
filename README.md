# Business Analysis Workflow UI

A React application that orchestrates API calls to analyze businesses using competitor analysis and generates loyalty program recommendations.

## Features

- Competitor Analysis Integration
- Loyalty Program Recommendations
- Modular Workflow Design
- Real-time Status Updates
- Responsive UI with Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and update the API URLs:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_COMPETITOR_ANALYSIS_API=your_competitor_api_url
NEXT_PUBLIC_LOYALTY_PROGRAM_API=your_loyalty_program_api_url
```

## Deployment

This application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Create a new project on Vercel
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

## API Integration

The application integrates with two APIs:

1. Competitor Analysis API
   - Endpoint: `/analyze`
   - Method: POST
   - Input: Business name

2. Loyalty Program API
   - Endpoint: `/objectives`
   - Method: POST
   - Input: Competitor analysis data

## Adding New Workflow Steps

To add new API integrations to the workflow:

1. Add new API endpoint in `src/lib/api.ts`
2. Create new types in `src/lib/types.ts`
3. Add new step in `WorkflowStatus.tsx`
4. Update `BusinessAnalysisWorkflow.tsx` to include the new step
5. Add new section in `WorkflowResults.tsx` to display results

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request