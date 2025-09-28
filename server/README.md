# Confidential BI Suite - Backend Server

Backend API server for the Confidential BI Suite, providing zero-knowledge proof generation and verification for privacy-preserving business intelligence.

## Features

- **Privacy-Preserving Benchmarking**: Generate ZK proofs for company metrics
- **Proof Verification**: Verify third-party proofs without revealing data
- **Industry Statistics**: Aggregate industry benchmarks
- **Mock ZK Integration**: Simulates Midnight Network integration

## API Endpoints

### Benchmarks
- `POST /api/benchmarks/submit` - Submit company data for benchmarking
- `GET /api/benchmarks/stats/:industry` - Get industry statistics

### Proofs
- `POST /api/proofs/verify` - Verify a proof hash
- `GET /api/proofs/:proofHash` - Get proof details

### Industries
- `GET /api/industries` - List supported industries
- `GET /api/industries/:industry/benchmarks` - Get industry benchmarks

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Environment Variables

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Frontend URL for CORS
- `JWT_SECRET` - Secret for JWT tokens

## Production Integration

For production deployment, you'll need to:

1. **Database Integration**: Replace in-memory storage with PostgreSQL/MongoDB
2. **Midnight Network**: Integrate real ZK proof generation
3. **Authentication**: Add proper user authentication
4. **Rate Limiting**: Implement API rate limiting
5. **Monitoring**: Add logging and monitoring

## Demo Mode

Currently runs in demo mode with:
- Mock ZK proof generation
- In-memory proof storage
- Simulated industry data
- No authentication required