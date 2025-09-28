import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
  
  // Database configuration (for future use)
  database: {
    url: process.env.DATABASE_URL,
  },
  
  // Midnight Network configuration (for future use)
  midnight: {
    networkUrl: process.env.MIDNIGHT_NETWORK_URL,
    apiKey: process.env.MIDNIGHT_API_KEY,
  },
  
  // API configuration
  api: {
    requestLimit: '10mb',
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100, // limit each IP to 100 requests per windowMs
  }
} as const;

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';