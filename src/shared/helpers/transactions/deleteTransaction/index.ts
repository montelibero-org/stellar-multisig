import { deleteTransactionByID } from '@/shared/api/firebase/firestore/Transactions';
import { Net } from '@/shared/types/store/slices';
import { Firestore } from 'firebase/firestore';

/**
 * Deletes a transaction from Firestore by its ID.
 * @param {string} net - The network identifier.
 * @param {string} firebaseID - The Firestore document ID.
 * @returns {Promise<void>} - Resolves when the deletion is complete.
 * @throws Will throw an error if the deletion fails.
 */
const deleteTransaction = async (
  firestore: Firestore | undefined,
  net: Net,
  firebaseID: string
): Promise<void> => {
  try {
    await deleteTransactionByID( firestore, net, firebaseID);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to delete transaction.');
  }
};

export default deleteTransaction;
