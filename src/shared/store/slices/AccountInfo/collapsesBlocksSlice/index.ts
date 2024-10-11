import { ICollapsesBlocksSlice, collapsesBlocks } from "@/shared/types";
import { StateCreator } from "zustand";

const initialCollapsesBlocks: collapsesBlocks = {
  summary: false,
  balances: false,
  transactions: false,
};

const collapsesBlocksSlice: StateCreator<
  ICollapsesBlocksSlice,
  [["zustand/immer", never]],
  [],
  ICollapsesBlocksSlice
> = (set /*, get*/) => {
  const collapsesBlocks = initialCollapsesBlocks;

  const setCollapsesBlocks = (newCollapsesBlocks: collapsesBlocks) => {
    set({ collapsesBlocks: newCollapsesBlocks });
  }

  return {
    collapsesBlocks,
    setCollapsesBlocks,
  };
};

export default collapsesBlocksSlice;
