import crypto from 'crypto';

/**
 * IdentityService — Simulated W3C DID and Sovereign ID signatures.
 * In a real Military-Grade app, this would use Hardware Security Modules (HSM)
 * or decentralized PKI (Public Key Infrastructure).
 */
export class IdentityService {
  
  /**
   * Generates a "Proof of Identity" (Signature) for a payload.
   * Uses a simulated private key for the user.
   */
  static signData(data: string, userId: string): string {
    // We simulate a signature by hashing the data with a user-specific secret
    // In production, this would be: crypto.sign("sha256", Buffer.from(data), privateKey)
    const secret = `USER_SECRET_${userId}`;
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Verifies a signature against the payload and user.
   */
  static verifySignature(data: string, signature: string, userId: string): boolean {
    const expected = this.signData(data, userId);
    return expected === signature;
  }

  /**
   * Two-Man Rule Check
   * Critical actions (Vault deletion, Policy overriding) require 2 distinct signatures.
   */
  static checkTwoManRule(signatures: { userId: string, signature: string }[]): boolean {
    if (signatures.length < 2) return false;
    
    // Ensure signers are unique
    const uniqueSigners = new Set(signatures.map(s => s.userId));
    if (uniqueSigners.size < 2) return false;

    // Verify each signature
    // For this simulation, we assume signatures are passed as proof
    return signatures.every(s => this.verifySignature('CRITICAL_ACTION_PAYLOAD', s.signature, s.userId));
  }
}
