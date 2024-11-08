import { useState, useCallback } from "react";
import stellarSdk from "stellar-sdk";

const useTransactionValidation = (): { validationError: string | null, validateTransactionEnvelope: (envelope: string) => boolean } => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateTransactionEnvelope = useCallback((envelope: string): boolean => {
    try {
      stellarSdk.TransactionBuilder.fromXDR(envelope, stellarSdk.Networks.TESTNET);
      setValidationError(null);
      return true;
    } catch (error) {
      setValidationError((error as Error).message || "Invalid transaction envelope");
      return false;
    }
  }, []);

  return { validationError, validateTransactionEnvelope };
};

export default useTransactionValidation;
