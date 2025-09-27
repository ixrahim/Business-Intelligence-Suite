import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { BenchmarkingAPIService } from '../../services/api/BenchmarkingAPIService';
import { CompanyMetrics, PercentileProof, APIError } from '../../types';

// ============= TYPES =============
interface BenchmarkingState {
  currentProof: PercentileProof | null;
  isLoading: boolean;
  error: APIError | null;
}

type BenchmarkingAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROOF'; payload: PercentileProof }
  | { type: 'SET_ERROR'; payload: APIError | null }
  | { type: 'CLEAR_PROOF' };

interface BenchmarkingContextType extends BenchmarkingState {
  api: BenchmarkingAPIService;
  submitData: (metrics: CompanyMetrics) => Promise<void>;
  verifyProof: (proofHash: string) => Promise<PercentileProof | null>;
  clearError: () => void;
  clearProof: () => void;
}

interface BenchmarkingProviderProps {
  children: ReactNode;
}

// ============= INITIAL STATE =============
const initialState: BenchmarkingState = {
  currentProof: null,
  isLoading: false,
  error: null,
};

// ============= REDUCER =============
const benchmarkingReducer = (
  state: BenchmarkingState, 
  action: BenchmarkingAction
): BenchmarkingState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PROOF':
      return { ...state, currentProof: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_PROOF':
      return { ...state, currentProof: null, error: null };
    default:
      return state;
  }
};

// ============= CONTEXT =============
const BenchmarkingContext = createContext<BenchmarkingContextType | null>(null);

// ============= PROVIDER =============
export const BenchmarkingProvider: React.FC<BenchmarkingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(benchmarkingReducer, initialState);
  const api = new BenchmarkingAPIService();

  const submitData = useCallback(async (metrics: CompanyMetrics): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await api.submitCompanyData(metrics);
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_PROOF', payload: response.data });
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: response.error || { message: 'Unknown error', code: 'SUBMIT_ERROR' } 
        });
      }
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { message: 'Failed to submit data', code: 'SUBMIT_ERROR' } 
      });
    }
  }, [api]);

  const verifyProof = useCallback(async (proofHash: string): Promise<PercentileProof | null> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await api.verifyProof(proofHash);
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return response.data;
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: response.error || { message: 'Verification failed', code: 'VERIFY_ERROR' } 
        });
        return null;
      }
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { message: 'Failed to verify proof', code: 'VERIFY_ERROR' } 
      });
      return null;
    }
  }, [api]);

  const clearError = useCallback((): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const clearProof = useCallback((): void => {
    dispatch({ type: 'CLEAR_PROOF' });
  }, []);

  // Create context value with explicit typing
  const contextValue: BenchmarkingContextType = {
    ...state,
    api,
    submitData,
    verifyProof,
    clearError,
    clearProof
  };

  return (
    <BenchmarkingContext.Provider value={contextValue}>
      {children}
    </BenchmarkingContext.Provider>
  );
};

// ============= HOOK =============
export const useBenchmarking = (): BenchmarkingContextType => {
  const context = useContext(BenchmarkingContext);
  if (!context) {
    throw new Error('useBenchmarking must be used within BenchmarkingProvider');
  }
  return context;
};
