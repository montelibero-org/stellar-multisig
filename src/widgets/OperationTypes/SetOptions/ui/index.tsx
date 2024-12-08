"use client";

import React, { useState, FC, useEffect } from "react";
import FlagSelector from "../../shared/FlagSelector";
import { setFlagsData, clearFlagsData } from "./flagsData";
import s from "@/widgets/OperationTypes/index.module.scss";
import StellarSdk from "stellar-sdk";
import InputField from "../../shared/InputField";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";

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
  const [selectedSetFlagsBitmask, setSelectedSetFlagsBitmask] = useState(0);
  const [selectedClearFlagsBitmask, setSelectedClearFlagsBitmask] = useState(0);
  const [selectedClearFlags] = useState<number[][]>([]);
  // const [selectedSetFlagsLocal, setSelectedSetFlagsLocal] = useState<number[]>(
  //   selectedSetFlags[id] || []
  // );
  // const [selectedClearFlagsLocal, setSelectedClearFlagsLocal] = useState<
  //   number[]
  // >(selectedClearFlags[id] || []);
  const [currentSignerType, setCurrentSignerType] = useState<string>(
    signerOptions[0]
  );
  const [lowThresholdValue, setLowThresholdValue] = useState(
    lowThreshold != null ? lowThreshold.toString() : "0"
  );

  const [mediumThresholdValue, setMediumThresholdValue] = useState(
    mediumThreshold != null ? mediumThreshold.toString() : "0"
  );

  const [highThresholdValue, setHighThresholdValue] = useState(
    highThreshold != null ? highThreshold.toString() : "0"
  );
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    
    console.log("URL Params:", window.location.search);

    
    const setFlags = params.get(`SetFlags${id}`);
    const clearFlags = params.get(`ClearFlags${id}`);

    
    if (setFlags !== null) {
      console.log(`SetFlags0 из URL: ${setFlags}`);
      setSelectedSetFlagsBitmask(Number(setFlags)); 
    } else {
      console.log('SetFlags0 не найден');
    }

    if (clearFlags !== null) {
      console.log(`ClearFlags0 из URL: ${clearFlags}`);
      setSelectedClearFlagsBitmask(Number(clearFlags));  
    } else {
      console.log('ClearFlags0 не найден');
    }
  }, []);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  // Обновляем URL параметры при изменении битмасок
  params.set(`SetFlags${id}`, selectedSetFlagsBitmask.toString());
  params.set(`ClearFlags${id}`, selectedClearFlagsBitmask.toString());

  window.history.replaceState({}, "", `?${params.toString()}`);
}, [selectedSetFlagsBitmask, selectedClearFlagsBitmask, id]);
useEffect(() => {
  console.log("Current selectedSetFlagsBitmask:", selectedSetFlagsBitmask);
  console.log("Current selectedClearFlagsBitmask:", selectedClearFlagsBitmask);
  console.log("URL Params:", window.location.search);
}, [selectedSetFlagsBitmask, selectedClearFlagsBitmask, id]);
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

  // useEffect(() => {
  //   setSelectedSetFlagsLocal(selectedSetFlags[id] || []);
  // }, [selectedSetFlags, id]);

  // useEffect(() => {
  //   setSelectedClearFlagsLocal(selectedClearFlags[id] || []);
  // }, [selectedClearFlags, id]);

  // const calculateFlagPoints = (flags: number[], flagData: IFlag[]) => {
  //   return flags.reduce((total, flagId) => {
  //     const flag = flagData.find((f) => f.id === flagId);
  //     return total + (flag ? flag.points : 0);
  //   }, 0);
  // };

  useEffect(() => {
    if (signer?.key || signer?.weight !== null) {
      setCurrentSignerType(signerOptions[1]);
    } else {
      setCurrentSignerType(signerOptions[0]);
    }
  }, [signer]);
  useEffect(() => {
    const currentSetFlags = selectedSetFlags[id] || [];
    setSelectedSetFlagsBitmask(
      currentSetFlags.reduce((bitmask, flagId) => bitmask | (1 << flagId), 0)
    );

    const currentClearFlags = selectedClearFlags[id] || [];
    setSelectedClearFlagsBitmask(
      currentClearFlags.reduce((bitmask, flagId) => bitmask | (1 << flagId), 0)
    );
  }, [selectedSetFlags, selectedClearFlags, id]);
  const handleToggleFlag = (flagId: number, flagType: "set" | "clear") => {
    const bitmask =
      flagType === "set" ? selectedSetFlagsBitmask : selectedClearFlagsBitmask;
    const newBitmask = bitmask ^ (1 << flagId);
  
    if (flagType === "set") {
      setSelectedSetFlagsBitmask(newBitmask);
    } else {
      setSelectedClearFlagsBitmask(newBitmask);
    }
  
    const newOperations = [...fullTransaction.tx.tx.operations];
    if (newOperations[id]) {
      newOperations[id] = {
        ...newOperations[id],
        body: {
          ...newOperations[id].body,
          set_options: {
            ...newOperations[id].body.set_options,
            [flagType === "set" ? "set_flags" : "clear_flags"]: newBitmask,
          },
        },
      };
      setOperations(newOperations);
    }
};

  const validateRange = (value: string): boolean => {
    if (value === "") return true; 
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

    
      params.set("masterWeight" + id.toString(), masterWeight?.toString() || "");
    
    
    params.set(
      "lowThreshold" + id.toString(),
      lowThresholdValue?.toString() || ""
    );
  
    params.set(
      "mediumThreshold" + id.toString(),
      mediumThresholdValue?.toString() || ""
    );

    params.set(
      "highThreshold" + id.toString(),
      highThresholdValue?.toString() || ""
    );

    params.set("homeDomain" + id.toString(), homeDomain?.toString() || "");

   
  
    

    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [
    masterWeight,
    lowThresholdValue,
    mediumThresholdValue,
    highThresholdValue,
    homeDomain,
    sourceAccount,
    id,
   
  ]);

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

    

    params.set(
      "sourceAccount" + id.toString(),
      sourceAccount?.toString() || ""
    );

    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [ sourceAccount, homeDomain]);

  useEffect(() => {
    const operation = fullTransaction.tx.tx.operations[id] || defaultOperation;

    setLowThresholdValue(
      operation.body.set_options?.low_threshold?.toString() || ""
    );
    setMediumThresholdValue(
      operation.body.set_options?.med_threshold?.toString() || ""
    );
    setHighThresholdValue(
      operation.body.set_options?.high_threshold?.toString() || ""
    );
  }, [fullTransaction, id]);
