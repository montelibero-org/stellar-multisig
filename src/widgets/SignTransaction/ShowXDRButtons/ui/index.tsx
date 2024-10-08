import {
  sendSignatureToTransaction as sendSignatureToTransactionFirebase,
  sendTransaction as sendTransactionFirebase,
} from "@/shared/api/firebase";
import { useStore } from "@/shared/store";
import React, { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import * as stellarSdk from "stellar-sdk";
import { DocumentData } from "firebase/firestore";

interface Props {
  XDR: string;
  currentFirebaseId: string;
  setSuccessMessageFirebase: (message: string) => void;
  successMessageFirebase: string;
  setErrorMessageFirebase: (message: string) => void;
}

const ShowXDRButtons: FC<Props> = ({
  XDR,
  currentFirebaseId,
  successMessageFirebase,
  setSuccessMessageFirebase,
  setErrorMessageFirebase,
}) => {
  const { net } = useStore(useShallow((state) => state));

  const sendSignatureToTransaction = async () => {
    try {
      const txHash = await sendSignatureToTransactionFirebase(
        currentFirebaseId,
        XDR,
        net
      );
      return txHash;
    } catch (error) {
      console.error("Error sending signature to transaction:", error);
      throw error;
    }
  };

  const sendTransaction = async () => {
    try {
      const transaction = stellarSdk.TransactionBuilder.fromXDR(XDR, net);

      if (transaction instanceof stellarSdk.Transaction) {
        const txHash = await sendTransactionFirebase(net, transaction);
        return txHash;
      } else if (transaction instanceof stellarSdk.FeeBumpTransaction) {
        // Handle FeeBumpTransaction if necessary
        throw new Error("FeeBumpTransaction is not supported in this context.");
      } else {
        throw new Error("Invalid transaction type.");
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  };

  const onClick = async () => {
    let txHash: DocumentData | undefined | string;
    try {
      if (currentFirebaseId) {
        txHash = await sendSignatureToTransaction();
      } else {
        txHash = await sendTransaction();
      }

      if (txHash) {
        setSuccessMessageFirebase(
          currentFirebaseId
            ? `Transaction updated`
            : `Transaction sent with ID ${txHash}`
        );
        setErrorMessageFirebase("");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessageFirebase(
          currentFirebaseId
            ? `Error updating transaction`
            : `Error sending transaction, ${error.message}`
        );
      } else {
        setErrorMessageFirebase("An unknown error occurred.");
      }
      setSuccessMessageFirebase("");
      console.error("Error processing transaction:", error);
    }
  };

  return (
    <button onClick={!successMessageFirebase ? onClick : undefined}>
      {currentFirebaseId
        ? "Update transaction with new signature(s)"
        : "Send Sign to Transaction"}
    </button>
  );
};

export default ShowXDRButtons;
