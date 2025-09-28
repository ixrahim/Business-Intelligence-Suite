import express, { Request, Response } from 'express';
import { APIResponse, Industry, IndustryBenchmarks } from '../types';

const router = express.Router();

// Get list of supported industries
router.get('/', (req: Request, res: Response<APIResponse<Industry[]>>) => {
  const industries: Industry[] = [
    { value: 'saas', label: 'SaaS', companies: 13 },
    { value: 'fintech', label: 'FinTech', companies: 8 },
    { value: 'ecommerce', label: 'E-commerce', companies: 11 },
    { value: 'healthcare', label: 'Healthcare', companies: 6 }
  ];
  
  res.json({
    success: true,
    data: industries
  });
});

// Get industry-specific benchmarks
router.get('/:industry/benchmarks', (req: Request<{ industry: string }>, res: Response<APIResponse<IndustryBenchmarks>>) => {
  const { industry } = req.params;
  
  // Mock benchmark data for the industry
  const benchmarks: IndustryBenchmarks = {
    industry,
    metrics: {
      revenue: {
        p25: 15000000,
        p50: 35000000,
        p75: 75000000,
        p90: 150000000
      },
      employees: {
        p25: 50,
        p50: 150,
        p75: 350,
        p90: 800
      }
    },
    sampleSize: 13,
    lastUpdated: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: benchmarks
  });
});

export default router;