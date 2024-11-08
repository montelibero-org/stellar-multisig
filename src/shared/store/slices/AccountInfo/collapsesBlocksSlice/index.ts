import { ICollapsesBlocksSlice, collapsesBlocks } from "@/shared/types";
import { StateCreator } from "zustand";

const initialCollapsesBlocks: collapsesBlocks = {
  summary: true,
  balances: true,
  transactions: true,
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
