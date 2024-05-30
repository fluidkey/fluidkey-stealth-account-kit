import { keccak256, toHex } from 'viem';

/**
 * Generate the key generation message specific to the Fluidkey interface.
 *
 * @param pin the user's PIN
 * @param address the address the user is connected to the Fluidkey interface with
 * @returns message
 */
export function generateFluidkeyMessage({
  pin,
  address,
}: {
  pin: string;
  address: string;
}): { message: string } {
  // Generate the secret based on the user's PIN and address
  const secret = keccak256(toHex(address + pin)).replace(
    '0x',
    '',
  );

  // Compose the message
  const message = `Sign this message to generate your Fluidkey private payment keys.

WARNING: Only sign this message within a trusted website or platform to avoid loss of funds.

Secret: ${secret}`;

  // Return the message
  return { message };
}