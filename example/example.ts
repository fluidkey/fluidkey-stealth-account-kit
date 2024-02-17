import { privateKeyToAccount } from 'viem/accounts';
import {
  extractViewingPrivateKeyNode,
  generateEphemeralPrivateKey,
  generateKeysFromSignature,
  generateStealthAddresses,
  predictStealthSafeAddressWithBytecode,
  predictStealthSafeAddressWithClient,
} from '../src';

/**
 * End-to-end example of how to generate a stealth Safe addresses based on the user's private key and the key generation message to be signed.
 *
 * @param userPrivateKey
 * @param keyGenerationMessage
 * @param viewingPrivateKeyNodeNumber
 * @param startNonce
 * @param endNonce
 * @param chainId
 * @returns a list of objects containing the nonce and the corresponding stealth Safe address
 */

export async function example({
  userPrivateKey,
  keyGenerationMessage,
  viewingPrivateKeyNodeNumber = 0,
  startNonce = 0,
  endNonce = 10,
  chainId = 1,
}: {
  userPrivateKey: `0x${string}`;
  keyGenerationMessage: string;
  viewingPrivateKeyNodeNumber?: number;
  startNonce?: number;
  endNonce?: number;
  chainId?: number;
}): Promise<{nonce: number; stealthSafeAddress: `0x${string}`}[]> {

  // Create an empty array to store the results
  const results: {nonce: number; stealthSafeAddress: `0x${string}`}[] = [];

  // Generate the signature from which the private keys will be derived
  const account = privateKeyToAccount(userPrivateKey);
  const signature = await account.signMessage({
    message: keyGenerationMessage,
  });
  // Generate the private keys from the signature
  const { spendingPrivateKey, viewingPrivateKey } = generateKeysFromSignature(signature);

  // Extract the node required to generate the pseudo-random input for stealth address generation
  const privateViewingKeyNode = extractViewingPrivateKeyNode(viewingPrivateKey, viewingPrivateKeyNodeNumber);

  // Get the spending public key
  const spendingAccount = privateKeyToAccount(spendingPrivateKey);
  const spendingPublicKey = spendingAccount.publicKey;

  // Loop through the nonce range and predict the stealth Safe address
  for (let nonce = startNonce; nonce <= endNonce; nonce++) {
    // Generate the ephemeral private key
    const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
      viewingPrivateKeyNode: privateViewingKeyNode,
      nonce,
      chainId,
    });

    // Generate the stealth owner address
    const { stealthAddresses } = generateStealthAddresses({
      spendingPublicKeys: [spendingPublicKey],
      ephemeralPrivateKey,
    });

    // Predict the corresponding stealth Safe address, both passing the client and using the CREATE2 option with
    // bytecode, making sure the addresses generated are the same
    console.log(`predicting Safe for signer ${stealthAddresses}`);
    const { stealthSafeAddress: stealthSafeAddressWithClient } = await predictStealthSafeAddressWithClient({
      chainId,
      threshold: 1,
      stealthAddresses,
      safeVersion: '1.3.0',
    });
    const { stealthSafeAddress: stealthSafeAddressWithBytecode } = predictStealthSafeAddressWithBytecode({
      chainId,
      threshold: 1,
      stealthAddresses,
      safeVersion: '1.3.0',
      safeProxyBytecode: '0x608060405234801561001057600080fd5b506040516101e63803806101e68339818101604052602081101561003357600080fd5b8101908080519060200190929190505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806101c46022913960400191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060ab806101196000396000f3fe608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea2646970667358221220d1429297349653a4918076d650332de1a1068c5f3e07c5c82360c277770b955264736f6c63430007060033496e76616c69642073696e676c65746f6e20616464726573732070726f7669646564',
    });

    console.log('  - stealthSafeAddressWithClient  ', stealthSafeAddressWithClient);
    console.log('  - stealthSafeAddressWithBytecode', stealthSafeAddressWithBytecode);

    // Add the result to the results array
    results.push({ nonce, stealthSafeAddress: stealthSafeAddressWithBytecode });
  }

  // Return the results
  return results;
}

async function runExample() {
  const results = await example({
    userPrivateKey: '0x8575420a19052cf9bbe9ef4ac755a9abaaefa3f1f2e35d14c04f38829182e9ba',
    keyGenerationMessage: `Sign this message to generate your Fluidkey private payment keys.

WARNING: Only sign this message within a trusted website or platform to avoid loss of funds.

Secret: deccc7b0ba824d3b6f73c50c41935eabf5e7e10f5b0177732344899c60be0f16`,
    chainId: 11155111,
    startNonce: 0,
    endNonce: 30,
  });

  console.log(results);
}

void runExample();
