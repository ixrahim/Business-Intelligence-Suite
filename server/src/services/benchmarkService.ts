import { v4 as uuidv4 } from 'uuid';
import { CompanyMetrics, PercentileProof, IndustryData } from '../types';

// Mock industry data for realistic percentile calculations
const INDUSTRY_DATA: Record<string, IndustryData> = {
  saas: {
    revenue: [2000000, 8500000, 15000000, 22000000, 35000000, 45000000, 62000000, 78000000, 95000000, 125000000, 150000000, 200000000, 300000000],
    employees: [15, 35, 65, 95, 140, 180, 250, 320, 450, 600, 800, 1200, 1800]
  },
  fintech: {
    revenue: [3000000, 12000000, 25000000, 40000000, 55000000, 75000000, 95000000, 120000000, 150000000, 200000000, 280000000, 400000000],
    employees: [25, 50, 85, 120, 180, 240, 320, 450, 650, 900, 1300, 2000]
  },
  ecommerce: {
    revenue: [1500000, 6000000, 12000000, 18000000, 28000000, 42000000, 58000000, 78000000, 105000000, 140000000, 180000000, 250000000],
    employees: [12, 28, 55, 85, 125, 170, 230, 310, 420, 580, 780, 1100]
  },
  healthcare: {
    revenue: [5000000, 15000000, 28000000, 45000000, 65000000, 85000000, 110000000, 140000000, 180000000, 230000000, 300000000],
    employees: [30, 65, 110, 160, 220, 290, 380, 500, 650, 850, 1200]
  }
};

/**
 * Calculate percentile ranking for a value within an industry dataset
 */
export function calculatePercentile(value: number, industryData: number[]): number {
  if (!industryData || industryData.length === 0) {
    return 50; // Default to median if no data
  }
  
  const sortedData = [...industryData].sort((a, b) => a - b);
  const countBelow = sortedData.filter(x => x < value).length;
  const totalCount = sortedData.length + 1; // +1 to include the submitted value
  
  // Ensure percentile is between 5 and 95 for realistic results
  const percentile = Math.round((countBelow / totalCount) * 100);
  return Math.max(5, Math.min(95, percentile));
}

/**
 * Generate a mock zero-knowledge proof for company benchmarking
 * In production, this would integrate with Midnight Network
 */
export async function generateMockProof(companyData: CompanyMetrics): Promise<PercentileProof> {
  const { revenue, employees, industry } = companyData;
  
  // Get industry benchmark data
  const industryBenchmarks = INDUSTRY_DATA[industry] || INDUSTRY_DATA.saas;
  
  // Calculate percentiles
  const revenuePercentile = calculatePercentile(revenue, industryBenchmarks.revenue);
  const employeePercentile = calculatePercentile(employees, industryBenchmarks.employees);
  
  // Generate proof hash (in production, this would be a real ZK proof)
  const proofHash = `zk_proof_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  const companyId = `company_${uuidv4().substr(0, 8)}`;
  
  const proof: PercentileProof = {
    proofHash,
    companyId,
    results: [
      {
        metric: 'revenue',
        percentile: revenuePercentile,
        sampleSize: industryBenchmarks.revenue.length
      },
      {
        metric: 'employees',
        percentile: employeePercentile,
        sampleSize: industryBenchmarks.employees.length
      }
    ],
    timestamp: new Date().toISOString(),
    verified: true,
    industry
  };
  
  // Store proof in memory (in production, use a database)
  if (!global.proofStore) {
    global.proofStore = new Map();
  }
  global.proofStore.set(proofHash, proof);
  
  return proof;
}