import {
  getProxyFactoryDeployment,
  getSafeSingletonDeployment,
  getFallbackHandlerDeployment,
} from '@safe-global/safe-deployments';
import { encodeFunctionData, AbiItem, createPublicClient, http } from 'viem';
import * as chains from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import assert from 'assert';

/**
 * Using Viem transaction simulation, predict a new Safe address using the parameters passed in input
 * @param params {PredictSafeParams}
 * @return {Promise<Safe>} the predicted Safe (not deployed)
 */

export async function predictStealthSafeAddress({
  chainId,
  threshold,
  stealthAddresses,
}: {
  chainId: number;
  threshold: number;
  stealthAddresses: string[];
}): Promise<{ stealthSafeAddress: `0x${string}` }> {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const SAFE_VERSION = '1.3.0';
  const configuration = {
    network: chainId.toString(),
    version: SAFE_VERSION,
    released: true,
  };
  // get the ProxyFactory on current chain
  const proxyFactory = getProxyFactoryDeployment(configuration);
  // get the safe singleton on current chain
  const safeSingleton = getSafeSingletonDeployment(configuration);
  // get the fallback handler
  const fallbackHandler = getFallbackHandlerDeployment(configuration);
  // encode data for the initializer of the safeSingleton call
  const initializer = encodeFunctionData({
    abi: safeSingleton?.abi as AbiItem[],
    functionName: 'setup',
    args: [
      stealthAddresses,
      threshold,
      ZERO_ADDRESS, // to
      '0x', // empty data
      fallbackHandler?.defaultAddress,
      ZERO_ADDRESS, // payment token
      0, //payment amount
      ZERO_ADDRESS, // payment receiver
    ],
  });
  // encode the call vs the proxy factory to deploy the safe
  const txData = encodeFunctionData({
    abi: proxyFactory?.abi as AbiItem[],
    functionName: 'createProxyWithNonce',
    args: [safeSingleton?.defaultAddress, initializer, 0],
  });
  assert(!!proxyFactory?.defaultAddress, 'Missing proxy factory to deploy Safe');

  let selectedChain;
  for (const chain of Object.values(chains)) {
    if (chain.id === chainId) {
      selectedChain = chain;
    }
  }

  const client = createPublicClient({
    chain: selectedChain,
    transport: http(),
  });

  const result = await client.call({
    account: privateKeyToAccount(
      '0x1111111111111111111111111111111111111111111111111111111111111111'
    ),
    data: txData,
    to: proxyFactory?.defaultAddress as `0x${string}`,
    gasPrice: BigInt(0),
  });

  const stealthSafeAddress = ('0x' + (result.data as string).slice(-40)) as `0x${string}`;
  return { stealthSafeAddress };
}
