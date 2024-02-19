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
  nonce: bigint;
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

  // key derivation structure is m/5564'/N'/c0'/c1'/0'/p/n

  // 5564 is the purpose as defined in BIP-43 and aligns with the stealth address EIP number, EIP-5564:
  // https://github.com/bitcoin/bips/blob/master/bip-0043.mediawiki
  // https://eips.ethereum.org/EIPS/eip-5564

  // N is the number of the node shared with the server

  // c is the coinType as derived in ENSIP-11 for EVM chains: https://docs.ens.domains/ens-improvement-proposals/ensip-11-evmchain-address-resolution
  // as it is a number above 0x80000000, which is not allowed in secure-bip32 (see HARDENED_OFFSET), it is split into two parts:
  // c0, the first byte of c
  // c1, the remaining bytes of c

  // only the node m/5564'/0' of the private viewing key is shared with the server (see extractPrivateKeyNode)
  // the server then generates pseudo-random addresses by incrementing n
  // since each value cannot be larger than 2^31 - 1 (see HARDENED_OFFSET - 0x7FFFFFF)
  // we therefore introduce a parent nonce p to allow for more addresses to be generated.
  // If the nonce is bigger than MAX_NONCE, we put the overflow part into a parentNonce. To simplify
  // the creation of parentNonce, we set MAX_NONCE to be 0xFFFFFFF. With this schema the combination of nonce
  // and parent nonce has a max value of 0x7FFFFFFFFFFFFFF-1 = 576460752303423486₁₀

  // Split the nonce into two parts to ensure no number above 0x80000000 is used in the derivation path
  if (nonce >= BigInt(0x7FFFFFFFFFFFFFF)) {
    throw new Error('Nonce is too large. Max value is 0x7FFFFFFFFFFFFFF.');
  }
  const MAX_NONCE = BigInt(0xfffffff);
  let parentNonce = BigInt(0);
  if (nonce > MAX_NONCE) {
    parentNonce = nonce / (MAX_NONCE + BigInt(1));
    nonce = nonce % (MAX_NONCE + BigInt(1));
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
