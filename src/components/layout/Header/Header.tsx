import React from 'react';
import { Shield } from 'lucide-react';

export const Header: React.FC = () => (
  <header className="text-center mb-8">
    <div className="flex items-center justify-center mb-4">
      <Shield className="w-8 h-8 text-purple-600 mr-2" />
      <h1 className="text-3xl font-bold text-gray-900">Confidential BI Suite</h1>
    </div>
    <p className="text-lg text-gray-600">Prove your performance without revealing your numbers</p>
    <div className="mt-4 bg-purple-100 rounded-lg p-3 inline-block">
      <span className="text-sm font-medium text-purple-800">
        Powered by Midnight Network's Zero-Knowledge Proofs
      </span>
    </div>
  </header>
);
