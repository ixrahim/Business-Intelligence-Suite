import { config } from '../config';
import { CompanyMetrics, PercentileProof } from '../types';
import { generateMockProof } from './benchmarkService';
import { verifyProofHash as verifyMockProofHash, storeProof as storeMockProof } from './proofService';

/**
 * Midnight integration adapter
 * - Mock mode (default): uses existing in-memory mock logic
 * - Real mode: placeholder methods to wire into Midnight testnet (Compact/SDK/RPC)
 */

export type MidnightMode = 'mock' | 'real';

function resolveMode(): MidnightMode {
  const envMode = (process.env.MIDNIGHT_MODE || '').toLowerCase();
  if (envMode === 'real') return 'real';
  // Otherwise default to mock to avoid breaking local/dev
  return 'mock';
}

interface MidnightClient {
  // Benchmarking / proof attestation
  generatePercentileProof(data: CompanyMetrics): Promise<PercentileProof>;
  verifyProofHash(proofHash: string): Promise<PercentileProof | null>;

  // Consent flows
  mintConsentToken(args: ConsentMintArgs): Promise<ConsentMintResult>;
  verifyConsentToken(consentId: string): Promise<ConsentVerification | null>;
  revokeConsent(consentId: string): Promise<ConsentRevokeResult>;
}

// --------------------
// Consent types (exported for route usage until central types are added)
// --------------------
export interface ConsentMintArgs {
  dataRequestId: string; // public identifier for the data access scope
  companyId: string;     // target company identifier (public)
  privateDataHash: string; // hash of private data proved in ZK
  proof: unknown;          // ZK proof artifact (opaque to adapter)
  owner?: string;          // wallet address (when available in real mode)
}

export interface ConsentMintResult {
  consentId: string;
  txHash?: string;
}

export interface ConsentVerification {
  consentId: string;
  valid: boolean;
  revoked: boolean;
  owner: string;
  dataRequestId: string;
  companyId: string;
  timestamp: string;
  txHash?: string;
}

export interface ConsentRevokeResult {
  consentId: string;
  txHash?: string;
}

// --------------------
// Mock implementation
// --------------------
class MockMidnightClient implements MidnightClient {
  async generatePercentileProof(data: CompanyMetrics): Promise<PercentileProof> {
    const proof = await generateMockProof(data);
    await storeMockProof(proof);
    return proof;
  }

  async verifyProofHash(proofHash: string): Promise<PercentileProof | null> {
    return verifyMockProofHash(proofHash);
  }

  async mintConsentToken(args: ConsentMintArgs): Promise<ConsentMintResult> {
    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    const owner = args.owner || 'mock_user_owner';
    const record: ConsentVerification = {
      consentId,
      valid: true,
      revoked: false,
      owner,
      dataRequestId: args.dataRequestId,
      companyId: args.companyId,
      timestamp: new Date().toISOString(),
      txHash: `0xmocktx_${Math.random().toString(36).substr(2, 8)}`
    };

    if (!(global as any).consentStore) {
      (global as any).consentStore = new Map<string, ConsentVerification>();
    }
    (global as any).consentStore.set(consentId, record);

    return { consentId, txHash: record.txHash };
  }

  async verifyConsentToken(consentId: string): Promise<ConsentVerification | null> {
    if (!(global as any).consentStore) {
      (global as any).consentStore = new Map<string, ConsentVerification>();
    }
    return (global as any).consentStore.get(consentId) || null;
  }

  async revokeConsent(consentId: string): Promise<ConsentRevokeResult> {
    if (!(global as any).consentStore) {
      (global as any).consentStore = new Map<string, ConsentVerification>();
    }
    const store: Map<string, ConsentVerification> = (global as any).consentStore;
    const rec = store.get(consentId);
    if (rec) {
      rec.revoked = true;
      rec.valid = false;
      rec.txHash = `0xmocktx_${Math.random().toString(36).substr(2, 8)}`;
      store.set(consentId, rec);
    }
    return { consentId, txHash: rec?.txHash };
  }
}

