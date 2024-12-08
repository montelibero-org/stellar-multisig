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
  const [operationsLoadedFromUrl, setOperationsLoadedFromUrl] = useState<boolean>(false);

 
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
  
    // Получаем текущие операции из хранилища
    const currentOperations = [...tx.tx.operations];
  
    // Обновляем список операций, добавляя новую
    setOperations([...currentOperations, newOperation]);
  
    // Обновляем operationIds и nextOperationId
    setOperationIds(new Map(operationIds.set(newOperationId, newOperation)));
    setNextOperationId(nextOperationId + 1);
    
    addIsShowOperation();
  };

  const duplicateOperation = (index: number) => {
    const operationToDuplicate = tx.tx.operations[index];
    const body: IOperation["body"] = {};
    if (operationToDuplicate) {
      const newOperationId = nextOperationId;
      setOperations([...tx.tx.operations, { ...operationToDuplicate }]);
      setOperationIds(new Map(operationIds.set(newOperationId, operationToDuplicate)));
      setNextOperationId(nextOperationId + 1);
      addIsShowOperation();
    }

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(nextOperationId.toString(), JSON.stringify(body)); 
    window.history.replaceState(null, "", `${window.location.pathname}?${urlParams.toString()}`);
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
  useEffect(() => {
    console.log("URL Params: ", window.location.search);
    const urlParams = new URLSearchParams(window.location.search);
    const operationsFromUrl: IOperation[] = [];
    let index = 0;
    const updatedIsShowOperation: { isShow: boolean; index: number  }[] = [];
  
    // Чтение операций из URL-параметров
    while (urlParams.has(`sourceAccount${index}`)) {
      const sourceAccount = urlParams.get(`sourceAccount${index}`);
      const masterWeight = urlParams.get(`masterWeight${index}`);
      const lowThreshold = urlParams.get(`lowThreshold${index}`);
      const medThreshold = urlParams.get(`mediumThreshold${index}`);
      const highThreshold = urlParams.get(`highThreshold${index}`);
      const homeDomain = urlParams.get(`homeDomain${index}`);
      const setFlags = urlParams.get(`SetFlags${index}`); 
      const clearFlags = urlParams.get(`ClearFlags${index}`); 
  
      if (sourceAccount || masterWeight || lowThreshold || medThreshold || highThreshold || homeDomain || setFlags || clearFlags) {
        operationsFromUrl.push({
          source_account: sourceAccount || "",
          body: {
            set_options: {
              master_weight: masterWeight ? Number(masterWeight) : null, 
              low_threshold: lowThreshold ? Number(lowThreshold) : null, 
              med_threshold: medThreshold ? Number(medThreshold) : null, 
              high_threshold: highThreshold ? Number(highThreshold) : null,
              home_domain: homeDomain || "",
              set_flags: setFlags ? Number(setFlags) : undefined, 
              clear_flags: clearFlags ? Number(clearFlags) : undefined,
            },
          },
        });
        updatedIsShowOperation.push({ isShow: true, index });
      }
      index++;
    }
  
    // Если операции из URL присутствуют и мы ещё не загрузили их
    if (operationsFromUrl.length > 0 && !operationsLoadedFromUrl) {
      setOperations(operationsFromUrl);  // Устанавливаем операции с флагами
      const initialIds = new Map();
      operationsFromUrl.forEach((operation, idx) => {
        initialIds.set(idx + 1, operation);
      });
      setOperationIds(initialIds);
      setNextOperationId(operationsFromUrl.length + 1);
      setIsShowOperation(updatedIsShowOperation);
      setOperationsLoadedFromUrl(true);  // Отмечаем, что операции загружены
    }
  }, [window.location.search, operationsLoadedFromUrl]);

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
