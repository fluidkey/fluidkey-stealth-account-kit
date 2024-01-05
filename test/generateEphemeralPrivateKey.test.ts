import { generateEphemeralPrivateKey } from '../src/generateEphemeralPrivateKey';
import { extractPrivateViewingKeyNode } from '../src/extractPrivateViewingKeyNode';
import { PRIVATE_VIEWING_KEY_UINT8 } from './constants';

describe('generateEphemeralPrivateKey', () => {
  it('should return the correct ephemeralPrivateKey with a low nonce', () => {
    const viewingPrivateKeyNode = extractPrivateViewingKeyNode(PRIVATE_VIEWING_KEY_UINT8);

    const { ephemeralPrivateKey } = generateEphemeralPrivateKey({
      viewingPrivateKeyNode,
      nonce: 0,
      chainId: 10,
    });

    expect(ephemeralPrivateKey).toEqual(
      '0xef01af02e46bea24d45e909d3c219cbc5122e1cafd13f914deea1237ea0b01a6'
    );
  });
});
