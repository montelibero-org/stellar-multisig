import { collection, addDoc } from "firebase/firestore";
import firestore from "../..";
import { Transaction } from "stellar-sdk";
import { TransactionData } from "@/shared/types";
import { Net } from "@/shared/types/store/slices";

async function sendTransaction(
  net: Net,
  transaction?: Transaction | null,
  xdr?: string,
): Promise<string> {
  if (!firestore) {
    throw new Error("Firestore не инициализирован");
  }

  if (!transaction && !xdr) {
    throw new Error("Отсутствует транзакция");
  }

  if (transaction && xdr) {
    throw new Error("Должно быть отправлено или транзакция, или XDR");
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

  const transactionsCollection = collection(firestore, collectionName);

  // Конвертируем транзакцию в XDR и оборачиваем в обычный объект
  const transactionData: Partial<TransactionData> = {
    xdr: transaction?.toXDR(),
    createdAt: Date.now(),
  };

  try {
    const docRef = await addDoc(transactionsCollection, transactionData);
    console.log("Документ добавлен с ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Ошибка при добавлении документа: ", error);
    throw error;
  }
}

export default sendTransaction;
