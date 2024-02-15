import * as fc from 'fast-check';
import { HDKey } from 'viem/accounts';
import { extractViewingPrivateKeyNode } from '../src';

describe('extractPrivateViewingKeyNode', () => {
  const privateViewingKey = '0xe377059c0f7d594f953672d99706109ef69b9044a6d009daf6e3066e179dd42d';
  const expectedDepth = 2;
  const expectedIndex = 2147483648;
  const expectedChainCode = Array.from([
    241, 8, 4, 27, 208, 170, 27, 166, 78, 168, 47, 148, 103, 98, 19, 222, 61, 3, 148, 17, 23, 146,
    35, 251, 77, 254, 17, 129, 253, 67, 12, 188,
  ]);
  const expectedParentFingerprint = 105519527;
  const expectedVersions = { private: 76066276, public: 76067358 };
  const expectedPrivateKey = Array.from([
    255, 153, 251, 2, 200, 75, 235, 30, 73, 55, 228, 195, 98, 75, 154, 139, 64, 17, 254, 170, 248,
    68, 131, 164, 194, 202, 108, 100, 224, 252, 254, 66,
  ]);
  const expectedPublicKey = Array.from([
    3, 13, 79, 218, 188, 152, 135, 70, 230, 176, 40, 138, 18, 120, 202, 121, 44, 25, 28, 197, 205,
    29, 9, 214, 113, 186, 137, 39, 83, 139, 52, 36, 200,
  ]);

  it('should generate the correct HDKey from a given private viewing key and node', () => {
    const result = extractViewingPrivateKeyNode(privateViewingKey, 0);

    // Check that the result is an instance of HDKey
    expect(result).toBeInstanceOf(HDKey);

    // Check that the result has the correct properties
    expect(result.depth).toEqual(expectedDepth);
    expect(result.index).toEqual(expectedIndex);
    expect(Array.from(result.chainCode!)).toEqual(expectedChainCode);
    expect(result.parentFingerprint).toEqual(expectedParentFingerprint);
    expect(result.versions).toEqual(expectedVersions);
    expect(Array.from(result.privateKey!)).toEqual(expectedPrivateKey);
    expect(Array.from(result.publicKey!)).toEqual(expectedPublicKey);
  });

  it('should use a default node of 0 if no node is provided', () => {
    const result = extractViewingPrivateKeyNode(privateViewingKey);

    // Check that the result is an instance of HDKey
    expect(result).toBeInstanceOf(HDKey);

    // Check that the result has the correct properties
    expect(result.depth).toEqual(expectedDepth);
    expect(result.index).toEqual(expectedIndex);
    expect(Array.from(result.chainCode!)).toEqual(expectedChainCode);
    expect(result.parentFingerprint).toEqual(expectedParentFingerprint);
    expect(result.versions).toEqual(expectedVersions);
    expect(Array.from(result.privateKey!)).toEqual(expectedPrivateKey);
    expect(Array.from(result.publicKey!)).toEqual(expectedPublicKey);
  });

  it('should throw an error if the private viewing key is not a valid hex string', () => {
    expect(() => extractViewingPrivateKeyNode('0xinvalid')).toThrow(
      'Hex private viewing key is not valid.',
    );
  });

  it('should handle a variety of valid private viewing keys without crashing', () => {
    fc.assert(
      fc.property(fc.hexaString({ minLength: 64, maxLength: 64 }).map(s => `0x${s}` as `0x${string}`), (randomPrivateViewingKey) => {
        const result = extractViewingPrivateKeyNode(randomPrivateViewingKey, 0);
        expect(result).toBeInstanceOf(HDKey);
      }),
    );
  });

  it('should throw an error for a variety of invalid private viewing keys', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 64, maxLength: 64 }).map(s => `0x${s}` as `0x${string}`), (randomPrivateViewingKey) => {
        fc.pre(!/^0x[0-9a-fA-F]{64}$/.test(randomPrivateViewingKey));
        expect(() => extractViewingPrivateKeyNode(randomPrivateViewingKey)).toThrow('Hex private viewing key is not valid.');
      }),
    );
  });
});
