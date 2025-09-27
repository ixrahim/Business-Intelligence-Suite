import React from 'react';
import { BenchmarkResult } from '../../../types';

interface PercentileDisplayProps {
  result: BenchmarkResult;
  color: string;
}

export const PercentileDisplay: React.FC<PercentileDisplayProps> = ({ result, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-lg p-6`}>
    <h3 className="text-lg font-semibold mb-3 text-gray-800 capitalize">
      {result.metric.replace('_', ' ')} Percentile
    </h3>
    <div className="text-4xl font-bold text-purple-600 mb-2">
      {result.percentile}th
    </div>
    <p className="text-gray-600 mb-4">
      You outperform {result.percentile}% of companies in your industry
    </p>
    <div className="bg-white bg-opacity-60 rounded p-3">
      <div className="text-xs text-gray-500 mb-1">Percentile Range</div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
          style={{width: `${result.percentile}%`}}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Sample size: {result.sampleSize} companies
      </div>
    </div>
  </div>
);