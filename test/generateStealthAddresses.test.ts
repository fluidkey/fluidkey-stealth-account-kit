import * as fc from 'fast-check';
import { privateKeyToAccount } from 'viem/accounts';
import { generateStealthAddresses } from '../src';

describe('generateStealthAddresses', () => {
  it('should generate the correct stealth addresses', () => {
    const spendingPublicKeys = [
      privateKeyToAccount('0x641f9f8b285fa1d22b009ea8c947bb6d88129b320b729d98810b40b51e8572c7')
        .publicKey,
      privateKeyToAccount('0xef01af02e46bea24d45e909d3c219cbc5122e1cafd13f914deea1237ea0b01a6')
        .publicKey,
    ];
    const ephemeralPrivateKey =
      '0x4f80725f967e22f2597e363f977bb563de45c5e22e9c3594ebc0de8bdccf8945';

    const result = generateStealthAddresses({
      spendingPublicKeys,
      ephemeralPrivateKey,
    });

    expect(result).toEqual({
      stealthAddresses: [
        '0xf4126489ac2f0df6441d0b72efcc760ef0c19706',
        '0x566953fb7a022f8c7f6421464ab700590f2b3464',
      ],
    });
  });

  it('should handle a variety of valid private keys without crashing', () => {
    fc.assert(
      fc.property(
        fc.array(fc.hexaString({ minLength: 64, maxLength: 64 }).map(s => `0x${s}` as `0x${string}`), { minLength: 1, maxLength: 10 }),
        fc.hexaString({ minLength: 64, maxLength: 64 }).map(s => `0x${s}` as `0x${string}`),
        (privateKeys, ephemeralPrivateKey) => {
          const spendingPublicKeys = privateKeys.map(privateKey => privateKeyToAccount(privateKey).publicKey);
          const result = generateStealthAddresses({
            spendingPublicKeys,
            ephemeralPrivateKey,
          });
          for (const stealthAddress of result.stealthAddresses) {
            expect(stealthAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
            expect(stealthAddress).toHaveLength(42);
          }
        },
      ),
    );
  });
});
