import {
  doc,
  updateDoc,
  getDoc,
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

async function updateTransactionByID(
  firestore: Firestore | undefined,
  net: "public" | "testnet",
  transactionId: string,
  updatedData: Partial<TransactionData>
): Promise<TransactionData | null> {
  if (!firestore) {
    throw new Error("Firestore не инициализирован");
  }

  let collectionName: string;
  if (net === "public") {
    collectionName = "TransactionsForSignPublic";
  } else if (net === "testnet") {
    collectionName = "TransactionsForSignTestnet";
  } else {
    throw new Error(`Unknown net: ${net}`);
  }

  const transactionRef = doc(firestore, collectionName, transactionId).withConverter(
    transactionConverter
  );

  try {
    await updateDoc(transactionRef, {
      ...updatedData,
      updatedAt: Date.now(),
    });

    const updatedDoc = await getDoc(transactionRef);

    if (updatedDoc.exists()) {
      return updatedDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error updating transaction: ", error);
    throw error;
  }
}

export default updateTransactionByID;
