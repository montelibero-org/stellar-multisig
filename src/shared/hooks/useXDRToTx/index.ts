import { useState, useEffect } from "react";
import __wbg_init, { decode } from "@stellar/stellar-xdr-json-web";
import { Transaction } from "stellar-sdk";

const useXDRToTransaction = (xdr: string) => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decodeXDR = async () => {
      if (!xdr) {
        setTransaction(null);
        setError(null);
        return;
      }

      try {
        await __wbg_init();
        const decodedTransaction = decode(xdr, "base64");

        if (
          typeof decodedTransaction === "object" &&
          "source" in decodedTransaction
        ) {
          setTransaction(decodedTransaction as Transaction);
          setError(null);
        } else {
          setError("Invalid transaction format.");
        }
      } catch (err) {
        setTransaction(null);
        setError("Invalid XDR format or decoding error.");
        console.log(err as Error);
      }
    };

    decodeXDR();
  }, [xdr]);

  return { transaction, error };
};

export default useXDRToTransaction;
