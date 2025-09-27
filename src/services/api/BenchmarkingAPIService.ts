import { APIResponse, CompanyMetrics, PercentileProof, IndustryStats } from '../../types';

export class BenchmarkingAPIService {
  private baseURL: string;
  
  constructor(baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api') {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: {
            message: data.message || 'Request failed',
            code: data.code || 'UNKNOWN_ERROR',
            details: data.details
          }
        };
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Network error',
          code: 'NETWORK_ERROR'
        }
      };
    }
  }

  async submitCompanyData(metrics: CompanyMetrics): Promise<APIResponse<PercentileProof>> {
    // For demo: simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResponse: PercentileProof = {
      proofHash: `zk_proof_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      companyId: `company_${Math.random().toString(36).substr(2, 8)}`,
      results: [
        {
          metric: 'revenue',
          percentile: this.calculateMockPercentile(metrics.revenue, 'revenue'),
          sampleSize: 13
        },
        {
          metric: 'employees',
          percentile: this.calculateMockPercentile(metrics.employees, 'employees'),
          sampleSize: 13
        }
      ],
      timestamp: new Date().toISOString(),
      verified: true
    };

    return { success: true, data: mockResponse };
  }

  private calculateMockPercentile(value: number, metric: string): number {
    // Mock industry data for realistic percentiles
    const industryData = {
      revenue: [2000000, 8500000, 15000000, 22000000, 35000000, 45000000, 62000000, 78000000, 95000000, 125000000, 150000000, 200000000],
      employees: [15, 35, 65, 95, 140, 180, 250, 320, 450, 600, 800, 1200]
    };

    const benchmarks = industryData[metric as keyof typeof industryData] || [];
    const countBelow = benchmarks.filter(x => x < value).length;
    const totalCount = benchmarks.length + 1;
    return Math.max(5, Math.min(95, Math.round((countBelow / totalCount) * 100)));
  }

  async verifyProof(proofHash: string): Promise<APIResponse<PercentileProof>> {
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!proofHash.startsWith('zk_proof_')) {
      return {
        success: false,
        error: { message: 'Invalid proof hash format', code: 'INVALID_PROOF' }
      };
    }

    const mockVerification: PercentileProof = {
      proofHash,
      companyId: 'verified_company',
      results: [
        { metric: 'revenue', percentile: 75, sampleSize: 13 },
        { metric: 'employees', percentile: 68, sampleSize: 13 }
      ],
      timestamp: new Date().toISOString(),
      verified: true
    };

    return { success: true, data: mockVerification };
  }

  async getIndustryStats(industry: string): Promise<APIResponse<IndustryStats>> {
    const stats: IndustryStats = {
      totalCompanies: 13,
      metrics: ['revenue', 'employees'],
      lastUpdated: new Date()
    };

    return { success: true, data: stats };
  }
}
