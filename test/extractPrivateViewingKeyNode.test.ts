import { HDKey } from 'viem/accounts';
import { extractPrivateViewingKeyNode } from '../src/extractPrivateViewingKeyNode';

describe('extractPrivateViewingKeyNode', () => {
  it('should generate the correct HDKey from a given private viewing key and node', () => {
    const privateViewingKey = new Uint8Array([
      227, 119, 5, 156, 15, 125, 89, 79, 149, 54, 114, 217, 151, 6, 16, 158, 246, 155, 144, 68, 166,
      208, 9, 218, 246, 227, 6, 110, 23, 157, 212, 45,
    ]);
    const node = 0;

    const result = extractPrivateViewingKeyNode(privateViewingKey, node);

    // Check that the result is an instance of HDKey
    expect(result).toBeInstanceOf(HDKey);

    // Check that the result has the correct properties
    // Replace 'expectedPublicKey' and 'expectedPrivateKey' with the expected values
    expect(result.depth).toEqual(2);
    expect(result.index).toEqual(2147483648);
    expect(Array.from(result.chainCode as Uint8Array)).toEqual(
      Array.from([
        241, 8, 4, 27, 208, 170, 27, 166, 78, 168, 47, 148, 103, 98, 19, 222, 61, 3, 148, 17, 23,
        146, 35, 251, 77, 254, 17, 129, 253, 67, 12, 188,
      ])
    );
    expect(result.parentFingerprint).toEqual(105519527);
    expect(result.versions).toEqual({ private: 76066276, public: 76067358 });
    expect(Array.from(result.privateKey as Uint8Array)).toEqual(
      Array.from([
        255, 153, 251, 2, 200, 75, 235, 30, 73, 55, 228, 195, 98, 75, 154, 139, 64, 17, 254, 170,
        248, 68, 131, 164, 194, 202, 108, 100, 224, 252, 254, 66,
      ])
    );
    expect(Array.from(result.publicKey as Uint8Array)).toEqual(
      Array.from([
        3, 13, 79, 218, 188, 152, 135, 70, 230, 176, 40, 138, 18, 120, 202, 121, 44, 25, 28, 197,
        205, 29, 9, 214, 113, 186, 137, 39, 83, 139, 52, 36, 200,
      ])
    );
  });

  // it('should use a default node of 0 if no node is provided', () => {
  //   const privateViewingKey = new Uint8Array([
  //     227, 119, 5, 156, 15, 125, 89, 79, 149, 54, 114, 217, 151, 6, 16, 158, 246, 155, 144, 68, 166,
  //     208, 9, 218, 246, 227, 6, 110, 23, 157, 212, 45,
  //   ]); // replace with a valid private viewing key

  //   const result = extractPrivateViewingKeyNode(privateViewingKey);

  //   // Check that the result is an instance of HDKey
  //   expect(result).toBeInstanceOf(HDKey);

  //   // Check that the result has the correct properties
  //   // Replace 'expectedPublicKey' and 'expectedPrivateKey' with the expected values
  //   expect(result.publicKey).toEqual('expectedPublicKey');
  //   expect(result.privateKey).toEqual('expectedPrivateKey');
  // });
});
