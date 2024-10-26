import {
  doc,
  getDoc,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  Firestore,
} from "firebase/firestore";
import { TransactionData } from "@/shared/types";

const transactionConverter: FirestoreDataConverter<TransactionData> = {
  toFirestore(transaction: TransactionData): DocumentData {
    return { xdr: transaction.xdr, createdAt: transaction.createdAt, updatedAt: transaction.updatedAt };
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

async function getTransactionByID(
  firestore: Firestore | undefined,
  net: "public" | "testnet",
  transactionId: string
): Promise<TransactionData | null> {
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

  const transactionDoc = doc(firestore, collectionName, transactionId).withConverter(transactionConverter);

  try {
    const docSnapshot = await getDoc(transactionDoc);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("Not found transaction: ");
      return null;
    }
  } catch (error) {
    console.error("Error getting transaction: ", error);
    throw error;
  }
}

export default getTransactionByID;
