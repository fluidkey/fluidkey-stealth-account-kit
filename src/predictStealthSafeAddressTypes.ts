export type SafeVersion = '1.4.1' | '1.3.0' | '1.2.0' | '1.1.1' | '1.0.0';

/**
 * Extra options that can be set within the Initializer when deploying a Stealth Safe.
 * For references on their values see how params are used during the setup
 * ( https://github.com/safe-global/safe-smart-account/blob/77bab0d37b78c26482f94662344c9af0994253f7/contracts/Safe.sol#L84 )
 */
export type InitializerExtraFields = {
  to?: `0x${string}`;
  data?: `0x${string}`;
  fallbackHandler?: `0x${string}`;
  paymentToken?: `0x${string}`;
  /** The payment amount. Set as string to avoid losing precision on large numbers. */
  payment?: string;
  paymentReceiver?: `0x${string}`;
}
