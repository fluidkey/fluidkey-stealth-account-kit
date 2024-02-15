import * as fc from 'fast-check';
import { generateKeysFromSignature } from '../src';

describe('generateKeysFromSignature', () => {
  it('should generate a private key pair from a valid signature', () => {
    const signature =
      '0xd6bf71e45d06a0ccc68523f090148e38941cbdf4113edb59ecad3e0a5f1e7ceb7b6fd1e1ddd1d2141f263bcfa4b1a3f8bf64f809aaed1b03e722cd88c82344c21b';
    const { spendingPrivateKey, viewingPrivateKey } = generateKeysFromSignature(signature);

    expect(spendingPrivateKey).toEqual(
      '0x641f9f8b285fa1d22b009ea8c947bb6d88129b320b729d98810b40b51e8572c7',
    );
    expect(viewingPrivateKey).toEqual(
      '0x16988506fc3aa66bad0f3f231aa9552a1639b7c05477e6d59f8044adb3155322',
    );
  });

  it('should throw an error for a signature that does not have the correct length', () => {
    const signature = ('0x' + 'a'.repeat(128)) as `0x${string}`;
    expect(() => generateKeysFromSignature(signature)).toThrow('Signature is not valid.');
  });

  it('should throw an error for a signature missing 0x', () => {
    const signature = 'a'.repeat(132) as `0x${string}`;
    expect(() => generateKeysFromSignature(signature)).toThrow('Signature is not valid.');
  });

  it('should handle a variety of inputs without crashing or errors', () => {
    fc.assert(
      fc.property(fc.hexaString({ minLength: 130, maxLength: 130 }).map(s => `0x${s}` as `0x${string}`), (signature) => {
        generateKeysFromSignature(signature);
      }),
    );
  });
});
