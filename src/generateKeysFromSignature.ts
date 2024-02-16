import { isHex, keccak256 } from 'viem';

/**
 * Generate private keys from the signature of a message.
 *
 * This code is based on the logic and code from umbra-js (https://github.com/ScopeLift/umbra-protocol).
 *
 * @param signature
 * @returns private keypair
 */

export function generateKeysFromSignature(signature: `0x${string}`): {
  spendingPrivateKey: `0x${string}`;
  viewingPrivateKey: `0x${string}`;
} {
  // Verify that the signature is valid
  if (!isHex(signature) || signature.length !== 132) {
    throw new Error('Signature is not valid.');
  }

  // Split hex string signature into two 32 byte chunks, ignore the last byte
  const startIndex = 2; // first two characters are 0x, so skip these
  const length = 64; // each 32 byte chunk is in hex, so 64 characters
  const portion1 = signature.slice(startIndex, startIndex + length);
  const portion2 = signature.slice(startIndex + length, startIndex + length + length);

  // Hash the signature pieces to get the two private keys
  const spendingPrivateKey = keccak256(`0x${portion1}`);
  const viewingPrivateKey = keccak256(`0x${portion2}`);

  // Return the private keypair
  return {
    spendingPrivateKey,
    viewingPrivateKey,
  };
}
