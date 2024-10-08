import { doc, deleteDoc } from "firebase/firestore";
import firestore from "../..";
import { Net } from "@/shared/types/store/slices";

async function deleteTransactionByID(
  net: Net,
  transactionId: string
): Promise<void> {
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

  const transactionRef = doc(firestore, collectionName, transactionId);

  try {
    await deleteDoc(transactionRef);
    console.log(`Транзакция с ID ${transactionId} успешно удалена`);
  } catch (error) {
    console.error("Ошибка при удалении транзакции: ", error);
    throw error;
  }
}

export default deleteTransactionByID;
