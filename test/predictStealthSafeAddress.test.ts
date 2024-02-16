import * as fc from 'fast-check';
import { predictStealthSafeAddressWithBytecode, predictStealthSafeAddressWithClient } from '../src';

describe('predictStealthSafeAddressWithClient', () => {
  it('should predict the correct stealth safe address', async () => {
    const chainId = 1;
    const threshold = 3;
    const stealthAddresses = [
      '0xb9e7de28c2e6c8f3c29fc0e061485a34c5864614',
      '0x5a655820821bf7af7b23566b34ce0ccbd9c9a37f',
      '0x74c19105f358bab85f8e9fda9202a1326a714d89',
      '0xfe972d3976f7cc5ba1c9b471d48362b82c6c5fdd',
    ];
    const expectedStealthSafeAddress = '0x695fd4ce104c325611ac1696fd4ba3568464810f';

    const result = await predictStealthSafeAddressWithClient({
      chainId,
      threshold,
      stealthAddresses,
    });

    expect(result).toEqual({ stealthSafeAddress: expectedStealthSafeAddress });
  });

  it('should use mainnet if useDefaultChain is passed', async () => {
    const threshold = 3;
    const stealthAddresses = [
      '0xb9e7de28c2e6c8f3c29fc0e061485a34c5864614',
      '0x5a655820821bf7af7b23566b34ce0ccbd9c9a37f',
      '0x74c19105f358bab85f8e9fda9202a1326a714d89',
      '0xfe972d3976f7cc5ba1c9b471d48362b82c6c5fdd',
    ];

    const resultWithUseDefaultAddress = await predictStealthSafeAddressWithClient({
      useDefaultAddress: true,
      threshold,
      stealthAddresses,
    });

    const resultWithChainMainnet = await predictStealthSafeAddressWithClient({
      chainId: 1,
      threshold,
      stealthAddresses,
    });

    expect(resultWithUseDefaultAddress).toEqual(resultWithChainMainnet);
  });

  it('should fail if the chain is not part of the safe deployments', async () => {
    const chainId = 123456789;
    const threshold = 3;
    const stealthAddresses = [
      '0xb9e7de28c2e6c8f3c29fc0e061485a34c5864614',
      '0x5a655820821bf7af7b23566b34ce0ccbd9c9a37f',
      '0x74c19105f358bab85f8e9fda9202a1326a714d89',
      '0xfe972d3976f7cc5ba1c9b471d48362b82c6c5fdd',
    ];

    await expect(
      predictStealthSafeAddressWithClient({
        chainId,
        threshold,
        stealthAddresses,
      }),
    ).rejects.toThrow('No safe contracts found for this configuration.');
  });

  it('should handle a variety of valid inputs without crashing', () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom(1, 5, 10, 8453, 42161),
        fc.array(fc.hexaString({ minLength: 40, maxLength: 40 }).map(s => `0x${s}`), { minLength: 1, maxLength: 10 }),
        async (chainId, stealthAddresses) => {
          const threshold = Math.floor(Math.random() * stealthAddresses.length) + 1;
          const result = await predictStealthSafeAddressWithClient({
            chainId,
            threshold,
            stealthAddresses,
          });
          expect(result).toHaveProperty('stealthSafeAddress');
          expect(result.stealthSafeAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
        },
      ),
    ).catch((error) => {
      throw error;
    });
  });

});

