import { HDKey } from 'viem/accounts';

/**
 * Extract the node required to generate the pseudo-random input for stealth address generation.
 *
 * It must always be implemented client side and only the resulting node should be shared with the server.
 * @param privateViewingKey
 * @param node
 * @returns HDKey
 */

export function extractPrivateKeyNode(privateViewingKey: Uint8Array, node: number = 0): HDKey {
  // generate the master HDKey from the private viewing key
  const hdkey = HDKey.fromMasterSeed(privateViewingKey);

  // derive the node m/5564'/N to be shared with the server
  return hdkey.derive(`m/5564'/${node}'`);
}
