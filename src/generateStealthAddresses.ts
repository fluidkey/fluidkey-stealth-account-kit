import secp from '@noble/secp256k1';
import { keccak256, toHex } from 'viem';

/**
 * Generates a stealth address, with related ephemeralPubkey
 * @param params {GenerateStealthAddressParams}
 */

// TO-DO: credit Umbra?

export function generateStealthAddresses({
  spendingPublicKeys,
  ephemeralPrivateKey,
}: {
  spendingPublicKeys: string[];
  ephemeralPrivateKey: `0x${string}`;
}): { stealthAddresses: string[] } {
  const stealthAddresses: string[] = [];

  for (const spendingPublicKey of spendingPublicKeys) {
    // compute the shared secret using private key ephemeral * smart account viewing public key
    const sharedSecret = secp.getSharedSecret(
      ephemeralPrivateKey.slice(2),
      spendingPublicKey.slice(2),
      false
    );
    const hashedSharedSecret = keccak256(toHex(sharedSecret.slice(1)));
    const R_pubkey_spend = secp.ProjectivePoint.fromHex(spendingPublicKey.slice(2)); // switched from Point to ProjectivePoint (v2 of secp256k1 package)
    const stealthPublicKey = R_pubkey_spend.multiply(BigInt(hashedSharedSecret));
    const stealthAddress =
      '0x' + keccak256(Buffer.from(stealthPublicKey.toHex(), 'hex').slice(1)).slice(-40);
    stealthAddresses.push(stealthAddress);
  }

  return { stealthAddresses };
}
