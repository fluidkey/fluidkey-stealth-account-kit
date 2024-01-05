import assert from 'assert';
import { keccak256, isHex } from 'viem';

/**
 * Generate private keys from a message signature.
 *
 * This code is based on the logic and code from umbra-js (https://github.com/ScopeLift/umbra-protocol).
 * @param signature
 * @returns private keypair
 */

export function generateKeysFromSignature(signature: `0x${string}`): {
  spendingPrivateKey: `0x${string}`;
  viewingPrivateKey: `0x${string}`;
} {
  // Verify that the signature is valid
  assert(isHex(signature) && signature.length === 132, 'Signature is not valid.');

  // Split hex string signature into two 32 byte chunks
  const startIndex = 2; // first two characters are 0x, so skip these
  const length = 64; // each 32 byte chunk is in hex, so 64 characters
  const portion1 = signature.slice(startIndex, startIndex + length);
  const portion2 = signature.slice(startIndex + length, startIndex + length + length);
  const lastByte = signature.slice(signature.length - 2);

  // Verify that the signature was parsed correctly
  assert(
    `0x${portion1}${portion2}${lastByte}` === signature,
    'Signature incorrectly generated or parsed.'
  );

  // Hash the signature pieces to get the two private keys
  const spendingPrivateKey = keccak256(`0x${portion1}`);
  const viewingPrivateKey = keccak256(`0x${portion2}`);

  // Return the private keypair
  return {
    spendingPrivateKey,
    viewingPrivateKey,
  };
}
