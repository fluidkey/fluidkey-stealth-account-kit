The Fluidkey Trust Kit is an open source repository of the core cryptographic functions used by Fluidkey’s interface and SDK. It enables anyone to independently generate and recover Fluidkey stealth smart accounts and related funds. 

It is composed of the following functions:
- `generateKeysFromSignature`: generates a user's private keypair from a signature
- `extractViewingPrivateKeyNode`: extracts a [BIP-32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) node from a private viewing key
- `generateEphemeralPrivateKey`: generates an ephemeral private key based on the private viewing key node
- `generateStealthAddresses`: generates stealth addresses based on an ephemeral secret and a list of public spending keys
- `predictStealthSafeAddress`: predicts the address of a stealth safe based on a list of stealth address owners

An example of how to use these functions to recover stealth addresses based on a user's privateKey can be found in the `example` folder.

Dependencies
------------
- [viem](https://github.com/wevm/viem) and its dependencies, specifically:
  - [noble-hashes](https://github.com/paulmillr/noble-hashes)
  - [scure-bip32](https://github.com/paulmillr/scure-bip32)
- [noble-secp256k1](https://github.com/paulmillr/noble-secp256k1)
- [safe-deployments](https://github.com/safe-global/safe-deployments)


Credits
-------
This code has been influenced by, and contains code from [umbra-js](https://github.com/ScopeLift/umbra-protocol)