// --------------------
// Real implementation (placeholders to wire to Midnight SDK/RPC)
// --------------------
class RealMidnightClient implements MidnightClient {
  private readonly networkUrl?: string;
  private readonly apiKey?: string;
  private readonly contractAddress?: string;

  constructor() {
    this.networkUrl = config.midnight.networkUrl;
    this.apiKey = config.midnight.apiKey;
    this.contractAddress = process.env.MIDNIGHT_CONTRACT_ADDRESS;
  }

  async generatePercentileProof(_data: CompanyMetrics): Promise<PercentileProof> {
    if (!this.networkUrl || !this.contractAddress) {
      console.warn('[Midnight][real] Missing network or contract; falling back to mock');
      return new MockMidnightClient().generatePercentileProof(_data);
    }
    // TODO: Implement: build proof, submit tx to contract, parse attestation/tx
    throw new Error('[Midnight] Real generatePercentileProof not implemented');
  }

  async verifyProofHash(_proofHash: string): Promise<PercentileProof | null> {
    if (!this.networkUrl || !this.contractAddress) {
      console.warn('[Midnight][real] Missing network or contract; falling back to mock');
      return new MockMidnightClient().verifyProofHash(_proofHash);
    }
    // TODO: Implement: query contract/view or indexer for attestation
    throw new Error('[Midnight] Real verifyProofHash not implemented');
  }

  async mintConsentToken(_args: ConsentMintArgs): Promise<ConsentMintResult> {
    if (!this.networkUrl || !this.contractAddress) {
      console.warn('[Midnight][real] Missing network or contract; falling back to mock');
      return new MockMidnightClient().mintConsentToken(_args);
    }
    // TODO: Implement: submit tx to mint_consent_token and parse consentId + txHash
    throw new Error('[Midnight] Real mintConsentToken not implemented');
  }

  async verifyConsentToken(_consentId: string): Promise<ConsentVerification | null> {
    if (!this.networkUrl || !this.contractAddress) {
      console.warn('[Midnight][real] Missing network or contract; falling back to mock');
      return new MockMidnightClient().verifyConsentToken(_consentId);
    }
    // TODO: Implement: call verify_consent_token or read ledger/state by consentId
    throw new Error('[Midnight] Real verifyConsentToken not implemented');
  }

  async revokeConsent(_consentId: string): Promise<ConsentRevokeResult> {
    if (!this.networkUrl || !this.contractAddress) {
      console.warn('[Midnight][real] Missing network or contract; falling back to mock');
      return new MockMidnightClient().revokeConsent(_consentId);
    }
    // TODO: Implement: submit tx to revoke_consent(consentId)
    throw new Error('[Midnight] Real revokeConsent not implemented');
  }
}

function getClient(): MidnightClient {
  const mode = resolveMode();
  if (mode === 'real') {
    console.log('[Midnight] Using REAL mode');
    return new RealMidnightClient();
  }
  console.log('[Midnight] Using MOCK mode');
  return new MockMidnightClient();
}

// Public API (benchmarks)
export async function generatePercentileProof(data: CompanyMetrics): Promise<PercentileProof> {
  return getClient().generatePercentileProof(data);
}

export async function verifyProofHash(proofHash: string): Promise<PercentileProof | null> {
  return getClient().verifyProofHash(proofHash);
}

// Public API (consent)
export async function mintConsentToken(args: ConsentMintArgs): Promise<ConsentMintResult> {
  return getClient().mintConsentToken(args);
}

export async function verifyConsentToken(consentId: string): Promise<ConsentVerification | null> {
  return getClient().verifyConsentToken(consentId);
}

export async function revokeConsent(consentId: string): Promise<ConsentRevokeResult> {
  return getClient().revokeConsent(consentId);
}
