import * as fc from 'fast-check';
import { privateKeyToAccount } from 'viem/accounts';
import { example } from '../../src/example/example';

describe('example', () => {
  const userPrivateKey = '0x8575420a19052cf9bbe9ef4ac755a9abaaefa3f1f2e35d14c04f38829182e9ba';
  const userPin = '1234';
  const userAddress = privateKeyToAccount(userPrivateKey).address;
  const expectedStealthSafeAddresses = [
    {
      nonce: BigInt(0),
      stealthSafeAddress: '0xf08954409c41f6823bdd1f14e239b5ae9c5c9c5d',
    },
    {
      nonce: BigInt(1),
      stealthSafeAddress: '0x25016e8527ff0198bfc6a6bba2f1f128d58df45c',
    },
    {
      nonce: BigInt(2),
      stealthSafeAddress: '0xfa233664f0d087ad9efee5e45fd409febd6bdc0c',
    },
    {
      nonce: BigInt(3),
      stealthSafeAddress: '0xbedc3fe15e11e639519cecffdb0b05a9392e6fc9',
    },
    {
      nonce: BigInt(4),
      stealthSafeAddress: '0xd4957e58c5992c49853d632202ec9b04a933b81f',
    },
    {
      nonce: BigInt(5),
      stealthSafeAddress: '0xa1ba1aa1baf20c8daeb8ca61231cf2708cccb922',
    },
    {
      nonce: BigInt(6),
      stealthSafeAddress: '0x66634399fefc7239454f4e3ceae07ded298f81a7',
    },
    {
      nonce: BigInt(7),
      stealthSafeAddress: '0xd6d0c29943cdd79f2cd7dbc02ea0732d97b271bf',
    },
    {
      nonce: BigInt(8),
      stealthSafeAddress: '0x6971e692ec78c74f3c3e1d81bfddcd1bb40abb55',
    },
    {
      nonce: BigInt(9),
      stealthSafeAddress: '0x3cbb7e737b9f41c735bba1210efc2a168fb41f9c',
    },
    {
      nonce: BigInt(10),
      stealthSafeAddress: '0x16de80bfe78bf4f4aad09999b65ccf8d86bfe287',
    },
  ];

  it('should generate the correct stealth Safe addresses starting from a private key and pin', async () => {
    const result = await example({
      userPrivateKey,
      userPin,
      userAddress,
    });

    // Check that the result is correct
    expect(result[0]).toEqual(expectedStealthSafeAddresses);
    expect(result[1]).toEqual(expectedStealthSafeAddresses);
  });

  it('should generate stealth addresses for a variety of viewingPrivateKeyNodeNumbers, startNonces, endNonces, and chainIds', async () => {
    fc.assert(
      fc.property(
        fc.hexaString({ minLength: 64, maxLength: 64 }).map(s => `0x${s}` as `0x${string}`),
        fc.integer({ min: 1000, max: 9999 }).map(n => n.toString()),
        fc.integer({ min: 0, max: 100 }),
        fc.bigInt({ min: BigInt(0), max: BigInt(100000000) }),
        fc.bigInt({ min: BigInt(0), max: BigInt(100000000) }),
        fc.integer({ min: 0, max: 100 }),
        (randomUserPrivateKey, randomUserPin, randomViewingPrivateKeyNodeNumber, randomStartNonce, randomEndNonce, randomChainId) => {
          const result = example({
            userPrivateKey: randomUserPrivateKey,
            userPin: randomUserPin,
            userAddress: privateKeyToAccount(randomUserPrivateKey).address,
            viewingPrivateKeyNodeNumber: randomViewingPrivateKeyNodeNumber,
            startNonce: randomStartNonce,
            endNonce: randomStartNonce + randomEndNonce,
            chainId: randomChainId,
          });
          void expect(result).resolves.toBeInstanceOf(Array);
        },
      ),
    );
  });
});
