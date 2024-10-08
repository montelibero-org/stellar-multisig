import {
  doc,
  getDoc,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import firestore from "../..";
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
  net: "public" | "testnet",
  transactionId: string
): Promise<TransactionData | null> {
  if (!firestore) {
    throw new Error("Firestore не инициализирован");
  }

  // Определяем название коллекции на основе сети
  let collectionName: string;
  if (net === "public") {
    collectionName = "TransactionsForSignPublic";
  } else if (net === "testnet") {
    collectionName = "TransactionsForSignTestnet";
  } else {
    throw new Error(`Неизвестная сеть: ${net}`);
  }

  const transactionDoc = doc(firestore, collectionName, transactionId).withConverter(transactionConverter);

  try {
    const docSnapshot = await getDoc(transactionDoc);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("Транзакция не найдена");
      return null;
    }
  } catch (error) {
    console.error("Ошибка при получении транзакции: ", error);
    throw error;
  }
}

export default getTransactionByID;
