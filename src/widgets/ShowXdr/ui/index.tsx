"use client";

import React, { FC, useEffect, useState } from "react";
import { useXDRDecoding } from "@/features/hooks";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import { Store } from "@/shared/types";
import {
  sendSignatureToTransaction as sendSignatureToTransactionFirebase,
  sendTransaction as sendTransactionFirebase,
} from "@/shared/api/firebase";
import stellarSdk from "stellar-sdk";
import { DocumentData } from "firebase/firestore";

interface Props {
  title?: string;
  upperDescription?: string;
  xdr?: string | null;
  lowerDescription?: string;
  showHash?: boolean;
  showNetPassphrase?: boolean;
  buttons?: React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
  currentFirebaseId?: string;
  setSuccessMessageFirebase?: (message: string) => void;
  successMessageFirebase?: string;
  setErrorMessageFirebase?: (message: string) => void;
}

const ShowXdr: FC<Props> = ({
  title,
  upperDescription,
  xdr,
  showNetPassphrase,
  showHash,
  lowerDescription,
  buttons,
  errorMessage,
  successMessage,
  currentFirebaseId,
  setSuccessMessageFirebase,
  setErrorMessageFirebase,
}) => {
  const [isCopy, setIsCopy] = useState(false);

  const { transaction, transactionHash } = useXDRDecoding(xdr, xdr || "");
  const { firestore, net } = useStore(useShallow((state: Store) => state));

  const sendSignatureToTransaction = async () => {
    if (typeof currentFirebaseId === "string") {
      try {
        const txHash = await sendSignatureToTransactionFirebase(
          firestore,
          currentFirebaseId,
          xdr,
          net
        );
        return txHash;
      } catch (error) {
        console.error("Error sending signature to transaction:", error);
        throw error;
      }
    }
  };

  const sendTransaction = async () => {
    try {
      const transaction = stellarSdk.TransactionBuilder.fromXDR(xdr, net);

      if (transaction instanceof stellarSdk.Transaction) {
        const txHash = await sendTransactionFirebase(
          firestore,
          net,
          transaction
        );
        return txHash;
      } else if (transaction instanceof stellarSdk.FeeBumpTransaction) {
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
    if (
      typeof currentFirebaseId === "string" &&
      setErrorMessageFirebase &&
      setSuccessMessageFirebase
    ) {
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
    }
  };

  useEffect(() => {
    if (xdr) {
      onClick();
    }
  }, [
    xdr,
    currentFirebaseId,
    setErrorMessageFirebase,
    setSuccessMessageFirebase,
  ]);

  return (
    <div className="container">
      <div style={{ marginTop: "20px" }} className="segment blank">
        <h3 className="success">{title}</h3>
        <p>{upperDescription}</p>
        <textarea
          value={
            xdr && !showNetPassphrase && !showHash
              ? xdr
              : !showNetPassphrase && showHash
              ? `Hash:\n${transactionHash}\nXDR:\n${xdr}`
              : showNetPassphrase && !showHash
              ? `Network Passphrase:\n${transaction?.networkPassphrase}\nXDR:\n${xdr}`
              : `Network Passphrase:\n${transaction?.networkPassphrase}\nHash:\n${transactionHash}\nXDR:\n${xdr}`
          }
          readOnly
          style={{ height: "120px", border: "1px solid #535759" }}
        />

        <p
          style={{ cursor: "pointer", position: "absolute", right: "30px" }}
          onClick={() => {
            navigator.clipboard.writeText(xdr!);
            setIsCopy(true);
            setTimeout(() => setIsCopy(false), 2000);
          }}
          title="Copy XDR"
        >
          <i className="fa-solid fa-arrow-up-from-bracket"></i>
        </p>
        {isCopy && (
          <p
            style={{ textAlign: "right", opacity: "0.8", marginRight: "28px" }}
          >
            Copied XDR
          </p>
        )}
        <p>{lowerDescription}</p>
        <div style={{ marginTop: "-10px" }}>
          {buttons}
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ShowXdr;
