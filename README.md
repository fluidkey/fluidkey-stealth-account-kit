😶‍🌫️

The Fluidkey Stealth Account Kit is an open source TypeScript library containing the core cryptographic functions used by [Fluidkey](https://fluidkey.com). It enables anyone to independently generate and recover stealth smart accounts and related funds.  

A written companion explaining the usage of the kit in Fluidkey's processes can be found in the [technical walkthrough](https://docs.fluidkey.com/technical-walkthrough).

We hope to see more developers build privacy-preserving applications with the kit. If you have questions about the kit or want to contribute, reach out at hey@fluidkey.com.

Contents
--------
The library is composed of the following functions:
- [`generateKeysFromSignature`](/src/generateKeysFromSignature.ts): generates a user's private keypair from a signature
- [`extractViewingPrivateKeyNode`](/src/extractViewingPrivateKeyNode.ts): extracts a [BIP-32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) node from a private viewing key
- [`generateEphemeralPrivateKey`](/src/generateEphemeralPrivateKey.ts): generates an ephemeral private key based on the private viewing key node
- [`generateStealthAddresses`](/src/generateStealthAddresses.ts): generates stealth addresses based on an ephemeral secret and a list of public spending keys
- [`generateStealthPrivateKey`](/src/generateStealthPrivateKey.ts): generates the private key of the account controlling the stealth Safe
- [`predictStealthSafeAddressWithClient`](/src/predictStealthSafeAddress.ts): predicts the address of a stealth [Safe](https://safe.global/) based on a list of stealth address owners (EOAs) calling the Safe Proxy Factory Deployment contract
- [`predictStealthSafeAddressWithBytecode`](/src/predictStealthSafeAddress.ts): predicts the address of a stealth [Safe](https://safe.global/) based on a list of stealth address owners (EOAs) simulating the CREATE2 call using the bytecode of the to-be deployed Safe Proxy
- [`generateFluidkeyMessage`](/src/utils/generateFluidkeyMessage.ts): generates the Fluidkey-specific key generation message

An example of how to use these functions to recover stealth accounts based on a user's private key can be found in the [`example`](/src/example/example.ts) folder. 

> [!WARNING]
> `generateKeysFromSignature`, `extractViewingPrivateKeyNode`, and `generateStealthPrivateKey` should only be used client-side, as they expose the user's private keys.

Get Started
-----------
To get started, install the package with your preferred package manager.
  
  ```bash
  npm install @fluidkey/stealth-account-kit
  yarn add @fluidkey/stealth-account-kit
  ```

Then start using the library by importing the functions you need. 

```typescript
import { 
  generateKeysFromSignature, 
  extractViewingPrivateKeyNode,
  generateEphemeralPrivateKey,
  generateStealthAddresses,
  predictStealthSafeAddressWithClient,
} from '@fluidkey/stealth-account-kit'
```

Fluidkey Parameters
-------------------

To recover stealth accounts generated by Fluidkey, the following parameters should be used.

```typescript
const chainId = 0
const safeVersion = '1.3.0'
const useDefaultAddress = true
const threshold = 1
```
For users who are using the auto-earn feature, the initdata can be found [here](/initdata/stealth-account-initdata.md).

Audits
------

The Fluidkey Stealth Account Kit has been audited by [Dedaub](https://dedaub.com) in May 2024. You can find the full audit report [here](/audits/Fluidkey%20Stealth%20Account%20Kit%20-%20May%2024,%202024.pdf).

Dependencies
------------
- [viem](https://github.com/wevm/viem) and its dependencies, specifically:
  - [noble-hashes](https://github.com/paulmillr/noble-hashes)
  - [scure-bip32](https://github.com/paulmillr/scure-bip32)
- [noble-secp256k1](https://github.com/paulmillr/noble-secp256k1)
- [safe-deployments](https://github.com/safe-global/safe-deployments)

Credits
-------
This code has been influenced by, and contains code from [umbra-js](https://github.com/ScopeLift/umbra-protocol).

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
