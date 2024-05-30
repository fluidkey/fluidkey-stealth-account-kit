import * as secp from '@noble/secp256k1';
import { keccak256, pad, toHex } from 'viem';

/**
   * Given the user's private spending key and an ephemeral public key, generate the private key of the stealth address
   * @param spendingPrivateKey
   * @param ephemeralPublicKey
   * @returns stealthPrivateSpendingKey
   */
export function generateStealthPrivateSpendingKey(
  { spendingPrivateKey, ephemeralPublicKey }: {spendingPrivateKey: string; ephemeralPublicKey: string}):
  {stealthPrivateSpendingKey: `0x${string}`} {
  const sharedSecret = secp.getSharedSecret(
    spendingPrivateKey.replace('0x', ''),
    ephemeralPublicKey.replace('0x', ''),
    false,
  );
  const hashedSharedSecret = keccak256(sharedSecret.slice(1));
  const privateKeyBigInt = (BigInt(spendingPrivateKey) * BigInt(hashedSharedSecret)) % secp.CURVE.n;
  return { stealthPrivateSpendingKey: pad(toHex(privateKeyBigInt)) };
};