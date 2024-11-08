// @/shared/helpers/updateTransactionSequence/index.ts

import { Net } from '@/shared/types/store/slices/shared/netSlice';
import { Server, AccountResponse } from 'stellar-sdk';

/**
 * Updates the transaction sequence number for the specified Stellar account.
 *
 * @param publicKey - The public key of the Stellar account.
 * @param net - The network type ('public' or 'testnet').
 * @returns The updated sequence number.
 * @throws Error if unable to load the account or update the sequence number.
 */
async function updateTransactionSequence(
  publicKey: string,
  net: Net
): Promise<number> {
  const serverUrl =
    net === 'public'
      ? 'https://horizon.stellar.org'
      : 'https://horizon-testnet.stellar.org';
  const server = new Server(serverUrl);

  try {
    const account: AccountResponse = await server.loadAccount(publicKey);
    const currentSequence: number = parseInt(account.sequence, 10);
    const updatedSequence: number = currentSequence + 1;
    return updatedSequence;
  } catch (error) {
    console.error('Error updating the sequence number:', error);
    throw error;
  }
}

export default updateTransactionSequence;
