import { Transaction } from 'stellar-sdk';
import { sendTransaction } from '@/shared/api/firebase/firestore/Transactions';
import { Net } from '@/shared/types/store/slices';
import { Firestore } from 'firebase/firestore';

/**
 * Sends a Stellar transaction for signing via the Stellar network.
 * @param {Transaction} transaction - The Stellar transaction to send.
 * @param {string} net - The network identifier ('testnet' or 'public').
 * @returns {Promise<string | undefined>} - The transaction hash if successful.
 * @throws Will throw an error if the transaction fails to send.
 */
const sendTransactionForSign = async (
  firestore: Firestore | undefined,
  transaction: Transaction,
  net: Net,
): Promise<string | undefined> => {
  if (!transaction) return;

  try {
    const txHash = await sendTransaction(firestore, net, transaction);;
    console.log(txHash);
    return txHash;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send transaction.');
  }
};

export default sendTransactionForSign;
