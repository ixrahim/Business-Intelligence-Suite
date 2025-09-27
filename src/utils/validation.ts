import { CompanyMetrics, ValidationErrors } from '../types';

export const validateCompanyData = (data: Partial<CompanyMetrics>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.revenue || data.revenue <= 0) {
    errors.revenue = 'Revenue must be greater than 0';
  }

  if (!data.employees || data.employees <= 0) {
    errors.employees = 'Employee count must be greater than 0';
  }

  if (!data.industry) {
    errors.industry = 'Please select an industry';
  }

  return errors;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};