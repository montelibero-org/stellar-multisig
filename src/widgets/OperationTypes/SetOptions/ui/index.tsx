"use client";

import React, { useState, FC, useCallback, useEffect } from "react";
import FlagSelector from "../../shared/FlagSelector";
import { setFlagsData, clearFlagsData } from "./flagsData";
import s from "@/widgets/OperationTypes/index.module.scss";
import StellarSdk from "stellar-sdk";
import InputField from "../../shared/InputField";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import { IFlag } from "../../shared/FlagSelector";
import { useHandleSourceAccountChange } from "@/features/hooks";
import { IOperation } from "@/shared/types";


export const signerOptions: string[] = [
  "Select signer type",
  "Ed25519 Public Key",
  "sha256 Hash",
  "Pre-authorized Transaction Hash",
];

export interface Props {
  id: number;
}

const SetOptions: FC<Props> = ({ id }) => {
  const handleSourceAccountChange = useHandleSourceAccountChange();


  const {
    fullTransaction,
    tx,
    setOperations,
    selectedSetFlags,
    signerTypes,
    setSignerTypes,
  } = useStore(useShallow((state) => state));

  const defaultOperation: IOperation = {
    source_account: null,
    body: {
      set_options: {
        inflation_dest: "",
        clear_flags: 0,
        set_flags: 0,
        master_weight: 0,
        low_threshold: 0,
        med_threshold: 0,
        high_threshold: 0,
        home_domain: "",
        signer: {
          key: "",
          weight: 0,
        },
      },
    },
  };

  const operation = tx.tx.operations[id] || defaultOperation;

  const masterWeight = operation.body.set_options?.master_weight;
  const lowThreshold = operation.body.set_options?.low_threshold;
  const mediumThreshold = operation.body.set_options?.med_threshold;
  const highThreshold = operation.body.set_options?.high_threshold;
  const homeDomain = operation.body.set_options?.home_domain || "";
  const sourceAccount = operation.source_account;

  const [selectedSetFlagsLocal, setSelectedSetFlagsLocal] = useState<number[]>(
    []
  );
  const [selectedClearFlags, setSelectedClearFlags] = useState<number[]>([]);
  const [currentSignerType, setCurrentSignerType] = useState<string>(
    signerOptions[0]
  );

  useEffect(() => {
    if (id === 0) {
      if (
        operation.body.set_options?.signer?.key ||
        operation.body.set_options?.signer?.weight
      ) {
        setCurrentSignerType(signerOptions[1]);
      }
    }
  }, [
    operation.body.set_options?.signer?.key,
    operation.body.set_options?.signer?.weight,
  ]);

  useEffect(() => {
    setSelectedSetFlagsLocal(selectedSetFlags[id] || []);
  }, [setSelectedClearFlags]);

  const calculateFlagPoints = (flags: number[], flagData: IFlag[]) => {
    return flags.reduce((total, flagId) => {
      const flag = flagData.find((f) => f.id === flagId);
      return total + (flag ? flag.points : 0);
    }, 0);
  };

  // Set Flags
  const handleToggleSetFlag = useCallback(
    (flagId: number) => {
      const newSelectedSetFlags = selectedSetFlagsLocal.includes(flagId)
        ? selectedSetFlagsLocal.filter((id) => id !== flagId)
        : [...selectedSetFlagsLocal, flagId];

      const newSetFlags = calculateFlagPoints(
        newSelectedSetFlags,
        setFlagsData
      );

      const newOperations = [...fullTransaction.tx.tx.operations];
      if (newOperations[id]) {
        newOperations[id] = {
          ...newOperations[id],
          body: {
            ...newOperations[id].body,
            set_options: {
              ...newOperations[id].body.set_options,
              set_flags: newSetFlags,
            },
          },
        };
        setOperations(newOperations);
      }

      setSelectedSetFlagsLocal(newSelectedSetFlags);
    },
    [selectedSetFlags, fullTransaction.tx.tx.operations, id, setOperations]
  );
  const handleToggleClearFlag = useCallback(
    (flagId: number) => {
      const newSelectedClearFlags = selectedClearFlags.includes(flagId)
        ? selectedClearFlags.filter((id) => id !== flagId)
        : [...selectedClearFlags, flagId];

      const newClearFlags = calculateFlagPoints(
        newSelectedClearFlags,
        clearFlagsData
      );

      const newOperations = [...fullTransaction.tx.tx.operations];
      if (newOperations[id]) {
        newOperations[id] = {
          ...newOperations[id],
          body: {
            ...newOperations[id].body,
            set_options: {
              ...newOperations[id].body.set_options,
              clear_flags: newClearFlags,
            },
          },
        };
        setOperations(newOperations);
      }

      setSelectedClearFlags(newSelectedClearFlags);
    },
    [selectedClearFlags, fullTransaction.tx.tx.operations, id, setOperations]
  );

  const validateRange = useCallback((value: string): boolean => {
    const num = Number(value);
    return num >= 0 && num <= 255;
  }, []);

  const handleInputChange =
    (field: string, isNumber = true) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      if (isNumber && value !== "" && isNaN(Number(value))) return;

      const newOperations = [...fullTransaction.tx.tx.operations];
      if (newOperations[id]) {
        newOperations[id] = {
          ...newOperations[id],
          body: {
            ...newOperations[id].body,
            set_options: {
              ...newOperations[id].body.set_options,
              [field]: isNumber
                ? value === ""
                  ? undefined
                  : Number(value)
                : value,
            },
          },
        };
        setOperations(newOperations);
      }
    };

  const handleSignerChange =
    (field: "key" | "weight") => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isNaN(Number(e.target.value)) && field === "weight") return;
      const newOperations = [...fullTransaction.tx.tx.operations];
      if (newOperations[id]) {
        newOperations[id] = {
          ...newOperations[id],
          body: {
            ...newOperations[id].body,
            set_options: {
              ...newOperations[id].body.set_options,
              signer: {
                ...newOperations[id].body.set_options?.signer,
                [field]:
                  field === "weight" && isNaN(Number(e.target.value))
                    ? undefined
                    : e.target.value,
              },
            },
          },
        };
        setOperations(newOperations);
      }
    };

  return (
    <>
      <p>Sets various configuration options for an account.</p>
      <hr />
      <div className={s.main}>
        <FlagSelector
          title="Set Flags"
          flags={setFlagsData}
          selectedFlags={selectedSetFlagsLocal}
          onToggle={handleToggleSetFlag}
        />

        <FlagSelector
          title="Clear Flags"
          flags={clearFlagsData}
          selectedFlags={selectedClearFlags}
          onToggle={handleToggleClearFlag}
        />

        <InputField
          title="Master Weight"
          placeholder="0-255"
          value={
            masterWeight !== null && masterWeight !== undefined
              ? masterWeight.toString()
              : ""
          }
          onChange={handleInputChange("master_weight")}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
          warningMessage="This can result in a permanently locked account. Are you sure you know what you're doing?"
        />

        <InputField
          title="Low Threshold"
          placeholder="0-255"
          value={
            lowThreshold !== null && lowThreshold !== undefined
              ? lowThreshold.toString()
              : ""
          }
          onChange={handleInputChange("low_threshold")}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
        />

        <InputField
          title="Medium Threshold"
          placeholder="0-255"
          value={
            mediumThreshold !== null && mediumThreshold !== undefined
              ? mediumThreshold.toString()
              : ""
          }
          onChange={handleInputChange("med_threshold")}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
          warningMessage="This can result in a permanently locked account. Are you sure you know what you're doing?"
        />

        <InputField
          title="High Threshold"
          placeholder="0-255"
          value={
            highThreshold !== null && highThreshold !== undefined
              ? highThreshold.toString()
              : ""
          }
          onChange={handleInputChange("high_threshold")}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
          warningMessage="This can result in a permanently locked account. Are you sure you know what you're doing?"
        />

        <div className={s.section}>
          <h4 className={s.sectionTitle}>
            Signer Type <span className={s.optional}>(optional)</span>
          </h4>
          <div>
            <select
              className={s.selectCurrentSignerType}
              value={currentSignerType}
              onChange={(e) => {
                setCurrentSignerType(e.target.value);

                const isDefaultOption = e.target.value === signerOptions[0];

                if (!isDefaultOption) {
                  const newOperations = [...fullTransaction.tx.tx.operations];

                  if (newOperations[id]) {
                    newOperations[id] = {
                      ...newOperations[id],
                      body: {
                        ...newOperations[id].body,
                        set_options: {
                          ...newOperations[id].body.set_options,
                          signer: {
                            key: newOperations[id].body.set_options?.signer
                              ?.key,
                            weight:
                              newOperations[id].body.set_options?.signer
                                ?.weight,
                          },
                        },
                      },
                    };
                    setOperations(newOperations);
                  }
                }
                const localSignerTypes = [...signerTypes];
                localSignerTypes[id] = isDefaultOption ? 0 : 1;
                setSignerTypes(localSignerTypes);
              }}
            >
              {signerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p>
              Used to add/remove or adjust the weight of an additional signer on
              the account.
            </p>
            {signerTypes[id] !== 0 && (
              <>
                <InputField
                  title="Key"
                  placeholder="Ex: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
                  value={
                    fullTransaction.tx.tx.operations[id].body.set_options
                      ?.signer?.key !== null &&
                    fullTransaction.tx.tx.operations[id].body.set_options
                      ?.signer?.key !== undefined
                      ? fullTransaction.tx.tx.operations[id].body.set_options
                          ?.signer?.key
                      : ""
                  }
                  onChange={handleSignerChange("key")}
                  validate={(value) =>
                    StellarSdk.StrKey.isValidEd25519PublicKey(value) ||
                    value === ""
                  }
                  errorMessage={
                    currentSignerType === signerOptions[3]
                      ? "Accepts a 32-byte hash in hexadecimal format (64 characters)."
                      : "Public key is invalid."
                  }
                />
                <InputField
                  title="Weight"
                  placeholder="0-255"
                  value={
                    fullTransaction.tx.tx.operations[
                      id
                    ].body.set_options?.signer?.weight?.toString() ?? ""
                  }
                  onChange={handleSignerChange("weight")}
                  validate={validateRange}
                  errorMessage="Expected an integer between 0 and 255 (inclusive)."
                  warningMessage={
                    <>
                      Signer will be removed from account if this weight is 0.
                      <br />
                      Used to add/remove or adjust weight of an additional
                      signer on the account.
                    </>
                  }
                />
              </>
            )}
          </div>
        </div>

        <InputField
          title="Home Domain"
          placeholder="Ex: example.com"
          value={homeDomain}
          onChange={handleInputChange("home_domain", false)}
        />

        <InputField
          title="Source Account"
          placeholder="Ex: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
          value={sourceAccount === null ? "" : sourceAccount}
          onChange={(e) => handleSourceAccountChange(e, id)}
          validate={(value) =>
            StellarSdk.StrKey.isValidEd25519PublicKey(value) || value === ""
          }
          errorMessage="Public key is invalid."
          isOptional={false}
        />
      </div>
    </>
  );
};

export default SetOptions;
