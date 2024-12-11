"use client";

import React, { FC, ChangeEvent, useEffect, useState } from "react";
import s from "@/widgets/OperationTypes/index.module.scss";
import InputField from "@/widgets/OperationTypes/shared/InputField";
import { useStore } from "@/shared/store";
import { useShallow } from "zustand/react/shallow";
import StellarSdk from "stellar-sdk";
import { IOperation } from "@/shared/types/store/slices";
import { hexToString, stringToHex } from "@/shared/helpers";
import { useSearchParams } from "next/navigation";

interface Props {
  id: number;
}

const ManageData: FC<Props> = ({ id }) => {
  const searchParams = useSearchParams();
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

  const operation = tx.tx.operations[id] || defaultOperation;

  const initialEntryName =
  searchParams.get("entryName" + id.toString()) ||
  operation.body.manage_data?.data_name ||
  undefined;

  const initialEntryValue =
  stringToHex(searchParams.get("entryValue" + id.toString()) ?? "") ||
  operation.body.manage_data?.data_value ||
  null;

  const initialSourceAccount =
    searchParams.get("sourceAccount" + id.toString()) ||
    operation.source_account ||
    "";

  const [entryName, setEntryName] = useState(initialEntryName);
  const [entryValue, setEntryValue] = useState(initialEntryValue);
  const [sourceAccount, setSourceAccount] = useState(initialSourceAccount);

  useEffect(() => {
    const newOperations = [...tx.tx.operations];

    const currentOperation = newOperations[id] || defaultOperation;

    const updatedOperation: IOperation = {
      ...currentOperation,
      source_account: sourceAccount.toString(),
    };

    newOperations[id] = updatedOperation;

    setOperations(newOperations);
  }, [entryName, entryValue, sourceAccount]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (entryName !== null && entryName !== undefined) {
      params.set("entryName" + id.toString(), entryName?.toString() || "");
    }else{
      params.delete("entryName" + id.toString());
    }
    if (entryValue !== null && entryValue !== undefined) {
      params.set(
        "entryValue" + id.toString(),
        hexToString(entryValue?.toString() ?? "") || ""
      );
    }else{
      params.delete("entryValue" + id.toString());
    }
    if (sourceAccount !== null && sourceAccount !== undefined) {
    params.set(
      "sourceAccount" + id.toString(),
      sourceAccount?.toString() || ""
    );
  }else{
    params.delete("sourceAccount" + id.toString());
  }
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [entryName, entryValue, sourceAccount]);

  const validateSymbols = (value: string): boolean => value.length <= 64;

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

    setEntryName(event.target.value);
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

    setEntryValue(stringToHex(event.target.value));
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
          value={entryName ?? ""}
          onChange={handleEntryNameChange}
          validate={validateSymbols}
          errorMessage={`Entry name can only contain a maximum of 64 characters. ${
            entryName !== undefined &&
            entryName.toString().length > 0 &&
            entryName.toString().length
          } characters.`}
          isOptional={false}
        />
        <InputField
          title="Entry Value"
          placeholder=""
          value={hexToString(entryValue || "") ?? ""}
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
          value={sourceAccount?.toString() ?? ""}
          onChange={(e) => setSourceAccount(e.target.value)}
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

export default ManageData;
