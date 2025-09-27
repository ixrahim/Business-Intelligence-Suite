export const INDUSTRIES = [
  { value: '', label: 'Select Industry' },
  { value: 'saas', label: 'SaaS' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'healthcare', label: 'Healthcare' },
] as const;

export const API_ENDPOINTS = {
  BENCHMARKS: '/benchmarks',
  PROOFS: '/proofs',
  INDUSTRIES: '/industries',
} as const;

export const DEMO_MODE = process.env.NODE_ENV === 'development';