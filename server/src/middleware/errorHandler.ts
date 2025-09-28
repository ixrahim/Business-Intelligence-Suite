import { Request, Response, NextFunction } from 'express';
import { APIResponse } from '../types';
import { isProduction } from '../config';

/**
 * 404 Not Found handler
 */
export function notFound(req: Request, res: Response<APIResponse>): void {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      code: 'NOT_FOUND'
    }
  });
}

/**
 * Global error handler
 */
export function errorHandler(
  err: Error, 
  req: Request, 
  res: Response<APIResponse>, 
  next: NextFunction
): void {
  console.error('❌ Server Error:', err);
  
  // Default error response
  let statusCode = 500;
  let errorResponse: APIResponse = {
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  };
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.error = {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.message
    };
  }
  
  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorResponse.error = {
      message: 'Unauthorized',
      code: 'UNAUTHORIZED'
    };
  }
  
  // Don't leak error details in production
  if (!isProduction && errorResponse.error) {
    errorResponse.error.details = {
      stack: err.stack,
      ...errorResponse.error.details
    };
  }
  
  res.status(statusCode).json(errorResponse);
}