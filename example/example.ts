import { privateKeyToAccount } from 'viem/accounts';
import { extractViewingPrivateKeyNode } from '../src/extractViewingPrivateKeyNode';
import { generateEphemeralPrivateKey } from '../src/generateEphemeralPrivateKey';
import { generateKeysFromSignature } from '../src/generateKeysFromSignature';
import { generateStealthAddresses } from '../src/generateStealthAddresses';
import { predictStealthSafeAddress } from '../src/predictStealthSafeAddress';

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
    console.log(ephemeralPrivateKey);

    // Generate the stealth owner address
    const { stealthAddresses } = generateStealthAddresses({
      spendingPublicKeys: [spendingPublicKey],
      ephemeralPrivateKey,
    });

    // Predict the corresponding stealth Safe address
    const { stealthSafeAddress } = await predictStealthSafeAddress({
      chainId,
      threshold: 1,
      stealthAddresses,
    });

    // Add the result to the results array
    results.push({ nonce, stealthSafeAddress });
  }

  // Return the results
  return results;
}

async function runExample() {
  const results = await example({
    userPrivateKey: '0xa795a0c0b64ccd65c1ca2890f8a592a9cad9f11e4a63a34acd628d8e308d39a4',
    keyGenerationMessage: `Sign this message to generate your Fluidkey private payment keys.

WARNING: Only sign this message within a trusted website or platform to avoid loss of funds.

Secret: c0bd24706c958efa41b1e470838288dbd617a30930c974e403e386e4434648ac`,
    chainId: 5,
  });

  console.log(results);
}

void runExample();