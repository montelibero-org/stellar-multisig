"use client";

import React, { FC, ChangeEvent, useEffect } from "react";
import s from "@/widgets/OperationTypes/index.module.scss";
import InputField from "@/widgets/OperationTypes/shared/InputField";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import StellarSdk from "stellar-sdk";
import { IOperation } from "@/shared/types/store/slices";
import { hexToString, stringToHex } from "@/shared/helpers";
import { useHandleSourceAccountChange } from "@/features/hooks";

interface Props {
  id: number;
}

const ManageData: FC<Props> = ({ id }) => {
  const handleSourceAccountChange = useHandleSourceAccountChange();
  const { tx, setOperations } = useStore(
    useShallow((state) => ({
      tx: state.tx,
      setOperations: state.setOperations,
    }))
  );

  const defaultOperation: IOperation = {
    source_account: "",
    body: {
      manage_data: {
        data_name: "",
        data_value: null,
      },
    },
  };

  // Ensure we have an operation with default structure
  const operation = tx.tx.operations[id] || defaultOperation;

  // Ensure `data_name` and `data_value` are not `undefined`
  const entryName = operation.body.manage_data?.data_name ?? "";
  const entryValue = operation.body.manage_data?.data_value ?? null;
  const sourceAccount = operation.source_account || "";

  const validateSymbols = (value: string): boolean => value.length <= 64;

  // Update the operations list
  const updateOperations = (updatedOperation: Partial<IOperation>) => {
    const newOperations = [...tx.tx.operations];
    newOperations[id] = {
      ...newOperations[id],
      ...updatedOperation,
    };
    setOperations(newOperations);
  };

  const handleEntryNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateOperations({
      body: {
        ...operation.body,
        manage_data: {
          ...operation.body.manage_data!,
          data_name: event.target.value,
        },
      },
    });
  };

  const handleEntryValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateOperations({
      body: {
        ...operation.body,
        manage_data: {
          ...operation.body.manage_data!,
          data_value: stringToHex(event.target.value),
        },
      },
    });
  };

  useEffect(() => {
    if (!tx.tx.operations[id]) {
      setOperations([...tx.tx.operations, defaultOperation]);
    }
  }, [defaultOperation, id, setOperations, tx.tx.operations]);

  return (
    <>
      <p>Sets, modifies, or deletes a Data Entry (name/value pair).</p>
      <hr />
      <div className={s.main}>
        <InputField
          title="Entry Name"
          placeholder=""
          value={tx.tx.operations[id].body?.manage_data?.data_name ?? ""}
          onChange={handleEntryNameChange}
          validate={validateSymbols}
          errorMessage={`Entry name can only contain a maximum of 64 characters. ${entryName.length} characters.`}
          isOptional={false}
        />
        <InputField
          title="Entry Value"
          placeholder=""
          value={
            hexToString(
              tx.tx.operations[id].body.manage_data?.data_value || ""
            ) ?? ""
          }
          onChange={handleEntryValueChange}
          validate={validateSymbols}
          warningMessage={
            <>
              If empty, this will delete the data entry named in this operation.{" "}
              <br /> Note: The Lab only supports strings.
            </>
          }
          errorMessage={`Entry value can only contain a maximum of 64 characters. ${
            typeof entryValue === "string" ? entryValue.length : 0
          } characters.`}
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
          isOptional={true }
        />
      </div>
    </>
  );
};

export default ManageData;
