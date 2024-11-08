import {
  collection,
  getDocs,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  Firestore,
} from "firebase/firestore";
import { TransactionData } from "@/shared/types";

const transactionConverter: FirestoreDataConverter<TransactionData> = {
  toFirestore(transaction: TransactionData): DocumentData {
    return {
      xdr: transaction.xdr,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): TransactionData {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      xdr: data.xdr,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

async function getAllTransactions(
  firestore: Firestore | undefined,
  net: "public" | "testnet"
): Promise<TransactionData[]> {
  if (!firestore) {
    throw new Error("Firestore not initialized");
  }

  let collectionName: string;
  if (net === "public") {
    collectionName = "TransactionsForSignPublic";
  } else if (net === "testnet") {
    collectionName = "TransactionsForSignTestnet";
  } else {
    throw new Error(`Unknown net: ${net}`);
  }

  const transactionsCollection = collection(
    firestore,
    collectionName
  ).withConverter(transactionConverter);

  try {
    const querySnapshot = await getDocs(transactionsCollection);
    const transactions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
      xdr: doc.data().xdr,
    }));
    return transactions;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
}

export default getAllTransactions;
