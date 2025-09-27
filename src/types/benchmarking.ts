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
}

export interface IndustryStats {
  totalCompanies: number;
  metrics: string[];
  lastUpdated: Date;
}
