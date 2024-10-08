"use client";

import { FC, useEffect, useState } from "react";
import { MainLayout, ShowXdr, XDRInput, ShowXdrButtons } from "@/widgets";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import __wbg_init, { decode, encode } from "@stellar/stellar-xdr-json-web";
import { useSearchParams } from "next/navigation";
import { useXDRDecoding } from "@/features/hooks";
import { getTransactionByID } from "@/shared/api/firebase";
import {
  SourceAccountInput,
  SequenceNumberInput,
  BaseFeeInput,
  MemoInput,
  TimeBoundsInput,
  OperationsList,
  TransactionErrors,
} from "@/widgets";
import {
  FullTransaction,
  TX,
} from "@/shared/types/store/slices/BuildTransaction/buildTxJSONSlice";
import StellarSdk from "stellar-sdk";
import { checkSigner } from "@/shared/helpers";

export interface TXErrors {
  sourceAccount: string;
  sequenceNumber: string;
  baseFee: string;
  memo: string;
  operations: string;
  typeOperation: string;
}

interface JSONWithBigInt {
  JSONParse<T>(text: string): T;
  JSONStringify<T>(value: T): string;
}


const BuildTransaction: FC = () => {
  const {
    tx,
    setTransaction,
    fullTransaction,
    net,
    setSourceAccount,
    buildErrors,
    setBuildErrors,
    accounts,
  } = useStore(useShallow((state) => state));

  const searchParams = useSearchParams();
  const sourceAccountParam = searchParams.get("sourceAccount");
  const firebaseIDParam = searchParams.get("firebaseID") || "";

  const [currentXDR, setCurrentXDR] = useState<string>("");
  const [successMessageXDR, setSuccessMessageXDR] = useState<string>("");
  const [errorMessageXDR, setErrorMessageXDR] = useState<string>("");

  const [XDRInputImport, setXDRInputImport] = useState<string>("");
  const [XDRInputImportBaseResult, setXDRInputImportBaseResult] = useState<TX>(
    {} as TX
  );
  const [isImportXDRInput, setIsImportXDRInput] = useState<boolean>(false);

  const [firebaseIDParamError, setFirebaseIDParamError] = useState<string>("");

  const [jsonWithBigInt, setJsonWithBigInt] = useState<JSONWithBigInt | null>(null);

  const decodedXDR = useXDRDecoding(currentXDR, currentXDR);

  const updateErrors = (condition: boolean, errorMessage: string) => {
    setBuildErrors((prevBuildErrors) => {
      const updatedErrors = condition
        ? !prevBuildErrors.includes(errorMessage)
          ? [...prevBuildErrors, errorMessage]
          : prevBuildErrors
        : prevBuildErrors.filter((error) => error !== errorMessage);
      return updatedErrors;
    });
  };

  // Load json-with-bigint dynamically
  useEffect(() => {
    const loadJSONWithBigInt = async () => {
      const { JSONParse, JSONStringify } = await import('json-with-bigint');
      setJsonWithBigInt({ JSONParse, JSONStringify });
    };

    loadJSONWithBigInt();
  }, []);

  // Fetch transaction data
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!jsonWithBigInt) return; // Ensure JSONParse and JSONStringify are loaded

      try {
        await __wbg_init();
        if (firebaseIDParam) {
          const transaction = await getTransactionByID(net, firebaseIDParam);
          if (!transaction) {
            console.error("Transaction not found from firebase ID");
            setFirebaseIDParamError("Transaction not found from firebase ID");
            return;
          }
          const decodedTx = jsonWithBigInt.JSONParse(
            decode("TransactionEnvelope", transaction.xdr)
          ) as FullTransaction;
          setTransaction(decodedTx.tx);
          setCurrentXDR(transaction.xdr);
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };

    if (sourceAccountParam) {
      setSourceAccount(sourceAccountParam);
    }

    if (firebaseIDParam) {
      fetchTransaction();
    }
  }, [
    firebaseIDParam,
    net,
    setTransaction,
    setSourceAccount,
    sourceAccountParam,
    jsonWithBigInt,
  ]);

  // Initialize WASM and encode transaction
  useEffect(() => {
    const initializeWasm = async () => {
      if (!jsonWithBigInt) return; // Ensure JSONParse and JSONStringify are loaded

      await __wbg_init();
      if (!fullTransaction || !fullTransaction.tx) {
        console.error("Invalid transaction structure");
        return;
      }

      const seqNum = tx.tx.seq_num;

      if (seqNum !== undefined) {
        const transactionEnvelope = {
          tx: {
            ...fullTransaction.tx,
            seq_num: BigInt(seqNum),
          },
        };

        const xdrEncoded = encode(
          "TransactionEnvelope",
          jsonWithBigInt.JSONStringify(transactionEnvelope)
        );
        setCurrentXDR(xdrEncoded);
      } else {
        console.error("Invalid transaction structure: seq_num is undefined");
      }
    };

    if (fullTransaction) {
      initializeWasm();
    }
  }, [fullTransaction, tx, jsonWithBigInt]);

  // Validate transaction fields
  useEffect(() => {
    const updateErrorSourceAccount = () => {
      try {
        if (!tx.tx.source_account) {
          updateErrors(true, "Source Account is a required field");
          return;
        } else {
          updateErrors(false, "Source Account is a required field");
        }
        const isValid = StellarSdk.StrKey.isValidEd25519PublicKey(
          tx.tx.source_account
        );
        updateErrors(!isValid, "Invalid Source Account");
      } catch (error) {
        console.error("Error in useSetTxBuildErrors:", error);
      }
    };

    const updateErrorSequence = () => {
      try {
        const isValid = Boolean(tx.tx.seq_num);
        updateErrors(!isValid, "Sequence Number is a required field");
      } catch (error) {
        console.error("Error in useSetTxBuildErrors:", error);
      }
    };

    const updateErrorBaseFee = () => {
      try {
        const isValid = Boolean(tx.tx.fee);
        updateErrors(!isValid, "Base Fee is a required field");
      } catch (error) {
        console.error("Error in useSetTxBuildErrors:", error);
      }
    };

    const updateErrorOperations = () => {
      try {
        const isValid = tx.tx.operations.length > 0;
        updateErrors(!isValid, "Operations are a required field");
      } catch (error) {
        console.error("Error in useSetTxBuildErrors:", error);
      }
    };

    const updateErrorOperationSelectType = () => {
      try {
        const hasEmptyOperation = tx.tx.operations.some(
          (op) => Object.keys(op.body).length === 0
        );

        if (hasEmptyOperation) {
          updateErrors(true, "Select Operation Type");
        } else {
          updateErrors(false, "Select Operation Type");
        }
      } catch (error) {
        console.error("Error in useSetTxBuildErrors:", error);
      }
    };

    const updateErrorCheckSigner = () => {
      try {
        const isValid = checkSigner(accounts, undefined, tx.tx.source_account);

        if (!isValid) {
          updateErrors(true, "Not enough rights");
        } else {
          updateErrors(false, "Not enough rights");
        }
      } catch (error) {
        console.error("Error in useSetTxBuildErrors:", error);
      }
    };

    const updateErrorOperationManageDataName = () => {
      try {
        let isValid = true;
        isValid = fullTransaction.tx?.tx.operations.every((op) => {
          if ("manage_data" in op.body) {
            return op.body.manage_data?.data_name !== "";
          }
          return true;
        });
        updateErrors(!isValid, "Entry Name in Manage Data operation is a required field");
      } catch (error) {
        console.error("Error in useSetTxBuildErrors:", error);
      }
    };

    const updateAllErrors = () => {
      updateErrorSourceAccount();
      updateErrorSequence();
      updateErrorBaseFee();
      updateErrorOperations();
      updateErrorOperationSelectType();
      updateErrorCheckSigner();
      updateErrorOperationManageDataName();
    };

    updateAllErrors();
  }, [
    tx.tx.source_account,
    tx.tx.seq_num,
    tx.tx.fee,
    tx.tx.memo,
    tx.tx.operations,
    accounts,
    fullTransaction,
  ]);

  // Handle loading state for jsonWithBigInt
  if (!jsonWithBigInt) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="container">
        <h3>{firebaseIDParam && !tx.tx.source_account && "Loading..."}</h3>
        <h4 className="warning">{firebaseIDParamError}</h4>
        <div className="segment blank">
          <SourceAccountInput />
          <SequenceNumberInput firebaseID={firebaseIDParam} />
          <BaseFeeInput />
          <MemoInput />
          <TimeBoundsInput />
          <OperationsList />
        </div>
        {buildErrors.length > 0 ? (
          <TransactionErrors errors={buildErrors} />
        ) : (
          <ShowXdr
            title="Here is your XDR transaction:"
            xdr={currentXDR}
            showHash
            showNetPassphrase
            buttons={
              <ShowXdrButtons
                firebaseID={firebaseIDParam}
                transaction={decodedXDR.transaction}
                setSuccessMessage={setSuccessMessageXDR}
                setErrorMessage={setErrorMessageXDR}
                XDR={currentXDR}
              />
            }
            successMessage={successMessageXDR}
            errorMessage={errorMessageXDR}
          />
        )}
      </div>
      <XDRInput
        XDR={XDRInputImport}
        setXDR={setXDRInputImport}
        isImport={isImportXDRInput}
        setIsImport={setIsImportXDRInput}
        baseResult={XDRInputImportBaseResult}
        setBaseResult={setXDRInputImportBaseResult}
      />
    </MainLayout>
  );
};

export default BuildTransaction;