describe('predictStealthSafeAddressWithBytecode', () => {

  const safeProxyBytecode = '0x608060405234801561001057600080fd5b506040516101e63803806101e68339818101604052602081101561003357600080fd5b8101908080519060200190929190505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806101c46022913960400191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505060ab806101196000396000f3fe608060405273ffffffffffffffffffffffffffffffffffffffff600054167fa619486e0000000000000000000000000000000000000000000000000000000060003514156050578060005260206000f35b3660008037600080366000845af43d6000803e60008114156070573d6000fd5b3d6000f3fea2646970667358221220d1429297349653a4918076d650332de1a1068c5f3e07c5c82360c277770b955264736f6c63430007060033496e76616c69642073696e676c65746f6e20616464726573732070726f7669646564';

  it('should predict the correct stealth safe address', async () => {
    const threshold = 3;
    const stealthAddresses = [
      '0xb9e7de28c2e6c8f3c29fc0e061485a34c5864614',
      '0x5a655820821bf7af7b23566b34ce0ccbd9c9a37f',
      '0x74c19105f358bab85f8e9fda9202a1326a714d89',
      '0xfe972d3976f7cc5ba1c9b471d48362b82c6c5fdd',
    ];
    const expectedStealthSafeAddress = '0x695fd4ce104c325611ac1696fd4ba3568464810f';

    const result = predictStealthSafeAddressWithBytecode({
      useDefaultAddress: true,
      threshold,
      stealthAddresses,
      safeProxyBytecode,
    });

    expect(result).toEqual({ stealthSafeAddress: expectedStealthSafeAddress });
  });

  it('should use mainnet if useDefaultChain is passed', async () => {
    const threshold = 3;
    const stealthAddresses = [
      '0xb9e7de28c2e6c8f3c29fc0e061485a34c5864614',
      '0x5a655820821bf7af7b23566b34ce0ccbd9c9a37f',
      '0x74c19105f358bab85f8e9fda9202a1326a714d89',
      '0xfe972d3976f7cc5ba1c9b471d48362b82c6c5fdd',
    ];

    const resultWithUseDefaultAddress = predictStealthSafeAddressWithBytecode({
      useDefaultAddress: true,
      threshold,
      stealthAddresses,
      safeProxyBytecode,
    });

    const resultWithChainMainnet = predictStealthSafeAddressWithBytecode({
      chainId: 1,
      threshold,
      stealthAddresses,
      safeProxyBytecode,
    });

    expect(resultWithUseDefaultAddress).toEqual(resultWithChainMainnet);
  });

  it('should fail if the chain is not part of the safe deployments', async () => {
    const chainId = 123456789;
    const threshold = 3;
    const stealthAddresses = [
      '0xb9e7de28c2e6c8f3c29fc0e061485a34c5864614',
      '0x5a655820821bf7af7b23566b34ce0ccbd9c9a37f',
      '0x74c19105f358bab85f8e9fda9202a1326a714d89',
      '0xfe972d3976f7cc5ba1c9b471d48362b82c6c5fdd',
    ];

    expect( () =>
      predictStealthSafeAddressWithBytecode({
        chainId,
        threshold,
        stealthAddresses,
        safeProxyBytecode,
      }),
    ).toThrow('No safe contracts found for this configuration.');
  });

  it('should fail if not the chainId nor the useDefaultAddress values are there', async () => {
    const threshold = 3;
    const stealthAddresses = [
      '0xb9e7de28c2e6c8f3c29fc0e061485a34c5864614',
      '0x5a655820821bf7af7b23566b34ce0ccbd9c9a37f',
      '0x74c19105f358bab85f8e9fda9202a1326a714d89',
      '0xfe972d3976f7cc5ba1c9b471d48362b82c6c5fdd',
    ];

    expect(
      () => predictStealthSafeAddressWithBytecode({
        threshold,
        stealthAddresses,
        safeProxyBytecode,
      }),
    ).toThrow('chainId is required when useDefaultAddress is false');
  });

  it('should handle a variety of valid inputs without crashing', () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom(1, 5, 10, 8453, 42161),
        fc.array(fc.hexaString({ minLength: 40, maxLength: 40 }).map(s => `0x${s}`), { minLength: 1, maxLength: 10 }),
        async (chainId, stealthAddresses) => {
          const threshold = Math.floor(Math.random() * stealthAddresses.length) + 1;
          const result = predictStealthSafeAddressWithBytecode({
            chainId,
            threshold,
            stealthAddresses,
            safeProxyBytecode,
          });
          expect(result).toHaveProperty('stealthSafeAddress');
          expect(result.stealthSafeAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
        },
      ),
    ).catch((error) => {
      throw error;
    });
  });

});
