import assert from 'node:assert';
import {
  getFallbackHandlerDeployment,
  getProxyFactoryDeployment,
  getSafeSingletonDeployment, SingletonDeployment,
} from '@safe-global/safe-deployments';
import {
  createPublicClient,
  encodeFunctionData,
  encodePacked,
  getContractAddress,
  hexToBigInt,
  http,
  keccak256,
  toBytes,
} from 'viem';
import * as chains from 'viem/chains';

/**
 * Using Viem transaction simulation, predict a new Safe address using the parameters passed in input.
 *
 * @param threshold {number} the threshold of the Safe
 * @param stealthAddresses {string[]} the stealth addresses controlling the Safe
 * @param useDefaultAddress {boolean} (optional) if true, the Safe default address will be used - see DefaultAddress inside https://github.com/safe-global/safe-deployments
 * @param chainId {number} (optional) the chainId of the network where the Safe will be deployed
 * @param transport (optional) a custom viem transport to use for the simulation
 * @return Promise<{ stealthSafeAddress }> the predicted Safe address (not deployed)
 */
export async function predictStealthSafeAddressWithClient({
  chainId,
  threshold,
  stealthAddresses,
  transport,
  useDefaultAddress,
}: {
  threshold: number;
  stealthAddresses: string[];
  chainId?: number;
  transport?: any;
  useDefaultAddress?: boolean;
}): Promise<{ stealthSafeAddress: `0x${string}` }> {

  // if useDefaultAddress is false, chainId is required
  if (!useDefaultAddress) {
    assert(!!chainId, 'chainId is required when useDefaultAddress is false');
  } else {
    // if useDefaultAddress is true, use mainnet chainId - all the chains will have the same code deployed at the same address
    chainId = 1;
  }

  const { initializer, proxyFactory, safeSingleton } = getSafeInitializerData({
    chainId,
    threshold,
    stealthAddresses,
    useDefaultAddress,
  });

  const safeSingletonAddress = useDefaultAddress ? safeSingleton.defaultAddress : safeSingleton.networkAddresses[chainId.toString()];
  const proxyFactoryAddress = useDefaultAddress ? proxyFactory.defaultAddress : proxyFactory.networkAddresses[chainId.toString()];

  // Encode the calldata for the proxy factory to deploy the safe
  const txData = encodeFunctionData({
    abi: proxyFactory.abi,
    functionName: 'createProxyWithNonce',
    args: [safeSingletonAddress, initializer, 0],
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
    account: '0x0000000000000000000000000000000000000000',
    data: txData,
    to: proxyFactoryAddress as `0x${string}`,
    gasPrice: BigInt(0),
  });

  // Return the predicted Safe address
  const stealthSafeAddress = ('0x' + (result.data as string).slice(-40)) as `0x${string}`;
  return { stealthSafeAddress };
}

/**
 * Using CREATE2 simulation, predict a new Safe address using the parameters passed in input, including the
 * bytecode of the Safe Proxy deployed.
 *
 * @param bytecode {`0x${string}`} the bytecode of the Safe Proxy to be deployed
 * @param threshold {number} the threshold of the Safe
 * @param stealthAddresses {string[]} the stealth addresses controlling the Safe
 * @param chainId {number} (optional) the chainId of the network where the Safe will be deployed
 * @param useDefaultAddress {boolean} (optional) if true, the Safe default address will be used - see DefaultAddress inside https://github.com/safe-global/safe-deployments
 * @return Promise<{ stealthSafeAddress }> the predicted Safe address (not deployed)
 */
export function predictStealthSafeAddressWithBytecode({
  chainId,
  safeProxyBytecode,
  threshold,
  stealthAddresses,
  useDefaultAddress,
}: {
  safeProxyBytecode: `0x${string}`;
  threshold: number;
  stealthAddresses: string[];
  chainId?: number;
  useDefaultAddress?: boolean;
}): { stealthSafeAddress: `0x${string}` } {
  // if useDefaultAddress is false, chainId is required
  if (!useDefaultAddress) {
    assert(!!chainId, 'chainId is required when useDefaultAddress is false');
  } else {
    // if useDefaultAddress is true, use mainnet chainId - all the chains will have the same code deployed at the same address
    chainId = 1;
  }

  const { initializer, proxyFactory, safeSingleton } = getSafeInitializerData({
    chainId,
    threshold,
    stealthAddresses,
    useDefaultAddress,
  });

  const safeSingletonAddress = useDefaultAddress ? safeSingleton.defaultAddress : safeSingleton.networkAddresses[chainId.toString()];
  const proxyFactoryAddress = useDefaultAddress ? proxyFactory.defaultAddress : proxyFactory.networkAddresses[chainId.toString()];

  const bytecodeWithSafeSingleton = encodePacked(
    ['bytes', 'uint256'],
    [safeProxyBytecode, hexToBigInt(safeSingletonAddress as `0x${string}`)],
  );

  const stealthSafeAddress = getContractAddress({
    opcode: 'CREATE2',
    bytecode: bytecodeWithSafeSingleton,
    from: proxyFactoryAddress as `0x${string}`,
    salt: toBytes(
      keccak256(
        encodePacked(
          ['uint256', 'uint256'],
          [hexToBigInt(keccak256(initializer)), BigInt(0)],
        ),
      ),
    ),
  });

  // Return the predicted Safe address
  return { stealthSafeAddress: stealthSafeAddress.toLowerCase() as `0x${string}` };
}

/**
 * Get the Safe initializer data for the given parameters, including the Safe Proxy Factory and Safe Singleton contracts.
 *
 * @param threshold {number} the threshold of the Safe
 * @param stealthAddresses {string[]} the stealth addresses controlling the Safe
 * @param chainId {number} (optional) the chainId of the network where the Safe will be deployed
 * @param useDefaultAddress {boolean} (optional) if true, the Safe default address will be used - see DefaultAddress inside https://github.com/safe-global/safe-deployments
 */
function getSafeInitializerData ({
  chainId,
  threshold,
  stealthAddresses,
  useDefaultAddress,
}: {
  threshold: number;
  stealthAddresses: string[];
  chainId?: number;
  useDefaultAddress?: boolean;
}): {
    initializer: `0x${string}`;
    proxyFactory: SingletonDeployment;
    safeSingleton: SingletonDeployment;
  } {
  // Constants
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const SAFE_VERSION = '1.3.0';

  // if useDefaultAddress is false, chainId is required
  if (!useDefaultAddress) {
    assert(!!chainId, 'chainId is required when useDefaultAddress is false');
  } else {
    // if useDefaultAddress is true, use mainnet chainId - all the chains will have the same code deployed at the same address
    chainId = 1;
  }

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

  // Get the fallback handler address
  const fallbackHandlerAddress = useDefaultAddress ? fallbackHandler.defaultAddress : fallbackHandler.networkAddresses[chainId.toString()];

  // Encode data for the initializer of the Safe singleton call
  const initializer = encodeFunctionData({
    abi: safeSingleton.abi,
    functionName: 'setup',
    args: [
      stealthAddresses,
      threshold,
      ZERO_ADDRESS,
      '0x',
      fallbackHandlerAddress,
      ZERO_ADDRESS,
      0,
      ZERO_ADDRESS,
    ],
  });

  return {
    initializer,
    proxyFactory: proxyFactory,
    safeSingleton: safeSingleton,
  };
}
