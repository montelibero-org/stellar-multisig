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
import { stringToHex } from "@/shared/helpers";
import axios from "axios";
import { Information } from "@/shared/types";

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
    setOperations,
    setSelectedSetFlags,
    selectedSetFlags,
    firestore,
    changeFirstSignerType,
    server,
    setSeqNum,
  } = useStore(useShallow((state) => state));

  const searchParams = useSearchParams();
  const sourceAccountParam = searchParams.get("sourceAccount");

  // const baseFeeParam = searchParams.get("baseFee");
  const firebaseIDParam = searchParams.get("firebaseID") || "";
  const operationTypeParam = searchParams.get("typeOperation");
  const processedKeyParam = searchParams.get("processedKey");
  const processedValueParam = searchParams.get("processedValue");
  const operationThresholdsParams = searchParams.get("operationThresholds");
  const weightParam = searchParams.get("weight");
  const masterWeightParam = searchParams.get("masterWeight");
  const sourceAccountForSetOptionsParam = searchParams.get(
    "sourceAccountForSetOptions"
  );
  const homeDomainParam = searchParams.get("homeDomain");
  const auth_clawback_enabledParam = searchParams.get("auth_clawback_enabled");
  const auth_immutableParam = searchParams.get("auth_immutable");
  const auth_requiredParam = searchParams.get("auth_required");
  const auth_revocableParam = searchParams.get("auth_revocable");

  const [currentXDR, setCurrentXDR] = useState<string>("");
  const [successMessageXDR, setSuccessMessageXDR] = useState<string>("");
  const [errorMessageXDR, setErrorMessageXDR] = useState<string>("");

  const [XDRInputImport, setXDRInputImport] = useState<string>("");
  const [XDRInputImportBaseResult, setXDRInputImportBaseResult] = useState<TX>(
    {} as TX
  );
  const [isImportXDRInput, setIsImportXDRInput] = useState<boolean>(false);

  const [firebaseIDParamError, setFirebaseIDParamError] = useState<string>("");

  const [jsonWithBigInt, setJsonWithBigInt] = useState<JSONWithBigInt | null>(
    null
  );

  const [currentTab, setCurrentTab] = useState<
    "Create Transaction" | "Import Transaction"
  >("Create Transaction");

  const [scoreOfSetFlags, setScoreOfSetFlags] = useState<number>(0);

  const decodedXDR = useXDRDecoding(currentXDR, currentXDR);

  useEffect(() => {
    const loadJSONWithBigInt = async () => {
      const { JSONParse, JSONStringify } = await import("json-with-bigint");
      setJsonWithBigInt({ JSONParse, JSONStringify });
    };

    loadJSONWithBigInt();
  }, []);

  useEffect(() => {
    const updSeqNumWhenSourceAccountIsSet = async () => {
      if (StellarSdk.StrKey.isValidEd25519PublicKey(tx.tx.source_account)) {
        try {
          const { data } = await axios.get<Information>(
            `${server}/accounts/${tx.tx.source_account}`
          );
          console.log(123123, data);
          if (data.sequence !== undefined) {
            const sequence = BigInt(data.sequence) + BigInt(1);
            setSeqNum(sequence);
          } else {
            console.error("Sequence number is undefined.");
          }
        } catch (error) {
          console.error(error);
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.error("Account not found or not funded.");
          }
        }
      }
    };

    updSeqNumWhenSourceAccountIsSet();
  }, [tx.tx.source_account]);

  useEffect(() => {
    if (auth_requiredParam) {
      setScoreOfSetFlags((prev) => prev + 1);
      const newSelectedSetFlags = selectedSetFlags;
      newSelectedSetFlags[0].push(0);
      setSelectedSetFlags(newSelectedSetFlags);
    }
    if (auth_revocableParam) {
      setScoreOfSetFlags((prev) => prev + 2);
      const newSelectedSetFlags = selectedSetFlags;
      newSelectedSetFlags[0].push(1);
      setSelectedSetFlags(newSelectedSetFlags);
    }
    if (auth_immutableParam) {
      setScoreOfSetFlags((prev) => prev + 4);
      const newSelectedSetFlags = selectedSetFlags;
      newSelectedSetFlags[0].push(2);
      setSelectedSetFlags(newSelectedSetFlags);
    }
    if (auth_clawback_enabledParam) {
      setScoreOfSetFlags((prev) => prev + 8);
      const newSelectedSetFlags = selectedSetFlags;
      newSelectedSetFlags[0].push(3);
      setSelectedSetFlags(newSelectedSetFlags);
    }
  }, [
    auth_clawback_enabledParam,
    auth_immutableParam,
    auth_revocableParam,
    auth_requiredParam,
    selectedSetFlags,
  ]);

  useEffect(() => {
    if (operationTypeParam) {
      if (
        operationTypeParam === "set_options" &&
        (sourceAccountForSetOptionsParam || weightParam)
      ) {
        changeFirstSignerType(1);
      }
      setOperations(
        operationTypeParam === "set_options"
          ? [
              {
                source_account: null,
                body: {
                  set_options: {
                    low_threshold: operationThresholdsParams
                      ? Number(operationThresholdsParams.split(",")[0])
                      : null,
                    med_threshold: operationThresholdsParams
                      ? Number(operationThresholdsParams.split(",")[1])
                      : null,
                    high_threshold: operationThresholdsParams
                      ? Number(operationThresholdsParams.split(",")[2])
                      : null,
                    home_domain: homeDomainParam ? homeDomainParam : null,
                    set_flags: scoreOfSetFlags,
                    master_weight:
                      masterWeightParam !== null &&
                      masterWeightParam !== undefined &&
                      masterWeightParam !== "undefined"
                        ? Number(masterWeightParam)
                        : null,
                    signer: {
                      key: sourceAccountForSetOptionsParam
                        ? sourceAccountForSetOptionsParam
                        : "",
                      weight: weightParam ? Number(weightParam) : null,
                    },
                  },
                },
              },
            ]
          : operationTypeParam === "manage_data"
          ? [
              {
                source_account: "",
                body: {
                  manage_data: {
                    data_name: processedKeyParam ?? "",
                    data_value: stringToHex(processedValueParam ?? "") ?? null,
                  },
                },
              },
            ]
          : [{ source_account: "", body: {} }]
      );
    }
  }, [
    operationTypeParam,
    processedKeyParam,
    processedValueParam,
    weightParam,
    scoreOfSetFlags,
  ]);

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

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!jsonWithBigInt) return;

      try {
        await __wbg_init();
        if (firebaseIDParam) {
          const transaction = await getTransactionByID(
            firestore,
            net,
            firebaseIDParam
          );
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

  useEffect(() => {
    const initializeWasm = async () => {
      if (!jsonWithBigInt) return;

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

    const updateErrorOperationManageDataName = () => {
      try {
        let isValid = true;
        isValid = fullTransaction.tx?.tx.operations.every((op) => {
          if ("manage_data" in op.body) {
            return op.body.manage_data?.data_name !== "";
          }
          return true;
        });
        updateErrors(
          !isValid,
          "Entry Name in Manage Data operation is a required field"
        );
      } catch (error) {
        // need to bag fix
        console.error("Error in useSetTxBuildErrors:", error);
      }
    };

    const updateAllErrors = () => {
      updateErrorSourceAccount();
      updateErrorSequence();
      updateErrorBaseFee();
      updateErrorOperations();
      updateErrorOperationSelectType();
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
    tx,
  ]);

  useEffect(() => {
    console.log(tx);
  }, [tx]);

  useEffect(() => {
    console.log("XDR:",currentXDR);
  }, [currentXDR]);

  const clearParams = () => {
    const newTx = {
      ...tx,
      tx: {
        ...tx.tx,
        cond: {
          ...tx.tx.cond,
          time: { ...tx.tx.cond.time },
        },
      },
    };

    newTx.tx.source_account = "";
    newTx.tx.seq_num = "";
    newTx.tx.fee = 100;
    const params = new URLSearchParams(searchParams.toString());
    params.set("baseFee", "100");

    window.history.replaceState({}, "", `?${params.toString()}`);
    newTx.tx.memo = "none";
    newTx.tx.cond.time.min_time = 0;
    newTx.tx.cond.time.max_time = 0;

    setTransaction(newTx);
  };

  if (!jsonWithBigInt) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            marginTop: "-12px",
          }}
        >
          <div className="tabs">
            <div className="tabs-header">
              <a
                href="#"
                className={`tabs-item condensed false ${
                  currentTab === "Create Transaction" && "selected"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentTab("Create Transaction");
                }}
              >
                <span className="tabs-item-text">Create Transaction</span>
              </a>
              <a
                href="#"
                className={`tabs-item condensed false ${
                  currentTab === "Import Transaction" && "selected"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentTab("Import Transaction");
                }}
              >
                <span className="tabs-item-text">Import Transaction</span>
              </a>
            </div>
          </div>
        </div>
        <hr style={{ marginTop: "0" }} className="flare" />
        {currentTab === "Create Transaction" ? (
          <>
            <h3>{firebaseIDParam && !tx.tx.source_account && "Loading..."}</h3>
            <h4 className="warning">{firebaseIDParamError}</h4>
            <div className="segment blank">
              <SourceAccountInput />
              <hr className="flare" />
              <SequenceNumberInput firebaseID={firebaseIDParam} />
              <hr className="flare" />
              <BaseFeeInput />
              <hr className="flare" />
              <MemoInput />
              <hr className="flare" />
              <TimeBoundsInput />
              <button onClick={clearParams}>
                <i className="fa fa-refresh" aria-hidden="true"></i> Clear
                params
              </button>
            </div>
            <hr className="flare" />
            <OperationsList />
            {buildErrors.length > 0 || currentXDR === "" ? (
              <TransactionErrors errors={buildErrors} />
            ) : (
              <ShowXdr
                title="Here is your XDR transaction:"
                xdr={currentXDR !== "" ? currentXDR : null}
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
          </>
        ) : (
          <>
            <XDRInput
              XDR={XDRInputImport}
              setXDR={setXDRInputImport}
              isImport={isImportXDRInput}
              setIsImport={setIsImportXDRInput}
              baseResult={XDRInputImportBaseResult}
              setBaseResult={setXDRInputImportBaseResult}
              setCurrentTab={setCurrentTab}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default BuildTransaction;
