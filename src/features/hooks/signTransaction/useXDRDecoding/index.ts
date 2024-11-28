import { useState, useEffect } from "react";
import __wbg_init, { decode } from "@stellar/stellar-xdr-json-web";
import {
  Transaction,
  FeeBumpTransaction,
  Networks,
  TransactionBuilder,
} from "stellar-sdk";
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
const useXDRDecoding = (
  trigger: string | null | undefined,
  envelope: string
) => {
  const [decodedTransactionJSON, setDecodedTransactionJSON] =
    useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [sourceAccount, setSourceAccount] = useState<string>("");
  const [sequenceNumber, setSequenceNumber] = useState<string>("");
  const [transactionFee, setTransactionFee] = useState<string>("");
  const [operationCount, setOperationCount] = useState<string>("");
  const [signatureCount, setSignatureCount] = useState<string>("");
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const { net } = useStore(useShallow((store) => store));

  useEffect(() => {
    // Avoid decoding if trigger or envelope is not provided
    if (!trigger || !envelope) {
      setDecodedTransactionJSON("");
      setTransactionHash("");
      setSourceAccount("");
      setSequenceNumber("");
      setTransactionFee("");
      setOperationCount("");
      setSignatureCount("");
      setTransaction(null);
      return;
    }

    const decodeXDR = async (envelope: string) => {
      try {
        await __wbg_init();
        const decodedXDR = decodeURIComponent(envelope);
        const decodedTransaction = decode("TransactionEnvelope", decodedXDR);
        setDecodedTransactionJSON(
          JSONbig.stringify(decodedTransaction, null, 2)
        );

        const tx = TransactionBuilder.fromXDR(
          envelope,
          net === "testnet" ? Networks.TESTNET : Networks.PUBLIC
        );
        setTransactionHash(tx.hash().toString("hex"));
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
      } catch (error) {
        console.error("Error decoding XDR:", error);
        // Handle errors gracefully, resetting state
        setDecodedTransactionJSON("");
        setTransactionHash("");
        setSourceAccount("");
        setSequenceNumber("");
        setTransactionFee("");
        setOperationCount("");
        setSignatureCount("");
        setTransaction(null);
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
    txHashBuffer: Buffer.from(transactionHash, "hex"),
  };
};

export default useXDRDecoding;
