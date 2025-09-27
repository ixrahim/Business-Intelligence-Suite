/**
 * 404 Not Found handler
 */
function notFound(req, res, next) {
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
function errorHandler(err, req, res, next) {
  console.error('❌ Server Error:', err);
  
  // Default error response
  let statusCode = 500;
  let errorResponse = {
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  };
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse.error.message = 'Validation failed';
    errorResponse.error.code = 'VALIDATION_ERROR';
    errorResponse.error.details = err.message;
  }
  
  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorResponse.error.message = 'Unauthorized';
    errorResponse.error.code = 'UNAUTHORIZED';
  }
  
  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    delete errorResponse.error.details;
  } else {
    errorResponse.error.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
}

module.exports = {
  notFound,
  errorHandler
};