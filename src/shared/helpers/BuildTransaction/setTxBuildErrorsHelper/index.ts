import stellarSdk from "stellar-sdk";
import { TX } from "@/shared/types/store/slices/BuildTransaction/buildTxJSONSlice";

const setTxBuildErrorsHelper = (
  tx: TX
) => {
  let txBuildErrors: string[] = []
  const updateErrors = (condition: boolean, errorMessage: string) => {
    const updatedErrors = condition
      ? !txBuildErrors.includes(errorMessage)
        ? [...txBuildErrors, errorMessage]
        : txBuildErrors
      : txBuildErrors.filter((error) => error !== errorMessage);
    txBuildErrors = updatedErrors;
  };

  try {
    const sourceAccount = tx.tx.source_account;
    const isValid = stellarSdk.StrKey.isValidEd25519PublicKey(sourceAccount);
    updateErrors(!isValid, "Source Account is a required field");
  } catch (error) {
    console.error("Error in useSetTxBuildErrors:", error);
  }
  return txBuildErrors;
};

export default setTxBuildErrorsHelper;
