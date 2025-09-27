import { PercentileProof } from '../types';

/**
 * Verify a zero-knowledge proof hash
 * In production, this would validate against Midnight Network
 */
export async function verifyProofHash(proofHash: string): Promise<PercentileProof | null> {
  // Check if proof exists in our mock store
  if (!global.proofStore) {
    global.proofStore = new Map();
  }
  
  if (!proofHash.startsWith('zk_proof_')) {
    return null; // Invalid format
  }
  
  // Check our in-memory store first
  if (global.proofStore.has(proofHash)) {
    return global.proofStore.get(proofHash) || null;
  }
  
  // For demo purposes, generate a mock verification result for unknown hashes
  // that follow the correct format
  const mockVerification: PercentileProof = {
    proofHash,
    companyId: 'verified_company',
    results: [
      { 
        metric: 'revenue', 
        percentile: Math.floor(Math.random() * 90) + 5, // 5-95
        sampleSize: 13 
      },
      { 
        metric: 'employees', 
        percentile: Math.floor(Math.random() * 90) + 5, // 5-95
        sampleSize: 13 
      }
    ],
    timestamp: new Date().toISOString(),
    verified: true,
    industry: 'saas'
  };
  
  return mockVerification;
}

/**
 * Store a proof (in production, this would be on-chain or in a secure database)
 */
export async function storeProof(proof: PercentileProof): Promise<boolean> {
  if (!global.proofStore) {
    global.proofStore = new Map();
  }
  global.proofStore.set(proof.proofHash, proof);
  return true;
}