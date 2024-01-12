import { predictStealthSafeAddress } from '../src/predictStealthSafeAddress';

describe('predictStealthSafeAddress', () => {
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

    const result = await predictStealthSafeAddress({
      chainId,
      threshold,
      stealthAddresses,
    });

    expect(result).toEqual({ stealthSafeAddress: expectedStealthSafeAddress });
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
      predictStealthSafeAddress({
        chainId,
        threshold,
        stealthAddresses,
      }),
    ).rejects.toThrow('No safe contracts found for this configuration.');
  });
});
