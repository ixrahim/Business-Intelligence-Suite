import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { APIError } from '../../../types';

interface ErrorAlertProps {
  error: APIError;
  onDismiss: () => void;
  className?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss, className = '' }) => (
  <div className={`bg-red-50 border border-red-200 rounded-lg p-4 mb-6 ${className}`}>
    <div className="flex items-start">
      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-medium text-red-900">{error.message}</h4>
        {error.details && (
          <p className="text-sm text-red-700 mt-1">
            {typeof error.details === 'string' ? error.details : JSON.stringify(error.details)}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-red-600 hover:text-red-800 ml-2"
        aria-label="Dismiss error"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);
