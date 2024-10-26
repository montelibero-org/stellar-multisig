import { Transaction } from 'stellar-sdk';
import { updateTransactionByID } from '@/shared/api/firebase/firestore/Transactions';
import { Net } from '@/shared/types/store/slices';
import { TransactionData } from '@/shared/types';
import { Firestore } from 'firebase/firestore';

/**
 * Updates an existing transaction in Firestore with a new XDR.
 * @param {Transaction} transaction - The Stellar transaction to update.
 * @param {string} net - The network identifier.
 * @param {string} firebaseID - The Firestore document ID.
 * @returns {Promise<TransactionData | null>} - The result of the update operation.
 * @throws Will throw an error if the update fails.
 */
const editTransaction = async (
  firestore: Firestore | undefined,
  transaction: Transaction,
  net: Net,
  firebaseID: string
): Promise<TransactionData | null | undefined> => {
  if (!transaction) return;

  try {
    const XDR = transaction.toXDR();
    const txHash = await updateTransactionByID(firestore, net, firebaseID, {
      xdr: XDR,
      updatedAt: Date.now(),
    });
    return txHash;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to update transaction.');
  }
};

export default editTransaction;
