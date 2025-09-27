export interface APIError {
  message: string;
  code: string;
  details?: any;
}

export interface APIResponse<T> {
  data?: T;
  error?: APIError;
  success: boolean;
}