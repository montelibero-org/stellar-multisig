import {
  ITransactionsFromFirebaseSlice,
  TransactionData,
} from "@/shared/types/index";
import { StateCreator } from "zustand";

export const transactionsFromFirebaseSlice: StateCreator<
  ITransactionsFromFirebaseSlice,
  [["zustand/immer", never]],
  [],
  ITransactionsFromFirebaseSlice
> = (set /*, get*/) => {
  const transactionsFromFirebase: TransactionData[] = [];
  const setTransactionsFromFirebase = (
    transactionsFromFirebase: TransactionData[]
  ) => {
    set({ transactionsFromFirebase });
  };

  return {
    transactionsFromFirebase,
    setTransactionsFromFirebase,
  };
};
