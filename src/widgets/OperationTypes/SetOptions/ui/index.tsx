"use client";

import React, { useState, FC, useEffect } from "react";
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

type Field =
  | "master_weight"
  | "low_threshold"
  | "med_threshold"
  | "high_threshold"
  | "home_domain";

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
    setOperations,
    selectedSetFlags,
    signerTypes,
    setSignerTypes,
  } = useStore(useShallow((s) => s));

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
        signer: null,
      },
    },
  };

  const operations = fullTransaction.tx.tx.operations;
  const operation = operations[id] || defaultOperation;

  const {
    master_weight: masterWeight,
    low_threshold: lowThreshold,
    med_threshold: mediumThreshold,
    high_threshold: highThreshold,
    home_domain: homeDomain,
    signer,
  } = operation.body.set_options || {};

  const sourceAccount = operation.source_account;

  const [masterWeightValue, setMasterWeightValue] = useState(
    masterWeight?.toString() || ""
  );

  const [selectedClearFlags, setSelectedClearFlags] = useState<number[][]>([]);
  const [selectedSetFlagsLocal, setSelectedSetFlagsLocal] = useState<number[]>(
    selectedSetFlags[id] || []
  );
  const [selectedClearFlagsLocal, setSelectedClearFlagsLocal] = useState<
    number[]
  >(selectedClearFlags[id] || []);
  const [currentSignerType, setCurrentSignerType] = useState<string>(
    signerOptions[0]
  );
  const [lowThresholdValue, setLowThresholdValue] = useState(
    lowThreshold?.toString() || ""
  );
  const [mediumThresholdValue, setMediumThresholdValue] = useState(
    mediumThreshold?.toString() || ""
  );
  const [highThresholdValue, setHighThresholdValue] = useState(
    highThreshold?.toString() || ""
  );
  useEffect(() => {
    if (id === 0) {
      if (
        operation.body.set_options?.signer?.key !== "" ||
        operation.body.set_options?.signer?.weight !== null
      ) {
        setCurrentSignerType(signerOptions[1]);
      } else {
        setCurrentSignerType(signerOptions[0]);
        const newOperations = [...fullTransaction.tx.tx.operations];

        newOperations[id] = {
          ...newOperations[id],
          body: {
            ...newOperations[id].body,
            set_options: {
              ...newOperations[id].body.set_options,
              signer: null,
            },
          },
        };
        setOperations(newOperations);
      }
    }
  }, [
    operation.body.set_options?.signer?.key,
    operation.body.set_options?.signer?.weight,
  ]);

  useEffect(() => {
    if (
      operation.body.set_options?.signer?.key === "" &&
      operation.body.set_options?.signer?.weight === null
    ) {
      setCurrentSignerType(signerOptions[0]);

      const newOperations = [...fullTransaction.tx.tx.operations];
      newOperations[id] = {
        ...newOperations[id],
        body: {
          ...newOperations[id].body,
          set_options: {
            ...newOperations[id].body.set_options,
            signer: null,
          },
        },
      };
      setOperations(newOperations);
    }
  }, [
    operation.body.set_options?.signer?.key,
    operation.body.set_options?.signer?.weight,
  ]);

  useEffect(() => {
    setSelectedSetFlagsLocal(selectedSetFlags[id] || []);
  }, [selectedSetFlags, id]);

  useEffect(() => {
    setSelectedClearFlagsLocal(selectedClearFlags[id] || []);
  }, [selectedClearFlags, id]);

  useEffect(() => {
    if (signer?.key || signer?.weight !== null) {
      setCurrentSignerType(signerOptions[1]);
    } else {
      setCurrentSignerType(signerOptions[0]);
    }
  }, [signer]);

  const calculateFlagPoints = (flags: number[], flagData: IFlag[]) => {
    return flags.reduce((total, flagId) => {
      const flag = flagData.find((f) => f.id === flagId);
      return total + (flag ? flag.points : 0);
    }, 0);
  };

  const handleToggleFlag = (flagId: number, flagType: "set" | "clear") => {
    const selectedFlagsLocal =
      flagType === "set" ? selectedSetFlagsLocal : selectedClearFlagsLocal;
    const setSelectedFlagsLocal =
      flagType === "set"
        ? setSelectedSetFlagsLocal
        : setSelectedClearFlagsLocal;
    const flagData = flagType === "set" ? setFlagsData : clearFlagsData;

    const newSelectedFlags = selectedFlagsLocal.includes(flagId)
      ? selectedFlagsLocal.filter((id) => id !== flagId)
      : [...selectedFlagsLocal, flagId];

    const newFlagsValue = calculateFlagPoints(newSelectedFlags, flagData);

    const newOperations = [...operations];
    if (newOperations[id]) {
      newOperations[id] = {
        ...newOperations[id],
        body: {
          ...newOperations[id].body,
          set_options: {
            ...newOperations[id].body.set_options,
            [flagType === "set" ? "set_flags" : "clear_flags"]: newFlagsValue,
          },
        },
      };
      setOperations(newOperations);
    }

    setSelectedFlagsLocal(newSelectedFlags);

    // Update global selected flags in the store
    if (flagType === "set") {
      const newSelectedSetFlags = [...selectedSetFlags];
      newSelectedSetFlags[id] = newSelectedFlags;
      useStore.setState({ selectedSetFlags: newSelectedSetFlags });
    } else {
      const newSelectedClearFlags = [...selectedClearFlags];
      newSelectedClearFlags[id] = newSelectedFlags;
      setSelectedClearFlags(newSelectedClearFlags);
    }
  };

  const validateRange = (value: string): boolean => {
    const num = Number(value);
    return num >= 0 && num <= 255;
  };

  const handleHomeDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newOperations = [...operations];
    if (newOperations[id]) {
      newOperations[id] = {
        ...newOperations[id],
        body: {
          ...newOperations[id].body,
          set_options: {
            ...newOperations[id].body.set_options,
            home_domain: value,
          },
        },
      };
      setOperations(newOperations);
    }
  };

  const handleInputChange =
    (field: Field | "home_domain") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numValue = Number(value);

      if (field === "home_domain") {
        handleHomeDomainChange(e);
        return;
      }

      if (
        value === "" ||
        (!isNaN(numValue) && validateRange(numValue.toString()))
      ) {
        const fieldSetters = {
          master_weight: setMasterWeightValue,
          low_threshold: setLowThresholdValue,
          med_threshold: setMediumThresholdValue,
          high_threshold: setHighThresholdValue,
        };

        fieldSetters[field]?.(value);

        const newOperations = [...operations];
        if (newOperations[id]) {
          newOperations[id] = {
            ...newOperations[id],
            body: {
              ...newOperations[id].body,
              set_options: {
                ...newOperations[id].body.set_options,
                [field]: value === "" ? undefined : numValue,
              },
            },
          };
          setOperations(newOperations);
        }
      }
    };

  const handleSignerChange =
    (field: "key" | "weight") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newOperations = [...operations];
      if (newOperations[id]) {
        const signer = newOperations[id].body.set_options?.signer || {};
        newOperations[id] = {
          ...newOperations[id],
          body: {
            ...newOperations[id].body,
            set_options: {
              ...newOperations[id].body.set_options,
              signer: {
                ...signer,
                [field]:
                  field === "weight"
                    ? value === ""
                      ? undefined
                      : Number(value)
                    : value,
              },
            },
          },
        };
        setOperations(newOperations);
      }
    };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("masterWeight", masterWeight ? masterWeight.toString() : "none");
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [masterWeight]);

  const handleSignerTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setCurrentSignerType(selectedType);

    const isDefaultOption = selectedType === signerOptions[0];
    const newOperations = [...operations];

    if (newOperations[id]) {
      newOperations[id] = {
        ...newOperations[id],
        body: {
          ...newOperations[id].body,
          set_options: {
            ...newOperations[id].body.set_options,
            signer: isDefaultOption ? null : { key: "", weight: undefined },
          },
        },
      };
      setOperations(newOperations);
    }

    const newSignerTypes = [...signerTypes];
    newSignerTypes[id] = isDefaultOption ? 0 : 1;
    setSignerTypes(newSignerTypes);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("masterWeight", masterWeightValue);
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [masterWeightValue]);

  return (
    <>
      <p>Sets various configuration options for an account.</p>
      <hr />
      <div className={s.main}>
        <FlagSelector
          title="Set Flags"
          flags={setFlagsData}
          selectedFlags={selectedSetFlagsLocal}
          onToggle={(flagId) => handleToggleFlag(flagId, "set")}
        />

        <FlagSelector
          title="Clear Flags"
          flags={clearFlagsData}
          selectedFlags={selectedClearFlagsLocal}
          onToggle={(flagId) => handleToggleFlag(flagId, "clear")}
        />

        <InputField
          title="Master Weight"
          placeholder="0-255"
          value={masterWeightValue}
          onChange={handleInputChange("master_weight")}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
          warningMessage="This can result in a permanently locked account. Are you sure you know what you're doing?"
        />

        <InputField
          title="Low Threshold"
          placeholder="0-255"
          value={lowThresholdValue}
          onChange={handleInputChange("low_threshold")}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
        />

        <InputField
          title="Medium Threshold"
          placeholder="0-255"
          value={mediumThresholdValue}
          onChange={handleInputChange("med_threshold")}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
          warningMessage="This can result in a permanently locked account. Are you sure you know what you're doing?"
        />

        <InputField
          title="High Threshold"
          placeholder="0-255"
          value={highThresholdValue}
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
              onChange={handleSignerTypeChange}
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
                  value={signer?.key || ""}
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
                  value={signer?.weight?.toString() || ""}
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
          value={homeDomain || ""}
          onChange={handleHomeDomainChange}
        />

        <InputField
          title="Source Account"
          placeholder="Ex: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
          value={sourceAccount || ""}
          onChange={(e) => handleSourceAccountChange(e, id)}
          validate={(value) =>
            StellarSdk.StrKey.isValidEd25519PublicKey(value) || value === ""
          }
          errorMessage="Public key is invalid."
          isOptional={true}
        />
      </div>
    </>
  );
};

export default SetOptions;
