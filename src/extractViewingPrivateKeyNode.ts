import { isHex, toBytes } from 'viem';
import { HDKey } from 'viem/accounts';

/**
 * Extract the node required to generate the pseudo-random input for stealth address generation.
 *
 * It must always be implemented client side and only the resulting node should be shared with the server.
 * @param privateViewingKey
 * @param node
 * @returns HDKey
 */

export function extractViewingPrivateKeyNode(
  privateViewingKey: `0x${string}`,
  node: number = 0,
): HDKey {
  // Ensure the private viewing key is a valid hex string
  if (!isHex(privateViewingKey) || privateViewingKey.length !== 66) {
    throw new Error('Hex private viewing key is not valid.');
  }

  // Convert the private viewing key to Uint8Array
  const uint8PrivateViewingKey = toBytes(privateViewingKey);

  // generate the master HDKey from the private viewing key
  const hdkey = HDKey.fromMasterSeed(uint8PrivateViewingKey);

  // derive the node m/5564'/N to be shared with the server
  return hdkey.derive(`m/5564'/${node}'`);
}
