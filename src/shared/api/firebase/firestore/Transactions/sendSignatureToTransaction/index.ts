import { doc, updateDoc, getDoc, DocumentData } from "firebase/firestore";
import firestore from "../..";

async function sendSignatureToTransaction(
  transactionId: string,
  signedXDR: string,
  net: "public" | "testnet"
): Promise<DocumentData | undefined> {
  if (!firestore) {
    throw new Error("Firestore not initialized");
  }

  if (!signedXDR) {
    throw new Error("Absence of a signed transaction");
  }

  let collectionName: string;
  if (net === "public") {
    collectionName = "TransactionsForSignPublic";
  } else if (net === "testnet") {
    collectionName = "TransactionsForSignTestnet";
  } else {
    throw new Error(`Unknown net: ${net}`);
  }

  const transactionRef = doc(firestore, collectionName, transactionId);

  try {
    await updateDoc(transactionRef, {
      xdr: signedXDR,
      updatedAt: Date.now(),
    })

    const updatedDoc = await getDoc(transactionRef);
    if (!updatedDoc.exists()) console.log("Document does not exist");

    return updatedDoc.data()
  } catch (error) {
    console.error("Error updating transaction: ", error);
    throw error;
  }
}

export default sendSignatureToTransaction;
