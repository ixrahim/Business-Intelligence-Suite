import { Request, Response, NextFunction } from 'express';
import { BenchmarkSubmissionRequest, APIResponse, ValidationError } from '../types';

/**
 * Validate company data submission
 */
export function validateCompanyData(
  req: Request<{}, APIResponse, BenchmarkSubmissionRequest>, 
  res: Response<APIResponse>, 
  next: NextFunction
): void {
  const { revenue, employees, industry } = req.body;
  const errors: ValidationError[] = [];
  
  // Validate revenue
  if (!revenue || typeof revenue !== 'number' || revenue <= 0) {
    errors.push({
      field: 'revenue',
      message: 'Revenue must be a positive number'
    });
  }
  
  // Validate employees
  if (!employees || typeof employees !== 'number' || employees <= 0) {
    errors.push({
      field: 'employees',
      message: 'Employee count must be a positive number'
    });
  }
  
  // Validate industry
  const validIndustries = ['saas', 'fintech', 'ecommerce', 'healthcare'];
  if (!industry || !validIndustries.includes(industry)) {
    errors.push({
      field: 'industry',
      message: 'Invalid industry selection'
    });
  }
  
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      }
    });
    return;
  }
  
  next();
}

/**
 * Validate proof hash format
 */
export function validateProofHash(proofHash: string): boolean {
  return typeof proofHash === 'string' && 
         proofHash.length > 0 && 
         proofHash.startsWith('zk_proof_');
}