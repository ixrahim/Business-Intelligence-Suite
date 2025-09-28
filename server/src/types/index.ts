export interface CompanyMetrics {
  revenue: number;
  employees: number;
  industry: string;
  customMetrics?: Record<string, number>;
}

export interface BenchmarkResult {
  metric: string;
  percentile: number;
  industryAverage?: number;
  sampleSize: number;
}

export interface PercentileProof {
  proofHash: string;
  companyId: string;
  results: BenchmarkResult[];
  timestamp: string;
  verified: boolean;
  industry?: string;
}

export interface IndustryStats {
  industry: string;
  totalCompanies: number;
  metrics: string[];
  averages: Record<string, number>;
  lastUpdated: string;
}

export interface IndustryBenchmarks {
  industry: string;
  metrics: Record<string, {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  }>;
  sampleSize: number;
  lastUpdated: string;
}

export interface APIError {
  message: string;
  code: string;
  details?: any;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
}

export interface Industry {
  value: string;
  label: string;
  companies: number;
}

export interface IndustryData {
  revenue: number[];
  employees: number[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Express Request extensions
export interface BenchmarkSubmissionRequest {
  revenue: number;
  employees: number;
  industry: string;
}

export interface ProofVerificationRequest {
  proofHash: string;
}

// Global proof store type (for demo purposes)
declare global {
  var proofStore: Map<string, PercentileProof> | undefined;
}