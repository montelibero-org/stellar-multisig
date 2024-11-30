import { AuthFlag } from "stellar-sdk";

export type Sequence = number | bigint | null | undefined | string;

export interface IBuildTxJSONState {
  fullTransaction: FullTransaction;
  tx: TX;
  selectedSetFlags: number[][];
  signerTypes: number[]
}

export interface FullTransaction {
  tx: TX;
}

export interface TX {
  tx: {
    source_account: string;
    fee: number | null;
    seq_num: number | bigint | string;

    cond: {
      time: {
        min_time: number;
        max_time: number;
      };
    };
    memo:
      | "none"
      | {
          text?: string;
          id?: string;
          hash?: string;
          return?: string;
        };
    operations: IOperation[] | [];
    ext: "v0";
  };
  signatures: ISignature[];
}

export interface IBuildTxJSONActions {
  setTransaction: (tx: TX) => void;
  setFullTransaction: (tx: TX) => void;
  setSourceAccount: (source_account: string) => void;
  setFee: (fee: number | null) => void;
  setSeqNum: (seq_num: number | string | bigint) => void;
  setTimeCondition: (min_time: number, max_time: number) => void;
  setMemo: (
    memo:
      | string
      | { text?: string; id?: string; hash?: string; return?: string }
  ) => void;
  selectedMemoType: string; // Добавляем свойство
  setSelectedMemoType: (type: string) => void;

  addOperation: () => void;
  removeOperation: (index: number) => void;
  addSignature: (signature: ISignature) => void;
  removeSignature: (index: number) => void;
  resetTx: () => void;
  setOperations: (operations: IOperation[]) => void;
  setSelectedSetFlags: (flags: number[][]) => void;
  setSignerTypes: (signerTypes: number[]) => void;
  changeFirstSignerType: (signerType: number) => void;
}

export interface ISignature {
  hint: string;
  signature: string;
}

export interface IOperation {
  source_account: string | null;
  body: {
    set_options?: {

      inflation_dest?: string | null;
      clear_flags?: AuthFlag | null | number;
      set_flags?: AuthFlag | null | number;
      master_weight?: number | null;
      low_threshold?: number | null;
      med_threshold?: number | null;
      high_threshold?: number | null;
      home_domain?: string | null;
      signer?:
        | {
            key?: string | null;
            weight?: number | string | null;
          }
        | undefined
        | null;
    };
    manage_data?: {
      data_name: string;
      data_value: string | null | undefined;
    };
  };
}

interface IBuildTxJSONSlice extends IBuildTxJSONState, IBuildTxJSONActions {}

export default IBuildTxJSONSlice;
