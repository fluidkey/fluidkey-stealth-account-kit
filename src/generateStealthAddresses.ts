import * as secp from '@noble/secp256k1';
import { keccak256, toHex } from 'viem';

/**
 * Generates a list of stealth addresses using the provided spending public keys and ephemeral private key.
 *
 * @param spendingPublicKeys
 * @param ephemeralPrivateKey
 * @returns stealthAddresses
 */
export function generateStealthAddresses({
  spendingPublicKeys,
  ephemeralPrivateKey,
}: {
  spendingPublicKeys: string[];
  ephemeralPrivateKey: `0x${string}`;
}): { stealthAddresses: string[] } {
  // Initialize an array to hold the stealth addresses
  const stealthAddresses: string[] = [];

  // Iterate over each spending public key
  for (const spendingPublicKey of spendingPublicKeys) {
    // Compute the shared secret by multiplying the ephemeral private key and the spending public key
    const sharedSecret = secp.getSharedSecret(
      ephemeralPrivateKey.slice(2),
      spendingPublicKey.slice(2),
      false,
    );

    // Hash the shared secret
    const hashedSharedSecret = keccak256(toHex(sharedSecret.slice(1)));

    // Convert the spending public key from hex to a point on the elliptic curve
    const spendingPublicKeyPoint = secp.Point.fromHex(spendingPublicKey.slice(2));

    // Multiply the public key point by the hashed shared secret to get the stealth public key
    const stealthPublicKey = spendingPublicKeyPoint.multiply(BigInt(hashedSharedSecret));

    // Get the stealth address from the stealth public key
    const stealthAddress =
      '0x' + keccak256(Buffer.from(stealthPublicKey.toHex(), 'hex').subarray(1)).slice(-40);

    // Add the stealth address to the array of stealth addresses
    stealthAddresses.push(stealthAddress);
  }

  // Return the array of stealth addresses
  return { stealthAddresses };
}