//   const parseFlagsFromURL = (paramName: string): number | null => {
//     const params = new URLSearchParams(window.location.search);
//     const bitmask = params.get(paramName);
//     return bitmask ? parseInt(bitmask, 10) : null;
// };




  return (
    <>
      <p>Sets various configuration options for an account.</p>
      <hr />
      <div className={s.main}>
        <FlagSelector
          title="Set Flags"
          flags={setFlagsData}
          operationIndex={id}
          selectedFlagsBitmask={selectedSetFlagsBitmask}
          onToggle={(flagId) => handleToggleFlag(flagId, "set")}
        />

        <FlagSelector
          operationIndex={id}
          title="Clear Flags"
          flags={clearFlagsData}
          selectedFlagsBitmask={selectedClearFlagsBitmask}
          onToggle={(flagId) => handleToggleFlag(flagId, "clear")}
        />

        <InputField
          title="Master Weight"
          placeholder="0-255"
          value={masterWeightValue}
          onChange={handleInputChange("master_weight")}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
          warningMessage={
            masterWeightValue !== "" && +masterWeightValue >= 0
              ? "This can result in a permanently locked account. Are you sure you know what you're doing?"
              : ""
          }
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
          warningMessage={
            mediumThresholdValue !== "" && +mediumThresholdValue >= 0
              ? "This can result in a permanently locked account. Are you sure you know what you're doing?"
              : ""
          }
        />

        <InputField
          title="High Threshold"
          placeholder="0-255"
          value={highThresholdValue}
          onChange={handleInputChange("high_threshold")}
          validate={validateRange}
          errorMessage="Expected an integer between 0 and 255 (inclusive)."
          warningMessage={
            highThresholdValue !== "" && +highThresholdValue >= 0
              ? "This can result in a permanently locked account. Are you sure you know what you're doing?"
              : ""
          }
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
