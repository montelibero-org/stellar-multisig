"use client";

import { FC, useState } from "react";
import { useStore } from "@/shared/store";
import { SetOptions, ManageData } from "@/widgets";
import { IOperation } from "@/shared/types/store/slices/BuildTransaction/buildTxJSONSlice";
import { useShallow } from "zustand/react/shallow";
import { OperationType } from "stellar-sdk";

const OperationsList: FC = () => {
  const { tx, addOperation, setOperations } = useStore(useShallow((state) => state));
  const [isOperationsOpen, setIsOperationsOpen] = useState<boolean>(false);

  const handleAddOperation = () => {
    addOperation();
    setIsOperationsOpen(true);
  };

  const duplicateOperation = (index: number) => {
    const operationToDuplicate = tx.tx.operations[index];
    if (operationToDuplicate) {
      setOperations([
        ...tx.tx.operations,
        {
          ...operationToDuplicate,
          source_account: operationToDuplicate.source_account,
        },
      ]);
    }
  };

  const removeOperation = (index: number) => {
    setOperations(tx.tx.operations.filter((_, i) => i !== index));
  };

  const setOperationType = (index: number, type: string) => {
    if (index >= 0 && index < tx.tx.operations.length) {
      const updatedOperations = [...tx.tx.operations];
      updatedOperations[index] = {
        ...updatedOperations[index],
        body:
          type === "set_options"
            ? { set_options: {} }
            : { manage_data: { data_name: "", data_value: null } },
      };
      setOperations(updatedOperations);
    }
  };

  const getOperationType = (operation: IOperation): string => {
    if (operation.body?.set_options) {
      return "set_options";
    } else if (operation.body?.manage_data) {
      return "manage_data";
    } else {
      return "select_operation_type";
    }
  };

  return (
    <>
      {tx?.tx?.operations?.length > 0 && (
        <button onClick={() => setIsOperationsOpen(!isOperationsOpen)}>
          {isOperationsOpen ? "Hide Operations" : "Show Operations"}
        </button>
      )}
      {isOperationsOpen &&
        tx.tx.operations.map((operation, index) => (
          <div key={index} className="blank flex">
            <div
              style={{
                borderRight: "1px solid #535759",
                borderBottom: "1px solid #535759",
                paddingRight: "10px",
              }}
              className="flex flex-col"
            >
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="text-center blank"
              >
                {index + 1}
              </div>
              <button onClick={() => duplicateOperation(index)}>
                Duplicate
              </button>
              {tx.tx.operations.length > 1 && (
                <button onClick={() => removeOperation(index)}>
                  Remove
                </button>
              )}
            </div>
            <div
              style={{
                borderBottom: "1px solid #535759",
                paddingLeft: "10px",
              }}
            >
              <h4>Operation Type</h4>
              <select
                className="input"
                value={getOperationType(operation)}
                onChange={(e) =>
                  setOperationType(index, e.target.value as OperationType)
                }
              >
                <option value="select_operation_type">
                  Select Operation Type
                </option>
                <option value="manage_data">Manage Data</option>
                <option value="set_options">Set Options</option>
              </select>

              <div className="mt-3">
                {getOperationType(operation) === "set_options" && (
                  <SetOptions id={index} />
                )}
                {getOperationType(operation) === "manage_data" && (
                  <ManageData id={index} />
                )}
              </div>
            </div>
          </div>
        ))}
        <button onClick={handleAddOperation}>Add New Operation</button>
    </>
  );
};

export default OperationsList;
