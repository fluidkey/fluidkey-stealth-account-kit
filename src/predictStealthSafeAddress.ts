import {
  getFallbackHandlerDeployment,
  getProxyFactoryDeployment,
  getSafeSingletonDeployment,
} from '@safe-global/safe-deployments';
import { createPublicClient, encodeFunctionData, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as chains from 'viem/chains';

/**
 * Using Viem transaction simulation, predict a new Safe address using the parameters passed in input.
 *
 * @param chainId
 * @param threshold
 * @param stealthAddresses
 * @param transport (optional) a custom viem transport to use for the simulation
 * @return Promise<{ stealthSafeAddress }> the predicted Safe address (not deployed)
 */

export async function predictStealthSafeAddress({
  chainId,
  threshold,
  stealthAddresses,
  transport,
}: {
  chainId: number;
  threshold: number;
  stealthAddresses: string[];
  transport?: any;
}): Promise<{ stealthSafeAddress: `0x${string}` }> {
  // Constants
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const SAFE_VERSION = '1.3.0';

  // Configuration to fetch the Safe contracts
  const configuration = {
    network: chainId.toString(),
    version: SAFE_VERSION,
    released: true,
  };

  // Get the Safe proxy factory
  const proxyFactory = getProxyFactoryDeployment(configuration);

  // Get the Safe singleton
  const safeSingleton = getSafeSingletonDeployment(configuration);

  // Get the Safe fallback
  const fallbackHandler = getFallbackHandlerDeployment(configuration);

  // Ensure the contracts are available on the current chain
  if (proxyFactory == null || safeSingleton == null || fallbackHandler == null) {
    throw new Error('No safe contracts found for this configuration.');
  }

  // Encode data for the initializer of the Safe singleton call
  const initializer = encodeFunctionData({
    abi: safeSingleton.abi,
    functionName: 'setup',
    args: [
      stealthAddresses,
      threshold,
      ZERO_ADDRESS,
      '0x',
      fallbackHandler.defaultAddress,
      ZERO_ADDRESS,
      0,
      ZERO_ADDRESS,
    ],
  });

  // Encode the calldata for the proxy factory to deploy the safe
  const txData = encodeFunctionData({
    abi: proxyFactory.abi,
    functionName: 'createProxyWithNonce',
    args: [safeSingleton.defaultAddress, initializer, 0],
  });

  // Get the viem chain configuration for the current chain
  let selectedChain;
  for (const chain of Object.values(chains)) {
    if (chain.id === chainId) {
      selectedChain = chain;
    }
  }

  // Create a viem client to simulate the transaction
  const client = createPublicClient({
    chain: selectedChain,
    transport: http(transport),
  });

  // Simulate the transaction
  const result = await client.call({
    account: privateKeyToAccount(
      '0x1111111111111111111111111111111111111111111111111111111111111111',
    ),
    data: txData,
    to: proxyFactory.defaultAddress as `0x${string}`,
    gasPrice: BigInt(0),
  });

  // Return the predicted Safe address
  const stealthSafeAddress = ('0x' + (result.data as string).slice(-40)) as `0x${string}`;
  return { stealthSafeAddress };
}
