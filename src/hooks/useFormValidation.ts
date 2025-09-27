import { useState, useCallback } from 'react';
import { CompanyMetrics, ValidationErrors } from '../types';
import { validateCompanyData } from '../utils/validation';

interface UseFormValidationReturn {
  data: Partial<CompanyMetrics>;
  errors: ValidationErrors;
  validate: () => boolean;
  updateField: (field: keyof CompanyMetrics, value: any) => void;
  reset: () => void;
}

export const useFormValidation = (initialData: Partial<CompanyMetrics>): UseFormValidationReturn => {
  const [data, setData] = useState<Partial<CompanyMetrics>>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((): boolean => {
    const newErrors = validateCompanyData(data);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data]);

  const updateField = useCallback((field: keyof CompanyMetrics, value: any): void => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const reset = useCallback((): void => {
    setData(initialData);
    setErrors({});
  }, [initialData]);

  return { data, errors, validate, updateField, reset };
};