import { extractViewingPrivateKeyNode } from '../src/extractViewingPrivateKeyNode';
import { generateEphemeralPrivateKey } from '../src/generateEphemeralPrivateKey';

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
      '0xef01af02e46bea24d45e909d3c219cbc5122e1cafd13f914deea1237ea0b01a6',
    );
  });

  it('should return the correct ephemeralPrivateKey with a nonce over 0x80000000', () => {
    const viewingPrivateKeyNode = extractViewingPrivateKeyNode(privateViewingKey);

    const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
      viewingPrivateKeyNode,
      nonce: 2147483649,
      chainId: 10,
    });

    expect(ephemeralPrivateKey).toEqual(
      '0x4f80725f967e22f2597e363f977bb563de45c5e22e9c3594ebc0de8bdccf8945',
    );
  });

  it('should throw an error if no coinType or chainId is provided', () => {
    const viewingPrivateKeyNode = extractViewingPrivateKeyNode(privateViewingKey);

    expect(() =>
      generateEphemeralPrivateKey({
        viewingPrivateKeyNode,
        nonce: 0,
      }),
    ).toThrow('coinType or chainId must be defined.');
  });
});
