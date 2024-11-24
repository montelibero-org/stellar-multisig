"use client";

import { FC, useEffect, useState } from "react";
import { useStore } from "@/shared/store";
import { SetOptions, ManageData } from "@/widgets";
import { IOperation } from "@/shared/types/store/slices/BuildTransaction/buildTxJSONSlice";
import { useShallow } from "zustand/react/shallow";
import {setOperationType} from "@/shared/helpers";
import { IsShowedBlock } from "@/shared/widgets";

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

 
  const [operationIds, setOperationIds] = useState<Map<number, IOperation>>(
    new Map()
  );

  const [nextOperationId, setNextOperationId] = useState<number>(1);


  useEffect(() => {
    if (tx.tx.operations.length > 0 && operationIds.size === 0) {
      const initialIds = new Map<number, IOperation>();
      tx.tx.operations.forEach((operation, index) => {
        initialIds.set(index + 1, operation); // Присваиваем уникальный ID на основе индекса
      });
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
    const newOperationId = nextOperationId;
    const body: IOperation["body"] = {};
    const newOperation: IOperation = {
      source_account: "",
      body,
    };
    setOperations([...tx.tx.operations, newOperation]);
    setOperationIds(new Map(operationIds.set(newOperationId, newOperation)));
    setNextOperationId(nextOperationId + 1);
    addIsShowOperation();
  };

  const duplicateOperation = (index: number) => {
    const operationToDuplicate = tx.tx.operations[index];
    if (operationToDuplicate) {
      const newOperationId = nextOperationId;
      setOperations([...tx.tx.operations, { ...operationToDuplicate }]);
      setOperationIds(new Map(operationIds.set(newOperationId, operationToDuplicate)));
      setNextOperationId(nextOperationId + 1);
      addIsShowOperation();
    }
  };

  const deleteOperation = (index: number) => {
    
    const updatedOperations = tx.tx.operations.filter((_, i) => i !== index);
  
    
    const updatedOperationIds = new Map<number, IOperation>();
    updatedOperations.forEach((operation, idx) => {
      updatedOperationIds.set(idx + 1, operation); 
    });
  
    
    const updatedIsShowOperation = updatedOperations.map((_, idx) => ({
      isShow: true,
      index: idx,
    }));
  
  
    setOperations(updatedOperations);
    setOperationIds(updatedOperationIds);
    setIsShowOperation(updatedIsShowOperation);
  
    const urlParams = new URLSearchParams(window.location.search);
    Array.from(urlParams.keys()).forEach((key) => {
      const match = key.match(/(\d+)$/);
      if (match && parseInt(match[1]) === index) {
        urlParams.delete(key);
      }
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${urlParams.toString()}`);
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

  const moveDownOperation = (index: number) => {
    if (index >= tx.tx.operations.length - 1) return; 
    
   
    const updatedOperations = [...tx.tx.operations];
    [updatedOperations[index], updatedOperations[index + 1]] = [
      updatedOperations[index + 1],
      updatedOperations[index],
    ];
  
   
    setOperations(updatedOperations);
  
    
    const updatedIds = new Map(
      updatedOperations.map((operation, i) => [i + 1, operation])
    );
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
  
 
    const updatedIds = new Map(
      updatedOperations.map((operation, i) => [i + 1, operation])
    );
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
    }, 2000); 
  };

  const handleClearOperations = () => {
    setOperations([]);
    setOperationIds(new Map());
    setNextOperationId(1);
    setIsShowOperation([]);
  };

  return (
    <div className="segment blank">
      {tx.tx.operations.map((operation, index) => (
        <div  key={operationIds.get(index + 1)?.source_account || index}>
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
              <h4>Operation {operationIds.get(index + 1)?.source_account || index + 1}</h4>
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
