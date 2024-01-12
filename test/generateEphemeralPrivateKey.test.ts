import { generateEphemeralPrivateKey } from '../src/generateEphemeralPrivateKey';
import { extractPrivateViewingKeyNode } from '../src/extractPrivateViewingKeyNode';

describe('generateEphemeralPrivateKey', () => {
  const privateViewingKey = new Uint8Array([
    227, 119, 5, 156, 15, 125, 89, 79, 149, 54, 114, 217, 151, 6, 16, 158, 246, 155, 144, 68, 166,
    208, 9, 218, 246, 227, 6, 110, 23, 157, 212, 45,
  ]);

  it('should return the correct ephemeralPrivateKey with a low nonce', () => {
    const viewingPrivateKeyNode = extractPrivateViewingKeyNode(privateViewingKey);

    const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
      viewingPrivateKeyNode,
      nonce: 0,
      chainId: 10,
    });

    expect(ephemeralPrivateKey).toEqual(
      '0xef01af02e46bea24d45e909d3c219cbc5122e1cafd13f914deea1237ea0b01a6'
    );
  });

  it('should return the correct ephemeralPrivateKey with a nonce over 0x80000000', () => {
    const viewingPrivateKeyNode = extractPrivateViewingKeyNode(privateViewingKey);

    const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
      viewingPrivateKeyNode,
      nonce: 2147483649,
      chainId: 10,
    });

    expect(ephemeralPrivateKey).toEqual(
      '0x4f80725f967e22f2597e363f977bb563de45c5e22e9c3594ebc0de8bdccf8945'
    );
  });

  it('should throw an error if no coinType or chainId is provided', () => {
    const viewingPrivateKeyNode = extractPrivateViewingKeyNode(privateViewingKey);

    expect(() =>
      generateEphemeralPrivateKey({
        viewingPrivateKeyNode,
        nonce: 0,
      })
    ).toThrow('coinType or chainId must be defined.');
  });
});
