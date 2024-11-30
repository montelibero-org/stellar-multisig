import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/shared/store";
import { getOperationType } from "@/widgets/BuildTransaction/OperationsList/ui";

export default function useFixUnknownError() {
  const { setOperations, tx } = useStore(useShallow((s) => s));

  const handleSourceAccountChange = (
    newSourceAccount: string | null,
    id: number,
  ) => {
    const operations = tx.tx.operations;

    const newOperations = operations.map((operation, index) => {
      if (index === id) {
        const op = tx.tx.operations[id];
        if (getOperationType(op) === "manage_data") {
          return {
            body: {
              manage_data: {
                ...operation.body.manage_data!,
                data_name: newSourceAccount !== "" ? "1" : "",
                data_value: null,
              }
            },
            source_account: newSourceAccount,
          };
        } else if (getOperationType(op) === "set_options") {
          return {
            ...operation,
            source_account: newSourceAccount,
          };
        }
      }
      return operation;
    });

    setOperations(newOperations);
  };

  const fixUnknownError = (id: number) => {
    handleSourceAccountChange(
      "GAQPZKOYGJDEWLYO6PBOJ4NG6HNBBNNZSOJNKUUCVJGLBQIQSO5AC26F",
      id,
    );

    setTimeout(() => {
      handleSourceAccountChange(null, id);
    }, 250);
  };

  return fixUnknownError;
}
