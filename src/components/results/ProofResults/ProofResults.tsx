import React, { useState } from 'react';
import { CheckCircle, Shield, Copy } from 'lucide-react';
import { PercentileProof } from '../../../types';
import { PercentileDisplay } from '../PercentileDisplay/PercentileDisplay';
import { Button } from '../../common/Button/Button';

interface ProofResultsProps {
  proof: PercentileProof;
  onNewSubmission?: () => void;
}

export const ProofResults: React.FC<ProofResultsProps> = ({ proof, onNewSubmission }) => {
  const [copied, setCopied] = useState(false);

  const copyProofHash = async () => {
    try {
      await navigator.clipboard.writeText(proof.proofHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy proof hash:', err);
    }
  };

  const colors = [
    'from-purple-50 to-blue-50',
    'from-green-50 to-teal-50',
    'from-orange-50 to-red-50',
    'from-pink-50 to-purple-50'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
        Your Anonymous Performance Proof
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {proof.results.map((result, index) => (
          <PercentileDisplay 
            key={result.metric} 
            result={result} 
            color={colors[index % colors.length]}
          />
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h4 className="font-semibold mb-3 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Cryptographic Proof Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Proof Hash:</span>
            <div className="font-mono bg-white p-2 rounded border mt-1 break-all flex items-center justify-between">
              <span className="truncate">{proof.proofHash}</span>
              <button
                onClick={copyProofHash}
                className="ml-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
                title="Copy proof hash"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <span className="text-green-600 text-xs">Copied to clipboard!</span>
            )}
          </div>
          <div>
            <span className="text-gray-500">Generated:</span>
            <div className="font-mono bg-white p-2 rounded border mt-1">
              {new Date(proof.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          This proof can be verified by third parties without revealing your actual metrics.
          <br />
          Powered by Midnight Network's zero-knowledge infrastructure.
        </div>
      </div>

      {onNewSubmission && (
        <div className="flex gap-4">
          <Button 
            variant="secondary"
            onClick={onNewSubmission}
            className="flex-1"
          >
            Submit Another Company
          </Button>
          <Button className="flex-1">
            Share Proof
          </Button>
        </div>
      )}
    </div>
  );
};