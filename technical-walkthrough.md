# Technical Walkthrough

This walkthrough provides background on Fluidkey's core crypto functions, which are released as an [open source trust kit](https://github.com/fluidkey/fluidkey-trust-kit).

## 1. Background Reading

To keep the walkthrough concise, we assume the reader has a basic understanding of the following concepts. If you're not familiar with them, we have provided links to resources covering each topic.

- [Elliptic Curve Cryptography](https://blog.cloudflare.com/a-relatively-easy-to-understand-primer-on-elliptic-curve-cryptography/)
- [Accounts and transactions on public EVM blockchains](https://github.com/ethereumbook/ethereumbook)
- [Stealth addresses](https://vitalik.eth.limo/general/2023/01/20/stealth.html)

## 2. User Keys

When a user signs into Fluidkey, they are asked to sign a key generation message with their existing Ethereum account. The signature of this message is used to derive the user's private key pair. 

See [`generateKeysFromSignature`](/src/generateKeysFromSignature.ts) in the trust kit.

The private key pair never leaves the user's client and is not stored locally. Every time the user re-opens the Fluidkey app, they must sign the key generation message again to derive their private keys.

The private key pair is composed of two keys:
- A **private spending key** used to control user funds and sign transactions
- A **private viewing key** used to retrieve user funds and view transactions

To allow Fluidkey to generate addresses on behalf of the user and retrieve their funds, the user shares a [BIP-32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) derived node of their private viewing key with Fluidkey. 

The shared node is of the form `m/5564'/N'` where `N` is the number identifying the specific node shared. 5564 refers to [ERC-5564](https://eips.ethereum.org/EIPS/eip-5564), focused on standardizing the use of stealth addresses. 

See [`extractViewingPrivateKeyNode`](/src/extractViewingPrivateKeyNode.ts) in the trust kit.

## 3. Stealth Accounts

Fluidkey currently uses 1/1 [Safe smart accounts](https://github.com/safe-global/safe-contracts) as stealth accounts. They act as stealth addresses with the added UX benefits of smart accounts, such as:
- Gas sponsorship
- Multisig compatibility
- Key rotation
- Compatibility with other Safe modules

A drawback to be aware of, is that like regular Safes, stealth smart account addresses are not usable across multiple chains. Users therefore need to ensure they use an address generated for the chain they are receiving funds on. 

For every available chain, Fluidkey provides users with a static ENS of the form `username.chain_shortname.fkey.id/eth`, such as `user.op.fkey.id` on Optimism. This identifier resolves a new stealth address specific to the chain on every query. This allows users to send funds to a single human-readable identifier while protecting recipient privacy.

### 3.a. Stealth Signer Derivation

Each stealth account is controlled by a stealth EOA that acts as the sole signer authorized to approve transactions and control the stealth account. 

The stealth EOA is derived pseudo-randomly using the viewing key node shared by the user (see section 2.). Every time a new stealth account is required, the ephemeral private key used to derive the stealth EOA is a new leaf of the shared viewing key node. 

Specifically, each new stealth address request increments the viewing key node `p/n` by one and derives the secret from the obtained leaf `m/5564'/N'/c0'/c1'/0'/p'/n'`, where `c0` and `c1` represent the coinType of the chain used following [ENSIP-11](https://docs.ens.domains/ens-improvement-proposals/ensip-11-evmchain-address-resolution ).

See [`generateEphemeralPrivateKey`](/src/generateEphemeralPrivateKey.ts) and [`generateStealthAddresses`](/src/generateStealthAddresses.ts) in the trust kit.

The pseudo-random derivation of the stealth EOA ensures that the user can independently replay all stealth addresses generated and recover funds without relying on Fluidkey.

### 3.b. Counterfactual Instantiation

Sending assets to a user's stealth account does not require the deployment of the underlying smart contract. Instead, the stealth account's address is counterfactually predicted and is only deployed at the moment of withdrawal. 

See [`predictStealthSafeAddress`](/src/predictStealthSafeAddress.ts) in the trust kit.