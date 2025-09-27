import React from 'react';
import { EyeOff, TrendingUp, Shield } from 'lucide-react';
import { CompanyMetrics } from '../../../types';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useBenchmarking } from '../../../contexts/BenchmarkingContext/BenchmarkingContext';
import { Button } from '../../common/Button/Button';
import { ErrorAlert } from '../../common/ErrorAlert/ErrorAlert';
import { INDUSTRIES } from '../../../utils/constants';

interface CompanyDataFormProps {
  onSubmit: (data: CompanyMetrics) => void;
  initialData?: Partial<CompanyMetrics>;
}

export const CompanyDataForm: React.FC<CompanyDataFormProps> = ({ 
  onSubmit, 
  initialData = {} 
}) => {
  const { isLoading, error, clearError } = useBenchmarking();
  const { data, errors, validate, updateField } = useFormValidation({
    revenue: 0,
    employees: 0,
    industry: '',
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(data as CompanyMetrics);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <EyeOff className="w-6 h-6 mr-2 text-purple-600" />
        Submit Your Private Data
      </h2>
      
      {error && <ErrorAlert error={error} onDismiss={clearError} />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <select 
            value={data.industry || ''}
            onChange={(e) => updateField('industry', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.industry ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          >
            {INDUSTRIES.map(industry => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="text-red-600 text-sm mt-1">{errors.industry}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Revenue (USD)
          </label>
          <input
            type="number"
            value={data.revenue || ''}
            onChange={(e) => updateField('revenue', parseInt(e.target.value) || 0)}
            placeholder="e.g., 50000000"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.revenue ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.revenue && (
            <p className="text-red-600 text-sm mt-1">{errors.revenue}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Employees
          </label>
          <input
            type="number"
            value={data.employees || ''}
            onChange={(e) => updateField('employees', parseInt(e.target.value) || 0)}
            placeholder="e.g., 200"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.employees ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.employees && (
            <p className="text-red-600 text-sm mt-1">{errors.employees}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">Privacy Guarantee</h4>
              <p className="text-sm text-blue-700 mt-1">
                Your exact numbers are encrypted using zero-knowledge proofs. 
                Only your percentile ranking will be revealed - never your actual data.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Generating Proof...' : 'Generate Anonymous Proof'}
          {!isLoading && <TrendingUp className="w-5 h-5 ml-2" />}
        </Button>
      </form>
    </div>
  );
};