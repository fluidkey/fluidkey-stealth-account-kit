import { toHex } from 'viem';
import { type HDKey } from 'viem/accounts';

/**
 * Generate an ephemeral private key based on a private viewing key node, a nonce, and a chainId or coinType using the BIP-32 derivation path.
 *
 * @param viewingPrivateKeyNode
 * @param nonce
 * @param chainId
 * @param coinType
 * @returns ephemeralPrivateKey
 */

export function generateEphemeralPrivateKey({
  viewingPrivateKeyNode,
  nonce,
  chainId,
  coinType,
}: {
  viewingPrivateKeyNode: HDKey;
  nonce: number;
  chainId?: number;
  coinType?: number;
}): { ephemeralPrivateKey: `0x${string}` } {
  // Convert the chainId to a coinType if no coinType was provided
  if (coinType == null && chainId != null) {
    // eslint-disable-next-line no-bitwise
    coinType = (0x80000000 | chainId) >>> 0;
  }

  // Ensure either the coinType or the chainId has been provided
  if (coinType == null) {
    throw new Error('coinType or chainId must be defined.');
  }

  // Slice the coinType into two parts, the first byte and the rest, to ensure no number above 0x80000000 is used in the derivation path
  const coinTypeString = coinType.toString(16).padStart(8, '0');
  const coinTypePart1 = parseInt(coinTypeString.slice(0, 1), 16);
  const coinTypePart2 = parseInt(coinTypeString.slice(1), 16);

  // Split the nonce into two parts to ensure no number above 0x80000000 is used in the derivation path
  const MAX_NONCE = 0xfffffff;
  let parentNonce = 0;
  if (nonce > MAX_NONCE) {
    parentNonce = Math.floor(nonce / (MAX_NONCE + 1));
    nonce = nonce % (MAX_NONCE + 1);
  }

  // Create the derivation path
  const index = `m/${coinTypePart1}'/${coinTypePart2}'/0'/${parentNonce}'/${nonce}'`;

  // Derive the child private key based on the index
  const childPrivateKey = viewingPrivateKeyNode.derive(index);

  // Ensure the child private key was derived successfully
  /* istanbul ignore next */
  if (childPrivateKey.privateKey == null) {
    throw new Error('Could not derive child private key.');
  }

  // Convert the child private key to hex and return it
  return { ephemeralPrivateKey: toHex(childPrivateKey.privateKey) };
}
