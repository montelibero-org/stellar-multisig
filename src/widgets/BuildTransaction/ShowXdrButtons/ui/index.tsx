"use client";

import React, { FC } from "react";
import { Keypair, Transaction } from "stellar-sdk";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import {
  sendTransactionForSign,
  editTransaction,
  deleteTransaction,
} from "@/shared/helpers";
import Link from "next/link";
import stellarSdk from "stellar-sdk";

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
  const { net, firestore, tx } = useStore(useShallow((state) => state));

  const handleSendTransactionForSign = async () => {
    if (!firebaseID) return;
    if (!transaction) return;

    try {
      const txCopy = tx;

      txCopy.signatures.map((signature) => {
        const secretKey = Buffer.from(signature.hint).toString("hex"); // Преобразуем hint в строку
        const keypair = Keypair.fromSecret(secretKey); // Создаем Keypair

        // Выводим публичный ключ в консоль
        console.log("Public Key:", keypair.publicKey());
      });
      const txHash = await sendTransactionForSign(firestore, transaction, net);
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
      const txHash = await editTransaction(
        firestore,
        transaction,
        net,
        firebaseID
      );
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
      await deleteTransaction(firestore, net, firebaseID);
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
        <button onClick={handleSendTransactionForSign}>Sign transaction</button>
      </Link>
      <button disabled={!firebaseID} onClick={handleEditTransaction}>
        Edit transaction
      </button>
      <button
        disabled={!firebaseID && tx.signatures.length === 0}
        onClick={handleDeleteTransaction}
      >
        Delete <i className="fa-solid fa-trash"></i>
      </button>
    </>
  );
};

export default ShowXdrButtons;
