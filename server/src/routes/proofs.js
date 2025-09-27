const express = require('express');
const { verifyProofHash } = require('../services/proofService');

const router = express.Router();

// Verify a proof hash
router.post('/verify', async (req, res) => {
  try {
    const { proofHash } = req.body;
    
    if (!proofHash) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Proof hash is required',
          code: 'MISSING_PROOF_HASH'
        }
      });
    }
    
    console.log(`🔍 Verifying proof: ${proofHash}`);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const verificationResult = await verifyProofHash(proofHash);
    
    if (verificationResult) {
      console.log(`✅ Proof verified successfully`);
      res.json({
        success: true,
        data: verificationResult,
        message: 'Proof verified successfully'
      });
    } else {
      console.log(`❌ Invalid proof hash`);
      res.status(400).json({
        success: false,
        error: {
          message: 'Invalid proof hash or verification failed',
          code: 'INVALID_PROOF'
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Proof verification error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to verify proof',
        code: 'VERIFICATION_ERROR'
      }
    });
  }
});

// Get proof details (for sharing/auditing)
router.get('/:proofHash', async (req, res) => {
  try {
    const { proofHash } = req.params;
    
    const proof = await verifyProofHash(proofHash);
    
    if (proof) {
      res.json({
        success: true,
        data: proof
      });
    } else {
      res.status(404).json({
        success: false,
        error: {
          message: 'Proof not found',
          code: 'PROOF_NOT_FOUND'
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Proof retrieval error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to retrieve proof',
        code: 'RETRIEVAL_ERROR'
      }
    });
  }
});

module.exports = router;