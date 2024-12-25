import { useState, useEffect } from "react";
import __wbg_init, { decode } from "@stellar/stellar-xdr-json-web";
import { Transaction, FeeBumpTransaction, Networks, TransactionBuilder } from "stellar-sdk";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import JSONbig from "json-bigint";
/**
 * Custom hook for decoding XDR and extracting transaction details.
 *
 * @param trigger - An optional parameter that triggers the decoding process
 * @param envelope - XDR envelope string to decode
 * @returns An object containing decoded transaction details and metadata
 */
const saveDecodingTimeToServer = async (transactionHash: string, timestamp: string) => {
  try {
    const response = await fetch("/api/save-decoding-time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactionHash, timestamp }),
    });

    if (!response.ok) {
      throw new Error("Failed to save decoding time");
    }

    const data = await response.json();
    console.log(data.message);
  } catch (error) {
    console.error("Error saving decoding time:", error);
  }
};
const useXDRDecoding = (trigger: string | null | undefined, envelope: string) => {
  const [decodedTransactionJSON, setDecodedTransactionJSON] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [sourceAccount, setSourceAccount] = useState<string>("");
  const [sequenceNumber, setSequenceNumber] = useState<string>("");
  const [transactionFee, setTransactionFee] = useState<string>("");
  const [operationCount, setOperationCount] = useState<string>("");
  const [signatureCount, setSignatureCount] = useState<string>("");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [decodingTime, setDecodingTime] = useState<string>(""); // добавлено время

  const { net } = useStore(useShallow(store => store));

  useEffect(() => {
    const decodeXDR = async (envelope: string) => {
      await __wbg_init();
      if (trigger) {
        const decodedXDR = decodeURIComponent(envelope);
        const decodedTransaction = decode("TransactionEnvelope", decodedXDR);
        setDecodedTransactionJSON(JSONbig.stringify(decodedTransaction, null, 2));
        const tx = TransactionBuilder.fromXDR(envelope, net === "testnet" ? Networks.TESTNET : Networks.PUBLIC);
        setTransactionHash(tx.hash().toString("hex"));
        const timestamp = new Date().toISOString();
        setDecodingTime(timestamp); // сохраняем время

        if (tx instanceof Transaction) {
          setTransaction(tx);
          setSourceAccount(tx.source);
          setSequenceNumber(tx.sequence);
          setTransactionFee(tx.fee.toString());
          setOperationCount(tx.operations.length.toString());
          setSignatureCount(tx.signatures.length.toString());
        } else if (tx instanceof FeeBumpTransaction) {
          setTransaction(null);
          setSourceAccount(tx.feeSource);
          setTransactionFee(tx.fee.toString());
          setOperationCount("1 (FeeBumpTransaction)");
          setSignatureCount(tx.signatures.length.toString());
        }

        try {
          await saveDecodingTimeToServer(tx.hash().toString("hex"), timestamp);
        } catch (error) {
          console.error("Error saving decoding time:", error);
        }
      }
    };

    decodeXDR(envelope);
  }, [trigger, envelope, net]);

  return {
    decodedTransactionJSON,
    transactionHash,
    sourceAccount,
    sequenceNumber,
    transactionFee,
    operationCount,
    signatureCount,
    transaction,
    decodingTime, // возвращаем время
  };
};
export default useXDRDecoding;
