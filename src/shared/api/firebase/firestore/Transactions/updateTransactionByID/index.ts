import {
  doc,
  updateDoc,
  getDoc,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import firestore from "../..";
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
  net: "public" | "testnet",
  transactionId: string,
  updatedData: Partial<TransactionData>
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

  const transactionRef = doc(firestore, collectionName, transactionId).withConverter(
    transactionConverter
  );

  try {
    // Обновляем документ с предоставленными данными
    await updateDoc(transactionRef, {
      ...updatedData,
      updatedAt: Date.now(),
    });

    // Получаем обновленный документ
    const updatedDoc = await getDoc(transactionRef);

    if (updatedDoc.exists()) {
      return updatedDoc.data();
    } else {
      console.log("Транзакция не найдена после обновления");
      return null;
    }
  } catch (error) {
    console.error("Ошибка при обновлении транзакции: ", error);
    throw error;
  }
}

export default updateTransactionByID;
