import { IOperation, TX } from "@/shared/types";

const setOperationType = (
  index: number,
  type: string,
  tx: TX,
  setOperations: (operations: IOperation[]) => void
) => {
  if (index >= 0 && index < tx.tx.operations.length) {
    const updatedOperations = [...tx.tx.operations];

   
    updatedOperations[index] = {
      ...updatedOperations[index],
      body:
        type === "set_options"
          ? { set_options: { signer: null } }
          : type === "manage_data"
          ? { manage_data: { data_name: "", data_value: null } }
          : {},
    };

    setOperations(updatedOperations);


    const currentUrlParams = new URLSearchParams(window.location.search);
    const paramsToClear = [
      `masterWeight${index}`,
      `lowThreshold${index}`,
      `medThreshold${index}`,
      `highThreshold${index}`,
      `homeDomain${index}`,
      `entryName${index}`,
      `entryValue${index}`,
      `sourceAccount${index}`,
    ];
    paramsToClear.forEach((param) => currentUrlParams.delete(param));

    
    if (type === "manage_data") {
      currentUrlParams.set(`entryName${index}`, "");
      currentUrlParams.set(`entryValue${index}`, "");
    } else if (type === "set_options") {
      currentUrlParams.set(`masterWeight${index}`, "");
      currentUrlParams.set(`lowThreshold${index}`, "");
      currentUrlParams.set(`medThreshold${index}`, "");
      currentUrlParams.set(`highThreshold${index}`, "");
      currentUrlParams.set(`homeDomain${index}`, "");
      currentUrlParams.set(`SetFlags${index}`, "");
      currentUrlParams.set(`ClearFlags${index}`, "");
    }

   
    currentUrlParams.set(
      `sourceAccount${index}`,
      updatedOperations[index].source_account || ""
    );

   
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${currentUrlParams.toString()}`
    );
  }
};

export default setOperationType;