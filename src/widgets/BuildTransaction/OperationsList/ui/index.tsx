"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { SetOptions, ManageData } from "@/widgets";
import { IOperation } from "@/shared/types/store/slices/BuildTransaction/buildTxJSONSlice";
import { useShallow } from "zustand/react/shallow";
import { setOperationType } from "@/shared/helpers";
import { IsShowedBlock } from "@/shared/widgets";

export const getOperationType = (operation: IOperation): string => {
  if (operation.body?.set_options) {
    return "set_options";
  } else if (operation.body?.manage_data) {
    return "manage_data";
  } else {
    return "select_operation_type";
  }
};

const OperationsList: FC = () => {
  const { tx, setOperations } = useStore(useShallow((state) => state));
  const [showTooltip, setShowTooltip] = useState(false);
  const [isShowOperation, setIsShowOperation] = useState<
    { isShow: boolean; index: number }[]
  >([
    {
      isShow: true,
      index: 0,
    },
  ]);

  // State to keep track of operation IDs
  const [operationIds, setOperationIds] = useState<number[]>([]);
  const [nextOperationId, setNextOperationId] = useState<number>(0);

  // Initialize operationIds and nextOperationId when the component mounts
  useEffect(() => {
    if (tx.tx.operations.length > 0 && operationIds.length === 0) {
      const initialIds = tx.tx.operations.map((_, index) => index + 1);
      setOperationIds(initialIds);
      setNextOperationId(tx.tx.operations.length + 1);
    }
  }, [tx.tx.operations]);

  const addIsShowOperation = () => {
    setIsShowOperation([
      ...isShowOperation,
      {
        isShow: true,
        index: isShowOperation.length,
      },
    ]);
  };

  useEffect(() => {
    if (tx.tx.operations.length > 0) {
      const updatedOperations = tx.tx.operations.map((operation) => {
        if (!operation.body?.set_options && !operation.body?.manage_data) {
          return {
            ...operation,
            body: {
              manage_data: {
                data_name: "",
                data_value: null,
              },
            },
          };
        }
        return operation;
      });
      setOperations(updatedOperations);
    }
  }, []);

  const handleAddOperation = () => {
    /*const body: IOperation["body"] = {};
        (state.tx.tx.operations as IOperation[]).push({
          source_account: "",
          body,
        } as IOperation);
        state.fullTransaction = { tx: state.tx };*/
    const body: IOperation["body"] = {};
    const newOperation: IOperation = {
      source_account: "",
      body,
    };
    setOperations([...tx.tx.operations, newOperation]);
    setOperationIds([...operationIds, nextOperationId]);
    setNextOperationId(nextOperationId + 1);
    addIsShowOperation();
  };

  const duplicateOperation = (index: number) => {
    const operationToDuplicate = tx.tx.operations[index];
    if (operationToDuplicate) {
      setOperations([...tx.tx.operations, { ...operationToDuplicate }]);
      setOperationIds([...operationIds, nextOperationId]);
      setNextOperationId(nextOperationId + 1);
      addIsShowOperation();
    }
  };

  const deleteOperation = (index: number) => {
    setOperations(tx.tx.operations.filter((_, i) => i !== index));
    setOperationIds(operationIds.filter((_, i) => i !== index));
  };

  const moveDownOperation = (index: number) => {
    if (index >= tx.tx.operations.length - 1) return;
    const updatedOperations = [...tx.tx.operations];
    [updatedOperations[index], updatedOperations[index + 1]] = [
      updatedOperations[index + 1],
      updatedOperations[index],
    ];
    setOperations(updatedOperations);

    const updatedIds = updatedOperations.map((_, i) => i + 1);
    setOperationIds(updatedIds);

    const updatedIsShow = updatedOperations.map((_, i) => ({
      ...isShowOperation[i],
      index: i,
    }));
    setIsShowOperation(updatedIsShow);
  };

  const moveUpOperation = (index: number) => {
    if (index <= 0) return;
    const updatedOperations = [...tx.tx.operations];
    [updatedOperations[index], updatedOperations[index - 1]] = [
      updatedOperations[index - 1],
      updatedOperations[index],
    ];
    setOperations(updatedOperations);

    const updatedIds = updatedOperations.map((_, i) => i + 1);
    setOperationIds(updatedIds);

    const updatedIsShow = updatedOperations.map((_, i) => ({
      ...isShowOperation[i],
      index: i,
    }));
    setIsShowOperation(updatedIsShow);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000); // Подсказка исчезнет через 2 секунды
  };
  const handleClearOperations = () => {
    setOperations([]);
    setOperationIds([]);
    setNextOperationId(1);
    setIsShowOperation([]);
  };

  return (
    <div className="segment blank">
      {tx.tx.operations.map((operation, index) => (
        <div key={index}>
          <div
            style={{
              marginTop: "20px",
              border: "1px solid #535759",
              padding: "10px 10px 5px 10px",
              borderRadius: "10px",
              boxShadow: "0 0px 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <h4>Operation {operationIds[index]}</h4>
              <div>
                <button
                  title="Move up"
                  className="btn"
                  onClick={() => moveUpOperation(index)}
                  disabled={index === 0}
                >
                  <i className="fa-solid fa-arrow-up"></i>
                </button>
                <button
                  title="Move down"
                  className="btn"
                  onClick={() => moveDownOperation(index)}
                  disabled={index === tx.tx.operations.length - 1}
                >
                  <i className="fa-solid fa-arrow-down"></i>
                </button>
                <button
                  title="Duplicate"
                  onClick={() => duplicateOperation(index)}
                  className="btn"
                >
                  <i className="fa-solid fa-clone"></i>
                </button>
                <button
                  title="Delete"
                  onClick={() => deleteOperation(index)}
                  className="btn"
                  disabled={tx.tx.operations.length <= 1}
                  style={{
                    marginRight: "30px",
                  }}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
                <IsShowedBlock
                  condition={isShowOperation[index]?.isShow}
                  style={{
                    marginRight: "30px",
                  }}
                  onToggle={() => {
                    const updatedIsShow = [...isShowOperation];
                    updatedIsShow[index] = {
                      ...updatedIsShow[index],
                      isShow: !updatedIsShow[index]?.isShow,
                    };
                    setIsShowOperation(updatedIsShow);
                  }}
                />
              </div>
            </div>
            {isShowOperation[index]?.isShow && (
              <div>
                <hr className="flare" />
                <h4>Operation Type</h4>
                <select
                  className="input"
                  value={getOperationType(operation)}
                  onChange={(e) =>
                    setOperationType(index, e.target.value, tx, setOperations)
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
            )}
          </div>
        </div>
      ))}
      <div
        className="flex"
        style={{ marginTop: "10px", justifyContent: "space-between" }}
      >
        <div>
          <button
            onClick={() => {
              handleAddOperation();
            }}
          >
            <i className="fa fa-plus" aria-hidden="true"></i> Add operation
          </button>
          <div style={{ position: "relative", display: "inline-block" }}>
            <button onClick={handleCopy} title="Share">
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
            </button>
            {showTooltip && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: "5px",
                  backgroundColor: "#333",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  zIndex: 1,
                }}
              >
                Copied shareable URL
              </div>
            )}
          </div>
        </div>
        <button onClick={() => handleClearOperations()}>
          <i className="fa fa-trash" aria-hidden="true"></i> Clear operations
        </button>
      </div>
    </div>
  );
};

export default OperationsList;
