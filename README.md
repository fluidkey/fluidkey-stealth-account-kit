The Fluidkey Trust Kit is an open source repository of the core cryptographic functions used by Fluidkey’s interface and SDK. It enables anyone to independently generate and recover Fluidkey stealth smart accounts and related funds. 

It is composed of the following functions:
- [`generateKeysFromSignature`](/src/generateKeysFromSignature.ts): generates a user's private keypair from a signature
- [`extractViewingPrivateKeyNode`](/src/extractViewingPrivateKeyNode.ts): extracts a [BIP-32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) node from a private viewing key
- [`generateEphemeralPrivateKey`](/src/generateEphemeralPrivateKey.ts): generates an ephemeral private key based on the private viewing key node
- [`generateStealthAddresses`](/src/generateStealthAddresses.ts): generates stealth addresses based on an ephemeral secret and a list of public spending keys
- [`predictStealthSafeAddressWithClient`](/src/predictStealthSafeAddress.ts): predicts the address of a stealth safe based on a list of stealth address owners

An example of how to use these functions to recover stealth addresses based on a user's privateKey can be found in the [`example`](/example/example.ts) folder. 

A written companion explaining the usage of these functions inside of Fluidkey's processes can be found in the [technical walkthrough](technical-walkthrough.md).

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

Coverage
-------------
![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat)
![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat)
![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat)
![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat)

License
-------
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Fluid Privacy SA
