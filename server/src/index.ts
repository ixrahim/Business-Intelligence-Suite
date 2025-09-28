import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config, isDevelopment } from './config';
import benchmarkRoutes from './routes/benchmarks';
import proofRoutes from './routes/proofs';
import industryRoutes from './routes/industries';
import authConsentRoutes from './routes/authConsent';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Logging
app.use(morgan(isDevelopment ? 'dev' : 'combined'));

// Body parsing
app.use(express.json({ limit: config.api.requestLimit }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api/benchmarks', benchmarkRoutes);
app.use('/api/proofs', proofRoutes);
app.use('/api/industries', industryRoutes);
app.use('/api', authConsentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 Confidential BI Server running on port ${config.port}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Frontend URL: ${config.corsOrigin}`);
  console.log(`💡 Demo mode: Using mock data for ZK proofs`);
});