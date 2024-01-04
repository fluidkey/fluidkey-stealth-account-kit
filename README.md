The Fluidkey Trust Kit is an open source repository of the core cryptographic functions used by Fluidkey’s interface and SDK. It enables anyone to independently generate and recover Fluidkey stealth smart accounts and related funds. It is composed of the following functions:
- `generateKeysFromSignature`: generates a user's private keypair from a signature
- `extractPrivateViewingKeyNode`: extracts a [BIP-32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) node from a private viewing key
- `generateEphemeralSecret`: generates an ephemeral secret based on the private viewing key node
- `generateStealthAddresses`: generates stealth addresses based on an ephemeral secret and a list of public spending keys
- `predictStealthSafeAddress`: predicts the address of a stealth safe based on a list of stealth address owners

Dependencies
------------
- [viem](https://github.com/wevm/viem) and its dependencies, specifically:
  - [noble-hashes](https://github.com/paulmillr/noble-hashes)
  - [scure-bip32](https://github.com/paulmillr/scure-bip32)
- [noble-secp256k1](https://github.com/paulmillr/noble-secp256k1)

Credits
-------
This code has been influenced by, and contains code from [umbra-js](https://github.com/ScopeLift/umbra-protocol)