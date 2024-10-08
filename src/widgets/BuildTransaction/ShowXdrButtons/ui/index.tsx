"use client";

import React, { FC } from "react";
import { Transaction } from "stellar-sdk";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import {
  sendTransactionForSign,
  editTransaction,
  deleteTransaction,
} from "@/shared/helpers";
import Link from "next/link";

type Props = {
  transaction: Transaction | null;
  firebaseID: string;
  setSuccessMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
  XDR: string;
};

/**
 * ShowXdrButtons component handles sending and editing Stellar transactions.
 * It provides buttons to send a new transaction or update an existing one.
 */
const ShowXdrButtons: FC<Props> = ({
  transaction,
  firebaseID,
  setSuccessMessage,
  setErrorMessage,
  XDR,
}) => {
  const { net } = useStore(useShallow((state) => state));

  const handleSendTransactionForSign = async () => {
    if (!transaction) return;

    try {
      const txHash = await sendTransactionForSign(transaction, net);
      if (txHash) {
        setSuccessMessage(`Transaction sent with ID ${txHash}`);
        setErrorMessage("");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        setErrorMessage(error.message);
      } else {
        console.error("Unknown error:", error);
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  const handleEditTransaction = async () => {
    if (!transaction) return;

    try {
      const txHash = await editTransaction(transaction, net, firebaseID);
      if (txHash) {
        setSuccessMessage(`Transaction updated with ID ${txHash.id}`);
        setErrorMessage("");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        setErrorMessage(error.message);
      } else {
        console.error("Unknown error:", error);
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await deleteTransaction(net, firebaseID);
      setSuccessMessage("Transaction deleted from Firebase.");
      setErrorMessage("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        setErrorMessage(error.message);
      } else {
        console.error("Unknown error:", error);
        setErrorMessage("An unknown error occurred.");
      }
    }
  };


  return (
    <>
      <Link href={`/${net}/sign-transaction?importXDR=${XDR}`}>
        <button>
          Sign transaction
        </button>
      </Link>
      <button onClick={handleSendTransactionForSign}>
        Send a new transaction to the Firebase
      </button>
      <button disabled={!firebaseID} onClick={handleEditTransaction}>
        Edit transaction
      </button>
      <button disabled={!firebaseID} onClick={handleDeleteTransaction}>
        Delete transaction from Firebase
      </button>
    </>
  );
};

export default ShowXdrButtons;
