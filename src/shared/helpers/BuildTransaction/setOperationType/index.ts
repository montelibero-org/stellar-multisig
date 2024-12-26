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
  }
};

export default setOperationType;
