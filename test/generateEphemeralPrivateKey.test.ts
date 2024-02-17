import * as fc from 'fast-check';
import { extractViewingPrivateKeyNode, generateEphemeralPrivateKey } from '../src';

describe('generateEphemeralPrivateKey', () => {
  const privateViewingKey = '0xe377059c0f7d594f953672d99706109ef69b9044a6d009daf6e3066e179dd42d';

  it('should return the correct ephemeralPrivateKey with a low nonce', () => {
    const viewingPrivateKeyNode = extractViewingPrivateKeyNode(privateViewingKey);

    const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
      viewingPrivateKeyNode,
      nonce: 0,
      chainId: 10,
    });

    expect(ephemeralPrivateKey).toEqual(
      '0xe0b00bde074552abedf968bdbfbcaab4d7a2c85a2251ef7cd6c29df9d9cf13b7',
    );
  });

  it('should return the correct ephemeralPrivateKey with a nonce between 0x80000000 and 0x7FFFFFFFFFFFFF', () => {
    const viewingPrivateKeyNode = extractViewingPrivateKeyNode(privateViewingKey);

    const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
      viewingPrivateKeyNode,
      nonce: 2147483649,
      chainId: 10,
    });

    expect(ephemeralPrivateKey).toEqual(
      '0x51bbb418b9c5743db6ea0419002b7da4bf3e0232adde05fc2d23334b388a726e',
    );
  });

  it('should return the correct ephemeralPrivateKey with a coinType as parameter', () => {
    const viewingPrivateKeyNode = extractViewingPrivateKeyNode(privateViewingKey);

    const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
      viewingPrivateKeyNode,
      nonce: 0,
      coinType: 2147483658,
    });

    expect(ephemeralPrivateKey).toEqual(
      '0xe0b00bde074552abedf968bdbfbcaab4d7a2c85a2251ef7cd6c29df9d9cf13b7',
    );
  });

  // TO-DO throw an error if the nonce is too high

  it('should throw an error if no coinType or chainId is provided', () => {
    const viewingPrivateKeyNode = extractViewingPrivateKeyNode(privateViewingKey);

    expect(() =>
      generateEphemeralPrivateKey({
        viewingPrivateKeyNode,
        nonce: 0,
      }),
    ).toThrow('coinType or chainId must be defined.');
  });

  it('should handle a variety of valid private viewing keys and nonces without crashing', () => {
    fc.assert(
      fc.property(fc.hexaString({ minLength: 64, maxLength: 64 }).map(s => `0x${s}` as `0x${string}`), fc.nat(), (randomPrivateViewingKey, nonce) => {
        const viewingPrivateKeyNode = extractViewingPrivateKeyNode(randomPrivateViewingKey);
        const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
          viewingPrivateKeyNode,
          nonce,
          chainId: 10,
        });
        expect(ephemeralPrivateKey).toMatch(/^0x[0-9a-fA-F]{64}$/);
      }),
    );
  });
});
