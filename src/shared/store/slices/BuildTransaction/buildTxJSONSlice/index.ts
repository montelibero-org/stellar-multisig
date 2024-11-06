import { IBuildTxJSONSlice } from "@/shared/types/store/slices";
import { StateCreator } from "zustand";
import { IOperation, ISignature } from "@/shared/types/store/slices";
import { TX } from "@/shared/types/store/slices/BuildTransaction/buildTxJSONSlice";

type ImmerStateCreator<T> = StateCreator<T, [["zustand/immer", never]], [], T>;

export const buildTxJSONSlice: ImmerStateCreator<IBuildTxJSONSlice> = (set) => {
  const initialTx: TX = {
    tx: {
      source_account: "",

      fee: 100,
      seq_num: "",
      cond: {
        time: {
          min_time: 0,
          max_time: 0,
        },
      },
      memo: "none",
      operations: [{ source_account: null, body: {} }] as IOperation[],
      ext: "v0",
    },
    signatures: [] as ISignature[],
  };

  return {
    fullTransaction: { tx: initialTx },
    tx: initialTx,
    selectedSetFlags: [[]],
    signatures: [] as ISignature[],
    signerTypes: [0],
    setFullTransaction: (tx: TX) => set({ fullTransaction: { tx } }),
    setTransaction: (tx: TX) => set({ tx }),
    setSourceAccount: (source_account: string) =>
      set((state) => {
        state.tx.tx.source_account = source_account;
        state.fullTransaction = { tx: state.tx };
      }),
    setFee: (fee: number | null) =>
      set((state) => {
        state.tx.tx.fee = fee;
        state.fullTransaction = { tx: state.tx };
      }),
      setSeqNum: (seq_num: string | number | bigint) =>
        set((state) => {
          
          state.tx.tx.seq_num = BigInt(seq_num)
          state.fullTransaction = { tx: state.tx }; 
        }),
    setTimeCondition: (min_time: number, max_time: number) =>
      set((state) => {
        state.tx.tx.cond.time.min_time = min_time;
        state.tx.tx.cond.time.max_time = max_time;
        state.fullTransaction = { tx: state.tx };
      }),

    selectedMemoType: "None",
    setSelectedMemoType: (type: string) =>
      set((state) => {
        state.selectedMemoType = type;

        if (type === "None") {
          state.tx.tx.memo = "none";
        } else {
          state.tx.tx.memo = { [type.toLowerCase()]: "" };
        }
        state.fullTransaction = { tx: state.tx };
      }),
    setMemo: (
      memo:
        | "none"
        | { text?: string; id?: string; hash?: string; return?: string }
    ) =>
      set((state) => {
        state.tx.tx.memo = memo;
        state.fullTransaction = { tx: state.tx };
      }),
    setOperations: (operations: IOperation[]) =>
      set((state) => {
        state.tx.tx.operations = operations;
        state.fullTransaction = { tx: state.tx };
      }),
    addOperation: () =>
      set((state) => {
        const body: IOperation["body"] = {};
        (state.tx.tx.operations as IOperation[]).push({
          source_account: "",
          body,
        } as IOperation);
        state.fullTransaction = { tx: state.tx };
      }),
    removeOperation: (index: number) =>
      set((state) => {
        state.tx.tx.operations.splice(index, 1);
        state.fullTransaction = { tx: state.tx };
      }),
    addSignature: (signature: ISignature) =>
      set((state) => {
        state.tx.signatures.push(signature);
        state.fullTransaction = { tx: state.tx };
      }),
    removeSignature: (index: number) =>
      set((state) => {
        state.tx.signatures.splice(index, 1);
        state.fullTransaction = { tx: state.tx };
      }),
    resetTx: () =>
      set(() => ({
        tx: initialTx,
        fullTransaction: { tx: initialTx },
        signatures: [],
      })),
    setSelectedSetFlags: (newFlags) => set({ selectedSetFlags: newFlags }),
    setSignerTypes: (newSignerTypes) => set({ signerTypes: newSignerTypes }),
    changeFirstSignerType: (signerType) =>
      set((state) => {
        state.signerTypes[0] = signerType;
      }),
  };
};
