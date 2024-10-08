import { getAllTransactions } from "@/shared/api/firebase/firestore/Transactions";
import { TransactionData } from "@/shared/types";
import { Net } from "@/shared/types/store/slices";

/**
 * Fetches all transactions for a specific network.
 *
 * @param {Net} net - The network identifier for which transactions should be retrieved.
 * @returns {Promise<TransactionData[]>} A promise that resolves to an array of transaction data.
 * @throws Will log an error to the console if the fetch operation fails.
 */
const fetchAllTransactionsFromFirebase = async (net: Net): Promise<TransactionData[]> => {
  try {
    return await getAllTransactions(net);
  } catch (error) {
    console.error(`Failed to fetch transactions for network ${net}:`, error);
    return [];
  }
};

export default fetchAllTransactionsFromFirebase;
