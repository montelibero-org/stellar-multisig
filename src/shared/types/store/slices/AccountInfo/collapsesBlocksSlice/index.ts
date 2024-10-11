export type collapsesBlocks = {
  summary: boolean;
  balances: boolean;
  transactions: boolean;
};

export interface collapsesBlocksState {
  collapsesBlocks: collapsesBlocks;
}

export interface collapsesBlocksActions {
  setCollapsesBlocks: (newCollapsesBlocks: collapsesBlocks ) => void;
}

interface ICollapsesBlocksSlice
  extends collapsesBlocksState,
    collapsesBlocksActions {}

export default ICollapsesBlocksSlice;
