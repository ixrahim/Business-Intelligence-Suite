import express, { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { mintConsentToken, verifyConsentToken, revokeConsent, ConsentMintArgs } from '../services/midnightClient';

const router = express.Router();

// In-memory store for auth challenges (replace with DB/Redis in prod)
const challengeStore: Map<string, { nonce: string; expiresAt: number }> = new Map();

// Utility to generate nonce
function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

// GET /api/auth/challenge?address=0x...
router.get('/auth/challenge', (req: Request, res: Response) => {
  const { address } = req.query as { address?: string };
  if (!address) {
    return res.status(400).json({ success: false, error: { message: 'Missing address' } });
  }

  const nonce = generateNonce();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  challengeStore.set(address.toLowerCase(), { nonce, expiresAt });

  res.json({ success: true, data: { address, nonce, expiresAt } });
});

// POST /api/auth/verify { address, signature, nonce }
// Note: Signature verification is placeholder; implement per Midnight wallet/SDK
router.post('/auth/verify', async (req: Request, res: Response) => {
  const { address, signature, nonce } = req.body as { address?: string; signature?: string; nonce?: string };
  
  if (!address || !signature || !nonce) {
    return res.status(400).json({ success: false, error: { message: 'Missing address/signature/nonce' } });
  }

  const stored = challengeStore.get(address.toLowerCase());
  if (!stored || stored.nonce !== nonce || stored.expiresAt < Date.now()) {
    return res.status(400).json({ success: false, error: { message: 'Invalid or expired challenge' } });
  }

  // TODO: Verify signature with Midnight wallet/SDK against the message (nonce)
  // For now accept any signature in mock mode

  const token = jwt.sign({ sub: address.toLowerCase(), amr: ['wallet-signature'] }, config.jwtSecret, { expiresIn: '1h' });
  challengeStore.delete(address.toLowerCase());

  res.json({ success: true, data: { token } });
});

// Middleware example: require auth
function requireAuth(req: Request, res: Response, next: Function) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
  }
  const token = auth.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as any;
    (req as any).user = { address: payload.sub };
    next();
  } catch (e) {
    return res.status(401).json({ success: false, error: { message: 'Invalid token' } });
  }
}

// POST /api/consent/mint
router.post('/consent/mint', requireAuth, async (req: Request, res: Response) => {
  try {
    const { dataRequestId, companyId, privateDataHash, proof } = req.body as ConsentMintArgs;
    if (!dataRequestId || !companyId || !privateDataHash || !proof) {
      return res.status(400).json({ success: false, error: { message: 'Missing required fields' } });
    }

    const owner = (req as any).user.address as string;
    const result = await mintConsentToken({ dataRequestId, companyId, privateDataHash, proof, owner });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Consent mint error', err);
    res.status(500).json({ success: false, error: { message: 'Failed to mint consent token' } });
  }
});

// GET /api/consent/:id
router.get('/consent/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await verifyConsentToken(id);
    if (!record) {
      return res.status(404).json({ success: false, error: { message: 'Consent not found' } });
    }
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('Consent fetch error', err);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch consent' } });
  }
});

// POST /api/consent/:id/revoke
router.post('/consent/:id/revoke', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // In real mode, contract enforces owner-only revoke
    const result = await revokeConsent(id);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Consent revoke error', err);
    res.status(500).json({ success: false, error: { message: 'Failed to revoke consent' } });
  }
});

export default router;
