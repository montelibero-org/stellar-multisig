import { collection, addDoc, Firestore } from "firebase/firestore";
import { Transaction } from "stellar-sdk";
import { TransactionData } from "@/shared/types";
import { Net } from "@/shared/types/store/slices";

async function sendTransaction(
  firestore: Firestore | undefined,
  net: Net,
  transaction?: Transaction | null,
  xdr?: string,
): Promise<string> {
  if (!firestore) {
    throw new Error("Firestore not initialized");
  }

  if (!transaction && !xdr) {
    throw new Error("Absence of a signed transaction");
  }

  if (transaction && xdr) {
    throw new Error("Either a transaction or an XDR must be sent");
  }

  let collectionName: string;
  if (net === "public") {
    collectionName = "TransactionsForSignPublic";
  } else if (net === "testnet") {
    collectionName = "TransactionsForSignTestnet";
  } else {
    throw new Error(`Unknown net: ${net}`);
  }

  const transactionsCollection = collection(firestore, collectionName);

  // Конвертируем транзакцию в XDR и оборачиваем в обычный объект
  const transactionData: Partial<TransactionData> = {
    xdr: transaction?.toXDR(),
    createdAt: Date.now(),
  };

  try {
    const docRef = await addDoc(transactionsCollection, transactionData);
    return docRef.id;
  } catch (error) {
    console.error("Error sending transaction: ", error);
    throw error;
  }
}

export default sendTransaction;
