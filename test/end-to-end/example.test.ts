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
      stealthPrivateKey: '0xc3496b0b8564827706bd71a9a7c147adcd29e044f525e8002416172f4c24db5f',
    },
    {
      nonce: BigInt(1),
      stealthSafeAddress: '0x25016e8527ff0198bfc6a6bba2f1f128d58df45c',
      stealthPrivateKey: '0x9144dea9bca79a4a300e94b8e1a4979d501159c9adc4b10364bfaafea3c34139',
    },
    {
      nonce: BigInt(2),
      stealthSafeAddress: '0xfa233664f0d087ad9efee5e45fd409febd6bdc0c',
      stealthPrivateKey: '0xfdfd59cc5b2feb553a5f4c1a97e7f00458402fa9f4e205687bf7d0a8a85f1b4e',
    },
    {
      nonce: BigInt(3),
      stealthSafeAddress: '0xbedc3fe15e11e639519cecffdb0b05a9392e6fc9',
      stealthPrivateKey: '0x4f3e1be745773ca6577b37f8da935f0c8245dc872a23b42af93cf3937ab56fe2',
    },
    {
      nonce: BigInt(4),
      stealthSafeAddress: '0xd4957e58c5992c49853d632202ec9b04a933b81f',
      stealthPrivateKey: '0xf4910a0b5ed9e9ab8709cbe85435cff10a4e1a9707687dd1fd633ea890337ab0',
    },
    {
      nonce: BigInt(5),
      stealthSafeAddress: '0xa1ba1aa1baf20c8daeb8ca61231cf2708cccb922',
      stealthPrivateKey: '0x6c5d4bbe26f1db6ed6523be8cf987935232ca5d32317854dd70031408261a621',
    },
    {
      nonce: BigInt(6),
      stealthSafeAddress: '0x66634399fefc7239454f4e3ceae07ded298f81a7',
      stealthPrivateKey: '0x4bbe8b6b45ea6febb6316f6f64cf595e81514d67aece0bdd01fd549b0c4ed525',
    },
    {
      nonce: BigInt(7),
      stealthSafeAddress: '0xd6d0c29943cdd79f2cd7dbc02ea0732d97b271bf',
      stealthPrivateKey: '0xfb92ddb354c4c3fb696a84eb217402940bba4a30919e150606be462adda0a113',
    },
    {
      nonce: BigInt(8),
      stealthSafeAddress: '0x6971e692ec78c74f3c3e1d81bfddcd1bb40abb55',
      stealthPrivateKey: '0xacfde69e98dcf6dd41fd9a89897c7898abc3faed21195e5fe97dc89469d97556',
    },
    {
      nonce: BigInt(9),
      stealthSafeAddress: '0x3cbb7e737b9f41c735bba1210efc2a168fb41f9c',
      stealthPrivateKey: '0xcca098b0704d16e5750b27603fe5ea356986e53e8f05a8fedcfb8ecb31befae2',
    },
    {
      nonce: BigInt(10),
      stealthSafeAddress: '0x16de80bfe78bf4f4aad09999b65ccf8d86bfe287',
      stealthPrivateKey: '0x65d4c59647bf0e86f01f9373e7f354c45484eb09008e7f891a8593801581ff6f',
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
  }, 60000);

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
  }, 60000);
});
