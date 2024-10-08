import { doc, updateDoc, getDoc, DocumentData } from "firebase/firestore";
import firestore from "../..";

async function sendSignatureToTransaction(
  transactionId: string,
  signedXDR: string,
  net: "public" | "testnet"
): Promise<DocumentData | undefined> {
  if (!firestore) {
    throw new Error("Firestore не инициализирован");
  }

  if (!signedXDR) {
    throw new Error("Отсутствует подписанная транзакция");
  }

  console.log(transactionId, net);

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
    await updateDoc(transactionRef, {
      xdr: signedXDR,
      updatedAt: Date.now(),
    })

    const updatedDoc = await getDoc(transactionRef);
    if (updatedDoc.exists()) {
      console.log("Обновленный документ:", updatedDoc.data());
    } else {
      console.log("Документ не найден после обновления");
    }

    return updatedDoc.data()
  } catch (error) {
    console.error("Ошибка при обновлении транзакции: ", error);
    throw error;
  }
}

export default sendSignatureToTransaction;
