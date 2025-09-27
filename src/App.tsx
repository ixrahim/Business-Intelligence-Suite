import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { BenchmarkingProvider, useBenchmarking } from './contexts';
import { CompanyDataForm, ProofVerificationForm } from './components/forms';
import { ProofResults } from './components/results';
import { Header } from './components/layout';
import { ErrorAlert } from './components/common';
import { CompanyMetrics } from './types';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              An unexpected error occurred. Please refresh the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AnonymousPercentileProofContent: React.FC = () => {
  const { currentProof, error, clearError, submitData, clearProof } = useBenchmarking();
  const [activeTab, setActiveTab] = useState<'submit' | 'verify'>('submit');

  const handleSubmit = async (data: CompanyMetrics): Promise<void> => {
    await submitData(data);
  };

  const handleNewSubmission = (): void => {
    clearProof();
    setActiveTab('submit');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <Header />

        {/* Global Error Display */}
        {error && (
          <ErrorAlert error={error} onDismiss={clearError} />
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'submit'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Submit Data
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'verify'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Verify Proof
          </button>
        </div>

        {/* Content */}
        <main>
          {activeTab === 'submit' && (
            <>
              {!currentProof ? (
                <CompanyDataForm onSubmit={handleSubmit} />
              ) : (
                <ProofResults 
                  proof={currentProof} 
                  onNewSubmission={handleNewSubmission}
                />
              )}
            </>
          )}

          {activeTab === 'verify' && (
            <ProofVerificationForm />
          )}
        </main>

        {/* Demo Note */}
        <footer className="mt-8 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
            <div className="flex items-center text-yellow-800">
              <Eye className="w-4 h-4 mr-2" />
              <span className="text-sm">
                <strong>Demo Mode:</strong> This uses simulated industry data. 
                Production version would use real encrypted submissions from participating companies.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BenchmarkingProvider>
        <AnonymousPercentileProofContent />
      </BenchmarkingProvider>
    </ErrorBoundary>
  );
};

export default App;