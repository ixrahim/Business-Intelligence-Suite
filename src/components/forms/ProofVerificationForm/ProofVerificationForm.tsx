import React, { useState } from 'react';
import { Eye, ExternalLink, CheckCircle } from 'lucide-react';
import { useBenchmarking } from '../../../contexts/BenchmarkingContext/BenchmarkingContext';
import { PercentileProof } from '../../../types';
import { Button } from '../../common/Button/Button';
import { ErrorAlert } from '../../common/ErrorAlert/ErrorAlert';
import { LoadingSpinner } from '../../common/LoadingSpinner/LoadingSpinner';

export const ProofVerificationForm: React.FC = () => {
  const { verifyProof, isLoading, error, clearError } = useBenchmarking();
  const [proofHash, setProofHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<PercentileProof | null>(null);
  const [localError, setLocalError] = useState<string>('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setVerificationResult(null);

    if (!proofHash.trim()) {
      setLocalError('Please enter a proof hash');
      return;
    }

    const result = await verifyProof(proofHash.trim());
    if (result) {
      setVerificationResult(result);
    } else {
      setLocalError('Invalid proof hash or verification failed');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Eye className="w-6 h-6 mr-2 text-blue-600" />
        Verify Third-Party Proof
      </h2>

      {error && <ErrorAlert error={error} onDismiss={clearError} />}

      <form onSubmit={handleVerify} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proof Hash
          </label>
          <input
            type="text"
            value={proofHash}
            onChange={(e) => setProofHash(e.target.value)}
            placeholder="zk_proof_abc123..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          {localError && (
            <p className="text-red-600 text-sm mt-1">{localError}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !proofHash.trim()}
          loading={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        >
          {isLoading ? 'Verifying...' : 'Verify Proof'}
          {!isLoading && <ExternalLink className="w-5 h-5 ml-2" />}
        </Button>
      </form>

      {isLoading && (
        <LoadingSpinner message="Verifying proof..." />
      )}

      {verificationResult && (
        <div className="border-t pt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900">Proof Verification Results</h4>
                <div className="mt-3 space-y-2">
                  {verificationResult.results.map(result => (
                    <div key={result.metric} className="flex justify-between items-center">
                      <span className="text-sm text-green-700 capitalize">
                        {result.metric.replace('_', ' ')}:
                      </span>
                      <span className="font-medium text-green-900">
                        {result.percentile}th percentile
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-sm text-green-700">
                    🔒 <strong>What's Hidden:</strong> Exact metrics, company identity
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    🔍 <strong>What's Proven:</strong> Percentile rankings, industry membership
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};