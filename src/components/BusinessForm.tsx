"use client";

import { useState } from 'react';

type BusinessFormProps = {
  onSubmit: (businessName: string) => void;
  loading: boolean;
};

export default function BusinessForm({ onSubmit, loading }: BusinessFormProps) {
  const [businessName, setBusinessName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessName.trim()) {
      onSubmit(businessName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
          Business Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter business name"
            disabled={loading}
            required
          />
        </div>
      </div>
      
      <div className="mt-4">
        <button
          type="submit"
          disabled={loading || !businessName.trim()}
          className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze Business'}
        </button>
      </div>
    </form>
  );
}