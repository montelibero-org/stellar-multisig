import { useStore } from "@/shared/store";
import { ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { IOperation } from "@/shared/types/store/slices";

export function useHandleSourceAccountChange() {
  const { setOperations, fullTransaction } = useStore(
    useShallow((state) => ({
      setOperations: state.setOperations,
      fullTransaction: state.fullTransaction
    }))
  );

  const updateOperations = ({ updatedOperation, id }: {
    updatedOperation: Partial<IOperation>,
    id: number,
  }) => {
    const newOperations = [...fullTransaction.tx.tx.operations];
    newOperations[id] = {
      ...newOperations[id],
      ...updatedOperation,
    };
    setOperations(newOperations);
  };

  const handleSourceAccountChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    updateOperations({
      updatedOperation: {
        source_account: event.target.value === "" ? null : event.target.value,
      },
      id
    });
  };

  return handleSourceAccountChange;
}

export default useHandleSourceAccountChange;
